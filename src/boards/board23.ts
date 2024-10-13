import { Board, Rectangle } from "@/types";
import { chaikinSmoothing, defaultColors } from "@/util";
import { createWaypointPathCustom } from "@/path";

export const board23 = (bounds: Rectangle): Board => {
  function* points() {
    const proportions = [
      [17, -1],
      [17, 0],
      [19, 16],
      [18, 19],
      [17, 16],
      [16, 7],
      [9, 1],
      [3, 7],
      [1, 16],
      [2, 19],
      [3, 18],
      [4, 11],
      [9, 5],
      [15, 11],
      [15, 15],
      [9, 19],
      [5, 15],
      [5, 13],
      [8, 9],
      [9, 9],
      [9, 9],
    ];
    const all = proportions.map(([x, y]) => ({x, y}));

    for (const pt of chaikinSmoothing(all)) yield { x: bounds.size.width * pt.x / 20, y: bounds.size.height * pt.y / 20 };
  }

  return {
    name: "2-3 Rorschach",
    launcherPosition: {
      x: bounds.size.width * .45,
      y: bounds.size.height * 14/20,
    },
    ballCount: 70,
    paths: [createWaypointPathCustom(() => points())],
    colors: defaultColors,
  };
};