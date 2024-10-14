import { Rectangle, Board } from "@/types";
import { chaikinSmoothing, colorsLevel2 } from "@/util";
import { createWaypointPathCustom } from "@/path";
import { board31 } from "./board31";
import { board32 } from "./board32";
import { board33 } from "./board33";
import { board34 } from "./board34";
import { board35 } from "./board35";

const wrap = (boardFun: (bounds: Rectangle) => Board) => {
  return (bounds: Rectangle) => {
    const board = boardFun(bounds);
    return {
      ...board,
      name: `6-${board.name.split("-")[1]}`,
      colors: colorsLevel2,
    };
  };
};

export const board61 = wrap(board31);
export const board62 = wrap(board32);
export const board63 = wrap(board33);
export const board64 = wrap(board34);
export const board65 = wrap(board35);
export const board66 = (bounds: Rectangle): Board => {
  function* points() {
    const all = [
      {
          "x": -20,
          "y": 201
      },
      {
          "x": -20,
          "y": 201
      },
      {
          "x": 111,
          "y": 181
      },
      {
          "x": 236,
          "y": 154
      },
      {
          "x": 748,
          "y": 153
      },
      {
          "x": 818,
          "y": 177
      },
      {
          "x": 936,
          "y": 242
      },
      {
          "x": 949,
          "y": 290
      },
      {
          "x": 942,
          "y": 381
      },
      {
          "x": 916,
          "y": 420
      },
      {
          "x": 851,
          "y": 466
      },
      {
          "x": 767,
          "y": 490
      },
      {
          "x": 693,
          "y": 511
      },
      {
          "x": 559,
          "y": 522
      },
      {
          "x": 303,
          "y": 520
      },
      {
          "x": 227,
          "y": 495
      },
      {
          "x": 158,
          "y": 454
      },
      {
          "x": 124,
          "y": 429
      },
      {
          "x": 63,
          "y": 316
      },
      {
          "x": 56,
          "y": 291
      },
      {
          "x": 86,
          "y": 179
      },
      {
          "x": 119,
          "y": 129
      },
      {
          "x": 156,
          "y": 81
      },
      {
          "x": 199,
          "y": 64
      },
      {
          "x": 692,
          "y": 59
      },
      {
          "x": 825,
          "y": 63
      },
      {
          "x": 892,
          "y": 82
      },
      {
          "x": 925,
          "y": 126
      },
      {
          "x": 925,
          "y": 175
      },
      {
          "x": 870,
          "y": 251
      },
      {
          "x": 747,
          "y": 409
      },
      {
          "x": 696,
          "y": 441
      },
      {
          "x": 592,
          "y": 451
      },
      {
          "x": 318,
          "y": 453
      },
      {
          "x": 258,
          "y": 450
      },
      {
          "x": 205,
          "y": 403
      },
      {
          "x": 179,
          "y": 360
      },
      {
          "x": 147,
          "y": 308
      },
      {
          "x": 136,
          "y": 254
      },
      {
          "x": 139,
          "y": 217
      },
      {
          "x": 172,
          "y": 138
      },
      {
          "x": 221,
          "y": 110
      },
      {
          "x": 326,
          "y": 109
      },
      {
          "x": 776,
          "y": 106
      },
      {
          "x": 838,
          "y": 127
      },
      {
          "x": 849,
          "y": 156
      },
      {
          "x": 825,
          "y": 185
      },
      {
          "x": 772,
          "y": 228
      },
      {
          "x": 736,
          "y": 261
      },
      {
          "x": 688,
          "y": 301
      }
  ];

    for (const pt of chaikinSmoothing(all)) yield { x: pt.x, y: pt.y };
  }

  return {
    name: "6-6 Sun Stone",
    launcherPosition: {
      x: (bounds.size.width * 8) / 20,
      y: (bounds.size.height * 9) / 20,
    },
    ballCount: 150,
    paths: [createWaypointPathCustom(() => points())],
    colors: colorsLevel2,
  };
};
