import { archimedeanSpiral2, createWaypointPathCustom } from "@/path";
import { Rectangle, Board, Point } from "@/types";
import { defaultColors } from "@/util";

export const board15 = (bounds: Rectangle): Board => {
  const common = {
    squash: {
      x: 2,
      y: 1,
    },
    stopAngle: Math.PI * 3.5,
    turnDistance: {
      x: 20,
      y: 20,
    },
  };
  function* points1() {
    const spiral = archimedeanSpiral2({
      ...common,
      bounds,
    })();

    const { done, value } = spiral.next();

    if (done) return;

    yield {
      x: 0,
      y: bounds.size.height - value.y,
    };

    yield {
      x: value.x,
      y: bounds.size.height - value.y,
    };

    for (const { x, y } of spiral) {
      yield { x: x, y: bounds.size.height - y };
    }
  }
  function* points2() {
    const spiral = archimedeanSpiral2({
      ...common,
      bounds,
    })();

    const { done, value } = spiral.next();

    if (done) return;

    yield {
      x: bounds.size.width,
      y: value.y,
    };

    yield {
      x: value.x,
      y: value.y,
    };

    for (const { x, y } of spiral) {
      yield { x: bounds.size.width - x, y };
    }
  }

  function* process(startOn: "left" | "right", gen: Generator<Point>) {
    const allPoints = Array.from(gen).reverse();
    const spiral = allPoints.slice(0, allPoints.length - 17);
    const padding = 50;

    spiral.unshift({
      x: startOn === "left" ? -padding : bounds.size.width + padding,
      y: spiral[0].y,
    });

    const points = spiral;
    for (const pt of points) {
      yield pt;
    }
  }

  return {
    name: "1-5 Vortex",
    launcherPosition: {
      x: bounds.size.width / 2 + 20,
      y: bounds.size.height / 2,
    },
    ballCount: 30,
    paths: [
      createWaypointPathCustom(() => process("right", points1())),
      createWaypointPathCustom(() => process("left", points2())),
    ],
    colors: defaultColors,
  };
};
