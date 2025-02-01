import { launchBall } from "./game";
import { Game } from "./types";

export const createInterface = (gameRef: {game: Game}) => (element: HTMLElement) => {
  element.addEventListener("mousemove", (event) => {
    const sc = gameRef.game.renderOptions.scale;
    gameRef.game.launcher.pointTo = {x: event.offsetX / sc, y: event.offsetY / sc};
  });
  element.addEventListener("click", () => {
    launchBall(gameRef.game);
  })
};
