import { Rectangle, Board } from "@/types";
import { chaikinSmoothing, colorsLevel3 } from "@/util";
import { createWaypointPathCustom } from "@/path";
import { board41, board42, board43, board44, board45, board46 } from "./board4";

const wrap = (boardFun: (bounds: Rectangle) => Board) => {
  return (bounds: Rectangle) => {
    const board = boardFun(bounds);
    return {
      ...board,
      name: `7-${board.name.split("-")[1]}`,
      colors: colorsLevel3,
    }
  }
}

export const board71 = wrap(board41);
export const board72 = wrap(board42);
export const board73 = wrap(board43);
export const board74 = wrap(board44);
export const board75 = wrap(board45);
export const board76 = wrap(board46);

export const board77 = (bounds: Rectangle): Board => {
  function* points() {
    const all = [
        {
            "x": 1020,
            "y": 67
        },
        {
            "x": 992,
            "y": 67
        },
        {
            "x": 763,
            "y": 56
        },
        {
            "x": 516,
            "y": 44
        },
        {
            "x": 279,
            "y": 89
        },
        {
            "x": 122,
            "y": 151
        },
        {
            "x": 51,
            "y": 237
        },
        {
            "x": 54,
            "y": 358
        },
        {
            "x": 161,
            "y": 435
        },
        {
            "x": 275,
            "y": 484
        },
        {
            "x": 367,
            "y": 512
        },
        {
            "x": 504,
            "y": 533
        },
        {
            "x": 626,
            "y": 544
        },
        {
            "x": 742,
            "y": 533
        },
        {
            "x": 831,
            "y": 520
        },
        {
            "x": 880,
            "y": 504
        },
        {
            "x": 868,
            "y": 461
        },
        {
            "x": 771,
            "y": 460
        },
        {
            "x": 722,
            "y": 470
        },
        {
            "x": 564,
            "y": 460
        },
        {
            "x": 422,
            "y": 448
        },
        {
            "x": 335,
            "y": 434
        },
        {
            "x": 283,
            "y": 416
        },
        {
            "x": 204,
            "y": 370
        },
        {
            "x": 176,
            "y": 302
        },
        {
            "x": 197,
            "y": 215
        },
        {
            "x": 257,
            "y": 175
        },
        {
            "x": 361,
            "y": 148
        },
        {
            "x": 489,
            "y": 127
        },
        {
            "x": 635,
            "y": 102
        },
        {
            "x": 754,
            "y": 95
        },
        {
            "x": 837,
            "y": 95
        },
        {
            "x": 915,
            "y": 106
        },
        {
            "x": 932,
            "y": 150
        },
        {
            "x": 881,
            "y": 180
        },
        {
            "x": 814,
            "y": 175
        },
        {
            "x": 676,
            "y": 170
        },
        {
            "x": 491,
            "y": 187
        },
        {
            "x": 365,
            "y": 217
        },
        {
            "x": 301,
            "y": 249
        },
        {
            "x": 298,
            "y": 326
        },
        {
            "x": 405,
            "y": 368
        },
        {
            "x": 509,
            "y": 381
        },
        {
            "x": 651,
            "y": 385
        },
        {
            "x": 755,
            "y": 392
        },
        {
            "x": 897,
            "y": 388
        }
    ];
    

    for (const pt of chaikinSmoothing(all)) yield { x: pt.x, y: pt.y };
  }

  return {
    name: "7-7 Long Range",
    launcherPosition: {
      x: bounds.size.width * 10/20,
      y: bounds.size.height * 11/20,
    },
    ballCount: 100,
    paths: [
      createWaypointPathCustom(() => points()),
    ],
    colors: colorsLevel3,
  };
};