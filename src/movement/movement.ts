// Ball movement
// If not interacted with, then balls will follow the ball
// that is in front of them, in a chain. The leader of the
// chain will follow a pre-specified path.

import { ballsCollide } from "@/collision";
import { Chain, ChainedBall, Game } from "@/types";
import {
  add,
  distance,
  inBounds,
  magnitude,
  scale,
  setPoint,
  subtract,
  toUnit,
} from "@/util";

export function stepMovement(game: Game) {
  stepChains(game);
  stepFreeBalls(game);
}

export function stepFreeBalls(game: Game) {
  game.freeBalls.forEach((ball) => {
    ball.position.x += ball.velocity.x;
    ball.position.y += ball.velocity.y;
  });

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
    if(chain.pauseStepsAfterMatch <= 0) {
      chain.pauseStepsAfterMatch = undefined;
    }
    return;
  }

  stepNormalChain(game, chain);
}

export function stepInsertingChain(game: Game, chain: Chain) {
  let current: ChainedBall | undefined = chain.head;
  while (current) {
    if (current.insertion) {
      stepInsertingChainBall({ game, chain, chainedBall: current });
    }

    current = current.next;
  }
}

export function stepInsertingChainBall({
  game,
  chain,
  chainedBall,
}: {
  game: Game;
  chain: Chain;
  chainedBall: ChainedBall;
}) {
  const { insertionComplete } = updatePositionTowardsInsertion(
    game,
    chainedBall
  );

  while (
    chainedBall.previous &&
    ballsCollide(game)(chainedBall.ball, chainedBall.previous.ball)
  ) {
    // now push the chain forward in front of the ball
    let current: ChainedBall | undefined = chainedBall.previous;
    while (current) {
      updatePositionTowardsWaypoint(current, game);
      current = current.previous;
    }
    console.log("updatePositionTowardsWaypoint");
  }

  if (!insertionComplete) return;

  chain.inserting--;
}

export function stepNormalChain(game: Game, chain: Chain) {
  updatePositionTowardsWaypoint(chain.head, game);

  let current: ChainedBall | undefined = chain.head.next;
  while (current) {
    updatePositionTowardsWaypoint(current, game);

    current = current.next;
  }

  if (!inBounds(chain.head.ball.position, game.bounds) || !chain.head.waypoint) {
    const next = chain.head.next;
    if (next) {
      chain.head = next;
      chain.head.previous = undefined;
    }
  }
}

export function setPreviousPosition({
  ball: { prevPosition, position },
}: ChainedBall) {
  prevPosition.x = position.x;
  prevPosition.y = position.y;
}

export function updatePositionTowardsWaypoint(cball: ChainedBall, game: Game) {
  setPreviousPosition(cball);

  if (!cball.waypoint) return;

  const {
    ball: { position },
    waypoint: { value: waypoint },
  } = cball;
  const normalized = { ...waypoint };

  subtract(normalized, position);
  toUnit(normalized);
  scale(normalized, game.options.chainedBallSpeed);

  position.x += normalized.x;
  position.y += normalized.y;

  const DISTANCE_DELTA = 1;
  const dist = distance(waypoint, position);
  if (dist < DISTANCE_DELTA) {
    cball.waypoint = cball.waypoint.next;
  }
}

export function updatePositionTowardsInsertion(
  game: Game,
  cball: ChainedBall
): { insertionComplete: boolean } {
  const {
    ball: { position },
    insertion,
  } = cball;

  if (!insertion)
    throw "do not call updatePositionTowardsInsertion unless inserting";

  const { position: insertAt } = insertion;

  setPreviousPosition(cball);
  const normalized = { ...insertAt };

  subtract(normalized, position);
  toUnit(normalized);
  scale(normalized, game.options.launchedBallSpeed);

  const newPos = { ...position };
  const newPosCopy = { ...newPos };
  const posCopy = { ...position };
  add(newPos, normalized);
  subtract(newPosCopy, insertAt);
  subtract(posCopy, insertAt);
  if (magnitude(newPosCopy) > magnitude(posCopy)) {
    // we overshot the insertion point
    setPoint(position, insertAt);
  } else {
    setPoint(position, newPos);
  }

  const DISTANCE_DELTA = Math.max(1, game.options.launchedBallSpeed / 2);
  const dist = distance(insertAt, position);
  if (dist < DISTANCE_DELTA) {
    // insertion is over once we reach the expected point
    cball.insertion = undefined;
    return { insertionComplete: true };
  }

  return { insertionComplete: false };
}
