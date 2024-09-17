import { EventManager, GameEvent, GameEventType } from "./types";

export const createEventManager = (): EventManager => {
  const eventTarget = new EventTarget();

  return {
    dispatchEvent(event: GameEvent) {
      return eventTarget.dispatchEvent(event);
    },
    removeEventListener: (type: GameEventType, callback: (event: GameEvent) => void) => eventTarget.removeEventListener(type, callback),
    addEventListener: (type: GameEventType, callback: (event: GameEvent) => void) => eventTarget.addEventListener(type, callback),
  }
}
