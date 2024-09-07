import { createGame, launchBall } from "@/game"
import { stepChains, stepFreeBalls } from "./movement";
import { expect, test, vi } from "vitest";

vi.mock('@/util', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/util')>();
  return {
    ...original,
    randomColor: vi.fn().mockReturnValue('red'),
  }
})

test('stepFreeBalls', () => {
  const game = createGame();
  launchBall(game);
  stepFreeBalls(game);

  expect(game.freeBalls).toMatchSnapshot();
})

test('stepChains', () => {
  const game = createGame();
  stepChains(game);

  expect(game.chains).toMatchSnapshot();
})

