import { createWaypointPathFromArray } from "@/path";
import { Board, Rectangle } from "@/types";
import { chaikinSmoothing, defaultColors } from "@/util";

export const board13 = ({ size: { width, height } }: Rectangle): Board => {
  function points() {
    function pt(x: number, y: number) {
      return { x, y };
    }

    const keyPoints = [
      pt((width * 9) / 10, height),
      pt((width * 9) / 10, (height * 2) / 10),
      pt((width * 4) / 5, (height * 1) / 10),
      pt((width * 1) / 10, (height * 3) / 10),
      pt((width * 1) / 20, (height * 9) / 10),
      pt((width * 8) / 10, (height * 9) / 10),
      pt((width * 8) / 10, (height * 1) / 3),
      pt((width * 6) / 10, (height * 7) / 10),
      pt((width * 2) / 10, (height * 7) / 10),
      pt((width * 2) / 10, (height * 2.5) / 5),
      pt((width * 6) / 10, (height * 1.3) / 5),
      pt((width * 5.7) / 10, (height * 3) / 5),
    ];

    return [pt((width * 9) / 10, height + 30), ...chaikinSmoothing(keyPoints)];
  }

  return {
    name: "1-3 Riverbed",
    launcherPosition: { x: (width * 4.5) / 10, y: height / 2 },
    ballCount: 30,
    paths: [createWaypointPathFromArray(points())],
    colors: defaultColors,
  };
};
