import { Color, Point } from "./types";

const colors: Color[] = ["red", "green", "blue", "yellow", "purple"];
export const randomColor = () =>
  colors[Math.floor(Math.random() * colors.length)];

export const distance = (pt1: Point, pt2: Point) => {
  const dx = pt1.x - pt2.x;
  const dy = pt1.y - pt2.y;
  return Math.sqrt(dx * dx + dy * dy);
};


const magnitude = ({x, y}: Point) => Math.sqrt(x * x + y * y);
export const subtract = (a: Point, b: Point) => {
  a.x -= b.x;
  a.y -= b.y;
}
export const scale = (a: Point, factor: number) => {
  a.x *= factor;
  a.y *= factor;
}

export const toUnit = (pt: Point) => {
  const mag = magnitude(pt);
  pt.x /= mag;
  pt.y /= mag;
}