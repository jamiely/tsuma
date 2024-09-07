import { Chain, ChainedBall } from "./types";

export function resolveMatches(chain: Chain) {
  // we want to allow launched balls to fully become part
  // of the chain before resolving matches.
  if(chain.inserting) return;

  let last: ChainedBall | undefined = undefined;
  let current: ChainedBall | undefined = chain.head;
  let start: ChainedBall | undefined = chain.head;
  let length = 1;

  while(current) {
    if(last?.ball.color === current.ball.color) {
      length++;      
    } else {
      // we are at a new color, so resolve the last match
      if(length >= 3) {
        // disappear balls in chain by changing pointers
        start.previous!.next = current;
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