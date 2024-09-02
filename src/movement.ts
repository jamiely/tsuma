// Ball movement
// If not interacted with, then balls will follow the ball
// that is in front of them, in a chain. The leader of the
// chain will follow a pre-specified path.

import { ChainedBall, Game, Point } from "./types";
import { inBounds, scale, subtract, toUnit } from "./util";

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
    updatePositionDelta(chain.head, {x: game.chainedBallSpeed, y: 0});
    
    let current: ChainedBall | undefined = chain.head.next;
    let previous: ChainedBall | undefined = chain.head;
    while (current) {
      updatePosition(current, previous.ball.prevPosition, game);

      previous = current;
      current = current.next;
    }
  });
}

function setPreviousPosition({ball: {prevPosition, position}}: ChainedBall) {
  prevPosition.x = position.x;
  prevPosition.y = position.y;
}

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

function updatePositionDelta(cball: ChainedBall, delta: Point) {
  setPreviousPosition(cball);

  const {ball: { position }} = cball;
  position.x += delta.x;
  position.y += delta.y;
}
