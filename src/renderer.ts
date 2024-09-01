import { Ball, Game } from "./game";

const ballRadius = 10;

export const renderGame =
  (canvas: HTMLCanvasElement) =>
  ({ balls }: Game) => {
    const context = canvas.getContext("2d");
    if (!context) {
      console.error("There is no 2d context available.");
      return;
    }

    balls.forEach(renderBall(context));
  };

const TwoPI = 2 * Math.PI;

const renderBall =
  (context: CanvasRenderingContext2D) =>
  ({ position: { x, y } }: Ball) => {
    context.beginPath();
    context.arc(x, y, ballRadius, 0, TwoPI);
    context.fillStyle = "red";
    context.fill();
  };
