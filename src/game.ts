import { buildBoards } from "./boards";
import { handleCollisions } from "./collision";
import { insertAfter } from "./linkedList";
import { resolveMatches } from "./match";
import { stepMovement } from "./movement";
import { Chain, ChainedBall, Game, Launcher, WaypointPath } from "./types";
import { distance, randomColor, scale, subtract, toUnit } from "./util";
import { Node } from "./types";

const createChain = ({
  waypointPath,
}: {
  waypointPath: WaypointPath;
}): Chain => {
  const startingWaypoint = waypointPath.start.next!;
  const startingPosition = waypointPath.start.value;
  const chainedBall: ChainedBall = {
    waypoint: startingWaypoint,
    ball: {
      position: { ...startingPosition },
      color: randomColor(),
    },
  };

  const node = { value: chainedBall };

  return {
    head: node,
    foot: node,
    path: waypointPath,
    inserting: 0,
  };
};

export const createGame = ({currentBoard, debug}: Pick<Game, 'currentBoard'> & {debug: Partial<Game['debug']>}): Game => {
  const launchedBallSpeed = 10;
  const bounds = {
    position: { x: 0, y: 0 },
    size: { width: 1000, height: 600 },
  };
  const game: Game = {
    debug: {
      ...debug,
      stopOnCollision: true,
      debugSteps: 0,
    },
    options: {
      chainedBallSpeed: 1,
      insertingBallSpeed: 5,
      launchedBallSpeed,
      firingDelay: 300,
    },
    ballsLeft: 100,
    ballRadius: 20,
    chains: [],
    launcher: {
      position: { x: 0, y: 0 },
      pointTo: { x: 0, y: 0 },
      color: randomColor(),
      launcherSpeed: launchedBallSpeed,
    },
    freeBalls: [],
    bounds,
    paths: [],
    lastFire: 0,
    boards: buildBoards(bounds),
    currentBoard,
  };

  loadBoard(game);

  return game;
};

const loadBoard = (game: Game) => {
  const { launcherPosition, paths, ballCount } = game.boards[game.currentBoard];
  game.ballsLeft = ballCount ?? 100;
  game.launcher.position = launcherPosition;
  game.paths = paths;
  game.chains = paths.map((path) => createChain({ waypointPath: path }));
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
    velocity: launcherVelocity(launcher),
    color: launcher.color,
  });

  launcher.color = randomColor();
};

export function step(game: Game) {
  if(game.debug.stop && game.debug.debugSteps <= 0) return;

  if(game.debug.debugSteps > 0) game.debug.debugSteps--;

  stepMovement(game);

  handleCollisions(game);

  game.chains.forEach((chain) => resolveMatches(game, chain));

  game.chains.forEach((chain) => appendToChain(game, chain));
}

function appendToChain(game: Game, chain: Chain) {
  if (game.ballsLeft <= 0) return;

  // we want to spawn a new ball when the foot has cleared the first waypoint.
  const { foot, path } = chain;

  const dist = distance(foot.value.ball.position, path.start.value);
  if (dist < 2 * game.ballRadius) return;

  // the last ball has cleared, so create another one

  const node: Node<ChainedBall> = {
    value: {
      waypoint: path.start.next!,
      ball: {
        position: { ...path.start.value },
        color: nextColor(chain),
      },
    },
  };

  insertAfter(node, foot);

  // the new ball always becomes the foot
  chain.foot = node;

  game.ballsLeft--;
}

function nextColor(chain: Chain) {
  const {
    foot: {
      value: {
        ball: { color },
      },
      previous,
    },
  } = chain;
  if (!previous) return randomColor();
  if (color !== previous.value.ball.color) return randomColor();

  do {
    const nextColor = randomColor();
    if (nextColor === color) continue;

    return nextColor;
  } while (true);
}
