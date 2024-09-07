import { handleCollisions } from "./collision";
import { resolveMatches } from "./match";
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
import { distance, randomColor, scale, subtract, toUnit } from "./util";

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
  const startingPosition = waypointPath.start.value;
  const chainedBall: ChainedBall = {
    collidable: true,
    waypoint: startingWaypoint,
    ball: {
      position: { ...startingPosition },
      prevPosition: { ...startingPosition },
      color: randomColor(),
    },
  };

  return {
    head: chainedBall,
    foot: chainedBall,
    path: waypointPath,
    inserting: 0,
  };
};

export const createGame = (): Game => {
  const launchedBallSpeed = 4;
  const game: Game = {
    options: {
      chainedBallSpeed: 1,
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
    length: 12,
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

  if (now - game.lastFire < game.options.firingDelay) return;

  game.lastFire = now;

  freeBalls.push({
    position: { ...launcher.position },
    prevPosition: { ...launcher.position },
    velocity: launcherVelocity(launcher),
    color: launcher.color,
  });

  launcher.color = randomColor();
};

export function step(game: Game) {
  stepMovement(game);

  handleCollisions(game);

  game.chains.forEach(resolveMatches);

  game.chains.forEach(chain => appendToChain(game, chain));
}

function appendToChain(game: Game, chain: Chain) {
  // we want to spawn a new ball when the foot has cleared the first waypoint.
  const { foot, path } = chain;

  const dist = distance(foot.ball.position, path.start.value);
  if (dist < 2 * game.ballRadius) return;

  // the last ball has cleared, so create another one

  const chainedBall: ChainedBall = {
    collidable: true,
    waypoint: path.start.next!,
    ball: {
      position: { ...path.start.value },
      prevPosition: { ...path.start.value },
      color: nextColor(chain),
    },
    previous: foot,
  };

  foot.next = chainedBall;
  
  // the new ball always becomes the foot
  chain.foot = chainedBall;
}

function nextColor(chain: Chain) {
  const {foot: {ball: {color}, previous}} = chain;
  if(! previous) return randomColor();
  if(color !== previous.ball.color) return randomColor();

  do {
    const nextColor = randomColor();
    if(nextColor === color) continue;

    return nextColor;
  } while(true);

}