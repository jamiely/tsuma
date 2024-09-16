import { insertAfter, insertBefore, iterateToTail } from "./linkedList";
import { Ball, Chain, ChainedBall, FreeBall, Game } from "./types";
import {
  add,
  distance,
  dotProduct,
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

  // this is not quite what we want later,
  // since we don't want to balls to disappear
  let hasCollision = false;
  do {
    hasCollision = false;
    // slow
    outer: for (let i = freeBalls.length - 1; i >= 0; i--) {
      for (let k = chains.length - 1; k >= 0; k--) {
        for (const { node: collisionNode } of iterateToTail(chains[k].head)) {
          if (!ballsCollide(game, freeBalls[i], collisionNode.value.ball)) {
            continue;
          }

          // need this check BEFORE we add the new node
          const isCollisionNodeTail = chains[k].foot === collisionNode;
          // this might need to be a special case
          const isCollisionNodeHeadAndTail = isCollisionNodeTail && chains[k].head === collisionNode;

          chains[k].inserting++;

          const { position } = freeBalls[i];

          // backoff the ball until it is not colliding anymore
          backoffFreeBall({
            game,
            collisionNode: collisionNode,
            freeBall: freeBalls[i],
          });

          // debugging
          game.debug.collisionChainedBallPosition = {
            ...collisionNode.value.ball.position,
          };
          game.debug.collisionFreeBallPosition = { ...position };

          let { newBall, insertingBefore, insertionPoint } = addNewNode({
            game,
            chain: chains[k],
            collisionNode: collisionNode,
            freeBall: freeBalls[i],
          });
          console.log(`[Collision] new ${newBall.ball.color} ball at (${newBall.ball.position.x}, ${newBall.ball.position.y}) ${insertingBefore ? 'before' : 'after'} ${collisionNode.value.ball.color} chained ball at (${collisionNode.value.ball.position.x}, ${collisionNode.value.ball.position.y}) at insertion point (${insertionPoint.x}, ${insertionPoint.y})`)

          // step the insertion point until it's not colliding
          let insertionPointCollides = true;
          let waypoint = newBall.waypoint;

          let waypointAdjustmentDirection: "toHead" | "toTail" = "toHead";

          if (isCollisionNodeHeadAndTail) {
            const comparisonPoint = position;
            const distanceToNextWaypoint = waypoint?.next
              ? distance(waypoint.next.value, comparisonPoint)
              : Infinity;
            const distanceToPrevWaypoint = waypoint?.previous
              ? distance(waypoint.previous.value, comparisonPoint)
              : Infinity;
            const closerToHead =
              waypoint?.next && distanceToNextWaypoint < distanceToPrevWaypoint;
            console.log("isHeadAndTail", {
              closerToHead,
              distanceToNextWaypoint,
              distanceToPrevWaypoint,
            });
            waypointAdjustmentDirection = closerToHead ? "toHead" : "toTail";
          } else if (isCollisionNodeTail && !insertingBefore) {
            waypointAdjustmentDirection = "toTail";
          }

          console.log('handleCollisions', {
            insertingBefore, 
            isCollisionNodeTail,
            insertionPointCollides,
            waypoint,
          })

          while (
            (insertingBefore || isCollisionNodeTail) &&
            insertionPointCollides &&
            waypoint
          ) {
            const waypointVec = waypointVectorFromPosition(
              insertionPoint,
              waypoint.value
            );
            add(insertionPoint, waypointVec);

            if (
              distance(insertionPoint, waypoint.value) < WAYPOINT_DISTANCE_DELTA
            ) {
              waypoint =
                waypointAdjustmentDirection === "toTail"
                  ? waypoint.previous
                  : waypoint.next;
            }

            const insertionDistance = distance(
              insertionPoint,
              collisionNode.value.ball.position
            );
            insertionPointCollides = insertionDistance < game.ballRadius * 2;
          }

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

export const ballsCollide = (game: Game, ball1: Ball, ball2: Ball) => {
  const diameter = game.ballRadius * 2;
  return diameter > distance(ball1.position, ball2.position);
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

  console.log('shouldInsertBefore', {
    pointOfContact,
    movementVector,
    collisionPointVec,
    scalarProjection,
  })

  return scalarProjection > 0;
};

const backoffFreeBall = ({
  game,
  collisionNode,
  freeBall,
}: {
  game: Game;
  collisionNode: Node<ChainedBall>;
  freeBall: FreeBall;
}) => {
  const { position, velocity } = freeBall;

  // backoff the ball until it is not colliding anymore
  const unitVelocity = { ...velocity };
  toUnit(unitVelocity);
  while (
    distance(position, collisionNode.value.ball.position) <
    game.ballRadius * 2
  ) {
    subtract(position, unitVelocity);
  }
};

const addNewNode = ({
  game,
  chain,
  collisionNode,
  freeBall,
}: {
  game: Game;
  chain: Chain;
  collisionNode: Node<ChainedBall>;
  freeBall: FreeBall;
}) => {
  const { position, color } = freeBall;
  const newBall = {
    ball: {
      color,
      position,
    },
    // note that it's possible that the position
    // we're inserting the ball into is past this
    // waypoint.
    waypoint: collisionNode.value.waypoint,
    // specify the insertion point to be the previous ball,
    // and we'll step it along the waypoint until we stop
    // colliding
    insertion: {
      position: { ...collisionNode.value.ball.position },
    },
  };

  const newNode: Node<ChainedBall> = { value: newBall };

  const insertingBefore = shouldInsertBefore(
    game,
    collisionNode.value,
    freeBall
  );
  if (insertingBefore) {
    insertBefore(newNode, collisionNode);
  } else {
    insertAfter(newNode, collisionNode);
  }

  if (!newNode.previous) {
    chain.head = newNode;
  }
  if (!newNode.next) {
    chain.foot = newNode;
  }

  const insertionPoint = newBall.insertion.position;

  return {
    newBall,
    insertingBefore,
    insertionPoint,
  };
};
