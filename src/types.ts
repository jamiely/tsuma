import { RenderOptions } from "./renderer";

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface HasPosition {
  position: Point;
}

export interface Rectangle extends HasPosition {
  size: Size;
}

export const SUPER_LIGHT_GRAY = "#f8f9f9";

export interface Node<T> {
  previous?: Node<T>;
  next?: Node<T>;
  value: T;
}

export interface WaypointPath {
  start: Node<Waypoint>;
  end: Node<Waypoint>;
}

export type Color =
  | "red"
  | "blue"
  | "green"
  | "gold"
  | "purple"
  | "black"
  | "silver"
  | "#f8f9f9"
  | "none";

export type WaypointDirection = "forwards" | "backwards";

export interface Ball extends HasPosition {
  color: Color;
}

export interface FreeBall extends Ball {
  velocity: Point;
}

interface Insertion {
  position: Point;
}

export interface Waypoint extends Point {
  id: number;
}

export interface ChainedBall {
  ball: Ball;
  effect?: EffectType;
  waypoint?: Node<Waypoint>;
  insertion?: Insertion;
}

export interface Chain {
  path: WaypointPath;
  head: Node<ChainedBall> | undefined;
  foot: Node<ChainedBall> | undefined;
  // positive if we are inserting a ball into the chain
  inserting: 0;
  pauseStepsAfterMatch?: number;
}

export interface Board {
  name: string,
  launcherPosition: Point;
  paths: WaypointPath[];
  ballCount?: number;
  colors: Color[];
}

export type BoardName =
  | "shallowWave"
  | "wave"
  | "archimedes"
  | "line"
  | "test-tail"
  | "test-head"
  | "test"
  | "board11"
  | "board12"
  | "board13"
  | "board14"
  | "board15"
  | "board21"
  | "board22"
  | "board23"
  | "board24"
  | "board25"
  | "board31"
  | "board32"
  | "board33"
  | "board34"
  | "board35"
  | "board41"
  | "board42"
  | "board43"
  | "board44"
  | "board45"
  | "board46"
  | "board51"
  | "board52"
  | "board53"
  | "board54"
  | "board55"
  | "board56"
  | "board61"
  | "board62"
  | "board63"
  | "board64"
  | "board65"
  | "board66"
  | "board71"
  | "board72"
  | "board73"
  | "board74"
  | "board75"
  | "board76"
  | "board77"
  | "board81"
  | "board82"
  | "board83"
  | "board84"
  | "board85"
  | "board86"
  | "board87"
  | "board91"
  | "board92"
  | "board93"
  | "board94"
  | "board95"
  | "board96"
  | "board97"
  | "test-sink"
  | "test-chains"
  | "test-chains-cross";

interface Debug {
  enableMapEditMode: boolean;
  enabled?: boolean;
  collisionVector?: Point;
  movementVector?: Point;
  movementNormalVector?: Point;
  collisionChainedBallPosition?: Point;
  collisionFreeBallPosition?: Point;
  collisionPoint?: Point;
  stop?: boolean;
  stopOnCollision?: boolean;
  debugSteps: number;
  debugHistory: boolean;
  history: string[],
  historyLimit: number,
}

export interface Explosion {
  type: "explosion";
  center: Point;
  step: number;
  radius: number;
}

export interface SlowEffect {
  type: "slowEffect";
  step: number;
}

export interface AccuracyEffect {
  type: "accuracyEffect";
  step: number;
  pointFrom: Point;
  pointTo: Point | undefined;
}

export interface BackwardsEffect {
  type: "backwardsEffect";
  step: number;
}


export type Effect = Explosion | SlowEffect | AccuracyEffect | BackwardsEffect;

export interface Game {
  audio: {
    enabled: boolean;
  },
  appliedEffects: {
    slowDown?: SlowEffect,
    accuracy?: AccuracyEffect,
    backwards?: BackwardsEffect,
    explosions: Explosion[],
  },
  boardSteps: number,
  boardOver?: "won" | "lost";
  boardOverSteps: number;
  debug: Debug;
  chainedBallSpeed: number;
  firingDelay: number,
  options: {
    defaultChainedBallSpeed: number;
    magneticBallSpeed: number;
    launchedBallSpeed: number;
    insertingBallSpeed: number;
    defaultFiringDelay: number;
    backwardsDuration: number;
    accuracyDuration: number;
    slowDuration: number;
    explosionExpansionDuration: number;
  };
  ballsLeft: number;
  chains: Chain[];
  launcher: Launcher;
  freeBalls: FreeBall[];
  ballRadius: number;
  bounds: Rectangle;
  paths: WaypointPath[];
  lastFire: number;
  boards: Record<BoardName, Board>;
  currentBoard: BoardName;
  events: EventManager;
  renderOptions: RenderOptions;
}

export interface Launcher extends Ball {
  pointTo: Point;
  launcherSpeed: number;
}

export interface AppConfig {
  stepsPerFrame: number;
}

export type EffectType = "explosion" | "slowEffect" | "accuracyEffect" | "backwardsEffect";

export type GameEventType =
  | "launchedBall"
  | "matchedBalls"
  | "boardOver"
  | "gameOver"
  | "ballCollision"
  | EffectType;

export class BaseGameEvent extends Event {
  constructor(type: GameEventType) {
    super(type);
  }
}

export class LaunchedBallEvent extends BaseGameEvent {
  constructor() {
    super("launchedBall");
  }
}

export interface LaunchedBallEvent extends BaseGameEvent {
  type: "launchedBall";
}

export class MatchedBallsEvent extends BaseGameEvent {
  constructor() {
    super("matchedBalls");
  }
}

export interface MatchedBallsEvent extends BaseGameEvent {
  type: "matchedBalls";
}

export class GameOverEvent extends BaseGameEvent {
  constructor() {
    super("gameOver");
  }
}

export interface GameOverEvent extends BaseGameEvent {
  type: "gameOver";
}

export class BoardOverEvent extends BaseGameEvent {
  constructor() {
    super("boardOver");
  }
}

export interface BoardOverEvent extends BaseGameEvent {
  type: "boardOver";
}

export class BallCollisionEvent extends BaseGameEvent {
  constructor() {
    super("ballCollision");
  }
}

export interface BallCollisionEvent extends BaseGameEvent {
  type: "ballCollision";
}

class EffectEvent extends BaseGameEvent {
  constructor(effectType: EffectType) {
    super(effectType);
  }
}

interface EffectEvent {
  type: EffectType;
}

export class SlowEffectEvent extends EffectEvent {
  constructor() {
    super("slowEffect");
  }
}

export interface SlowEffectEvent extends EffectEvent {
  type: "slowEffect";
}

export class ExplosionEffectEvent extends BaseGameEvent {
  constructor(public center: Point) {
    super("explosion");
  }
}

export interface ExplosionEffectEvent extends BaseGameEvent {
  type: "explosion";
  center: Point;
}

export class AccuracyEffectEvent extends BaseGameEvent {
  constructor() {
    super('accuracyEffect');
  }
}

export interface AccuracyEffectEvent extends BaseGameEvent {
  type: 'accuracyEffect';
}

export class BackwardsEffectEvent extends BaseGameEvent {
  constructor() {
    super('backwardsEffect');
  }
}

export interface BackwardsEffectEvent extends BaseGameEvent {
  type: 'backwardsEffect'
}

export type GameEvent =
  | ExplosionEffectEvent
  | SlowEffectEvent
  | AccuracyEffectEvent
  | BackwardsEffectEvent
  | BallCollisionEvent
  | BoardOverEvent
  | GameOverEvent
  | MatchedBallsEvent
  | LaunchedBallEvent;

export interface EventManager {
  dispatchEvent(event: GameEvent): boolean;
  removeAll: () => void;
  removeEventListener: (
    type: GameEventType,
    callback: (event: GameEvent) => void
  ) => void;
  addEventListener: (
    type: GameEventType,
    callback: (event: GameEvent) => void
  ) => void;
}
