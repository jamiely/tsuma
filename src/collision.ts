import { Ball, ChainedBall, Game } from "./types";
import { distance, getIntersection } from "./util";

export function handleCollisions(game: Game) {
  // if a launched ball collides with a ball in a chain,
  // the launched ball should be merged into the chain.
  // it should become part of the chain between the two
  // balls it is closest to in the chain.
  //
  // on collision, figure out whether the launched ball is
  // closer to the previous or next ball in the chain. Insert
  // between the balls it is closest to.

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
          if (!cball.collidable || !didCollide(freeBalls[i], cball.ball)) {
            cball = cball.next;
            continue;
          }

          // figure out whether the free ball is closer to prev or next
          const distPrev = cball.previous
            ? distance(freeBalls[i].position, cball.previous.ball.position)
            : undefined;
          const distNext = cball.next
            ? distance(freeBalls[i].position, cball.next.ball.position)
            : undefined;
          const insertPrevious = distPrev && distNext && distPrev < distNext;

          const { position, color, prevPosition } = freeBalls[i];
          const newBall: ChainedBall = {
            collidable: true,
            ball: {
              color,
              position,
              prevPosition: position,
            },
            waypoint: cball.waypoint,
            inserting: true,
          };

          let otherBall = cball.next;
          if (insertPrevious) {
            otherBall = cball.previous;
            newBall.previous = cball.previous;
            newBall.next = cball;
            cball.previous!.next = newBall;
            cball.previous = newBall;
          } else {
            newBall.previous = cball;
            newBall.next = cball.next;
            cball.next!.previous = newBall;
            cball.next = newBall;
          }

          if (otherBall) {
            const intersection = getIntersection(
              cball.ball.position,
              otherBall.ball.position,
              position,
              prevPosition
            );
            if (intersection) {
              newBall.ball.position = intersection;
              newBall.ball.prevPosition = { ...intersection };
            }
          }

          // go up and down the chain from the new ball, pushing
          // out the balls until they don't collid
          // if(newBall.previous) moveBackwards(game, newBall.previous);
          // moveForwards(newBall.next);

          freeBalls.splice(i, 1);
          hasCollision = true;
          break outer;
        }
      }
    }
  } while (hasCollision);
}

const ballsCollide = (game: Game) => {
  const diameter = game.ballRadius * 2;
  return (ball1: Ball, ball2: Ball) => {
    return diameter > distance(ball1.position, ball2.position);
  };
};