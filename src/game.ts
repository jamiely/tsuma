interface Point {
  x: number;
  y: number;
}

export interface Ball {
  position: Point;
}

export interface Game {
  balls: Ball[];
  launcher: Launcher;
}

export interface Launcher extends Ball {
  pointTo: Point;
}

export const createGame = (): Game => {
  return {
    balls: [{ position: { x: 100, y: 100 } }, { position: { x: 10, y: 10 } }],
    launcher: {position: {x: 300, y:300}, pointTo: {x:0, y:0}}
  };
};

export function step(game: Game) {
  game.balls.forEach((ball) => {
    ball.position.x += 1;
  })
}