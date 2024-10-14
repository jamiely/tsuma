import { createWaypointPathFromArray } from "@/path";
import { Board, Rectangle } from "@/types";
import { chaikinSmoothing, defaultColors } from "@/util";

export const board12 = ({ size: { width, height } }: Rectangle): Board => {
  function points() {
    function pt(x: number, y: number) {
      return { x, y };
    }

    const keyPoints = [
      pt(-30, (height * 4) / 20),
      pt(-30, (height * 4) / 20),
      pt(width / 2, (height * 1) / 20),
      pt((width * 16) / 20, (height * 4) / 20),
      pt((width * 19) / 20, height / 2),
      pt((width * 16) / 20, (height * 12) / 20),
      pt((width * 13) / 20, (height * 6) / 20),
      pt((width * 3) / 20, (height * 6) / 20),
      pt((width * 1) / 20, (height * 12) / 20),
      pt((width * 3) / 20, (height * 18) / 20),
      pt((width * 10) / 20, (height * 18) / 20),
      pt((width * 18) / 20, (height * 16) / 20),
      pt((width * 18) / 20, (height * 13) / 20),
      pt((width * 15) / 20, (height * 14) / 20),
      pt((width * 13) / 20, (height * 12) / 20),
      pt((width * 10) / 20, (height * 14) / 20),
      pt((width * 6) / 20, (height * 14) / 20),
      pt((width * 4) / 20, (height * 10) / 20),
    ];

    return chaikinSmoothing(keyPoints);
  }

  return {
    name: "1-2 Talon",
    launcherPosition: { x: (width * 4.5) / 10, y: height / 2 },
    ballCount: 30,
    paths: [createWaypointPathFromArray(points())],
    colors: defaultColors,
  };
};
