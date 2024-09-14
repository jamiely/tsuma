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

export const SUPER_LIGHT_GRAY = '#f8f9f9';

export interface Node<T> {
  previous?: Node<T>;
  next?: Node<T>;
  value: T
}

export interface WaypointPath {
  start: Node<Point>;
  end: Node<Point>;
}

export type Color = "red" | "blue" | "green" | "gold" | "purple" | "black" | "#f8f9f9" | 'none';

export type WaypointDirection = 'forwards' | 'backwards';

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
  waypoint?: Node<Point>;
  insertion?: Insertion;
}

export interface Chain {
  path: WaypointPath;
  head: Node<ChainedBall>;
  foot: Node<ChainedBall>;
  // positive if we are inserting a ball into the chain
  inserting: 0;
  pauseStepsAfterMatch?: number;
}

export interface Board {
  launcherPosition: Point;
  paths: WaypointPath[];
  ballCount?: number;
}

type BoardName = 'shallowWave' | 'wave' | 'archimedes' | 'line' | 'test-tail' | 'test-head' | 'test';

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

export interface Game {
  boardOver?: 'won' | 'lost';
  boardOverSteps: number;
  debug: Debug;
  options: {
    chainedBallSpeed: number;
    launchedBallSpeed: number;
    insertingBallSpeed: number;
    firingDelay: number;
  },
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
}

export interface Launcher extends Ball {
  pointTo: Point;
  launcherSpeed: number;
}

export interface AppConfig {
  stepsPerFrame: number;
}