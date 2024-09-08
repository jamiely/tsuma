import { insertAfter, insertBefore } from "./linkedList";
import { Ball, ChainedBall, FreeBall, Game } from "./types";
import {
  add,
  angleBetweenVectors,
  distance,
  radiansToDegrees,
  scale,
  subtract,
  toUnit,
} from "./util";
import { Node } from "./types";

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
        let node: Node<ChainedBall> | undefined = chains[k].head;

        while (node) {
          if (!didCollide(freeBalls[i], node.value.ball)) {
            node = node.next;
            continue;
          }

          let insertPrevious = false;
          if(node.next && node.previous) {
            insertPrevious = chainedBallDistance(node, node.previous) < chainedBallDistance(node, node.next);
          } else {
            const angle = collisionAngle(game, freeBalls[i], node.value);
            console.log("Collision angle is " + radiansToDegrees(angle));
            insertPrevious = angle > Math.PI / 2;
          }

          chains[k].inserting++;

          const { position, color } = freeBalls[i];
          const newBall: ChainedBall = {
            ball: {
              color,
              position,
            },
            // note that it's possible that the position
            // we're inserting the ball into is past this
            // waypoint.
            waypoint: node.value.waypoint,
          };
          const newNode: Node<ChainedBall> = { value: newBall };

          console.log("collision ball is ", node.value.ball.color);

          let targetBall = node;
          if (insertPrevious) {
            console.log("inserting before");
            targetBall = newNode;
            insertBefore(newNode, node);
          } else {
            console.log("inserting after");
            insertAfter(newNode, node);
          }
          if (!newNode.previous) {
            chains[k].head = newNode;
          }

          newBall.waypoint = targetBall.value.waypoint;
          newBall.insertion = {
            position: { ...targetBall.value.ball.position },
          };

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

export const collisionAngle = (
  game: Game,
  freeBall: FreeBall,
  chainedBall: ChainedBall
): number => {
  const vec1 = { ...freeBall.velocity };
  toUnit(vec1);

  game.debug.collisionVector = { ...vec1 };

  if (!chainedBall.waypoint) {
    console.error("waypoint should not be undefined");
    return 0;
  }

  const vec2 = { ...chainedBall.waypoint.value };
  subtract(vec2, chainedBall.ball.position);
  toUnit(vec2);

  game.debug.movementVector = { ...vec2 };
  
  return angleBetweenVectors(vec2, vec1);
};

const chainedBallDistance = (node1: Node<ChainedBall>, node2: Node<ChainedBall>): number =>
  distance(node1.value.ball.position, node2.value.ball.position);