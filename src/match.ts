import { Chain, ChainedBall, ExplosionEvent, Game } from "./types";
import { distance } from "./util";
import { Node } from "./types";
import { iterateToTail } from "./linkedList";

export function resolveMatches(game: Game, chain: Chain): {matches: boolean} {
  // we want to allow launched balls to fully become part
  // of the chain before resolving matches.
  if(chain.inserting) return {matches: false};

  let last: Node<ChainedBall> | undefined = undefined;
  let current: Node<ChainedBall> | undefined = chain.head;
  let start: Node<ChainedBall> | undefined = chain.head;
  let length = 1;

  let matches = false;
  while(current) {
    const lastBall = last?.value.ball;
    const didMatch = lastBall && lastBall.color === current.value.ball.color &&
    distance(lastBall.position, current.value.ball.position) < 2 * game.ballRadius + 1;
    if(didMatch) {
      length++;
    }
    
    const isFoot = current == chain.foot;
    if(!didMatch || isFoot) {
      // we are at a new color, so resolve the last match
      if(length >= 3) {
        for(const {value: {effect, ball}} of iterateToTail(start, (node) => node !== current)) {
          if(!effect) continue;

          if(effect === 'explosion') {
            game.events.dispatchEvent(new ExplosionEvent(ball.position));
          }
        }

        if(chain.head === start) {
          if(didMatch && isFoot) {
            chain.head = undefined;
          } else {
            chain.head = current;
          }
        }
        if(isFoot && didMatch) {
          chain.foot = start?.previous;
        }

        matches = true;
        // I think there is a bug where matches at the foot
        // aren't handled

        // disappear balls in chain by changing pointers
        if(start?.previous) {
          if(isFoot) {
            chain.foot = start.previous;
            start.previous.next = undefined;
          } else {
            start.previous.next = current;
          }
        }
        current.previous = start?.previous;
        chain.pauseStepsAfterMatch = 30;
      }
  
      start = current;
      length = 1;
    }

    last = current;
    current = current.next;
  }

  return {matches};
}