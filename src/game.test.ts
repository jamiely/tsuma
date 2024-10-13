import { describe, expect, it, vitest } from 'vitest';
import { createGame, nextBoard } from './game';

vitest.mock('@/vendor/sfxr');

describe('nextBoard', () => {
  it('gets the next board', () => {
    const game = createGame({ currentBoard: 'board15', debug: {} });
    nextBoard(game);
    expect(game.currentBoard).toBe('board21');
  })
})  