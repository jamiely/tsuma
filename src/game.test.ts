import { describe, expect, it, vitest, beforeEach } from 'vitest';
import { createGame, nextBoard, step, launchBall } from './game';
import { Game } from './types';
import { RenderOptions } from './renderer';

vitest.mock('@/vendor/sfxr');

describe('Game', () => {
  let game: Game;
  let renderOptions: RenderOptions;

  beforeEach(() => {
    renderOptions = {
      scale: 1,
      size: { width: 1000, height: 600 },
      showControls: false,
      waypoints: {
        enabled: false,
        color: 'black',
        radius: 5
      },
      paths: {
        color: 'black',
        width: 1
      }
    };
    game = createGame({ currentBoard: 'board11', debug: {}, renderOptions });
  });

  describe('createGame', () => {
    it('initializes with correct default values', () => {
      expect(game.ballsLeft).toBeGreaterThan(0);
      expect(game.chains).toHaveLength(game.paths.length);
      expect(game.freeBalls).toHaveLength(0);
      expect(game.boardSteps).toBe(0);
      expect(game.currentBoard).toBe('board11');
    });

    it('initializes launcher with valid color', () => {
      expect(game.launcher.color).toBeDefined();
      expect(game.boards[game.currentBoard].colors).toContain(game.launcher.color);
    });
  });

  describe('launchBall', () => {
    it('creates a new free ball with launcher properties', () => {
      const initialColor = game.launcher.color;
      launchBall(game);
      expect(game.freeBalls).toHaveLength(1);
      expect(game.freeBalls[0].color).toBe(initialColor);
      expect(game.freeBalls[0].position).toEqual(game.launcher.position);
      expect(game.launcher.color).not.toBe(initialColor); // Color should change
    });

    it('respects firing delay', () => {
      launchBall(game);
      const initialFreeBalls = game.freeBalls.length;
      launchBall(game); // Should not fire due to delay
      expect(game.freeBalls).toHaveLength(initialFreeBalls);
    });

    it('does not launch when game is over', () => {
      game.boardOver = 'won';
      launchBall(game);
      expect(game.freeBalls).toHaveLength(0);
    });
  });

  describe('nextBoard', () => {
    it('gets the next board', () => {
      const initialBoard = game.currentBoard;
      nextBoard(game);
      expect(game.currentBoard).not.toBe(initialBoard);
    });

    it('resets game state when loading new board', () => {
      game.boardSteps = 100;
      game.freeBalls.push({ position: { x: 0, y: 0 }, velocity: { x: 1, y: 1 }, color: 'red' });
      game.boardOver = 'won';
      step(game); // This will trigger nextBoard and loadBoard
      expect(game.boardSteps).toBe(0);
      expect(game.freeBalls).toHaveLength(0);
      expect(game.boardOver).toBeUndefined();
    });
  });

  describe('step', () => {
    it('increments board steps', () => {
      const initialSteps = game.boardSteps;
      step(game);
      expect(game.boardSteps).toBe(initialSteps + 1);
    });

    it('respects debug stop flag', () => {
      game.debug.stop = true;
      game.debug.debugSteps = 0;
      const initialSteps = game.boardSteps;
      step(game);
      expect(game.boardSteps).toBe(initialSteps);
    });

    it('updates free ball positions', () => {
      launchBall(game);
      const initialPosition = { ...game.freeBalls[0].position };
      step(game);
      expect(game.freeBalls[0].position).not.toEqual(initialPosition);
    });

    it('removes out-of-bounds balls', () => {
      game.freeBalls.push({
        position: { x: -100, y: -100 }, // Outside bounds
        velocity: { x: -1, y: -1 },
        color: 'red'
      });
      step(game);
      expect(game.freeBalls).toHaveLength(0);
    });
  });

  describe('game over conditions', () => {
    it('sets game over when no balls left', () => {
      game.ballsLeft = 0;
      game.freeBalls = [];
      // Clear any existing chains
      game.chains.forEach(chain => {
        chain.head = undefined;
        chain.foot = undefined;
      });
      step(game);
      expect(game.boardOver).toBe('won');
    });

    it('sets game over when chain reaches end', () => {
      const chain = game.chains[0];
      if (!chain?.head) {
        return; // Skip test if no chain or head available
      }
      // Move a ball to the end of the path
      const lastWaypoint = chain.path.end;
      chain.head.value.waypoint = lastWaypoint;
      chain.head.value.ball.position = lastWaypoint.value;
      step(game);
      expect(game.boardOver).toBe('lost');
    });
  });
});  