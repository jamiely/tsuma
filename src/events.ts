import { EventManager, GameEvent, GameEventType } from "./types";

export const createEventManager = (): EventManager => {
  const eventTarget = new EventTarget();

  const wrapCallback = (callback: (_: GameEvent) => void) => 
    (event: Event) => callback(event as GameEvent)

  return {
    dispatchEvent(event: GameEvent) {
      return eventTarget.dispatchEvent(event);
    },
    removeEventListener: (type: GameEventType, callback: (event: GameEvent) => void) => eventTarget.removeEventListener(type, wrapCallback(callback)),
    addEventListener: (type: GameEventType, callback: (event: GameEvent) => void) => eventTarget.addEventListener(type, wrapCallback(callback)),
  }
}