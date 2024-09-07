import { Game, Node, Point, WaypointPath } from "./types";
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

export const sinPath = (game: Game, startX: number) => {
  const increment = Math.PI;
  return function* () {
    for (let x = startX; x <= game.bounds.size.width - 50; x += increment) {
      yield {
        x,
        y: Math.sin(0.02 * x) * 100 + 150,
      };
    }
  };
};

export const archimedeanSpiral = ({game}: {game: Game}) => {
  const startingRadius = Math.PI / 2,
    turnDistance = 10,
    squash = {
      x: 2,
      y: 1,
    },
    startAngle = Math.PI * 8,
    stopAngle = 5,
    incrementAngle = Math.PI / 8,
    origin = {
      x: game.bounds.size.width / 2,
      y: game.bounds.size.height / 2,
    }

  return function*() {
    for(let a = startAngle; a >= stopAngle; a-= incrementAngle) {
      const coefficient = (startingRadius + turnDistance * a );
      yield {
        x: squash.x * coefficient * Math.cos(a) + origin.x,
        y: squash.y * coefficient * Math.sin(a) + origin.y,
      }
    }
  }
}
