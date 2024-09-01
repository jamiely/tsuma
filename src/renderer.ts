import { Ball, Game } from "./types";

export const renderGame = (canvas: HTMLCanvasElement) => (game: Game) => {
  const { chains, freeBalls, ballRadius } = game;
  const context = canvas.getContext("2d");
  if (!context) {
    console.error("There is no 2d context available.");
    return;
  }

  // clear the canvas
  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);

  chains.forEach(({ balls }) => balls.forEach(renderBall(context, ballRadius)));
  freeBalls.forEach(renderBall(context, ballRadius));
  renderLauncher(context, game);
};

const TwoPI = 2 * Math.PI;

const renderBall =
  (context: CanvasRenderingContext2D, ballRadius: number) =>
  ({ position: { x, y }, color }: Ball) => {
    context.beginPath();
    context.arc(x, y, ballRadius, 0, TwoPI);
    context.fillStyle = color;
    context.fill();
  };

const renderLauncher = (context: CanvasRenderingContext2D, game: Game) => {
  const launcher = game.launcher;
  renderBall(context, game.ballRadius)(launcher);
  context.beginPath();
  const {
    position: { x, y },
    pointTo: { x: otherX, y: otherY },
  } = launcher;
  context.moveTo(x, y);
  context.lineTo(otherX, otherY);
  context.stroke();
};
