import { Board, Rectangle } from "@/types";
import { chaikinSmoothing, defaultColors } from "@/util";
import { createWaypointPathCustom } from "@/path";

export const board31 = (bounds: Rectangle): Board => {
  function* points() {
    const all = [
        {
            "x": 170,
            "y": -100,
        },
        {
            "x": 163,
            "y": 2
        },
        {
            "x": 161,
            "y": 35
        },
        {
            "x": 101,
            "y": 418
        },
        {
            "x": 155,
            "y": 496
        },
        {
            "x": 234,
            "y": 496
        },
        {
            "x": 891,
            "y": 491
        },
        {
            "x": 980,
            "y": 471
        },
        {
            "x": 978,
            "y": 375
        },
        {
            "x": 748,
            "y": 63
        },
        {
            "x": 658,
            "y": 11
        },
        {
            "x": 496,
            "y": 83
        },
        {
            "x": 206,
            "y": 323
        },
        {
            "x": 171,
            "y": 395
        },
        {
            "x": 282,
            "y": 428
        },
        {
            "x": 796,
            "y": 423
        },
        {
            "x": 880,
            "y": 410
        },
        {
            "x": 864,
            "y": 345
        },
        {
            "x": 706,
            "y": 124
        },
        {
            "x": 652,
            "y": 88
        },
        {
            "x": 576,
            "y": 121
        },
        {
            "x": 371,
            "y": 293
        },
        {
            "x": 336,
            "y": 335
        }
    ];
    

    for (const pt of chaikinSmoothing(all)) yield { x: pt.x - 20, y: pt.y + 50 };
  }

  return {
    name: "3-1 Landing Pad",
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