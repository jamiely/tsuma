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

export type Color = "red" | "blue" | "green" | "yellow" | "purple";

export interface Ball extends HasPosition {
  color: Color;
}

export interface FreeBall extends Ball {
  velocity: Point;
}

export interface Chain {
  balls: Ball[];
}

export interface Game {
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
