interface Point {
  x: number;
  y: number;
}

export interface Ball {
  position: Point;
}

export interface Game {
  balls: Ball[];
}

export const createGame = (): Game => {
  return {
    balls: [{ position: { x: 100, y: 100 } }, { position: { x: 10, y: 10 } }],
  };
};
