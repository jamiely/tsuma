import { Board, Rectangle } from "@/types";
import { chaikinSmoothing, colorsLevel2 } from "@/util";
import { createWaypointPathCustom } from "@/path";

export const board46 = (bounds: Rectangle): Board => {
  function* points() {
    const all = [
        {
            "x": 104,
            "y": 620
        },
        {
            "x": 104,
            "y": 600
        },
        {
            "x": 70,
            "y": 323
        },
        {
            "x": 102,
            "y": 190
        },
        {
            "x": 261,
            "y": 85
        },
        {
            "x": 457,
            "y": 67
        },
        {
            "x": 798,
            "y": 108
        },
        {
            "x": 899,
            "y": 154
        },
        {
            "x": 897,
            "y": 211
        },
        {
            "x": 860,
            "y": 268
        },
        {
            "x": 878,
            "y": 329
        },
        {
            "x": 904,
            "y": 388
        },
        {
            "x": 868,
            "y": 458
        },
        {
            "x": 787,
            "y": 495
        },
        {
            "x": 653,
            "y": 524
        },
        {
            "x": 526,
            "y": 529
        },
        {
            "x": 268,
            "y": 525
        },
        {
            "x": 208,
            "y": 505
        },
        {
            "x": 201,
            "y": 467
        },
        {
            "x": 293,
            "y": 441
        },
        {
            "x": 566,
            "y": 446
        },
        {
            "x": 720,
            "y": 440
        },
        {
            "x": 782,
            "y": 413
        },
        {
            "x": 781,
            "y": 361
        },
        {
            "x": 741,
            "y": 291
        },
        {
            "x": 785,
            "y": 194
        },
        {
            "x": 727,
            "y": 162
        },
        {
            "x": 600,
            "y": 124
        },
        {
            "x": 470,
            "y": 127
        },
        {
            "x": 275,
            "y": 148
        },
        {
            "x": 177,
            "y": 197
        },
        {
            "x": 153,
            "y": 244
        },
        {
            "x": 158,
            "y": 314
        },
        {
            "x": 158,
            "y": 314
        }
    ];
    

    for (const pt of chaikinSmoothing(all)) yield { x: pt.x, y: pt.y };
  }

  return {
    name: "4-6 Switchback",
    launcherPosition: {
      x: bounds.size.width * 10/20,
      y: bounds.size.height * 11/20,
    },
    ballCount: 100,
    paths: [
      createWaypointPathCustom(() => points()),
    ],
    colors: colorsLevel2,
  };
};