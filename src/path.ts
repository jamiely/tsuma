import { Node, Point, Rectangle, WaypointPath } from "./types";
import { distance } from "./util";

export const createWaypointPath = (
  startPt: Point,
  endPt: Point
): WaypointPath => {
  const start: Node<Point> = { value: startPt };
  const end: Node<Point> = { value: endPt, previous: start };

  start.next = end;

  return {
    start,
    end,
  };
};

export const createWaypointPathFromArray = (points: Point[]): WaypointPath => {
  function* gen() {
    for (const pt of points) {
      yield pt;
    }
  }

  return createWaypointPathCustom(gen);
};

export const createWaypointPathCustom = (
  get: () => Generator<Point>
): WaypointPath => {
  const generator = get();
  const start: Node<Point> = { value: generator.next().value };
  let last: Node<Point> = start;
  do {
    let { done, value: currentPoint } = generator.next();
    if (done) break;

    const current = {
      value: currentPoint,
      previous: last,
    };

    last.next = current;
    last = current;
  } while (true);

  return {
    start,
    end: last,
  };
};

export const simplify = (minDistance: number, get: () => Generator<Point>) => {
  return function* () {
    const generator = get();
    let last: Point | undefined;
    do {
      const { done, value } = generator.next();
      if (done) break;
      if (!last) {
        yield value;
        last = value;
        continue;
      }

      const dist = distance(last, value);
      if (dist < minDistance) {
        continue;
      }
      yield value;
      last = value;
    } while (true);
  };
};

export const sinWave = ({
  bounds,
  origin,
  frequency,
  amplitude,
}: {
  amplitude: number;
  frequency: number;
  bounds: Rectangle;
  origin: Point;
}) => {
  const increment = Math.PI;
  return function* () {
    for (let x = origin.x; x <= bounds.size.width - 50; x += increment) {
      yield {
        x,
        y: Math.sin(frequency * x) * amplitude + origin.y,
      };
    }
  };
};

export const archimedeanSpiral = ({
  bounds,
  startingRadius = Math.PI / 2,
  turnDistance = { x: 10, y: 10 },
  squash = {
    x: 2,
    y: 1,
  },
  startAngle = Math.PI * 8,
  stopAngle = 5,
  incrementAngle = Math.PI / 16,
  origin = {
    x: bounds.size.width / 2,
    y: bounds.size.height / 2,
  },
  predicate,
  angleCoefficient = 1,
}: {
  bounds: Rectangle;
  startingRadius?: number;
  turnDistance?: Point;
  squash?: Point;
  startAngle?: number;
  stopAngle?: number;
  incrementAngle?: number;
  origin?: Point;
  predicate?: (angle: number) => boolean;
  angleCoefficient?: number;
  rawCoefficient?: number;
}) => {
  const resolvedPredicate = predicate || ((angle) => angle >= stopAngle);

  return function* () {
    for (let a = startAngle; resolvedPredicate(a); a -= incrementAngle) {
      yield {
        x:
          squash.x *
            (startingRadius + turnDistance.x * a) *
            Math.cos(angleCoefficient * a) +
          origin.x,
        y:
          squash.y *
            (startingRadius + turnDistance.y * a) *
            Math.sin(angleCoefficient * a) +
          origin.y,
      };
    }
  };
};

export const linePath = ({
  bounds,
  slope,
  yIntercept,
  startX = -10,
  stopX,
  xIncrement = 10,
}: {
  bounds: Rectangle;
  slope: number;
  yIntercept: number;
  startX?: number;
  stopX?: number;
  xIncrement?: number;
}) => {
  stopX ||= bounds.size.width - 50;

  return function* () {
    for (let x = startX; x < stopX; x += xIncrement) {
      yield {
        x,
        y: slope * x + yIntercept,
      };
    }
  };
};

export const archimedeanSpiral2 = ({
  bounds,
  startingRadius = Math.PI / 2,
  turnDistance = { x: 10, y: 10 },
  squash = {
    x: 2,
    y: 1,
  },
  startAngle = 0,
  stopAngle = Math.PI * 2,
  incrementAngle = Math.PI / 16,
  origin = {
    x: bounds.size.width / 2,
    y: bounds.size.height / 2,
  },
  angleCoefficient = 1,
}: {
  bounds: Rectangle;
  startingRadius?: number;
  turnDistance?: Point;
  squash?: Point;
  startAngle?: number;
  stopAngle?: number;
  incrementAngle?: number;
  origin?: Point;
  angleCoefficient?: number;
  rawCoefficient?: number;
}) => {
  return function* () {
    for (let a = startAngle; a <= stopAngle; a += incrementAngle) {
      yield {
        x:
          squash.x *
            (startingRadius + turnDistance.x * a) *
            Math.cos(angleCoefficient * a) +
          origin.x,
        y:
          squash.y *
            (startingRadius + turnDistance.y * a) *
            Math.sin(angleCoefficient * a) +
          origin.y,
      };
    }
  };
};
