import { buildBoards } from "./boards";
import { handleCollisions } from "./collision";
import { insertAfter, iterateToTail, remove } from "./linkedList";
import { resolveMatches } from "./match";
import { stepMovement } from "./movement";
import { BallCollisionEvent, BoardName, Chain, ChainedBall, Color, Effect, Explosion, Game, GameOverEvent, LaunchedBall, Launcher, MatchedBalls, WaypointPath } from "./types";
import { distance, randomColor as utilRandomColor, scale, subtract, toUnit } from "./util";
import { Node } from "./types";
import { createEventManager } from "./events";
import { createSoundManager } from "./sounds";

const createChain = ({
  game,
  waypointPath,
}: {
  game: Game;
  waypointPath: WaypointPath;
}): Chain => {
  const startingWaypoint = waypointPath.start.next!;
  const startingPosition = waypointPath.start.value;
  const chainedBall: ChainedBall = {
    waypoint: startingWaypoint,
    ball: {
      position: { ...startingPosition },
      color: randomColor(game),
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
  const launchedBallSpeed = 5;
  const bounds = {
    position: { x: 0, y: 0 },
    size: { width: 1000, height: 600 },
  };
  const events = createEventManager();
  createSoundManager(events);
  const game: Game = {
    debug: {
      ...debug,
      stopOnCollision: true,
      debugSteps: 0,
    },
    effects: [],
    options: {
      chainedBallSpeed: 0.6,
      insertingBallSpeed: launchedBallSpeed/3,
      launchedBallSpeed,
      firingDelay: 400,
    },
    ballsLeft: 100,
    ballRadius: 20, 
    boardOverSteps: 0,
    chains: [],
    launcher: {
      position: { x: 0, y: 0 },
      pointTo: { x: 0, y: 0 },
      color: 'red',
      launcherSpeed: launchedBallSpeed,
    },
    freeBalls: [],
    bounds,
    paths: [],
    lastFire: 0,
    boards: buildBoards(bounds),
    currentBoard,
    events,
  };

  game.launcher.color = randomColor(game);

  loadBoard(game);

  return game;
};

const loadBoard = (game: Game) => {
  console.log('loading board', game.currentBoard);
  const { launcherPosition, paths, ballCount } = game.boards[game.currentBoard];
  game.ballsLeft = ballCount ?? 100;
  game.launcher.position = launcherPosition;
  game.paths = paths;
  game.chains = paths.map((path) => createChain({game, waypointPath: path }));
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
  if(game.boardOver) return;

  const { launcher, freeBalls } = game;

  const now = Date.now();

  if (now - game.lastFire < game.options.firingDelay) return;

  game.lastFire = now;

  freeBalls.push({
    position: { ...launcher.position },
    velocity: launcherVelocity(launcher),
    color: launcher.color,
  });

  launcher.color = randomColor(game);

  game.events.dispatchEvent(new LaunchedBall());
};

export function step(game: Game) {
  if(game.debug.stop && game.debug.debugSteps <= 0) return;

  if(game.debug.debugSteps > 0) game.debug.debugSteps--;

  if(game.boardOver) {
    stepBoardOver(game);
    return
  }

  if(boardWon(game)) {
    game.boardOver = 'won';
    return;
  }

  stepMovement(game);

  const {hasCollision} = handleCollisions(game);
  if(hasCollision) {
    game.events.dispatchEvent(new BallCollisionEvent());
  }

  game.chains.forEach((chain) => {
    const {matches} = resolveMatches(game, chain)
    if(! matches) return;

    game.events.dispatchEvent(new MatchedBalls());
  });

  game.chains.forEach((chain) => appendToChain(game, chain));

  stepLauncher(game);

  game.effects.forEach(effect => stepEffect(game, effect))
  for(let i=game.effects.length-1; i>=0; i--) {
    const {shouldRemove} = stepEffect(game, game.effects[i]);
    if(!shouldRemove) continue;
    game.effects.splice(i, 1);
  }
}

function stepEffect(game: Game, effect: Effect): {shouldRemove: boolean} {
  if(effect.type === 'explosion') {
    return stepEffectExplosion(game, effect);
  }

  return {shouldRemove: false};
}

function stepEffectExplosion(game: Game, effect: Explosion): {shouldRemove: boolean} {
  effect.step++;

  if(effect.step < 150) {
    effect.radius++;
    removeBallsFromExplosion();
  } else if(effect.radius > 0) {
    effect.radius--;
  } else {
    return {shouldRemove: true}
  }

  return {shouldRemove: false};

  function removeBallsFromExplosion() {
    for(const chain of game.chains) {
      for(const {node} of iterateToTail(chain.head)) {
        const {value: {ball: {position}}} = node;
        const dist = distance(position, effect.center);
        if(dist < effect.radius) {
          // remove ball
          if(node === chain.head) {
            chain.head = node.next;
          }
          if(node === chain.foot) {
            chain.foot = node.previous;
          }

          remove(node);

          if(node.value.effect) {
            if(node.value.effect === 'explosion') {
              game.effects.push({
                type: 'explosion',
                center: position,
                radius: 1,
                step: 0,
              })
            }
          }
        }
      }
    }

  }
}

function stepLauncher(game: Game) {
  const {launcher} = game;
  const colorsLeft = remainingColors(game);

  if(colorsLeft.has(launcher.color)) {
    return;
  }

  launcher.color = utilRandomColor(Array.from(colorsLeft));
}

function stepBoardOver(game: Game) {
  if(game.boardOver === 'lost') return stepBoardOverLost(game);

  // choose another board
  nextBoard(game);
  loadBoard(game);
  game.boardOver = undefined;
  game.boardOverSteps = 0;
}

function nextBoard(game: Game) {
  if(game.currentBoard.startsWith('board1')) {
    const number = parseInt(game.currentBoard.substring(6));
    if(! isNaN(number)) {
      game.currentBoard = `board1${number % 5 + 1}` as BoardName;
      return;
    }
  }
  const boardNames = Object.keys(game.boards);
  const index = boardNames.indexOf(game.currentBoard);
  const nextIndex = (index + 1) % boardNames.length;
  game.currentBoard = boardNames[nextIndex] as BoardName;
}

function stepBoardOverLost(game: Game) {
  game.boardOverSteps++;
  if(game.boardOverSteps === 1) {
    game.events.dispatchEvent(new GameOverEvent())
  }
  stepMovement(game);
}

function appendToChain(game: Game, chain: Chain) {
  if (game.ballsLeft <= 0) return;

  // we want to spawn a new ball when the foot has cleared the first waypoint.
  const { foot, path } = chain;

  let effect: ChainedBall['effect'];
  if(!foot?.value.effect && Math.random() < .15) {
    effect = 'explosion';
  }

  const nextBall = (): Node<ChainedBall> => ({
    value: {
      waypoint: path.start.next!,
      ball: {
        position: { ...path.start.value },
        color: nextColor(game, chain),
      },
      effect,
    },
  });

  let node: Node<ChainedBall> | undefined;

  if(foot) {
    const dist = distance(foot.value.ball.position, path.start.value);
    if (dist < 2 * game.ballRadius) return;

    // the last ball has cleared, so create another one

    node = nextBall();
    insertAfter(node, foot);
  } else if(!chain.head) {
    // we cleared all the balls that have spawned
    // but we still have balls left to spawn.
    node = nextBall();
    chain.head = node;
  }

  if(! node) return;

  // the new ball always becomes the foot
  chain.foot = node;

  game.ballsLeft--;
}

function boardWon(game: Game) {
  if(game.ballsLeft > 0) return false;

  for(const chain of game.chains) {
    if(chain.foot || chain.head) return false;
  }
  return true;
}

function nextColor(game: Game, chain: Chain) {
  if(!chain.foot) return randomColor(game);

  const {
    value: {
      ball: { color },
    },
    previous,
  } = chain.foot;
  if (!previous) return randomColor(game);
  if (color !== previous.value.ball.color) return randomColor(game);

  do {
    const nextColor = randomColor(game);
    if (nextColor === color) continue;

    return nextColor;
  } while (true);
}

function randomColor(game: Game) {
  const baseColors = game.boards[game.currentBoard].colors;
  if(game.ballsLeft > 0) return utilRandomColor(baseColors);

  return utilRandomColor(Array.from(remainingColors(game)));
}

function remainingColors(game: Game): Set<Color> {
  const remainingColors = new Set<Color>();
  for(const c of game.chains) {
    for(const {value: {ball: {color}}} of iterateToTail(c.head)) {
      remainingColors.add(color);
    }
  }

  return remainingColors;
}