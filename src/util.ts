import {
  ChainedBall,
  Color,
  Point,
  Rectangle,
  WaypointDirection,
} from "./types";

export const defaultColors: Color[] = ["red", "green", "blue", "gold"];
export const randomColor = (colors: Color[] = defaultColors) =>
  colors[Math.floor(Math.random() * colors.length)];

export const distance = (pt1: Point, pt2: Point) => {
  const dx = pt1.x - pt2.x;
  const dy = pt1.y - pt2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const inBounds = (pt: Point, { position, size }: Rectangle) => {
  const padding = { x: 20, y: 20 };
  if (pt.x < position.x - padding.x) return false;
  if (pt.x > position.x + size.width + padding.x) return false;
  if (pt.y < position.y - padding.y) return false;
  if (pt.y > position.y + size.height + padding.y) return false;

  return true;
};

export const magnitude = ({ x, y }: Point) =>
  x === 0 && y === 0 ? 0 : Math.sqrt(x * x + y * y);

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
  if (pt.x === 0 && pt.y === 0) return pt;

  const mag = magnitude(pt);
  pt.x /= mag;
  pt.y /= mag;
};

export const setPoint = (dest: Point, src: Point) => {
  dest.x = src.x;
  dest.y = src.y;
};

// via chat GPT
export function getIntersection(
  A: Point,
  B: Point,
  C: Point,
  D: Point
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

export function dotProduct(pt1: Point, pt2: Point): number {
  return pt1.x * pt2.x + pt1.y * pt2.y;
}

export function angleBetweenVectors(vec1: Point, vec2: Point): number {
  const magnitudes = magnitude(vec1) * magnitude(vec2);
  return Math.acos(dotProduct(vec1, vec2) / magnitudes);
}

export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

export function normal({ x, y }: Point): Point {
  return { x: -y, y: x };
}

export const waypointVector = (
  chainedBall: ChainedBall,
  {
    scale: scaleFactor,
    waypointDirection = "forwards",
  }: { scale?: number; waypointDirection?: WaypointDirection } = {}
): Point => {
  const waypoint = waypointDirection === 'forwards' ? chainedBall.waypoint : chainedBall.waypoint?.previous;

  if (!waypoint) throw `chained ball waypoint is empty for direction ${waypointDirection}`;

  const vec = waypointVectorFromPosition(
    chainedBall.ball.position,
    waypoint.value
  );
  if (scaleFactor) {
    scale(vec, scaleFactor);
  }
  return vec;
};

export const waypointVectorFromPosition = (
  position: Point,
  waypoint: Point
): Point => {
  const vec2 = { ...waypoint };
  subtract(vec2, position);
  toUnit(vec2);
  return vec2;
};


// Linear interpolation between two points (lerp function)
function lerp(p0: Point, p1: Point, t: number): Point {
  return {
      x: p0.x + t * (p1.x - p0.x),
      y: p0.y + t * (p1.y - p0.y)
  };
}

// Chaikin's algorithm for smoothing a curve
export function chaikinSmoothing(
  points: Point[], 
  iterations: number = 3, 
  smoothingFactor: number = 0.25
): Point[] {
  let smoothedPoints = [...points]; // Start with the original points

  for (let iter = 0; iter < iterations; iter++) {
      const newPoints: Point[] = [];
      for (let i = 0; i < smoothedPoints.length - 1; i++) {
          const p0 = smoothedPoints[i];
          const p1 = smoothedPoints[i + 1];

          // Calculate new points along the segment
          const q = lerp(p0, p1, smoothingFactor);       // New point closer to p0
          const r = lerp(p0, p1, 1 - smoothingFactor);   // New point closer to p1

          // Add the new points to the new list
          newPoints.push(q);
          newPoints.push(r);
      }

      smoothedPoints = newPoints;
  }

  return smoothedPoints;
}
