// Ball movement
// If not interacted with, then balls will follow the ball
// that is in front of them, in a chain. The leader of the
// chain will follow a pre-specified path.

import { Game } from "./types";

export function stepMovement(game: Game) {
  stepChains(game);
  stepFreeBalls(game);
}

function stepFreeBalls(game: Game) {
  game.freeBalls.forEach((ball) => {
    ball.position.x += ball.velocity.x;
    ball.position.y += ball.velocity.y;
  });
}

function stepChains(game: Game) {
  const {chains} = game;
  chains.forEach(chain => {
    [chain.head.ball].forEach((ball) => {
      ball.position.x += 1;
    })
  })
}
