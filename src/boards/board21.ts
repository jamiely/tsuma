import { createWaypointPathCustom } from "@/path";
import { Rectangle, Board } from "@/types";
import { chaikinSmoothing, defaultColors } from "@/util";

export const board21 = (bounds: Rectangle): Board => {
  function* points() {
    const all = [
      { x: bounds.size.width / 2, y: -10 },
      { x: bounds.size.width / 2, y: 0 },
      { x: (bounds.size.width * 17) / 20, y: (bounds.size.height * 5) / 20 },
      { x: (bounds.size.width * 19) / 20, y: bounds.size.height / 2 },

      { x: (bounds.size.width * 17) / 20, y: (bounds.size.height * 17) / 20 },
      { x: (bounds.size.width * 10) / 20, y: (bounds.size.height * 19) / 20 },

      { x: (bounds.size.width * 3) / 20, y: (bounds.size.height * 16) / 20 },
      { x: (bounds.size.width * 1) / 20, y: (bounds.size.height * 12) / 20 },

      { x: (bounds.size.width * 3) / 20, y: (bounds.size.height * 5) / 20 },
      { x: (bounds.size.width * 5) / 20, y: (bounds.size.height * 3) / 20 },

      { x: (bounds.size.width * 16) / 20, y: (bounds.size.height * 8) / 20 },
      { x: (bounds.size.width * 17) / 20, y: (bounds.size.height * 10) / 20 },
      { x: (bounds.size.width * 15) / 20, y: (bounds.size.height * 15) / 20 },
      { x: (bounds.size.width * 10) / 20, y: (bounds.size.height * 16) / 20 },
      { x: (bounds.size.width * 5) / 20, y: (bounds.size.height * 14) / 20 },
      { x: (bounds.size.width * 3) / 20, y: (bounds.size.height * 11) / 20 },
      { x: (bounds.size.width * 5) / 20, y: (bounds.size.height * 6) / 20 },

      { x: bounds.size.width * 0.66, y: bounds.size.height / 2 },
      { x: bounds.size.width * 0.66, y: bounds.size.height / 2 },
    ];

    for (const pt of chaikinSmoothing(all)) yield pt;
  }

  return {
    name: "2-1 Spirals Attack",
    launcherPosition: {
      x: bounds.size.width * .4,
      y: bounds.size.height * 11/20,
    },
    ballCount: 30,
    paths: [createWaypointPathCustom(() => points())],
    colors: defaultColors,
  };
};
