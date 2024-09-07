import { Ball, ChainedBall, Game } from "./types";
import { distance } from "./util";

// when a launched ball collides with a chain,
// there are 3 things that happen.
// 1. the chain stops moving for some period of time
// 2. if the launched ball enters between two balls
//    in the chain, then it inserts itself between those
//    two balls, pushing everything ahead of it forward.
// 3. if the launched ball enters at the beginning or end
//    the line, nothing gets pushed.

export function handleCollisions(game: Game) {
  const { chains, freeBalls } = game;

  const didCollide = ballsCollide(game);

  // this is not quite what we want later,
  // since we don't want to balls to disappear
  let hasCollision = false;
  do {
    hasCollision = false;
    // slow
    outer: for (let i = freeBalls.length - 1; i >= 0; i--) {
      for (let k = chains.length - 1; k >= 0; k--) {
        let cball: ChainedBall | undefined = chains[k].head;

        while (cball) {
          if (!didCollide(freeBalls[i], cball.ball)) {
            cball = cball.next;
            continue;
          }

          chains[k].inserting++;

          const { position, color } = freeBalls[i];
          const newBall: ChainedBall = {
            ball: {
              color,
              position,
            },
            waypoint: cball.waypoint,
          };

          let frontBall = cball.previous || cball;
          if(cball.previous) {
            newBall.previous = cball.previous;
          } else {
            chains[k].head = newBall;
          }
          newBall.next = cball;
          if(cball.previous) {
            cball.previous.next = newBall;
          }
          cball.previous = newBall;

          const targetBall = frontBall || cball;
          newBall.waypoint = targetBall.waypoint;
          newBall.insertion = { position: {...targetBall.ball.position} };

          freeBalls.splice(i, 1);
          hasCollision = true;
          break outer;
        }
      }
    }
  } while (hasCollision);
}

export const ballsCollide = (game: Game) => {
  const diameter = game.ballRadius * 2;
  return (ball1: Ball, ball2: Ball) => {
    return diameter > distance(ball1.position, ball2.position);
  };
};
