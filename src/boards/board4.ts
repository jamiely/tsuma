import { Rectangle, Board } from "@/types";
import { colorsLevel2 } from "@/util";
import { board11 } from "./board11";
import { board12 } from "./board12";
import { board13 } from "./board13";
import { board14 } from "./board14";
import { board15 } from "./board15";

const wrap = (boardFun: (bounds: Rectangle) => Board) => {
  return (bounds: Rectangle) => {
    const board = boardFun(bounds);
    return {
      ...board,
      name: `4-${board.name.split("-")[1]}`,
      colors: colorsLevel2,
    }
  }
}

export const board41 = wrap(board11);
export const board42 = wrap(board12);
export const board43 = wrap(board13);
export const board44 = wrap(board14);
export const board45 = wrap(board15);
