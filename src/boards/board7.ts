import { Rectangle, Board } from "@/types";
import { chaikinSmoothing, colorsLevel2, colorsLevel3 } from "@/util";
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
            "y": 70
        },
        {
            "x": 991,
            "y": 70
        },
        {
            "x": 798,
            "y": 53
        },
        {
            "x": 553,
            "y": 51
        },
        {
            "x": 330,
            "y": 71
        },
        {
            "x": 162,
            "y": 130
        },
        {
            "x": 61,
            "y": 222
        },
        {
            "x": 45,
            "y": 314
        },
        {
            "x": 82,
            "y": 402
        },
        {
            "x": 177,
            "y": 442
        },
        {
            "x": 271,
            "y": 483
        },
        {
            "x": 419,
            "y": 520
        },
        {
            "x": 556,
            "y": 529
        },
        {
            "x": 668,
            "y": 538
        },
        {
            "x": 763,
            "y": 532
        },
        {
            "x": 850,
            "y": 501
        },
        {
            "x": 870,
            "y": 473
        },
        {
            "x": 819,
            "y": 458
        },
        {
            "x": 683,
            "y": 480
        },
        {
            "x": 503,
            "y": 469
        },
        {
            "x": 336,
            "y": 434
        },
        {
            "x": 226,
            "y": 386
        },
        {
            "x": 169,
            "y": 297
        },
        {
            "x": 186,
            "y": 232
        },
        {
            "x": 268,
            "y": 166
        },
        {
            "x": 412,
            "y": 128
        },
        {
            "x": 611,
            "y": 110
        },
        {
            "x": 745,
            "y": 102
        },
        {
            "x": 841,
            "y": 90
        },
        {
            "x": 919,
            "y": 106
        },
        {
            "x": 901,
            "y": 142
        },
        {
            "x": 782,
            "y": 158
        },
        {
            "x": 625,
            "y": 170
        },
        {
            "x": 475,
            "y": 182
        },
        {
            "x": 375,
            "y": 209
        },
        {
            "x": 295,
            "y": 250
        },
        {
            "x": 277,
            "y": 297
        },
        {
            "x": 317,
            "y": 341
        },
        {
            "x": 434,
            "y": 368
        },
        {
            "x": 553,
            "y": 379
        },
        {
            "x": 659,
            "y": 382
        },
        {
            "x": 764,
            "y": 389
        },
        {
            "x": 906,
            "y": 386
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