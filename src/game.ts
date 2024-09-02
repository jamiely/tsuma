import { stepMovement } from "./movement";
import {
  Ball,
  Chain,
  ChainedBall,
  FreeBall,
  Game,
  Launcher,
  Point,
} from "./types";
import { distance, randomColor, scale, subtract, toUnit } from "./util";

const createChain = ({
  game,
  headPosition,
  length,
}: {
  length: number;
  game: Game;
  headPosition: Point;
}): Chain => {
  const head: ChainedBall = {
    ball: {
      position: headPosition,
      prevPosition: headPosition,
      color: "black",
    },
  };
  let previous = head;

  for (let i = 0; i <= length; i++) {
    const isFoot = i === length;
    const position = { ...previous.ball.position };
    subtract(position, { x: game.ballRadius * 2, y: 0 });
    const cball: ChainedBall = {
      ball: {
        position,
        prevPosition: position,
        color: isFoot ? "black" : randomColor(),
      },
      previous,
    };
    previous.next = cball;
    previous = cball;
  }
  return { head, foot: previous };
};

export const createGame = (): Game => {
  const game: Game = {
    chainedBallSpeed: 1.5,
    ballRadius: 10,
    chains: [],
    launcher: {
      prevPosition: { x: 300, y: 300 },
      position: { x: 300, y: 300 },
      pointTo: { x: 0, y: 0 },
      color: "purple",
      launcherSpeed: 2,
    },
    freeBalls: [],
    bounds: {
      position: { x: 0, y: 0 },
      size: { width: 800, height: 400 },
    },
  };

  const chain1 = createChain({
    game,
    headPosition: { x: 200, y: 200 },
    length: 6,
  });

  const chain2 = createChain({
    game,
    headPosition: { x: 30, y: 30 },
    length: 3,
  });

  game.chains.push(chain1, chain2);

  return game;
};

const launcherVelocity = ({ pointTo, position, launcherSpeed }: Launcher) => {
  // the un-normalized velocity vector
  const velocity = { ...pointTo };
  subtract(velocity, position);
  toUnit(velocity);
  scale(velocity, launcherSpeed);
  return velocity;
};

export const launchBall = ({ launcher, freeBalls }: Game) => {
  freeBalls.push({
    position: { ...launcher.position },
    prevPosition: { ...launcher.position },
    velocity: launcherVelocity(launcher),
    color: randomColor(),
  });
};

export function step(game: Game) {
  stepMovement(game);

  handleCollisions(game);
}

function handleCollisions(game: Game) {
  // if a launched ball collides with a ball in a chain,
  // the launched ball should be merged into the chain.
  // it should become part of the chain between the two
  // balls it is closest to in the chain.
  //
  // on collision, figure out whether the launched ball is
  // closer to the previous or next ball in the chain. Insert
  // between the balls it is closest to.

  const { chains, freeBalls } = game;

  const diameter = game.ballRadius * 2;
  const didCollide = (ball1: Ball, ball2: Ball) => {
    return diameter > distance(ball1.position, ball2.position);
  };

  // this is not quite what we want later,
  // since we don't want to balls to disappear
  let hasCollision = false;
  do {
    hasCollision = false;
    // slow
    outer: for (let i = freeBalls.length - 1; i >= 0; i--) {
      for (let k = chains.length - 1; k >= 0; k--) {
        let cball: ChainedBall | undefined = chains[k].head

        while(cball) {
          // cannot collide with black balls
          if (cball.ball.color === "black" ||
            !didCollide(freeBalls[i], cball.ball)) {
            cball = cball.next;
            continue;
          }

          // figure out whether the free ball is closer to prev or next
          const distPrev = cball.previous ? distance(freeBalls[i].position, cball.previous.ball.position) : undefined;
          const distNext = cball.next ? distance(freeBalls[i].position, cball.next.ball.position) : undefined;
          const insertPrevious = distPrev && distNext && distPrev < distNext;

          const {position, color} = freeBalls[i];
          const newBall: ChainedBall = {
            ball: {
              color,
              position,
              prevPosition: position,
            },
          }
          if(insertPrevious) {
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
          
          freeBalls.splice(i, 1);
          hasCollision = true;
          break outer;
        }
      }
    }
  } while (hasCollision);
}
