import { launchBall } from "./game";
import { Game } from "./types";

export const createInterface = (game: Game) => (element: HTMLElement) => {
  element.addEventListener("mousemove", (event) => {
    game.launcher.pointTo = {x: event.offsetX, y: event.offsetY};
  });
  element.addEventListener("mousedown", () => {
    launchBall(game);
  })
};
