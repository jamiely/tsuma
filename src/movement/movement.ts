// Ball movement
// If not interacted with, then balls will follow the ball
// that is in front of them, in a chain. The leader of the
// chain will follow a pre-specified path.

import { ballsCollide } from "@/collision";
import { WAYPOINT_DISTANCE_DELTA } from "@/constants";
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

  if (chain.pauseStepsAfterMatch && chain.pauseStepsAfterMatch > 0) {
    chain.pauseStepsAfterMatch--;
    if (chain.pauseStepsAfterMatch <= 0) {
      chain.pauseStepsAfterMatch = undefined;
    }
    return;
  }

  stepNormalChain(game, chain);
}

export function stepInsertingChain(game: Game, chain: Chain) {
  let current: Node<ChainedBall> | undefined = chain.head;
  while (current) {
    if (current.value.insertion) {
      stepInsertingChainBall({ game, chain, node: current });
    }

    current = current.next;
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
    next && ballsCollide(game)(chainedBall.ball, next.value.ball);

  let insertionComplete = false;
  if (isCollidingWithNextBall) {
    const copy = {...chainedBall.ball.position}
    subtract(copy, next.value.ball.position);
    toUnit(copy);
    add(copy, waypointVector(node.value));

    const result = updatePositionTowardsInsertion(game, chainedBall, {
      adjustmentVector: copy,
    });
    insertionComplete = result.insertionComplete;
  }
  else {
    const result = updatePositionTowardsInsertion(game, chainedBall);
    insertionComplete = result.insertionComplete;
  }

  const isTail = node === chain.foot;
  while (
    !isTail &&
    previous &&
    ballsCollide(game)(chainedBall.ball, previous.value.ball)
  ) {
    // now push the chain forward in front of the ball
    let current: Node<ChainedBall> | undefined = previous;
    while (current) {
      updatePositionTowardsWaypoint({ node: current, chain, game });
      current = current.previous;
    }
  }

  if (!insertionComplete) return;

  chain.inserting--;
}

export function stepNormalChain(game: Game, chain: Chain) {
  updatePositionTowardsWaypoint({ node: chain.foot, chain, game });

  // after moving the foot, push along the next ball until it's
  // not colliding with the foot anymore. Continue the process
  // until the head.
  const areColliding = ballsCollide(game);
  let current: Node<ChainedBall> | undefined = chain.foot.previous;
  while (current) {
    while (
      current &&
      current.next &&
      areColliding(current.value.ball, current.next.value.ball)
    ) {
      const { ballRemoved } = updatePositionTowardsWaypoint({
        node: current,
        chain,
        game,
      });
      if (ballRemoved) {
        break;
      }
    }

    current = current.previous;
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
