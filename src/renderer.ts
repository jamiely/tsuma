import { Node, ChainedBall, Game, Point } from "./types";
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
    let current: Node<ChainedBall> | undefined = chains[i].head;
    while (current) {
      renderBall(context, ballRadius)(current.value.ball);
      current = current.next;
    }
  }
  freeBalls.forEach(renderBall(context, ballRadius));
  renderLauncher(context, game);
  renderDebug(context, game);
};

const renderDebug = (context: CanvasRenderingContext2D, game: Game) => {
  const line = (original: Point, color: string) => {
    const pt = {...original}
    const origin = {x: 50, y: 50};
    scale(pt, 10);
    add(pt, origin);
  
    context.beginPath();
    context.setLineDash([]);
    context.lineWidth = 1;
    context.lineCap = "square";
    context.strokeStyle = color;
    context.moveTo(pt.x, pt.y);
    context.lineTo(origin.x, origin.y);
    context.stroke();
  };

  if(game.debug.collisionVector) {
    line(game.debug.collisionVector, 'red');
  }
  if(game.debug.movementVector) {
    line(game.debug.movementVector, 'green');
  }
}

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
        context.lineWidth = 1;
        context.moveTo(previous.value.x, previous.value.y);
        context.lineTo(current.value.x, current.value.y);
        context.strokeStyle = "lightgray";
        context.stroke();
      }

      previous = current;
      current = current.next;
    }

    if(!previous?.value) return;

    context.beginPath();
    const {x, y} = previous.value;
    context.arc(x, y, game.ballRadius + 5, 0, TwoPI);
    context.fillStyle = 'black';
    context.fill();
    context.strokeStyle = 'SlateGray';
    context.lineWidth = 4;
    context.setLineDash([]);
    context.arc(x, y, game.ballRadius + 5, 0, TwoPI);
    context.stroke();
  });

const renderBall =
  (context: CanvasRenderingContext2D, ballRadius: number) =>
  ({ position: { x, y }, color }: {position: Point, color: string}) => {
    context.beginPath();
    context.arc(x, y, ballRadius, 0, TwoPI);
    context.fillStyle = color;
    context.fill();
  };


const renderLauncher = (context: CanvasRenderingContext2D, game: Game) => {
  const launcherLength = game.ballRadius * 1.5;
  const launcher = game.launcher;

  const { position, pointTo } = launcher;
  const normalized = { ...pointTo };
  subtract(normalized, position);
  toUnit(normalized);
  scale(normalized, launcherLength);
  add(normalized, position);

  context.beginPath();
  context.setLineDash([]);
  context.lineWidth = 10;
  context.lineCap = "round";
  context.strokeStyle = "black";
  context.moveTo(position.x, position.y);
  context.lineTo(normalized.x, normalized.y);
  context.stroke();

  renderBall(context, game.ballRadius)(launcher);

  context.lineCap = "butt";
};
