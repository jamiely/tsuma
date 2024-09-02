import { stepMovement } from "./movement";
import { Ball, Chain, ChainedBall, Game, Launcher, Point } from "./types";
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
      color: randomColor(),
    }
  }
  let previous = head;
  for(let i = 1; i < length; i++) {
    const position = {...previous.ball.position};
    subtract(position, {x: game.ballRadius * 2, y: 0});
    const cball: ChainedBall = {
      ball: {
        position,
        prevPosition: position,
        color: randomColor(),
      },
      previous,
    }
    previous.next = cball;
    previous = cball;
  }
  return {head};
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
    headPosition: {x: 200, y: 200},
    length: 6
  })
  
  const chain2 = createChain({
    game,
    headPosition: {x: 30, y: 30},
    length: 3
  })


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
        const ball = chains[k].head.ball;
        if (!didCollide(freeBalls[i], ball)) continue;

        freeBalls.splice(i, 1);
        // there is no head now, but later the head will be adjusted
        chains.splice(k, 1);
        hasCollision = true;
        break outer;
      }
    }
  } while (hasCollision);
}
