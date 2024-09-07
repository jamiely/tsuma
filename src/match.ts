import { Chain, ChainedBall, Game } from "./types";
import { distance } from "./util";

export function resolveMatches(game: Game, chain: Chain) {
  // we want to allow launched balls to fully become part
  // of the chain before resolving matches.
  if(chain.inserting) return;

  let last: ChainedBall | undefined = undefined;
  let current: ChainedBall | undefined = chain.head;
  let start: ChainedBall | undefined = chain.head;
  let length = 1;

  while(current) {
    if(last?.ball && last.ball.color === current.ball.color &&
      distance(last.ball.position, current.ball.position) < 2 * game.ballRadius + 1
    ) {
      length++;   
    } else {
      // we are at a new color, so resolve the last match
      if(length >= 3) {
        if(chain.head === start) {
          chain.head = current;
        }
        // I think there is a bug where matches at the foot
        // aren't handled

        // disappear balls in chain by changing pointers
        if(start.previous) {
          start.previous.next = current;
        }
        current.previous = start.previous;
        chain.pauseStepsAfterMatch = 30;
      }
  
      start = current;
      length = 1;
    }

    last = current;
    current = current.next;
  }
}