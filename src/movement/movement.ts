// Ball movement
// If not interacted with, then balls will follow the ball
// that is in front of them, in a chain. The leader of the
// chain will follow a pre-specified path.

import { ballsCollide } from "@/collision";
import { WAYPOINT_DISTANCE_DELTA } from "@/constants";
import {
  remove as removeNode,
  iterateToHead,
  iterateToTail,
} from "@/linkedList";
import {
  Chain,
  ChainedBall,
  Game,
  Node,
  Point,
  WaypointDirection,
} from "@/types";
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
  if (game.boardOver) {
    stepBoardOver(game);
    return;
  }
  stepChains(game, {waypointDirection: game.appliedEffects.backwards ? 'backwards': 'forwards'});
  stepFreeBalls(game);
}

function stepBoardOver(game: Game) {
  for (const chain of game.chains) {
    for (const {
      node,
      value: { waypoint },
    } of iterateToTail(chain.head)) {
      const steps = game.boardOverSteps * 0.4 + 1;
      for (let i = 0; i < steps; i++) {
        updatePositionTowardsWaypoint({ node, game, chain });
        if (!waypoint) removeBall(chain, node);
      }
    }
  }

  for (let i = game.freeBalls.length - 1; i >= 0; i--) {
    game.freeBalls.splice(i, 1);
  }
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

export function stepChains(game: Game, options: {waypointDirection: WaypointDirection}) {
  const { chains } = game;

  // handle regular movement
  for (let i = 0; i < chains.length; i++) {
    stepChain(game, chains[i], options);
  }
}

function stepChain(game: Game, chain: Chain, options: {waypointDirection: WaypointDirection}) {
  if (chain.inserting) {
    stepInsertingChain(game, chain);
    return;
  }

  const { shouldContinue } = pauseSteppingAfterMatch(chain);
  if (!shouldContinue) return;

  const { didMove } = magneticCheck(game, chain);
  // don't move the chain when something moved magnetically
  if (didMove) return;

  stepNormalChain(game, chain, options);
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
  let didSomeInsertion = false;
  for (const { node } of iterateToTail(chain.head)) {
    if (!node.value.insertion) continue;
    didSomeInsertion = true;

    const { insertionComplete } = stepInsertingChainBall({
      game,
      chain,
      node: node,
    });

    if (!insertionComplete) continue;

    chain.inserting--;
  }

  if(!didSomeInsertion) {
    // we lost the insertions, so reset insertion status
    chain.inserting = 0;
  }
}

function gapExists(
  game: Game,
  ball1: ChainedBall,
  ball2: ChainedBall,
  { buffer = 1 }: { buffer?: number } | undefined = {}
) {
  const dist = distance(ball1.ball.position, ball2.ball.position);
  return dist > 2 * game.ballRadius + buffer;
}

function magneticCheck(game: Game, chain: Chain): { didMove: boolean } {
  let didMove = false;
  for (const { node, value, next } of iterateToTail(chain.head)) {
    if (!next) continue;
    if (value.ball.color !== next.value.ball.color) continue;

    const maxSteps = 3;
    outer: for (let step = 0; step < maxSteps; step++) {
      // gap exists between current node and previous
      if (!gapExists(game, value, next.value)) break outer;

      // pull the node towards the previous waypoint and everything after it
      let pushStart: Node<ChainedBall> | undefined = chain.head;

      //
      // if there is a magnetic with the current ball and
      // the next ball, we want to go back towards the head
      // to find the first gap or until we reach the head of 
      // the chain. Call this ball the mini head.
      // 
      // push the balls back from this mini head until the
      // current ball touches the next ball.


      for(const {node: current, previous} of iterateToHead(node)) {
        // this is not quite working right
        // if(!current.previous) break outer;

        if(!previous) {
          pushStart = current;
          break;
        }

        if(gapExists(game, current.value, previous.value, {buffer: 2})) {
          pushStart = current;
          break;
        }
      }

      if(! pushStart) break outer;

      // we know where to start pushing from, so push
      for(const {node} of iterateToTail(pushStart)) {
        if(node === next) break;

        didMove = true;

        // TODO: instead of doing this, might be better to move the
        // first ball, then use collision logic to determine whether
        // to move the next ball.
        const { ballRemoved } = updatePositionTowardsWaypoint({
          game,
          chain,
          node,
          waypointDirection: "backwards",
          speed: game.options.magneticBallSpeed,
        });

        if (ballRemoved) {
          console.error("Do not remove a ball in this method");
          debugger;
        }
      }
    }

    // TODO: it's possible that the balls collide now
  }
  return { didMove };
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

  const isCollidingWithPreviousBall =
    previous && ballsCollide(game, chainedBall.ball, previous.value.ball);
  if (isCollidingWithPreviousBall) {
    console.log(
      "TODO isCollidingWithPreviousBall",
      isCollidingWithPreviousBall,
      'current ball',
      chainedBall.ball,
      'previous ball',
      previous.value.ball,
    );
  }

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

  const isTail = node === chain.foot;
  if (!isTail && previous) {
    try {
      insertionPushChainForward({
        game,
        chain,
        chainedBall,
        previous,
      });
    } catch(error) {
      // assume we can continue
      console.error(error);
    }
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
  outer: for (let loopCount=0, MAX_LOOP=10_000; ballsCollide(game, chainedBall.ball, previous.value.ball); loopCount++) {
    if(loopCount > MAX_LOOP) {
      debugger;
      throw 'Infinite loop in insertionPushChainForward';
    }

    // now push the chain forward in front of the ball
    for (const {
      node,
      value: {
        ball: { position },
      },
      next,
    } of iterateToHead(previous)) {
      if (next) {
        const dist = distance(position, next.value.ball.position);
        const gapExists = game.ballRadius * 2 + 1 < dist;
        if (gapExists) break;
      }

      const {ballRemoved, positionChanged} = updatePositionTowardsWaypoint({ node, chain, game });
      if(ballRemoved) {
        break outer;
      }
      if(! positionChanged) {
        break outer;
      }
    }
  }
}

export function stepNormalChain(game: Game, chain: Chain, {waypointDirection}: {waypointDirection: WaypointDirection}) {
  let moveFrom = chain.foot;
  let getPrev = (node: Node<ChainedBall>) => node.previous;
  let getNext = (node: Node<ChainedBall>) => node.next;
  let iterator = iterateToHead;

  if(waypointDirection === 'backwards') {
    moveFrom = chain.head;
    let tmp = getPrev;
    getPrev = getNext;
    getNext = tmp;
    iterator = iterateToTail;
  }

  if (!moveFrom) return;

  updatePositionTowardsWaypoint({ node: moveFrom, chain, game, waypointDirection });

  // after moving the foot, push along the next ball until it's
  // not colliding with the foot anymore. Continue the process
  // until the head.

  let next: Node<ChainedBall> | undefined;
  for (const { node } of iterator(getPrev(moveFrom))) {
    while (
      node &&
      (next = getNext(node)) &&
      ballsCollide(game, node.value.ball, next.value.ball)
    ) {
      const nextFoot = chain.foot === node ? getNext(node) : undefined;
      const nextHead = chain.head === node ? getPrev(node) : undefined;

      const { ballRemoved } = updatePositionTowardsWaypoint({
        node,
        chain,
        game,
        waypointDirection,
      });

      if (ballRemoved) {
        if(nextFoot) chain.foot = nextFoot;
        if(nextHead) chain.head = nextHead;
        break;
      }
    }
  }
}

export function updatePositionTowardsWaypoint({
  node,
  chain,
  game,
  waypointDirection = "forwards",
  speed,
}: {
  node: Node<ChainedBall>;
  chain: Chain;
  game: Game;
  waypointDirection?: WaypointDirection;
  speed?: number;
}): { ballRemoved: boolean, positionChanged: boolean } {
  const { value: chainedBall } = node;

  if (!chainedBall.waypoint) {
    removeBall(chain, node);
    return { ballRemoved: true, positionChanged: false };
  }

  const {
    ball: { position },
  } = chainedBall;

  let waypoint = chainedBall.waypoint.value;
  let nextWaypoint = chainedBall.waypoint.next;
  let boardOverPossible = waypointDirection === "forwards";
  if (waypointDirection === "backwards") {
    if (!chainedBall.waypoint.previous) {
      removeBall(chain, node);
      // TODO: we should possibly replay ball state
      console.warn("No previous waypoint available.");
      return { ballRemoved: true, positionChanged: false };
    }
    waypoint = chainedBall.waypoint.previous.value;
    nextWaypoint = chainedBall.waypoint.previous;
    boardOverPossible = false;
  }

  add(
    position,
    waypointVector(chainedBall, {
      scale: speed || game.chainedBallSpeed,
      waypointDirection,
    })
  );

  // check if we have reached the next waypoint. there
  // is the potential for bugs here if we step too far
  // at once and go past the waypoint.
  const dist = distance(waypoint, position);
  if (dist < WAYPOINT_DISTANCE_DELTA) {
    chainedBall.waypoint = nextWaypoint;

    if (!chainedBall.waypoint && boardOverPossible) {
      // we have reached the last waypoint, so remove
      // the ball from the game.
      game.boardOver = "lost";
      console.log("game.boardOver=", game.boardOver);

      removeBall(chain, node);
      return { ballRemoved: true, positionChanged: false };
    } else if(!chainedBall.waypoint) {
      return {ballRemoved: false, positionChanged: false};
    }
  }

  return { ballRemoved: false, positionChanged: true };
}

function removeBall(chain: Chain, node: Node<ChainedBall>) {
  if (chain.head === node) {
    chain.head = node.next;
  }
  removeNode(node);
}

export function updatePositionTowardsInsertion(
  game: Game,
  chainedBall: ChainedBall,
  options: {
    adjustmentVector?: Point;
  } = {}
): { insertionComplete: boolean } {
  const {
    ball: { position },
    insertion,
  } = chainedBall;

  if (!insertion) throw new FailedInsertionPrerequisite();

  const insertionVector = getInsertionVector(game, chainedBall, options);

  setPoint(position, getInsertionPoint(chainedBall, insertionVector));

  const DISTANCE_DELTA = Math.max(1, game.options.launchedBallSpeed / 4);
  if (distance(insertion.position, position) < DISTANCE_DELTA) {
    // insertion is over once we reach the expected point
    chainedBall.insertion = undefined;
    return { insertionComplete: true };
  }

  return { insertionComplete: false };
}

function getInsertionVector(
  game: Game,
  chainedBall: ChainedBall,
  options: {
    adjustmentVector?: Point;
  } = {}
) {
  const {
    ball: { position },
    insertion,
  } = chainedBall;

  if (!insertion) throw new FailedInsertionPrerequisite();

  const { position: insertAt } = insertion;
  const insertionVector = { ...insertAt };
  subtract(insertionVector, position);
  toUnit(insertionVector);
  if (options.adjustmentVector) {
    add(insertionVector, options.adjustmentVector);
  }
  scale(insertionVector, game.options.insertingBallSpeed);

  return insertionVector;
}

function getInsertionPoint(chainedBall: ChainedBall, insertionVector: Point) {
  const {
    ball: { position },
    insertion,
  } = chainedBall;
  if (!insertion) throw new FailedInsertionPrerequisite();

  const { position: insertAt } = insertion;

  const newPos = { ...position };
  const posCopy = { ...position };
  add(newPos, insertionVector);
  const newPosCopy = { ...newPos };
  subtract(newPosCopy, insertAt);
  subtract(posCopy, insertAt);
  if (magnitude(newPosCopy) > magnitude(posCopy)) {
    // we overshot the insertion point
    return insertAt;
  }

  return newPos;
}

class FailedInsertionPrerequisite extends Error {
  constructor() {
    super("Cannot call method without insertion property");
  }
}
