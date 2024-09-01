export interface Point {
  x: number;
  y: number;
}

export interface HasPosition {
  position: Point;
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
}

export interface Launcher extends Ball {
  pointTo: Point;
}
