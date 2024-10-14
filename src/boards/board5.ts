import { Rectangle, Board } from "@/types";
import { chaikinSmoothing, colorsLevel2 } from "@/util";
import { board21 } from "./board21";
import { board22 } from "./board22";
import { board23 } from "./board23";
import { board24 } from "./board24";
import { board25 } from "./board25";
import { createWaypointPathCustom } from "@/path";

const wrap = (boardFun: (bounds: Rectangle) => Board) => {
  return (bounds: Rectangle) => {
    const board = boardFun(bounds);
    return {
      ...board,
      name: `5-${board.name.split("-")[1]}`,
      colors: colorsLevel2,
    };
  };
};

export const board51 = wrap(board21);
export const board52 = wrap(board22);
export const board53 = wrap(board23);
export const board54 = wrap(board24);
export const board55 = wrap(board25);
export const board56 = (bounds: Rectangle): Board => {
  function* points() {
    const all = [
      {
        x: 1020,
        y: 69,
      },
      {
        x: 1001,
        y: 69,
      },
      {
        x: 917,
        y: 74,
      },
      {
        x: 826,
        y: 104,
      },
      {
        x: 741,
        y: 157,
      },
      {
        x: 611,
        y: 161,
      },
      {
        x: 485,
        y: 127,
      },
      {
        x: 353,
        y: 125,
      },
      {
        x: 241,
        y: 157,
      },
      {
        x: 146,
        y: 219,
      },
      {
        x: 65,
        y: 288,
      },
      {
        x: 68,
        y: 367,
      },
      {
        x: 136,
        y: 439,
      },
      {
        x: 298,
        y: 502,
      },
      {
        x: 538,
        y: 534,
      },
      {
        x: 794,
        y: 504,
      },
      {
        x: 912,
        y: 445,
      },
      {
        x: 953,
        y: 372,
      },
      {
        x: 928,
        y: 252,
      },
      {
        x: 883,
        y: 183,
      },
      {
        x: 768,
        y: 91,
      },
      {
        x: 640,
        y: 70,
      },
      {
        x: 461,
        y: 44,
      },
      {
        x: 262,
        y: 74,
      },
      {
        x: 156,
        y: 113,
      },
      {
        x: 71,
        y: 186,
      },
      {
        x: 85,
        y: 275,
      },
      {
        x: 186,
        y: 371,
      },
      {
        x: 348,
        y: 441,
      },
      {
        x: 506,
        y: 469,
      },
      {
        x: 603,
        y: 474,
      },
      {
        x: 694,
        y: 465,
      },
      {
        x: 748,
        y: 439,
      },
      {
        x: 777,
        y: 407,
      },
      {
        x: 717,
        y: 362,
      },
      {
        x: 624,
        y: 338,
      },
      {
        x: 582,
        y: 301,
      },
      {
        x: 605,
        y: 238,
      },
      {
        x: 700,
        y: 234,
      },
      {
        x: 769,
        y: 256,
      },
      {
        x: 822,
        y: 297,
      },
    ];

    for (const pt of chaikinSmoothing(all)) yield { x: pt.x, y: pt.y };
  }

  return {
    name: "5-6 Sand Garden",
    launcherPosition: {
      x: (bounds.size.width * 8) / 20,
      y: (bounds.size.height * 9) / 20,
    },
    ballCount: 150,
    paths: [createWaypointPathCustom(() => points())],
    colors: colorsLevel2,
  };
};
