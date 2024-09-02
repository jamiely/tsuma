import { Node, Point, WaypointPath } from "./types";

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

export const sinPath = () => {
  const increment = Math.PI * 16;
  return function* () {
    for (let x = increment; x <= 800; x += increment) {
      yield {
        x,
        y: Math.sin(.01 * x) * 100 + 200,
      };
    }
  };
};
