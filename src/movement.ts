// Ball movement
// If not interacted with, then balls will follow the ball
// that is in front of them, in a chain. The leader of the
// chain will follow a pre-specified path.

import { ChainedBall, Game } from "./types";
import { distance, inBounds, scale, subtract, toUnit } from "./util";

export function stepMovement(game: Game) {
  stepChains(game);
  stepFreeBalls(game);
}

function stepFreeBalls(game: Game) {
  game.freeBalls.forEach((ball) => {
    ball.position.x += ball.velocity.x;
    ball.position.y += ball.velocity.y;
  });

  for(let i = game.freeBalls.length - 1; i >= 0; i--) {
    if(inBounds(game.freeBalls[i].position, game.bounds)) continue;

    game.freeBalls.splice(i, 1);
  }
}

function stepChains(game: Game) {
  const { chains } = game;

  for(let i=0; i<chains.length; i++) {
    updatePositionTowardsWaypoint(chains[i].head, game);
    
    let current: ChainedBall | undefined = chains[i].head.next;
    while (current) {
      updatePositionTowardsWaypoint(current, game);

      current = current.next;
    }

    if(!inBounds(chains[i].head.ball.position, game.bounds)) {
      const next = chains[i].head.next;
      if(next) {
        chains[i].head = next;
        chains[i].head.previous = undefined;
      }
    }
  }
}

function setPreviousPosition({ball: {prevPosition, position}}: ChainedBall) {
  prevPosition.x = position.x;
  prevPosition.y = position.y;
}

function updatePositionTowardsWaypoint(cball: ChainedBall, game: Game) {
  setPreviousPosition(cball);
  
  if(! cball.waypoint) return;
  
  const {ball: { position }, waypoint: {value: waypoint}} = cball;
  const normalized = {...waypoint};

  subtract(normalized, position);
  toUnit(normalized);
  scale(normalized, game.chainedBallSpeed);

  position.x += normalized.x;
  position.y += normalized.y;

  const DISTANCE_DELTA = 1;
  const dist = distance(waypoint, position);
  if(dist < DISTANCE_DELTA) {
    cball.waypoint = cball.waypoint.next;
  }
}
