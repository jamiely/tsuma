import { Ball, Game, Launcher } from "./game";

const ballRadius = 10;

export const renderGame =
  (canvas: HTMLCanvasElement) =>
  ({ balls, freeBalls, launcher }: Game) => {
    const context = canvas.getContext("2d");
    if (!context) {
      console.error("There is no 2d context available.");
      return;
    }

    // clear the canvas
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    balls.forEach(renderBall(context));
    freeBalls.forEach(renderBall(context));
    renderLauncher(context)(launcher)
  };

const TwoPI = 2 * Math.PI;

const renderBall =
  (context: CanvasRenderingContext2D) =>
  ({ position: { x, y }, color }: {position: Ball['position'], color: Ball['color']}) => {
    context.beginPath();
    context.arc(x, y, ballRadius, 0, TwoPI);
    context.fillStyle = color;
    context.fill();
  };

const renderLauncher = (context: CanvasRenderingContext2D) => (launcher: Launcher) => {
  renderBall(context)(launcher);
  context.beginPath();
  const {position: {x, y}, pointTo: {x: otherX, y: otherY}} = launcher;
  context.moveTo(x, y);
  context.lineTo(otherX, otherY);
  context.stroke();
}
