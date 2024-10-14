import { Board, Rectangle } from "@/types";
import { chaikinSmoothing, defaultColors } from "@/util";
import { createWaypointPathCustom } from "@/path";

export const board34 = (bounds: Rectangle): Board => {
  function* points() {
    const all = [
        {
            "x": 772,
            "y": -100,
        },
        {
            "x": 772,
            "y": 1
        },
        {
            "x": 770,
            "y": 447
        },
        {
            "x": 762,
            "y": 490
        },
        {
            "x": 716,
            "y": 508
        },
        {
            "x": 262,
            "y": 505
        },
        {
            "x": 221,
            "y": 491
        },
        {
            "x": 198,
            "y": 448
        },
        {
            "x": 199,
            "y": 172
        },
        {
            "x": 209,
            "y": 140
        },
        {
            "x": 263,
            "y": 135
        },
        {
            "x": 837,
            "y": 141
        },
        {
            "x": 892,
            "y": 156
        },
        {
            "x": 910,
            "y": 217
        },
        {
            "x": 901,
            "y": 375
        },
        {
            "x": 894,
            "y": 413
        },
        {
            "x": 821,
            "y": 424
        },
        {
            "x": 145,
            "y": 415
        },
        {
            "x": 92,
            "y": 405
        },
        {
            "x": 77,
            "y": 325
        },
        {
            "x": 72,
            "y": 77
        },
        {
            "x": 87,
            "y": 38
        },
        {
            "x": 150,
            "y": 29
        },
        {
            "x": 547,
            "y": 26
        },
        {
            "x": 605,
            "y": 45
        },
        {
            "x": 613,
            "y": 102
        },
        {
            "x": 611,
            "y": 311
        },
        {
            "x": 590,
            "y": 350
        },
        {
            "x": 542,
            "y": 354
        },
        {
            "x": 514,
            "y": 330
        },
        {
            "x": 514,
            "y": 266
        },
        {
            "x": 514,
            "y": 266
        }
    ];
    

    for (const pt of chaikinSmoothing(all)) yield { x: pt.x - 20, y: pt.y + 50 };
  }

  return {
    name: "3-4 Shrine",
    launcherPosition: {
      x: bounds.size.width * 7/20,
      y: bounds.size.height * 11/20,
    },
    ballCount: 100,
    paths: [
      createWaypointPathCustom(() => points()),
    ],
    colors: defaultColors,
  };
};