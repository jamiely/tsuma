import { Node, ChainedBall, Game, Point, Color } from "./types";
import { add, scale, subtract, toUnit } from "./util";

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
    const { start } = path;

    let previous: Node<Point> | undefined = undefined;
    let current: Node<Point> | undefined = start;

    while (current) {
      context.beginPath();
      context.arc(current.value.x, current.value.y, 2, 0, TwoPI);
      context.fillStyle = "lightgray";
      context.fill();

      if (previous) {
        context.beginPath();
        context.setLineDash([5, 15]);
        context.moveTo(previous.value.x, previous.value.y);
        context.lineTo(current.value.x, current.value.y);
        context.strokeStyle = "lightgray";
        context.stroke();
      }

      previous = current;
      current = current.next;
    }

    renderBall(context, game.ballRadius + 5)({position: previous!.value, color: 'black'})
  });

const renderBall =
  (context: CanvasRenderingContext2D, ballRadius: number) =>
  ({ position: { x, y }, color }: {position: Point, color: Color}) => {
    context.beginPath();
    context.arc(x, y, ballRadius, 0, TwoPI);
    context.fillStyle = color;
    context.fill();
  };


const renderLauncher = (context: CanvasRenderingContext2D, game: Game) => {
  const launcherLength = game.ballRadius * 2;
  const launcher = game.launcher;
  renderBall(context, game.ballRadius)(launcher);

  const { position, pointTo } = launcher;
  const normalized = { ...pointTo };
  subtract(normalized, position);
  toUnit(normalized);
  scale(normalized, launcherLength);
  add(normalized, position);

  context.beginPath();
  context.setLineDash([]);
  context.strokeStyle = "black";
  context.moveTo(position.x, position.y);
  context.lineTo(normalized.x, normalized.y);
  context.stroke();
};
