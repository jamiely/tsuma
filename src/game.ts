import { stepMovement } from "./movement";
import { Ball, Chain, Game, Launcher, Point } from "./types";
import { distance, randomColor, scale, subtract, toUnit } from "./util";

export const createGame = (): Game => {
  const chains: Chain[] = [
    {
      balls: [
        { position: { x: 200, y: 200 }, color: "red" },
        { position: { x: 10, y: 10 }, color: "blue" },
      ],
    },
  ];

  return {
    ballRadius: 10,
    chains,
    launcher: {
      position: { x: 300, y: 300 },
      pointTo: { x: 0, y: 0 },
      color: "purple",
      launcherSpeed: 2,
    },
    freeBalls: [],
    bounds: {
      position: {x:0, y:0},
      size: {width: 800, height: 400},
    },
  };
};

const launcherVelocity = ({pointTo, position, launcherSpeed}: Launcher) => {
  // the un-normalized velocity vector
  const velocity = {...pointTo};
  subtract(velocity, position);
  toUnit(velocity);
  scale(velocity, launcherSpeed);
  return velocity;
}

export const launchBall = ({launcher, freeBalls}: Game) => {
  freeBalls.push({
    position: { ...launcher.position },
    velocity: launcherVelocity(launcher),
    color: randomColor(),
  });
}

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
        const balls = chains[k].balls;
        for (let j = balls.length - 1; j >= 0; j--) {
          if (didCollide(freeBalls[i], balls[j])) {
            freeBalls.splice(i, 1);
            balls.splice(j, 1);
            hasCollision = true;
            break outer;
          }
        }
      }
    }
  } while (hasCollision);
}
