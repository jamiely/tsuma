import { Game } from "./game";

export const createInterface = (game: Game) => (element: HTMLElement) => {
  element.addEventListener("mousemove", (event) => {
    game.launcher.pointTo = {x: event.offsetX, y: event.offsetY};
  });
};
