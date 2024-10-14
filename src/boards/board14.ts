import { archimedeanSpiral, createWaypointPathCustom } from "@/path";
import { Rectangle, Board } from "@/types";
import { chaikinSmoothing, defaultColors } from "@/util";

export const board14 = (bounds: Rectangle): Board => {
  function* points() {
    const spiral = archimedeanSpiral({
      bounds,
      squash: {
        x: 1.5,
        y: 1,
      },
      startAngle: Math.PI * 6,
      stopAngle: 8,
    })();

    const { done, value } = spiral.next();

    if (done) return;

    yield {
      x: bounds.size.width + 20,
      y: (bounds.size.height * 9) / 10,
    };

    const keyPoints = [
      {
        x: bounds.size.width + 20,
        y: (bounds.size.height * 9) / 10,
      },
      {
        x: (bounds.size.width * 2) / 10,
        y: (bounds.size.height * 9) / 10,
      },
      {
        x: (bounds.size.width * 1) / 10,
        y: (bounds.size.height * 5) / 10,
      },
      {
        x: (bounds.size.width * 1) / 10,
        y: (bounds.size.height * 1) / 10,
      },
      {
        x: bounds.size.width - value.x,
        y: (bounds.size.height * 1) / 10,
      },
      {
        x: bounds.size.width - value.x,
        y: (bounds.size.height * 2) / 10,
      },
    ];

    for (const pt of chaikinSmoothing(keyPoints)) {
      yield pt;
    }

    for (const { x, y } of spiral) {
      yield { x: bounds.size.width - x, y: bounds.size.height - y };
    }
  }

  return {
    name: "1-4 Breath",
    launcherPosition: {
      x: (bounds.size.width * 9) / 20,
      y: bounds.size.height / 2,
    },
    ballCount: 30,
    paths: [createWaypointPathCustom(points)],
    colors: defaultColors,
  };
};
