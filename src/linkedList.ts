import { Node } from "./types";

/**
 * Before:
 *     v new node               
 * A - B - insertAt - D
 * 
 * After:
 * A - B - newNode - insertAt - D
 */
export const insertBefore = <T>(newNode: Node<T>, insertAt: Node<T>) => {
  newNode.previous = insertAt.previous;
  newNode.next = insertAt;
  if(insertAt.previous) insertAt.previous.next = newNode;
  insertAt.previous = newNode;
}


/**
 * Before:
 *                    v new node
 * A - B - insertAt - D
 * 
 * After:
 * 
 * A - B - insertAt - newNode - D
 */
export const insertAfter = <T>(newNode: Node<T>, insertAt: Node<T>) => {
  newNode.previous = insertAt;
  newNode.next = insertAt.next;
  if(insertAt.next) insertAt.next.previous = newNode;
  insertAt.next = newNode;
}

export const replace = <T>(replacement: Node<T>, toReplace: Node<T>) => {
  replacement.next = toReplace.next;
  replacement.previous = toReplace.previous;

  if(toReplace.previous) toReplace.previous.next = replacement;
  if(toReplace.next) toReplace.next.previous = replacement;
}
