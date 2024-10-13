import { Board, Rectangle } from "@/types";
import { chaikinSmoothing, defaultColors } from "@/util";
import { createWaypointPathCustom } from "@/path";

export const board24 = (bounds: Rectangle): Board => {
  function* points() {
    const proportions = [
      [21, 19],
      [21, 19],
      [10, 19],
      [4, 18],
      [1, 12],
      [1, 10],
      [2, 3],
      [4, 1],
      [5, 4],
      [6, 12],
      [8, 15],
      [12, 15],
      [15, 4],
      [16, 1],
      [17, 3],
      [19, 10],
      [17, 15],
      [12, 17],
      [10, 15],
      [8, 12],
      [7, 3],
      [7, 1],      
    ];
    const all = proportions.map(([x, y]) => ({x, y}));

    for (const pt of chaikinSmoothing(all)) yield { x: bounds.size.width * pt.x / 20, y: bounds.size.height * pt.y / 20 };
  }

  return {
    name: "2-4 Mouth",
    launcherPosition: {
      x: bounds.size.width * 10/20,
      y: bounds.size.height * 3/20,
    },
    ballCount: 70,
    paths: [createWaypointPathCustom(() => points())],
    colors: defaultColors,
  };
};