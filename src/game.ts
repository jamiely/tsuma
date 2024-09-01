interface Point {
  x: number;
  y: number;
}

type Color = 'red' | 'blue' | 'green' | 'yellow' | 'purple';

export interface Ball {
  position: Point;
  color: Color;
}

export interface FreeBall extends Ball {
  velocity: Point;
}

export interface Game {
  balls: Ball[];
  launcher: Launcher;
  freeBalls: FreeBall[];
}

export interface Launcher extends Ball {
  pointTo: Point;
}

export const createGame = (): Game => {
  return {
    balls: [{ position: { x: 100, y: 100 }, color: 'red' }, { position: { x: 10, y: 10 }, color: 'blue' }],
    launcher: {position: {x: 300, y:300}, pointTo: {x:0, y:0}, color: 'purple'},
    freeBalls: [],
  };
};

const colors: Color[] = ['red', 'green', 'blue', 'yellow', 'purple']
const randomColor = () => colors[Math.floor(Math.random() * colors.length)]; 

export const launchBall = (game: Game) => {
  // the un-normalized velocity vector
  const velocity = {
    x: game.launcher.pointTo.x - game.launcher.position.x,
    y: game.launcher.pointTo.y - game.launcher.position.y,
  };

  // normalized velocity vector
  const magnitude = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y)
  velocity.x /= magnitude;
  velocity.y /= magnitude;

  game.freeBalls.push({
    position: {...game.launcher.position},
    velocity,
    color: randomColor(),
  });
}

export function step(game: Game) {
  game.balls.forEach((ball) => {
    ball.position.x += 1;
  })

  game.freeBalls.forEach((ball) => {
    ball.position.x += ball.velocity.x;
    ball.position.y += ball.velocity.y;
  })
}