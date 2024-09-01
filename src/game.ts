import { Ball, Game } from "./types";
import { distance, randomColor } from "./util";

export const createGame = (): Game => {
  return {
    ballRadius: 10,
    balls: [{ position: { x: 200, y: 200 }, color: 'red' }, { position: { x: 10, y: 10 }, color: 'blue' }],
    launcher: {position: {x: 300, y:300}, pointTo: {x:0, y:0}, color: 'purple'},
    freeBalls: [],
  };
};

export const launchBall = (game: Game) => {
  // the un-normalized velocity vector
  const velocity = {
    x: game.launcher.pointTo.x - game.launcher.position.x,
    y: game.launcher.pointTo.y - game.launcher.position.y,
  };

  // normalized velocity vector
  const magnitude = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y)
  velocity.x /= magnitude;
  velocity.y /= magnitude;

  game.freeBalls.push({
    position: {...game.launcher.position},
    velocity,
    color: randomColor(),
  });
}

export function step(game: Game) {
  game.balls.forEach((ball) => {
    ball.position.x += 1;
  })

  game.freeBalls.forEach((ball) => {
    ball.position.x += ball.velocity.x;
    ball.position.y += ball.velocity.y;
  })

  handleCollisions(game);
}

function handleCollisions(game: Game) {
  const {balls, freeBalls} = game;

  const diameter = game.ballRadius * 2;
  const didCollide = (ball1: Ball, ball2: Ball) => {
    return diameter > distance(ball1.position, ball2.position);
  }

  // this is not quite what we want later,
  // since we don't want to balls to disappear
  let hasCollision = false;
  do {
    hasCollision = false;
    // slow
    outer:
    for(let i = freeBalls.length - 1; i >= 0; i--) {
      for(let j = balls.length - 1; j >= 0; j--) {
        if(didCollide(freeBalls[i], balls[j])) {
          freeBalls.splice(i, 1);
          balls.splice(j, 1);
          hasCollision = true;
          break outer;
        }
      }
    }
  } while (hasCollision);
}