import { insertAfter, insertBefore } from "./linkedList";
import { Ball, ChainedBall, FreeBall, Game, Point } from "./types";
import {
  add,
  distance,
  dotProduct,
  getIntersection,
  scale,
  subtract,
  toUnit,
  waypointVector,
  waypointVectorFromPosition,
} from "./util";
import { Node } from "./types";
import { WAYPOINT_DISTANCE_DELTA } from "./constants";

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

          chains[k].inserting++;

          const { position, color, velocity } = freeBalls[i];

          // backoff the ball until it is not colliding anymore
          const unitVelocity = {...velocity}
          toUnit(unitVelocity);
          while(distance(position, node.value.ball.position) < game.ballRadius * 2) {
            subtract(position, unitVelocity);
          }

          // debugging
          game.debug.collisionChainedBallPosition = {
            ...node.value.ball.position,
          };
          game.debug.collisionFreeBallPosition = { ...position };
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

          let targetBall: Node<ChainedBall> | undefined = undefined;
          if (shouldInsertBefore(game, node.value, freeBalls[i])) {
            targetBall = node.next;
            console.log("inserting before");
            insertBefore(newNode, node);
            targetBall = newNode.previous;
          } else {
            console.log("inserting after");
            insertAfter(newNode, node);
            targetBall = node;
          }

          if (!newNode.previous) {
            chains[k].head = newNode;
          }
          if (!newNode.next) {
            chains[k].foot = newNode;
          }

          if (targetBall) {
            newBall.waypoint = targetBall.value.waypoint;
            newBall.insertion = {
              position: { ...targetBall.value.ball.position },
            };
          } else {
            // specify the insertion point to be the previous ball,
            // and we'll step it along the waypoint until we stop
            // colliding
            newBall.insertion = {
              position: {...node.value.ball.position}
            };
            // step this point until it's not colliding
            let insertionPointCollides = true;
            let waypoint = newBall.waypoint;
            const {position: insertionPoint} = newBall.insertion;
            while(insertionPointCollides && waypoint) {
              const dist = distance(insertionPoint, node.value.ball.position);

              const waypointVec = waypointVectorFromPosition(insertionPoint, waypoint.value)
              add(insertionPoint, waypointVec);

              if(distance(insertionPoint, waypoint.value) < WAYPOINT_DISTANCE_DELTA) {
                waypoint = waypoint.next;
              }
              
              insertionPointCollides = dist < game.ballRadius * 2;
            }
          }

          console.log('insertion', newBall.insertion?.position);

          if (game.debug.enabled && game.debug.stopOnCollision) {
            game.debug.stop = true;
          }

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

const shouldInsertBefore = (
  game: Game,
  chainedBall: ChainedBall,
  freeBall: FreeBall
): boolean => {
  // get the exact point of contact
  const pointOfContact = { ...chainedBall.ball.position };
  subtract(pointOfContact, freeBall.position);
  scale(pointOfContact, 0.5);
  add(pointOfContact, freeBall.position);

  game.debug.collisionPoint = pointOfContact;

  const movementVector = waypointVector(chainedBall);
  game.debug.movementVector = { ...movementVector };

  const collisionPointVec = { ...pointOfContact };
  subtract(collisionPointVec, chainedBall.ball.position);

  const scalarProjection =
    dotProduct(collisionPointVec, movementVector) /
    dotProduct(movementVector, movementVector);

  return scalarProjection > 0;
};
