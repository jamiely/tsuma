import { Rectangle, Board } from "@/types";
import { chaikinSmoothing, colorsLevel3 } from "@/util";
import { createWaypointPathCustom } from "@/path";
import { board51, board52, board53, board54, board55, board56 } from "./board5";

const wrap = (boardFun: (bounds: Rectangle) => Board) => {
  return (bounds: Rectangle) => {
    const board = boardFun(bounds);
    return {
      ...board,
      name: `8-${board.name.split("-")[1]}`,
      colors: colorsLevel3,
    }
  }
}

export const board81 = wrap(board51);
export const board82 = wrap(board52);
export const board83 = wrap(board53);
export const board84 = wrap(board54);
export const board85 = wrap(board55);
export const board86 = wrap(board56);

export const board87 = (bounds: Rectangle): Board => {
  function* points() {
    const all = [
        {
            "x": 56,
            "y": 620,
        },
        {
            "x": 56,
            "y": 595
        },
        {
            "x": 61,
            "y": 437
        },
        {
            "x": 72,
            "y": 265
        },
        {
            "x": 142,
            "y": 168
        },
        {
            "x": 239,
            "y": 121
        },
        {
            "x": 361,
            "y": 113
        },
        {
            "x": 511,
            "y": 110
        },
        {
            "x": 685,
            "y": 130
        },
        {
            "x": 843,
            "y": 136
        },
        {
            "x": 932,
            "y": 121
        },
        {
            "x": 959,
            "y": 93
        },
        {
            "x": 932,
            "y": 57
        },
        {
            "x": 698,
            "y": 44
        },
        {
            "x": 363,
            "y": 47
        },
        {
            "x": 263,
            "y": 53
        },
        {
            "x": 134,
            "y": 78
        },
        {
            "x": 87,
            "y": 129
        },
        {
            "x": 83,
            "y": 155
        },
        {
            "x": 132,
            "y": 198
        },
        {
            "x": 235,
            "y": 222
        },
        {
            "x": 422,
            "y": 218
        },
        {
            "x": 624,
            "y": 198
        },
        {
            "x": 761,
            "y": 199
        },
        {
            "x": 850,
            "y": 237
        },
        {
            "x": 930,
            "y": 311
        },
        {
            "x": 928,
            "y": 407
        },
        {
            "x": 898,
            "y": 472
        },
        {
            "x": 838,
            "y": 490
        },
        {
            "x": 798,
            "y": 460
        },
        {
            "x": 745,
            "y": 381
        },
        {
            "x": 643,
            "y": 310
        },
        {
            "x": 556,
            "y": 285
        },
        {
            "x": 453,
            "y": 272
        },
        {
            "x": 365,
            "y": 281
        },
        {
            "x": 261,
            "y": 307
        },
        {
            "x": 208,
            "y": 346
        },
        {
            "x": 185,
            "y": 405
        },
        {
            "x": 179,
            "y": 467
        }
    ];
    

    for (const pt of chaikinSmoothing(all)) yield { x: pt.x, y: pt.y };
  }

  return {
    name: "8-7 Lair",
    launcherPosition: {
      x: bounds.size.width * 9/20,
      y: bounds.size.height * 14/20,
    },
    ballCount: 100,
    paths: [
      createWaypointPathCustom(() => points()),
    ],
    colors: colorsLevel3,
  };
};