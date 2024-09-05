import { Color, Point, Rectangle } from "./types";

const colors: Color[] = ["red", "green", "blue", "gold", "purple"];
export const randomColor = () =>
  colors[Math.floor(Math.random() * colors.length)];

export const distance = (pt1: Point, pt2: Point) => {
  const dx = pt1.x - pt2.x;
  const dy = pt1.y - pt2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const inBounds = (pt: Point, {position, size}: Rectangle) => {
  if(pt.x < position.x) return false;
  if(pt.x > position.x + size.width) return false;
  if(pt.y < position.y) return false;
  if(pt.y > position.y + size.height) return false;

  return true;
}

export const magnitude = ({ x, y }: Point) => Math.sqrt(x * x + y * y);
export const add = (a: Point, b: Point) => {
  a.x += b.x;
  a.y += b.y;
};
export const subtract = (a: Point, b: Point) => {
  a.x -= b.x;
  a.y -= b.y;
};
export const scale = (a: Point, factor: number) => {
  a.x *= factor;
  a.y *= factor;
};

export const toUnit = (pt: Point) => {
  const mag = magnitude(pt);
  pt.x /= mag;
  pt.y /= mag;
};

// via chat GPT
export function getIntersection(
  A: Point, B: Point,
  C: Point, D: Point
): Point | null {
  // Line AB represented as a1x + b1y = c1
  const a1 = B.y - A.y;
  const b1 = A.x - B.x;
  const c1 = a1 * A.x + b1 * A.y;

  // Line CD represented as a2x + b2y = c2
  const a2 = D.y - C.y;
  const b2 = C.x - D.x;
  const c2 = a2 * C.x + b2 * C.y;

  const determinant = a1 * b2 - a2 * b1;

  if (determinant === 0) {
      // The lines are parallel, so no intersection
      return null;
  } else {
      const x = (b2 * c1 - b1 * c2) / determinant;
      const y = (a1 * c2 - a2 * c1) / determinant;

      return { x, y };
  }
}
