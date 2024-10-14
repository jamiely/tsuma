import { Rectangle, Board } from "@/types";
import { chaikinSmoothing, colorsLevel3 } from "@/util";
import { createWaypointPathCustom } from "@/path";
import { board61, board62, board63, board64, board65, board66 } from "./board6";

const wrap = (boardFun: (bounds: Rectangle) => Board) => {
  return (bounds: Rectangle) => {
    const board = boardFun(bounds);
    return {
      ...board,
      name: `9-${board.name.split("-")[1]}`,
      colors: colorsLevel3,
    }
  }
}

export const board91 = wrap(board61);
export const board92 = wrap(board62);
export const board93 = wrap(board63);
export const board94 = wrap(board64);
export const board95 = wrap(board65);
export const board96 = wrap(board66);

export const board97 = (bounds: Rectangle): Board => {
  function* points() {
    const all = [
        {
            "x": 390,
            "y": -20,
        },
        {
            "x": 390,
            "y": -3
        },
        {
            "x": 383,
            "y": 144
        },
        {
            "x": 383,
            "y": 249
        },
        {
            "x": 344,
            "y": 319
        },
        {
            "x": 266,
            "y": 319
        },
        {
            "x": 228,
            "y": 356
        },
        {
            "x": 235,
            "y": 411
        },
        {
            "x": 290,
            "y": 448
        },
        {
            "x": 472,
            "y": 449
        },
        {
            "x": 754,
            "y": 450
        },
        {
            "x": 814,
            "y": 441
        },
        {
            "x": 850,
            "y": 385
        },
        {
            "x": 839,
            "y": 159
        },
        {
            "x": 828,
            "y": 121
        },
        {
            "x": 768,
            "y": 100
        },
        {
            "x": 250,
            "y": 102
        },
        {
            "x": 178,
            "y": 121
        },
        {
            "x": 148,
            "y": 175
        },
        {
            "x": 155,
            "y": 441
        },
        {
            "x": 181,
            "y": 501
        },
        {
            "x": 246,
            "y": 522
        },
        {
            "x": 792,
            "y": 520
        },
        {
            "x": 871,
            "y": 505
        },
        {
            "x": 927,
            "y": 437
        },
        {
            "x": 919,
            "y": 352
        },
        {
            "x": 924,
            "y": 153
        },
        {
            "x": 901,
            "y": 87
        },
        {
            "x": 825,
            "y": 52
        },
        {
            "x": 163,
            "y": 48
        },
        {
            "x": 111,
            "y": 65
        },
        {
            "x": 70,
            "y": 118
        },
        {
            "x": 69,
            "y": 486
        },
        {
            "x": 69,
            "y": 486
        }
    ];
    

    for (const pt of chaikinSmoothing(all)) yield { x: pt.x, y: pt.y };
  }

  return {
    name: "9-7 Exodus",
    launcherPosition: {
      x: bounds.size.width * 12/20,
      y: bounds.size.height * 10/20,
    },
    ballCount: 100,
    paths: [
      createWaypointPathCustom(() => points()),
    ],
    colors: colorsLevel3,
  };
};