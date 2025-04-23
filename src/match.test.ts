import { describe, it, expect, vi } from 'vitest';
import { resolveMatches } from './match';
import { Chain, ChainedBall, Game, Node, ExplosionEffectEvent, SlowEffectEvent, AccuracyEffectEvent } from './types';

describe('match', () => {
  describe('resolveMatches', () => {
    it('should not resolve matches when chain is inserting', () => {
      const chain: Chain = {
        inserting: 0,
        path: {} as any,
        head: undefined,
        foot: undefined
      };
      // Manually set inserting after creation to bypass type checking
      (chain as any).inserting = 1;
      
      const game = {
        ballRadius: 10
      } as Game;

      const result = resolveMatches(game, chain);
      expect(result.matches).toBe(false);
    });

    it('should resolve matches of 3 or more same-colored balls', () => {
      const mockDispatchEvent = vi.fn();
      const game = {
        ballRadius: 10,
        events: {
          dispatchEvent: mockDispatchEvent
        }
      } as unknown as Game;

      // Create a chain of 3 red balls
      const ball1: Node<ChainedBall> = {
        value: {
          ball: { color: 'red', position: { x: 0, y: 0 } }
        }
      };
      const ball2: Node<ChainedBall> = {
        value: {
          ball: { color: 'red', position: { x: 15, y: 0 } }
        }
      };
      const ball3: Node<ChainedBall> = {
        value: {
          ball: { color: 'red', position: { x: 30, y: 0 } }
        }
      };
      const ball4: Node<ChainedBall> = {
        value: {
          ball: { color: 'blue', position: { x: 45, y: 0 } }
        }
      };

      // Link the balls
      ball1.next = ball2;
      ball2.previous = ball1;
      ball2.next = ball3;
      ball3.previous = ball2;
      ball3.next = ball4;
      ball4.previous = ball3;

      const chain: Chain = {
        inserting: 0,
        path: {} as any,
        head: ball1,
        foot: ball4
      };

      const result = resolveMatches(game, chain);
      expect(result.matches).toBe(true);
      expect(chain.head).toBe(ball4);
      expect(ball4.previous).toBeUndefined();
    });

    it('should trigger effects when matching balls with effects', () => {
      const mockDispatchEvent = vi.fn();
      const game = {
        ballRadius: 10,
        events: {
          dispatchEvent: mockDispatchEvent
        }
      } as unknown as Game;

      // Create a chain of 3 red balls with effects
      const ball1: Node<ChainedBall> = {
        value: {
          ball: { color: 'red', position: { x: 0, y: 0 } },
          effect: 'explosion'
        }
      };
      const ball2: Node<ChainedBall> = {
        value: {
          ball: { color: 'red', position: { x: 15, y: 0 } },
          effect: 'slowEffect'
        }
      };
      const ball3: Node<ChainedBall> = {
        value: {
          ball: { color: 'red', position: { x: 19, y: 0 } },
          effect: 'accuracyEffect'
        }
      };

      // Link the balls
      ball1.next = ball2;
      ball2.previous = ball1;
      ball2.next = ball3;
      ball3.previous = ball2;

      const chain: Chain = {
        inserting: 0,
        path: {} as any,
        head: ball1,
        foot: ball3
      };

      const result = resolveMatches(game, chain);
      expect(result.matches).toBe(true);
      // Each effect should trigger a dispatch event
      expect(mockDispatchEvent).toHaveBeenCalledTimes(3);
      expect(mockDispatchEvent.mock.calls[0][0]).toBeInstanceOf(ExplosionEffectEvent);
      expect(mockDispatchEvent.mock.calls[1][0]).toBeInstanceOf(SlowEffectEvent);
      expect(mockDispatchEvent.mock.calls[2][0]).toBeInstanceOf(AccuracyEffectEvent);
    });

    it('should not match balls that are too far apart', () => {
      const game = {
        ballRadius: 10,
        events: {
          dispatchEvent: vi.fn()
        }
      } as unknown as Game;

      // Create a chain of 3 red balls but too far apart
      const ball1: Node<ChainedBall> = {
        value: {
          ball: { color: 'red', position: { x: 0, y: 0 } }
        }
      };
      const ball2: Node<ChainedBall> = {
        value: {
          ball: { color: 'red', position: { x: 50, y: 0 } }
        }
      };
      const ball3: Node<ChainedBall> = {
        value: {
          ball: { color: 'red', position: { x: 100, y: 0 } }
        }
      };

      // Link the balls
      ball1.next = ball2;
      ball2.previous = ball1;
      ball2.next = ball3;
      ball3.previous = ball2;

      const chain: Chain = {
        inserting: 0,
        path: {} as any,
        head: ball1,
        foot: ball3
      };

      const result = resolveMatches(game, chain);
      expect(result.matches).toBe(false);
      expect(chain.head).toBe(ball1);
    });
  });
}); 