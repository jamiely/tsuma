import { EventManager, GameEvent, GameEventType } from "./types";

export const createEventManager = (): EventManager => {
  const eventTarget = new EventTarget();

  const wrapCallback = (callback: (_: GameEvent) => void) => 
    (event: Event) => callback(event as GameEvent)

  const eventListeners: {type: GameEventType, callback: any}[] = [];

  const removeEventListener = (type: GameEventType, callback: (event: GameEvent) => void) => {
    for(let i = eventListeners.length - 1; i >= 0; i--) {
      if(type !== eventListeners[i].type || callback !== eventListeners[i].callback) continue;

      eventListeners.splice(i, 1);
      break;
    }

    return eventTarget.removeEventListener(type, wrapCallback(callback))
  };

  return {
    dispatchEvent(event: GameEvent) {
      return eventTarget.dispatchEvent(event);
    },
    removeAll: () => {
      eventListeners.forEach(({type, callback}) => {
        removeEventListener(type, callback);
      })
    },
    removeEventListener,
    addEventListener: (type: GameEventType, callback: (event: GameEvent) => void) => {
      eventListeners.push({type, callback});
      return eventTarget.addEventListener(type, wrapCallback(callback))
    },
  }
}