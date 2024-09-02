import { Ball, ChainedBall, Game } from "./types";
import { add, distance, scale, subtract, toUnit } from "./util";

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

  renderWaypoints(context, game);

  for (let i = 0; i < chains.length; i++) {
    let current: ChainedBall | undefined = chains[i].head;
    while (current) {
      renderBall(context, ballRadius)(current.ball);
      current = current.next;
    }
  }
  freeBalls.forEach(renderBall(context, ballRadius));
  renderLauncher(context, game);
};

const TwoPI = 2 * Math.PI;

const renderWaypoints = (context: CanvasRenderingContext2D, game: Game) => 
  game.paths.forEach((path) => {
    context.beginPath();
    const {start: {value: start}, end: {value: end}} = path;

    [start, end].forEach(({x, y}) => {
      context.beginPath();
      context.arc(x, y, 5, 0, TwoPI);
      context.fillStyle = 'gray';
      context.fill();
    })

    console.log(start, end);

    context.beginPath();
    context.setLineDash([5, 15]);
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.strokeStyle = 'lightgray';
    context.stroke();
  })

const renderBall =
  (context: CanvasRenderingContext2D, ballRadius: number) =>
  ({ position: { x, y }, color }: Ball) => {
    context.beginPath();
    context.arc(x, y, ballRadius, 0, TwoPI);
    context.fillStyle = color;
    context.fill();
  };

const renderLauncher = (context: CanvasRenderingContext2D, game: Game) => {
  const launcherLength = 30;
  const launcher = game.launcher;
  renderBall(context, game.ballRadius)(launcher);

  const { position, pointTo } = launcher;
  const normalized = { ...pointTo };
  subtract(normalized, position);
  toUnit(normalized);
  scale(normalized, launcherLength);
  add(normalized, position);

  context.beginPath();
  context.moveTo(position.x, position.y);
  context.lineTo(normalized.x, normalized.y);
  context.stroke();
};
