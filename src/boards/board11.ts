import { archimedeanSpiral, createWaypointPathCustom } from "@/path";
import { Board, Rectangle } from "@/types";
import { defaultColors } from "@/util";

export const board11 = (bounds: Rectangle): Board => {
  function* points() {
    const spiral = archimedeanSpiral({
      bounds,
      squash: {
        x: 1.5,
        y: 1,
      },
      stopAngle: 9,
    })();

    const { done, value } = spiral.next();

    if (done) return;

    yield {
      x: value.x,
      y: -30,
    };

    yield {
      x: value.x,
      y: bounds.size.height / 2 + bounds.position.y,
    };

    for (const { x, y } of spiral) {
      yield { x, y: bounds.size.height - y };
    }
  }

  return {
    name: "1-1 Spiral",
    launcherPosition: {
      x: bounds.size.width / 2 + 20,
      y: bounds.size.height / 2,
    },
    ballCount: 30,
    paths: [createWaypointPathCustom(points)],
    colors: defaultColors,
  };
};
