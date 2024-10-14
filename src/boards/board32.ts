import { Board, Rectangle } from "@/types";
import { chaikinSmoothing, defaultColors } from "@/util";
import { createWaypointPathCustom } from "@/path";

export const board32 = (bounds: Rectangle): Board => {
  function* points() {
    const all = [
        {
            "x": 3,
            "y": 45
        },
        {
            "x": 46,
            "y": 44
        },
        {
            "x": 124,
            "y": 78
        },
        {
            "x": 173,
            "y": 183
        },
        {
            "x": 168,
            "y": 324
        },
        {
            "x": 202,
            "y": 394
        },
        {
            "x": 291,
            "y": 436
        },
        {
            "x": 701,
            "y": 453
        },
        {
            "x": 796,
            "y": 420
        },
        {
            "x": 861,
            "y": 346
        },
        {
            "x": 864,
            "y": 169
        },
        {
            "x": 824,
            "y": 107
        },
        {
            "x": 715,
            "y": 49
        },
        {
            "x": 508,
            "y": 24
        },
        {
            "x": 333,
            "y": 38
        },
        {
            "x": 207,
            "y": 84
        },
        {
            "x": 115,
            "y": 148
        },
        {
            "x": 64,
            "y": 271
        },
        {
            "x": 67,
            "y": 368
        },
        {
            "x": 126,
            "y": 444
        },
        {
            "x": 307,
            "y": 509
        },
        {
            "x": 535,
            "y": 521
        },
        {
            "x": 804,
            "y": 496
        },
        {
            "x": 896,
            "y": 445
        },
        {
            "x": 947,
            "y": 351
        },
        {
            "x": 943,
            "y": 228
        },
        {
            "x": 924,
            "y": 134
        },
        {
            "x": 891,
            "y": 82
        },
        {
            "x": 825,
            "y": 59
        },
        {
            "x": 757,
            "y": 85
        },
        {
            "x": 725,
            "y": 141
        },
        {
            "x": 744,
            "y": 192
        },
        {
            "x": 769,
            "y": 265
        },
        {
            "x": 741,
            "y": 330
        },
        {
            "x": 631,
            "y": 378
        },
        {
            "x": 491,
            "y": 389
        },
        {
            "x": 375,
            "y": 373
        },
        {
            "x": 292,
            "y": 338
        },
        {
            "x": 257,
            "y": 276
        },
        {
            "x": 259,
            "y": 188
        },
        {
            "x": 325,
            "y": 122
        },
        {
            "x": 400,
            "y": 103
        },
        {
            "x": 514,
            "y": 95
        }
    ];
    

    for (const pt of chaikinSmoothing(all)) yield { x: pt.x - 20, y: pt.y + 50 };
  }

  return {
    name: "3-2 Altar",
    launcherPosition: {
      x: bounds.size.width * 12/20,
      y: bounds.size.height * 12/20,
    },
    ballCount: 100,
    paths: [
      createWaypointPathCustom(() => points()),
    ],
    colors: defaultColors,
  };
};