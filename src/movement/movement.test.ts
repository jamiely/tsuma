import { describe, it, expect } from 'vitest';
import {
  stepMovement,
  stepFreeBalls,
  stepChains,
  stepInsertingChain,
  stepNormalChain,
  updatePositionTowardsWaypoint,
  updatePositionTowardsInsertion,
} from './movement';
import { Chain, ChainedBall, FreeBall, Game, Node, Point, Waypoint, Board, BoardName } from '@/types';

// Create a base game mock that can be extended
const createGameMock = (partial: Partial<Game> = {}): Game => {
  const testBoard: Board = {
    name: 'Test Board',
    launcherPosition: { x: 0, y: 0 },
    paths: [],
    colors: ['red', 'blue', 'green']
  };

  return {
    audio: { enabled: false },
    boardSteps: 0,
    boardOverSteps: 0,
    debug: {
      enabled: false,
      enableMapEditMode: false,
      debugSteps: 0,
      debugHistory: false,
      history: [],
      historyLimit: 100
    },
    chainedBallSpeed: 5,
    ballRadius: 10,
    firingDelay: 0,
    options: {
      defaultChainedBallSpeed: 5,
      magneticBallSpeed: 5,
      launchedBallSpeed: 5,
      insertingBallSpeed: 5,
      defaultFiringDelay: 0,
      backwardsDuration: 0,
      accuracyDuration: 0,
      slowDuration: 0,
      explosionExpansionDuration: 0
    },
    ballsLeft: 10,
    chains: [],
    launcher: {
      color: 'red',
      position: { x: 0, y: 0 },
      pointTo: { x: 0, y: 0 },
      launcherSpeed: 5
    },
    freeBalls: [],
    bounds: {
      position: { x: 0, y: 0 },
      size: { width: 100, height: 100 }
    },
    paths: [],
    lastFire: 0,
    boards: {
      test: testBoard,
      shallowWave: testBoard,
      wave: testBoard,
      archimedes: testBoard,
      line: testBoard,
      'test-tail': testBoard,
      'test-head': testBoard,
      'board11': testBoard,
      'board12': testBoard,
      'board13': testBoard,
      'board14': testBoard,
      'board15': testBoard,
      'board21': testBoard,
      'board22': testBoard,
      'board23': testBoard,
      'board24': testBoard,
      'board25': testBoard,
      'board31': testBoard,
      'board32': testBoard,
      'board33': testBoard,
      'board34': testBoard,
      'board35': testBoard,
      'board41': testBoard,
      'board42': testBoard,
      'board43': testBoard,
      'board44': testBoard,
      'board45': testBoard,
      'board46': testBoard,
      'board51': testBoard,
      'board52': testBoard,
      'board53': testBoard,
      'board54': testBoard,
      'board55': testBoard,
      'board56': testBoard,
      'board61': testBoard,
      'board62': testBoard,
      'board63': testBoard,
      'board64': testBoard,
      'board65': testBoard,
      'board66': testBoard,
      'board71': testBoard,
      'board72': testBoard,
      'board73': testBoard,
      'board74': testBoard,
      'board75': testBoard,
      'board76': testBoard,
      'board77': testBoard,
      'board81': testBoard,
      'board82': testBoard,
      'board83': testBoard,
      'board84': testBoard,
      'board85': testBoard,
      'board86': testBoard,
      'board87': testBoard,
      'board91': testBoard,
      'board92': testBoard,
      'board93': testBoard,
      'board94': testBoard,
      'board95': testBoard,
      'board96': testBoard,
      'board97': testBoard,
      'test-sink': testBoard,
      'test-chains': testBoard,
      'test-chains-cross': testBoard
    } as Record<BoardName, Board>,
    currentBoard: 'test' as BoardName,
    events: {
      dispatchEvent: () => true,
      removeAll: () => {},
      removeEventListener: () => {},
      addEventListener: () => {}
    },
    renderOptions: {
      scale: 1,
      size: { width: 100, height: 100 },
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
    },
    appliedEffects: {
      backwards: undefined,
      explosions: []
    },
    ...partial
  };
};

describe('movement', () => {
  describe('stepFreeBalls', () => {
    it('should update free ball positions based on velocity', () => {
      const freeBall: FreeBall = {
        color: 'red',
        position: { x: 0, y: 0 },
        velocity: { x: 5, y: 10 }
      };

      const game = createGameMock({
        freeBalls: [freeBall]
      });

      stepFreeBalls(game);

      expect(freeBall.position).toEqual({ x: 5, y: 10 });
    });

    it('should remove balls that go out of bounds', () => {
      const outOfBoundsBall: FreeBall = {
        color: 'red',
        position: { x: 0, y: 0 },
        velocity: { x: 200, y: 200 }
      };

      const game = createGameMock({
        freeBalls: [outOfBoundsBall]
      });

      stepFreeBalls(game);
      stepFreeBalls(game); // Second step to ensure ball is out of bounds

      expect(game.freeBalls).toHaveLength(0);
    });
  });

  describe('stepChains', () => {
    it('should handle inserting chains', () => {
      const waypoint: Node<Waypoint> = {
        value: { id: 1, x: 50, y: 50 }
      };

      const chainedBall: Node<ChainedBall> = {
        value: {
          ball: { color: 'red', position: { x: 0, y: 0 } },
          insertion: { position: { x: 50, y: 50 } },
          waypoint
        }
      };

      const chain: Chain = {
        inserting: 0,
        head: chainedBall,
        foot: chainedBall,
        path: { start: waypoint, end: waypoint }
      };
      // Manually set inserting after creation to bypass type checking
      (chain as any).inserting = 1;

      const game = createGameMock({
        chains: [chain]
      });

      stepChains(game, { waypointDirection: 'forwards' });

      // Ball should move towards insertion point
      expect(chainedBall.value.ball.position.x).toBeGreaterThan(0);
      expect(chainedBall.value.ball.position.y).toBeGreaterThan(0);
    });
  });

  describe('updatePositionTowardsWaypoint', () => {
    it('should move ball towards waypoint', () => {
      const waypoint: Node<Waypoint> = {
        value: { id: 1, x: 100, y: 100 }
      };

      const chainedBall: Node<ChainedBall> = {
        value: {
          ball: { color: 'red', position: { x: 0, y: 0 } },
          waypoint
        }
      };

      const chain: Chain = {
        inserting: 0,
        head: chainedBall,
        foot: chainedBall,
        path: { start: waypoint, end: waypoint }
      };

      const game = createGameMock();

      const result = updatePositionTowardsWaypoint({
        node: chainedBall,
        chain,
        game,
        waypointDirection: 'forwards'
      });

      expect(result.ballRemoved).toBe(false);
      expect(result.positionChanged).toBe(true);
      expect(chainedBall.value.ball.position.x).toBeGreaterThan(0);
      expect(chainedBall.value.ball.position.y).toBeGreaterThan(0);
    });
  });

  describe('updatePositionTowardsInsertion', () => {
    it('should move ball towards insertion point', () => {
      const chainedBall: ChainedBall = {
        ball: { color: 'red', position: { x: 0, y: 0 } },
        insertion: { position: { x: 50, y: 50 } }
      };

      const game = createGameMock();

      const result = updatePositionTowardsInsertion(game, chainedBall);

      expect(result.insertionComplete).toBe(false);
      expect(chainedBall.ball.position.x).toBeGreaterThan(0);
      expect(chainedBall.ball.position.y).toBeGreaterThan(0);
    });

    it('should complete insertion when ball reaches target', () => {
      const chainedBall: ChainedBall = {
        ball: { color: 'red', position: { x: 49, y: 49 } },
        insertion: { position: { x: 50, y: 50 } }
      };

      const game = createGameMock();

      const result = updatePositionTowardsInsertion(game, chainedBall);

      expect(result.insertionComplete).toBe(true);
      expect(chainedBall.ball.position.x).toBeCloseTo(50, 0);
      expect(chainedBall.ball.position.y).toBeCloseTo(50, 0);
    });
  });
}); 