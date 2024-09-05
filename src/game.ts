import { handleCollisions } from "./collision";
import { stepMovement } from "./movement";
import { createWaypointPathCustom, sinPath } from "./path";
import {
  Chain,
  ChainedBall,
  Game,
  Launcher,
  Point,
  SUPER_LIGHT_GRAY,
  WaypointPath,
} from "./types";
import { randomColor, scale, subtract, toUnit } from "./util";

const HIDDEN_BALL_COLOR = SUPER_LIGHT_GRAY;

const createChain = ({
  game,
  length,
  waypointPath,
}: {
  length: number;
  game: Game;
  headPosition: Point;
  waypointPath: WaypointPath;
}): Chain => {
  const startingWaypoint = waypointPath.start.next!;
  const head: ChainedBall = {
    collidable: false,
    waypoint: startingWaypoint,
    ball: {
      position: { ...waypointPath.start.value },
      prevPosition: { ...waypointPath.start.value },
      color: HIDDEN_BALL_COLOR,
    },
  };
  let previous = head;

  for (let i = 0; i <= length; i++) {
    const isFoot = i === length;
    const position = { ...previous.ball.position };
    subtract(position, { x: game.ballRadius * 2 + 2, y: 0 });
    const cball: ChainedBall = {
      collidable: !isFoot,
      waypoint: startingWaypoint,
      ball: {
        position,
        prevPosition: position,
        color: isFoot ? HIDDEN_BALL_COLOR : randomColor(),
      },
      previous,
    };
    previous.next = cball;
    previous = cball;
  }
  return { head, foot: previous, path: waypointPath, inserting: 0 };
};

export const createGame = (): Game => {
  const launchedBallSpeed = 4;
  const game: Game = {
    options: {
      chainedBallSpeed: 1.5,
      launchedBallSpeed,
      firingDelay: 300,
    },
    ballRadius: 10,
    chains: [],
    launcher: {
      prevPosition: { x: 300, y: 300 },
      position: { x: 300, y: 300 },
      pointTo: { x: 0, y: 0 },
      color: "purple",
      launcherSpeed: launchedBallSpeed,
    },
    freeBalls: [],
    bounds: {
      position: { x: 0, y: 0 },
      size: { width: 800, height: 400 },
    },
    paths: [],
    lastFire: 0,
  };

  const waypointPath = createWaypointPathCustom(sinPath(game, 100));
  game.paths.push(waypointPath);

  const chain1 = createChain({
    game,
    headPosition: { x: 200, y: 200 },
    length: 8,
    waypointPath,
  });

  game.chains.push(chain1);

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

export const launchBall = (game: Game) => {
  const { launcher, freeBalls } = game;

  const now = Date.now();

  if(now - game.lastFire < game.options.firingDelay) return;

  game.lastFire = now;

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
