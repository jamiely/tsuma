import { launchBall } from "./game";
import { Game } from "./types";

export const createInterface = (gameRef: {game: Game}) => (element: HTMLElement) => {
  element.addEventListener("mousemove", (event) => {
    gameRef.game.launcher.pointTo = {x: event.offsetX, y: event.offsetY};
  });
  element.addEventListener("click", () => {
    launchBall(gameRef.game);
  })
};
