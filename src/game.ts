import { buildBoards } from "./boards";
import { handleCollisions } from "./collision";
import { insertAfter, iterateToTail, remove } from "./linkedList";
import { resolveMatches } from "./match";
import { stepMovement } from "./movement";
import {
  AccuracyEffect,
  BackwardsEffect,
  BallCollisionEvent,
  BoardName,
  BoardOverEvent,
  Chain,
  ChainedBall,
  Color,
  EffectType,
  Explosion,
  ExplosionEffectEvent,
  Game,
  GameOverEvent,
  LaunchedBallEvent,
  Launcher,
  MatchedBallsEvent,
  Point,
  SlowEffect,
  WaypointPath,
} from "./types";
import {
  distance,
  randomColor as utilRandomColor,
  scale,
  subtract,
  toUnit,
  inBounds,
  add,
} from "./util";
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

export const createGame = ({
  currentBoard,
  debug,
}: Pick<Game, "currentBoard"> & { debug: Partial<Game["debug"]> }): Game => {
  const launchedBallSpeed = 5;
  const bounds = {
    position: { x: 0, y: 0 },
    size: { width: 1000, height: 600 },
  };
  const events = createEventManager();
  createSoundManager(events);
  const defaultFiringDelay = 500
  const game: Game = {
    boardSteps: 0,
    debug: {
      ...debug,
      stopOnCollision: true,
      debugSteps: 0,
    },
    appliedEffects: {
      explosions: [],
    },
    chainedBallSpeed: 0.6,
    firingDelay: defaultFiringDelay,
    options: {
      accuracyDuration: 800,
      backwardsDuration: 1000,
      defaultChainedBallSpeed: 0.6,
      explosionExpansionDuration: 150,
      insertingBallSpeed: launchedBallSpeed / 3,
      launchedBallSpeed,
      defaultFiringDelay,
      magneticBallSpeed: 0.6,
      slowDuration: 1200,
    },
    ballsLeft: 100,
    ballRadius: 20,
    boardOverSteps: 0,
    chains: [],
    launcher: {
      position: { x: 0, y: 0 },
      pointTo: { x: 0, y: 0 },
      color: "red",
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
  handleEvents(game);

  game.launcher.color = randomColor(game);

  loadBoard(game);

  return game;
};

const loadBoard = (game: Game) => {
  game.boardSteps = 0;
  // clear all effects
  game.appliedEffects = {explosions: []};
  game.chainedBallSpeed = game.options.defaultChainedBallSpeed;
  game.firingDelay = game.options.defaultFiringDelay;

  console.log("loading board", game.currentBoard);
  const { launcherPosition, paths, ballCount } = game.boards[game.currentBoard];
  game.ballsLeft = ballCount ?? 100;
  game.launcher.position = launcherPosition;
  game.freeBalls = [];
  game.paths = paths;
  game.chains = paths.map((path) => createChain({ game, waypointPath: path }));
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
  if (game.boardOver) return;

  const { launcher, freeBalls } = game;

  const now = Date.now();

  if (now - game.lastFire < game.firingDelay) return;

  game.lastFire = now;

  freeBalls.push({
    position: { ...launcher.position },
    velocity: launcherVelocity(launcher),
    color: launcher.color,
  });

  launcher.color = randomColor(game);

  game.events.dispatchEvent(new LaunchedBallEvent());
};

export function step(game: Game) {
  if (game.debug.stop && game.debug.debugSteps <= 0) return;

  if (game.debug.debugSteps > 0) game.debug.debugSteps--;

  game.boardSteps ++;

  if (game.boardOver) {
    stepBoardOver(game);
    return;
  }

  if (boardWon(game)) {
    game.boardOver = "won";
    return;
  }

  stepMovement(game);

  const { hasCollision } = handleCollisions(game);
  if (hasCollision) {
    game.events.dispatchEvent(new BallCollisionEvent());
  }

  game.chains.forEach((chain) => {
    const { matches } = resolveMatches(game, chain);
    if (!matches) return;

    game.events.dispatchEvent(new MatchedBallsEvent());
  });

  game.chains.forEach((chain) => appendToChain(game, chain));

  stepLauncher(game);

  const {accuracy, backwards, slowDown, explosions} = game.appliedEffects

  if(accuracy) stepEffectAccuracy(game, accuracy);
  if(backwards) stepEffectBackwards(game, backwards);
  if(slowDown) stepEffectSlow(game, slowDown);
  explosions?.forEach(effect => stepEffectExplosion(game, effect));
}

function stepEffectBackwards(
  game: Game,
  effect: BackwardsEffect
) {
  effect.step++;

  if (effect.step < game.options.backwardsDuration) {
    // pass
  } else {
    game.appliedEffects.backwards = undefined;
  }
}

function stepEffectAccuracy(
  game: Game,
  effect: AccuracyEffect
) {
  effect.step++;

  if (effect.step < game.options.accuracyDuration) {
    if(!game.appliedEffects.accuracy) {
      game.appliedEffects.accuracy = effect;
    }
    game.firingDelay = game.options.defaultFiringDelay / 2;
    setPointTo();
  } else {
    game.firingDelay = game.options.defaultFiringDelay;
    game.appliedEffects.accuracy = undefined;
  }

  function setPointTo() {
    effect.pointTo = undefined;

    const directionVector = {...game.launcher.pointTo}
    subtract(directionVector, effect.pointFrom);
    toUnit(directionVector);

    const current = {...effect.pointFrom};
    let closestCollision: {distance: number, position: Point} | undefined = undefined;
    for(let loopCount = 0, MAX_LOOP = 10_000; inBounds(current, game.bounds); loopCount ++) {
      if(loopCount > MAX_LOOP) {
        debugger;
        throw 'Infinite loop in stepEffectAccuracy';
      }
      for(const chain of game.chains) {
        for(const {value: {ball: {position}}} of iterateToTail(chain.head)) {
          const dist = distance(position, current);
          if(dist > game.ballRadius * 2) continue;
          if(closestCollision && closestCollision.distance < dist) continue;
          
          closestCollision = {
            distance: dist,
            position: {...current},
          }
        }
      }
      add(current, directionVector);
    }

    if(! closestCollision) return;
    effect.pointTo = {...closestCollision.position};
  }
}

function stepEffectSlow(
  game: Game,
  effect: SlowEffect
 ) {
  effect.step++;

  if (effect.step < game.options.slowDuration) {
    game.chainedBallSpeed = game.options.defaultChainedBallSpeed * 0.25;
  } else {
    game.chainedBallSpeed = game.options.defaultChainedBallSpeed;
  }
}

function stepEffectExplosion(
  game: Game,
  effect: Explosion
): { shouldRemove: boolean } {
  effect.step++;

  if (effect.step < game.options.explosionExpansionDuration) {
    effect.radius++;
    removeBallsFromExplosion();
  } else if (effect.radius > 0) {
    effect.radius--;
  } else {
    return { shouldRemove: true };
  }

  return { shouldRemove: false };

  function removeBallsFromExplosion() {
    for (const chain of game.chains) {
      for (const { node } of iterateToTail(chain.head)) {
        const {
          value: {
            ball: { position },
          },
        } = node;
        const dist = distance(position, effect.center);
        if (dist < effect.radius) {
          // remove ball
          if (node === chain.head) {
            chain.head = node.next;
          }
          if (node === chain.foot) {
            chain.foot = node.previous;
          }

          remove(node);

          if (node.value.effect) {
            if (node.value.effect === "explosion") {
              game.events.dispatchEvent(new ExplosionEffectEvent(position));
            }
          }
        }
      }
    }
  }
}

function stepLauncher(game: Game) {
  const { launcher } = game;

  // the color may come up in the remaining balls
  if(game.ballsLeft > 10) {
    return;
  }

  const colorsLeft = remainingColors(game);

  if (colorsLeft.has(launcher.color)) {
    return;
  }

  launcher.color = utilRandomColor(Array.from(colorsLeft)) || "red";
}

function stepBoardOver(game: Game) {
  if (game.boardOver === "lost") return stepBoardOverLost(game);

  // choose another board
  nextBoard(game);
  loadBoard(game);
  game.boardOver = undefined;
  game.boardOverSteps = 0;
}

function nextBoard(game: Game) {
  if (game.currentBoard.startsWith("board1")) {
    const number = parseInt(game.currentBoard.substring(6));
    if (!isNaN(number)) {
      game.currentBoard = `board1${(number % 5) + 1}` as BoardName;
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
  if (game.boardOverSteps === 1) {
    game.events.dispatchEvent(new BoardOverEvent());
  } else if(game.boardOverSteps > 300) {
    resetBoard(game);
    return;
  }

  stepMovement(game);
}

function resetBoard(game: Game) {
  game.boardOverSteps = 0;
  game.boardOver = undefined;
  loadBoard(game);
}

function newBallEffect(
  _game: Game,
  chain: Chain
): ChainedBall["effect"] | undefined {

  // don't put power ups next to each other
  if (chain.foot?.value.effect) return;

  const value = Math.random();
  if (value > 0.5) return;

  const probabilities: Record<EffectType, number> = {
    slowEffect: 0.2,
    accuracyEffect: 0.2,
    explosion: 0.1,
    backwardsEffect: 0.1,
  } as const;

  const effects = Object.keys(probabilities) as (keyof typeof probabilities)[];
  shuffleArray(effects);

  for(const effect of effects) {
    const prob = probabilities[effect];
    if(Math.random() < prob) {
      return effect;
    }
  }

  return undefined;

  function shuffleArray<T>(array: T[]) {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
  }
}

function appendToChain(game: Game, chain: Chain) {
  if(game.appliedEffects.backwards) return;
  if (game.ballsLeft <= 0) return;

  // we want to spawn a new ball when the foot has cleared the first waypoint.
  const { foot, path } = chain;

  const nextBall = (): Node<ChainedBall> => ({
    value: {
      waypoint: path.start.next!,
      ball: {
        position: { ...path.start.value },
        color: nextColor(game, chain),
      },
      effect: newBallEffect(game, chain),
    },
  });

  let node: Node<ChainedBall> | undefined;

  if (chain.head && foot) {
    const dist = distance(foot.value.ball.position, path.start.value);
    if (dist < 2 * game.ballRadius) return;

    // the last ball has cleared, so create another one

    node = nextBall();
    insertAfter(node, foot);
  } else if (!chain.head) {
    // we cleared all the balls that have spawned
    // but we still have balls left to spawn.
    node = nextBall();
    chain.head = node;
  }

  if (!node) return;

  // the new ball always becomes the foot
  chain.foot = node;

  game.ballsLeft--;
}

function boardWon(game: Game) {
  if (game.ballsLeft > 0) return false;

  for (const chain of game.chains) {
    if (chain.foot || chain.head) return false;
  }
  return true;
}

function nextColor(game: Game, chain: Chain) {
  if (!chain.foot) return randomColor(game);

  const {
    value: {
      ball: { color },
    },
    previous,
  } = chain.foot;
  if (!previous) return randomColor(game);
  if (color !== previous.value.ball.color) return randomColor(game);

  for(let loopCount = 0, MAX_LOOP = 50; true; loopCount++) {
    if(loopCount > MAX_LOOP) {
      throw 'Infinite loop in nextColor';
    }

    const nextColor = randomColor(game);
    if (nextColor === color) continue;

    return nextColor;
  }
}

function randomColor(game: Game) {
  const fallbackColor = "red";

  const baseColors = game.boards[game.currentBoard].colors;
  if (game.ballsLeft > 0) return utilRandomColor(baseColors) || fallbackColor;

  return utilRandomColor(Array.from(remainingColors(game))) || fallbackColor;
}

function remainingColors(game: Game): Set<Color> {
  const remainingColors = new Set<Color>();
  for (const c of game.chains) {
    for (const {
      value: {
        ball: { color },
      },
    } of iterateToTail(c.head)) {
      remainingColors.add(color);
    }
  }

  return remainingColors;
}

function handleEvents(game: Game) {
  game.events.addEventListener("explosion", (event) => {
    if (event.type !== "explosion") return;

    game.appliedEffects.explosions.push({
      type: "explosion",
      center: event.center,
      radius: 1,
      step: 0,
    });
  });

  game.events.addEventListener("slowEffect", (event) => {
    if (event.type !== "slowEffect") return;

    game.appliedEffects.slowDown = {
      type: "slowEffect",
      step: 0,
    };
  });

  game.events.addEventListener("accuracyEffect", (event) => {
    if (event.type !== "accuracyEffect") return;

    game.appliedEffects.accuracy = {
      type: "accuracyEffect",
      step: 0,
      pointFrom: game.launcher.position,
      pointTo: game.launcher.pointTo,
    };
  });
  
  game.events.addEventListener("backwardsEffect", (event) => {
    if (event.type !== "backwardsEffect") return;

    game.appliedEffects.backwards = {
      type: "backwardsEffect",
      step: 0,
    };
  });
}
