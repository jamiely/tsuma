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
  if (insertAt.previous) insertAt.previous.next = newNode;
  insertAt.previous = newNode;
};

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
  if (insertAt.next) insertAt.next.previous = newNode;
  insertAt.next = newNode;
};

export const replace = <T>(replacement: Node<T>, toReplace: Node<T>) => {
  replacement.next = toReplace.next;
  replacement.previous = toReplace.previous;

  if (toReplace.previous) toReplace.previous.next = replacement;
  if (toReplace.next) toReplace.next.previous = replacement;
};

export const remove = <T>(node: Node<T>) => {
  if (node.previous) {
    node.previous.next = node.next;
  }
  if (node.next) {
    node.next.previous = node.previous;
  }
  node.previous = undefined;
  node.next = undefined;
};

export function iterateToTail<T>(head: Node<T> | undefined, predicate?: (node: Node<T>) => boolean) {
  return iterateWithTransform(head, (current) => current.next, predicate);
}

export function iterateToHead<T>(tail: Node<T> | undefined) {
  return iterateWithTransform(tail, (current) => current.previous);
}

export function* iterateWithTransform<T>(
  node: Node<T> | undefined,
  transformer: (node: Node<T>) => Node<T> | undefined,
  predicate: (node: Node<T>) => boolean = (node) => Boolean(node),
) {
  let current: Node<T> | undefined = node;
  while (current && predicate(current)) {
    yield {
      ...current,
      node: current,
    };
    current = transformer(current);
  }
}
