// Ball movement
// If not interacted with, then balls will follow the ball
// that is in front of them, in a chain. The leader of the
// chain will follow a pre-specified path.

import { ballsCollide } from "@/collision";
import { WAYPOINT_DISTANCE_DELTA } from "@/constants";
import { iterateToHead, iterateToTail } from "@/linkedList";
import { Chain, ChainedBall, Game, Node, Point } from "@/types";
import {
  add,
  distance,
  inBounds,
  magnitude,
  scale,
  setPoint,
  subtract,
  toUnit,
  waypointVector,
} from "@/util";

export function stepMovement(game: Game) {
  stepChains(game);
  stepFreeBalls(game);
}

export function stepFreeBalls(game: Game) {
  for (let i = 0; i < game.freeBalls.length; i++) {
    add(game.freeBalls[i].position, game.freeBalls[i].velocity);
  }

  // remove any balls that go out of bounds
  for (let i = game.freeBalls.length - 1; i >= 0; i--) {
    if (inBounds(game.freeBalls[i].position, game.bounds)) continue;

    game.freeBalls.splice(i, 1);
  }
}

export function stepChains(game: Game) {
  const { chains } = game;

  // handle regular movement
  for (let i = 0; i < chains.length; i++) {
    stepChain(game, chains[i]);
  }
}

function stepChain(game: Game, chain: Chain) {
  if (chain.inserting) {
    stepInsertingChain(game, chain);
    return;
  }

  const { shouldContinue } = pauseSteppingAfterMatch(chain);
  if (!shouldContinue) return;

  stepNormalChain(game, chain);
}

const PAUSE_CONTINUE = { shouldContinue: true };
const PAUSE_NO_CONTINUE = { shouldContinue: false };

function pauseSteppingAfterMatch(chain: Chain) {
  if (!chain.pauseStepsAfterMatch) return PAUSE_CONTINUE;
  if (chain.pauseStepsAfterMatch <= 0) return PAUSE_CONTINUE;

  chain.pauseStepsAfterMatch--;
  if (chain.pauseStepsAfterMatch <= 0) {
    chain.pauseStepsAfterMatch = undefined;
  }

  return PAUSE_NO_CONTINUE;
}

export function stepInsertingChain(game: Game, chain: Chain) {
  for (const { node } of iterateToTail(chain.head)) {
    if (!node.value.insertion) continue;

    const { insertionComplete } = stepInsertingChainBall({
      game,
      chain,
      node: node,
    });

    if (!insertionComplete) continue;

    chain.inserting--;
  }
}

export function stepInsertingChainBall({
  game,
  chain,
  node,
}: {
  game: Game;
  chain: Chain;
  node: Node<ChainedBall>;
}) {
  const { value: chainedBall, previous, next } = node;

  const isCollidingWithNextBall =
    next && ballsCollide(game, chainedBall.ball, next.value.ball);

  const adjustmentVector = isCollidingWithNextBall
    ? // when the ball is colliding with the next ball (closer to the
      // tail), since the tail-side doesn't move, we need to nudge
      // our inserting ball away from the tail-side ball.
      nudgeAwayVector(node)
    : undefined;
  const { insertionComplete } = updatePositionTowardsInsertion(
    game,
    chainedBall,
    {
      adjustmentVector,
    }
  );

  const isTail = node.next === chain.foot;
  if (!isTail && previous) {
    insertionPushChainForward({
      game,
      chain,
      chainedBall,
      previous,
    });
  }

  return { insertionComplete };
}

function nudgeAwayVector(node: Node<ChainedBall>) {
  const { next, value: chainedBall } = node;
  if (!next) {
    throw "next node required for nudge away";
  }

  const copy = { ...chainedBall.ball.position };
  subtract(copy, next.value.ball.position);
  toUnit(copy);
  add(copy, waypointVector(node.value));
  return copy;
}

function insertionPushChainForward({
  game,
  chain,
  chainedBall,
  previous,
}: {
  game: Game;
  chain: Chain;
  chainedBall: ChainedBall;
  previous: Node<ChainedBall>;
}) {
  while (ballsCollide(game, chainedBall.ball, previous.value.ball)) {
    // now push the chain forward in front of the ball
    for (const { node } of iterateToHead(previous)) {
      updatePositionTowardsWaypoint({ node, chain, game });
    }
  }
}

export function stepNormalChain(game: Game, chain: Chain) {
  updatePositionTowardsWaypoint({ node: chain.foot, chain, game });

  // after moving the foot, push along the next ball until it's
  // not colliding with the foot anymore. Continue the process
  // until the head.
  if (!chain.foot.previous) return;

  for (const { node } of iterateToHead(chain.foot.previous)) {
    while (
      node &&
      node.next &&
      ballsCollide(game, node.value.ball, node.next.value.ball)
    ) {
      const { ballRemoved } = updatePositionTowardsWaypoint({
        node,
        chain,
        game,
      });
      
      if (ballRemoved) break;
    }
  }
}

export function updatePositionTowardsWaypoint({
  node,
  chain,
  game,
}: {
  node: Node<ChainedBall>;
  chain: Chain;
  game: Game;
}): { ballRemoved: boolean } {
  const { value: chainedBall } = node;

  if (!chainedBall.waypoint) {
    removeBall(chain, node);
    return { ballRemoved: true };
  }

  const {
    ball: { position },
    waypoint: { value: waypoint },
  } = chainedBall;
  const normalized = { ...waypoint };

  subtract(normalized, position);
  toUnit(normalized);
  scale(normalized, game.options.chainedBallSpeed);

  position.x += normalized.x;
  position.y += normalized.y;

  const dist = distance(waypoint, position);
  if (dist < WAYPOINT_DISTANCE_DELTA) {
    chainedBall.waypoint = chainedBall.waypoint.next;
    if (!chainedBall.waypoint) {
      removeBall(chain, node);
      return { ballRemoved: true };
    }
  }

  return { ballRemoved: false };
}

function removeBall(chain: Chain, node: Node<ChainedBall>) {
  if (chain.head === node && node.next) {
    chain.head = node.next;
  }
  if (node.previous) {
    node.previous.next = node.next;
  }
  if (node.next) {
    node.next.previous = node.previous;
  }
}

export function updatePositionTowardsInsertion(
  game: Game,
  cball: ChainedBall,
  options: {
    adjustmentVector?: Point;
  } = {}
): { insertionComplete: boolean } {
  const {
    ball: { position },
    insertion,
  } = cball;

  if (!insertion)
    throw "do not call updatePositionTowardsInsertion unless inserting";

  const { position: insertAt } = insertion;

  const insertionVector = { ...insertAt };
  subtract(insertionVector, position);
  toUnit(insertionVector);
  if (options.adjustmentVector) {
    add(insertionVector, options.adjustmentVector);
  }
  scale(insertionVector, game.options.insertingBallSpeed);

  const newPos = { ...position };
  const posCopy = { ...position };
  add(newPos, insertionVector);
  const newPosCopy = { ...newPos };
  subtract(newPosCopy, insertAt);
  subtract(posCopy, insertAt);
  if (magnitude(newPosCopy) > magnitude(posCopy)) {
    // we overshot the insertion point
    setPoint(position, insertAt);
  } else {
    setPoint(position, newPos);
  }

  const DISTANCE_DELTA = Math.max(1, game.options.launchedBallSpeed / 4);
  const dist = distance(insertAt, position);
  if (dist < DISTANCE_DELTA) {
    // insertion is over once we reach the expected point
    cball.insertion = undefined;
    return { insertionComplete: true };
  }

  return { insertionComplete: false };
}
