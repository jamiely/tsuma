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
  start: Node<Point>;
  end: Node<Point>;
}

export type Color =
  | "red"
  | "blue"
  | "green"
  | "gold"
  | "purple"
  | "black"
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

export interface ChainedBall {
  ball: Ball;
  effect?: EffectType;
  waypoint?: Node<Point>;
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
  | "test-chains"
  | "test-chains-cross";

interface Debug {
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
  appliedEffects: {
    slowDown?: SlowEffect,
    accuracy?: AccuracyEffect,
    backwards?: BackwardsEffect,
    explosions: Explosion[],
  },
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
  | GameOverEvent
  | MatchedBallsEvent
  | LaunchedBallEvent;

export interface EventManager {
  dispatchEvent(event: GameEvent): boolean;
  removeEventListener: (
    type: GameEventType,
    callback: (event: GameEvent) => void
  ) => void;
  addEventListener: (
    type: GameEventType,
    callback: (event: GameEvent) => void
  ) => void;
}
