import { Board, Rectangle } from "@/types";
import { chaikinSmoothing, defaultColors } from "@/util";
import { createWaypointPathCustom } from "@/path";

export const board33 = (bounds: Rectangle): Board => {
  function* points() {
    const all = [
        {
            "x": 1100,
            "y": 52
        },
        {
            "x": 992,
            "y": 52
        },
        {
            "x": 134,
            "y": 47
        },
        {
            "x": 76,
            "y": 67
        },
        {
            "x": 76,
            "y": 97
        },
        {
            "x": 121,
            "y": 121
        },
        {
            "x": 848,
            "y": 113
        },
        {
            "x": 890,
            "y": 121
        },
        {
            "x": 898,
            "y": 165
        },
        {
            "x": 895,
            "y": 458
        },
        {
            "x": 887,
            "y": 491
        },
        {
            "x": 830,
            "y": 505
        },
        {
            "x": 119,
            "y": 502
        },
        {
            "x": 88,
            "y": 498
        },
        {
            "x": 76,
            "y": 462
        },
        {
            "x": 75,
            "y": 209
        },
        {
            "x": 82,
            "y": 177
        },
        {
            "x": 129,
            "y": 169
        },
        {
            "x": 767,
            "y": 173
        },
        {
            "x": 796,
            "y": 181
        },
        {
            "x": 800,
            "y": 217
        },
        {
            "x": 800,
            "y": 418
        },
        {
            "x": 797,
            "y": 442
        },
        {
            "x": 761,
            "y": 450
        },
        {
            "x": 210,
            "y": 448
        },
        {
            "x": 179,
            "y": 440
        },
        {
            "x": 174,
            "y": 407
        },
        {
            "x": 175,
            "y": 246
        }
    ];
    

    for (const pt of chaikinSmoothing(all)) yield { x: pt.x - 20, y: pt.y + 50 };
  }

  return {
    name: "3-3 Codex",
    launcherPosition: {
      x: bounds.size.width * 10/20,
      y: bounds.size.height * 12/20,
    },
    ballCount: 100,
    paths: [
      createWaypointPathCustom(() => points()),
    ],
    colors: defaultColors,
  };
};