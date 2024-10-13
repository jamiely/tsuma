import { Board, Rectangle } from "@/types";
import { chaikinSmoothing, defaultColors } from "@/util";
import { createWaypointPathCustom } from "@/path";

export const board22 = (bounds: Rectangle): Board => {
  function* points() {
    const all = [
      { x: 21, y: -1 },
      { x: 20, y: 0 },
      { x: 0, y: 10 },
      { x: 2, y: 15 },
      { x: 10, y: 19 },
      { x: 18, y: 15 },
      { x: 18, y: 10 },
      { x: 15, y: 5 },
      { x: 10, y: 1 },
      { x: 5, y: 3 },
      { x: 3, y: 10 },
      { x: 5, y: 12 },
      { x: 10, y: 15 },
      { x: 16, y: 12 },
      { x: 16, y: 12 },
    ];

    for (const pt of chaikinSmoothing(all)) yield { x: bounds.size.width * pt.x / 20, y: bounds.size.height * pt.y / 20 };
  }

  return {
    name: "2-2 Mud Slide",
    launcherPosition: {
      x: bounds.size.width * .5,
      y: bounds.size.height * 10/20,
    },
    ballCount: 70,
    paths: [createWaypointPathCustom(() => points())],
    colors: defaultColors,
  };
};