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

export type Color = "red" | "blue" | "green" | "yellow" | "purple" | "black";

export interface Ball extends HasPosition {
  color: Color;
  prevPosition: Point;
}

export interface FreeBall extends Ball {
  velocity: Point;
}

export interface ChainedBall {
  ball: Ball;
  previous?: ChainedBall;
  next?: ChainedBall;
}

export interface Chain {
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
}

export interface Launcher extends Ball {
  pointTo: Point;
  launcherSpeed: number;
}
