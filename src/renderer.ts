import { iterateToTail } from "./linkedList";
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
    for(const {value} of iterateToTail(chains[i].head)) {
      renderChainedBall(context, game, value);
    }
  }
  freeBalls.forEach(renderBall(context, ballRadius));
  renderLauncher(context, game);
  renderDebug(context, game);
};

const renderChainedBall = (
  context: CanvasRenderingContext2D,
  game: Game,
  chainedBall: ChainedBall
) => {
  const {
    ball: {
      position: { x, y },
    },
    insertion,
  } = chainedBall;
  renderBall(context, game.ballRadius)(chainedBall.ball);
  if (!insertion || !game.debug.enabled) return;

  context.font = "20pt helvetica";
  context.fillStyle = "black";
  context.fillText("ins", x - game.ballRadius, y + game.ballRadius / 2);

  context.beginPath();
  context.arc(insertion.position.x, insertion.position.y, 5, 0, TwoPI);
  context.fillStyle = "violet";
  context.fill();
};

const renderDebug = (context: CanvasRenderingContext2D, game: Game) => {
  if (!game.debug.enabled) return;

  const line = (
    original: Point,
    color: string,
    origin: Point = { x: 50, y: 50 }
  ) => {
    const pt = { ...original };
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

  const circle = ({ x, y }: Point, color?: string) => {
    context.beginPath();
    context.arc(x, y, 2, 0, TwoPI);
    context.fillStyle = color || "lime";
    context.fill();
  };

  if (game.debug.collisionVector) {
    line(game.debug.collisionVector, "red");
  }

  if(game.debug.collisionChainedBallPosition) {
    circle(game.debug.collisionChainedBallPosition, "cyan")
  }

  if (game.debug.collisionChainedBallPosition && game.debug.movementVector) {
    const copy = { ...game.debug.movementVector };
    scale(copy, 10);
    line(copy, "pink", game.debug.collisionChainedBallPosition);
  }

  if (
    game.debug.collisionChainedBallPosition &&
    game.debug.movementNormalVector
  ) {
    const copy = { ...game.debug.movementNormalVector };
    scale(copy, 10);
    line(copy, "yellow", game.debug.collisionChainedBallPosition);
  }

  if (game.debug.collisionChainedBallPosition) {
    circle(game.debug.collisionChainedBallPosition);
  }

  if (game.debug.collisionFreeBallPosition) {
    circle(game.debug.collisionFreeBallPosition);
  }

  if (game.debug.collisionPoint) {
    circle(game.debug.collisionPoint, "CornSilk");
  }

  for (let i = 0; i < game.chains.length; i++) {
    for (const { value } of iterateToTail(game.chains[i].head)) {
      const {
        ball: {
          position: { x, y },
        },
        insertion,
      } = value;

      if (insertion) {
        context.font = "20pt helvetica";
        context.fillStyle = "black";
        context.fillText("ins", x - game.ballRadius, y + game.ballRadius / 2);

        context.beginPath();
        context.arc(insertion.position.x, insertion.position.y, 5, 0, TwoPI);
        context.fillStyle = "violet";
        context.fill();
      }
    }
  }
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
        context.lineWidth = 1;
        context.moveTo(previous.value.x, previous.value.y);
        context.lineTo(current.value.x, current.value.y);
        context.strokeStyle = "lightgray";
        context.stroke();
      }

      previous = current;
      current = current.next;
    }

    if (!previous?.value) return;

    context.beginPath();
    const { x, y } = previous.value;
    context.arc(x, y, game.ballRadius + 5, 0, TwoPI);
    context.fillStyle = "black";
    context.fill();
    context.strokeStyle = "SlateGray";
    context.lineWidth = 4;
    context.setLineDash([]);
    context.arc(x, y, game.ballRadius + 5, 0, TwoPI);
    context.stroke();
  });

const renderBall =
  (context: CanvasRenderingContext2D, ballRadius: number) =>
  ({ position: { x, y }, color }: { position: Point; color: string }) => {
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
