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

export type Color = "red" | "blue" | "green" | "gold" | "purple" | "black" | "#f8f9f9";

export interface Ball extends HasPosition {
  color: Color;
  prevPosition: Point;
}

export interface FreeBall extends Ball {
  velocity: Point;
}

export interface ChainedBall {
  ball: Ball;
  collidable: boolean;
  previous?: ChainedBall;
  next?: ChainedBall;
  waypoint?: Node<Point>;
  inserting?: boolean;
}

export interface Chain {
  path: WaypointPath;
  head: ChainedBall;
  foot: ChainedBall;
}

export interface Game {
  chainedBallSpeed: number;
  chains: Chain[];
  launcher: Launcher;
  freeBalls: FreeBall[];
  ballRadius: number;
  bounds: Rectangle;
  paths: WaypointPath[];
}

export interface Launcher extends Ball {
  pointTo: Point;
  launcherSpeed: number;
}
