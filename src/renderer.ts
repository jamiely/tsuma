import { iterateToTail } from "./linkedList";
import { Node, ChainedBall, Game, Point, Explosion } from "./types";
import { add, scale, subtract, toUnit } from "./util";

export interface RenderOptions {
  scale: number,
  size: {
    width: number;
    height: number,
  }
  showControls: boolean,
  waypoints: {
    enabled: boolean;
    color: string;
    radius: number;
  },
  paths: {
    color: string;
    width: number;
  }
}

declare global {
  interface CanvasRenderingContext2D {
    set scaledFontSize(value: number);
    origfillRect: CanvasRenderingContext2D['fillRect'];
    origfillText: CanvasRenderingContext2D['fillText'];
  }
}


export const renderGame = (canvas: HTMLCanvasElement) => (game: Game, options: RenderOptions) => {
  const { chains, freeBalls, ballRadius } = game;
  const originalContext = canvas.getContext("2d");
  if (!originalContext) {
    console.error("There is no 2d context available.");
    return;
  }

  const context = enrichContext(originalContext, options);
  // clear the canvas
  context.fillStyle = "white";
  context.origfillRect(0, 0, canvas.width, canvas.height);

  renderWaypoints(context, game, options);

  for (let i = 0; i < chains.length; i++) {
    for(const {value} of iterateToTail(chains[i].head)) {
      renderChainedBall(context, game, value);
    }
  }
  freeBalls.forEach(renderBall(context, ballRadius));
  renderLauncher(context, game);
  renderEffects(context, game);
  renderText(context, game);
  renderDebug(context, game);
  
  renderMapEditorBackground(context, game);
};

const renderMapEditorBackground = (context: CanvasRenderingContext2D, game: Game) => {
  if(!game.debug.enableMapEditMode) return;

  const imageSrc = '/tsuma/mapEditorBackground.png';
  const image = new Image();
  image.src = imageSrc;
  context.drawImage(image, 0, 0);
}

const renderText = (context: CanvasRenderingContext2D, game: Game) => {
  renderBoardOver(context, game);
  renderBoardName(context, game);
};

const renderBoardOver = (context: CanvasRenderingContext2D, game: Game) => {
  if(!game.boardOver) return;

  
  const padding = 10;
  const {size} = game.bounds
  context.scaledFontSize = 27;
  context.fillStyle = "black";
  const text = "Whoops! Restarting the board.";
  const {width} = context.measureText(text);
  context.origfillText(text, size.width - width - padding, size.height - padding, width);
}

const debugText = (context: CanvasRenderingContext2D, text: string, {x, y}: Point, offset: number = 5) => {
  context.scaledFontSize = 15;
  context.fillStyle = "cyan";
  context.strokeStyle = "black"
  const {width} = context.measureText(text);
  context.strokeText(text, x + offset, y + offset, width);
  context.fillText(text, x + offset, y + offset, width);
}

const renderBoardName = (context: CanvasRenderingContext2D, game: Game) => {
  if(game.boardSteps > 500) return;
  if(game.boardOver) return;

  const padding = 10;
  const {size} = game.bounds
  context.scaledFontSize = 27;
  context.fillStyle = "black";
  const text = game.boards[game.currentBoard].name;
  const {width} = context.measureText(text);
  const sc = game.renderOptions.scale;
  const x = size.width * sc - width - padding;
  const y = size.height * sc - padding;
  console.log('board name', x, y)
  context.origfillText(text, x, y, width);
}

const renderEffects = (context: CanvasRenderingContext2D, game: Game) => {
  for(const effect of game.appliedEffects.explosions) {
    renderEffectExplosion(context, game, effect);
  }

  renderEffectAccuracy(context, game);
}

const renderEffectAccuracy  = (context: CanvasRenderingContext2D, game: Game) => {
  const {accuracy} = game.appliedEffects
  if(!accuracy) return;

  const {pointFrom, pointTo} = accuracy
  if(! pointTo) return;

  context.beginPath();
  context.setLineDash([]);
  context.lineWidth = 5;
  context.lineCap = "square";
  context.strokeStyle = 'cyan';
  context.moveTo(pointFrom.x, pointFrom.y);
  context.lineTo(pointTo.x, pointTo.y);
  context.globalAlpha = 0.5;
  context.stroke();
  context.globalAlpha = 1;
}

const renderEffectExplosion = (context: CanvasRenderingContext2D, _game: Game, {radius, center}: Explosion) => {
  context.beginPath();
  context.arc(center.x, center.y, radius, 0, TwoPI);
  context.fillStyle = "orange";
  context.fill();
}

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

  if(chainedBall.effect) {
    let text = {
      'explosion': '💣',
      'slowEffect': '⏸️',
      'accuracyEffect': '🎯',
      'backwardsEffect': '🔃',
    }[chainedBall.effect];
    context.scaledFontSize = 22;
    context.fillStyle = "white";
    context.fillText(text, x - game.ballRadius/2, y + game.ballRadius / 2);
  }

  if (!insertion || !game.debug.enabled) return;

  context.scaledFontSize = 27;
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
    debugPoint(context, copy)
    debugPoint(context, game.debug.collisionChainedBallPosition)
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
        context.scaledFontSize = 27;
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

const renderWaypoints = (context: CanvasRenderingContext2D, game: Game, options: RenderOptions) =>
  game.paths.forEach((path) => {
    const { start } = path;

    let previous: Node<Point> | undefined = undefined;

    for(const {node: current} of iterateToTail(start)) {
      if(options.waypoints.enabled) {
        context.beginPath();
        context.arc(current.value.x, current.value.y, options.waypoints.radius, 0, TwoPI);
        context.fillStyle = options.waypoints.color;
        context.fill();
      }

      if (previous) {
        context.beginPath();
        context.lineWidth = options.paths.width;
        context.moveTo(previous.value.x, previous.value.y);
        context.lineTo(current.value.x, current.value.y);
        context.strokeStyle = options.paths.color;
        context.stroke();
      }

      previous = current;
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

const ptText = ({x, y}: Point): string => `(${x.toFixed(0)}, ${y.toFixed(0)})`

const debugPoint = (context: CanvasRenderingContext2D, pt: Point) =>
  debugText(context, ptText(pt), pt)

function enrichContext(context: CanvasRenderingContext2D, options: RenderOptions) {
  const sc = options.scale;
  const lookup: Record<string, any> = {
    arc,
    fillRect,
    fillText,
    lineTo,
    moveTo,
    strokeText,
  }
  const handler = {
    get(target: any, prop: string) {
      if(prop.startsWith('orig')) return target[prop.substring(4)].bind(target);
      if(lookup[prop]) return lookup[prop];

      if (typeof target[prop] === "function") {
        return target[prop].bind(target);
      }
      return target[prop];
    },
    set(target: any, prop: string, value: any) {
      if(prop === 'scaledFontSize') {
        const scaledFontSize = Math.max(Math.round(value * options.scale), 5);
        target.font = `${scaledFontSize}px helvetica`;
        console.log(target.font);
        return true;
      } else if(prop === 'lineWidth') {
        target.lineWidth = Math.max(value * options.scale, 0.5);
        return true;
      }
      // Allow setting properties normally (like fillStyle)
      target[prop] = value;
      return true;
    },
  };
  return new Proxy(context, handler) as CanvasRenderingContext2D;

  function fillRect(...props: Parameters<CanvasRenderingContext2D['fillRect']>) {
    const [x, y, w, h] = props;
    context.fillRect(x * sc, y * sc, w * sc, h * sc)
  }

  function arc(...props: Parameters<CanvasRenderingContext2D['arc']>) {
    const [x, y, radius, startAngle, endAngle, counterClockwise] = props;
    context.arc(x * sc, y * sc, radius * sc, startAngle, endAngle, counterClockwise);
  }

  function lineTo(...props: Parameters<CanvasRenderingContext2D['lineTo']>) {
    const [x, y] = props;
    context.lineTo(x * sc, y * sc);
  }
  
  function moveTo(...props: Parameters<CanvasRenderingContext2D['moveTo']>) {
    const [x, y] = props;
    context.moveTo(x * sc, y * sc);
  }

  function fillText(...props: Parameters<CanvasRenderingContext2D['fillText']>) {
    const [text, x, y, maxWidth] = props;
    context.fillText(text, x * sc, y * sc, maxWidth)
  }
  
  function strokeText(...props: Parameters<CanvasRenderingContext2D['strokeText']>) {
    const [text, x, y, maxWidth] = props;
    context.strokeText(text, x * sc, y * sc, maxWidth)
  }
}
