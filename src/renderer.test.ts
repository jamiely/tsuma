import { describe, it, expect, vi } from 'vitest';
import { renderGame, RenderOptions } from './renderer';
import { Game, Board, BoardName } from './types';

describe('renderer', () => {
  describe('renderGame', () => {
    it('should handle missing 2d context', () => {
      const canvas = {
        getContext: () => null
      } as unknown as HTMLCanvasElement;

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const game = {} as Game;
      const options: RenderOptions = {
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
      };

      renderGame(canvas)(game, options);
      
      expect(consoleSpy).toHaveBeenCalledWith('There is no 2d context available.');
      consoleSpy.mockRestore();
    });

    it('should render game elements when context is available', () => {
      const mockContext = {
        fillStyle: 'black',
        fillRect: vi.fn().mockImplementation(() => {
          // When fillRect is called, fillStyle should already be set to white
          expect(mockContext.fillStyle).toBe('white');
        }),
        origfillRect: vi.fn(),
        beginPath: vi.fn(),
        arc: vi.fn(),
        fill: vi.fn(),
        setLineDash: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        stroke: vi.fn(),
        measureText: () => ({ width: 100 }),
        fillText: vi.fn(),
        strokeText: vi.fn(),
        drawImage: vi.fn(),
        set scaledFontSize(_: number) {},
        lineWidth: 1,
        lineCap: 'butt',
        strokeStyle: '',
        globalAlpha: 1,
        font: '',
      };

      const canvas = {
        width: 800,
        height: 600,
        getContext: () => mockContext
      } as unknown as HTMLCanvasElement;

      const options: RenderOptions = {
        scale: 1,
        size: { width: 800, height: 600 },
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

      const testBoard: Board = {
        name: 'Test Board',
        launcherPosition: { x: 0, y: 0 },
        paths: [],
        colors: ['red', 'blue', 'green']
      };

      const game: Partial<Game> = {
        chains: [],
        freeBalls: [],
        ballRadius: 10,
        bounds: {
          position: { x: 0, y: 0 },
          size: { width: 800, height: 600 }
        },
        debug: {
          enabled: false,
          enableMapEditMode: false,
          debugSteps: 0,
          debugHistory: false,
          history: [],
          historyLimit: 100
        },
        boardOver: undefined,
        boardSteps: 0,
        launcher: {
          position: { x: 400, y: 500 },
          color: 'red',
          pointTo: { x: 400, y: 400 },
          launcherSpeed: 5
        },
        appliedEffects: {
          explosions: [],
          accuracy: undefined
        },
        paths: [],
        boards: {
          test: testBoard
        } as Record<BoardName, Board>,
        currentBoard: 'test' as BoardName,
        renderOptions: options
      };

      renderGame(canvas)(game as Game, options);

      // Verify that basic rendering functions were called
      expect(mockContext.fillRect).toHaveBeenCalledWith(0, 0, 800, 600);
    });
  });
}); 