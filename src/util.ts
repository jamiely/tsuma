import { Color, Point } from "./types";

const colors: Color[] = ["red", "green", "blue", "yellow", "purple"];
export const randomColor = () =>
  colors[Math.floor(Math.random() * colors.length)];

export const distance = (pt1: Point, pt2: Point) => {
  const dx = pt1.x - pt2.x;
  const dy = pt1.y - pt2.y;
  return Math.sqrt(dx * dx + dy * dy);
};
