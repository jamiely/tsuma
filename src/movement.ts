// Ball movement
// If not interacted with, then balls will follow the ball
// that is in front of them, in a chain. The leader of the
// chain will follow a pre-specified path.

import { ChainedBall, Game, Point } from "./types";
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

  chains.forEach((chain) => {
    // updatePositionDelta(chain.head, {x: game.chainedBallSpeed, y: 0});
    updatePositionTowardsWaypoint(chain.head, game);
    
    let current: ChainedBall | undefined = chain.head.next;
    let previous: ChainedBall | undefined = chain.head;
    while (current) {
      updatePosition(current, previous.ball.prevPosition, game);
      // updatePositionBasedOnLeader(current);

      previous = current;
      current = current.next;
    }
  });
}

function setPreviousPosition({ball: {prevPosition, position}}: ChainedBall) {
  prevPosition.x = position.x;
  prevPosition.y = position.y;
}

// function updatePositionBasedOnLeader(cball: ChainedBall, game: Game) {
//   setPreviousPosition(cball);

//   const {ball: {position}, waypoint: {value: waypoint}} = cball;

//   const v = {...waypoint}
//   subtract(v, position);
//   toUnit(v);
//   scale(v, game.chainedBallSpeed);

//   position.x = px;
//   position.y = py;
// }

function updatePosition(cball: ChainedBall, pt: Point, game: Game) {
  setPreviousPosition(cball);

  const {position} = cball.ball

  const delta = {...pt};
  subtract(delta, position);
  toUnit(delta);
  scale(delta, game.chainedBallSpeed);

  position.x += delta.x;
  position.y += delta.y;
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
