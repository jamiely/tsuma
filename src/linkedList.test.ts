import { describe, it, expect } from 'vitest';
import { Node } from './types';
import {
  insertBefore,
  insertAfter,
  replace,
  remove,
  iterateToTail,
  iterateToHead,
  fromArray,
  findNode,
  reduceList,
} from './linkedList';

describe('LinkedList', () => {
  describe('insertBefore', () => {
    it('should insert a node before the given node', () => {
      const node1: Node<number> = { value: 1 };
      const node2: Node<number> = { value: 2 };
      const node3: Node<number> = { value: 3 };
      
      // Link node1 and node3
      node1.next = node3;
      node3.previous = node1;
      
      // Insert node2 before node3
      insertBefore(node2, node3);
      
      expect(node1.next).toBe(node2);
      expect(node2.previous).toBe(node1);
      expect(node2.next).toBe(node3);
      expect(node3.previous).toBe(node2);
    });
  });

  describe('insertAfter', () => {
    it('should insert a node after the given node', () => {
      const node1: Node<number> = { value: 1 };
      const node2: Node<number> = { value: 2 };
      const node3: Node<number> = { value: 3 };
      
      // Link node1 and node3
      node1.next = node3;
      node3.previous = node1;
      
      // Insert node2 after node1
      insertAfter(node2, node1);
      
      expect(node1.next).toBe(node2);
      expect(node2.previous).toBe(node1);
      expect(node2.next).toBe(node3);
      expect(node3.previous).toBe(node2);
    });
  });

  describe('replace', () => {
    it('should replace a node in the list', () => {
      const node1: Node<number> = { value: 1 };
      const node2: Node<number> = { value: 2 };
      const node3: Node<number> = { value: 3 };
      const replacement: Node<number> = { value: 4 };
      
      // Link nodes
      node1.next = node2;
      node2.previous = node1;
      node2.next = node3;
      node3.previous = node2;
      
      // Replace node2 with replacement
      replace(replacement, node2);
      
      expect(node1.next).toBe(replacement);
      expect(replacement.previous).toBe(node1);
      expect(replacement.next).toBe(node3);
      expect(node3.previous).toBe(replacement);
    });
  });

  describe('remove', () => {
    it('should remove a node from the list', () => {
      const node1: Node<number> = { value: 1 };
      const node2: Node<number> = { value: 2 };
      const node3: Node<number> = { value: 3 };
      
      // Link nodes
      node1.next = node2;
      node2.previous = node1;
      node2.next = node3;
      node3.previous = node2;
      
      // Remove node2
      remove(node2);
      
      expect(node1.next).toBe(node3);
      expect(node3.previous).toBe(node1);
      expect(node2.next).toBeUndefined();
      expect(node2.previous).toBeUndefined();
    });
  });

  describe('iterateToTail', () => {
    it('should iterate from head to tail', () => {
      const { head } = fromArray([1, 2, 3, 4]);
      const values = Array.from(iterateToTail(head)).map(n => n.value);
      expect(values).toEqual([1, 2, 3, 4]);
    });

    it('should respect predicate', () => {
      const { head } = fromArray([1, 2, 3, 4]);
      const values = Array.from(iterateToTail(head, node => node.value < 3))
        .map(n => n.value);
      expect(values).toEqual([1, 2]);
    });
  });

  describe('iterateToHead', () => {
    it('should iterate from tail to head', () => {
      const { tail } = fromArray([1, 2, 3, 4]);
      const values = Array.from(iterateToHead(tail)).map(n => n.value);
      expect(values).toEqual([4, 3, 2, 1]);
    });
  });

  describe('fromArray', () => {
    it('should create a linked list from an array', () => {
      const arr = [1, 2, 3, 4];
      const { head, tail } = fromArray(arr);
      
      expect(head?.value).toBe(1);
      expect(tail?.value).toBe(4);
      
      const forwardValues = Array.from(iterateToTail(head)).map(n => n.value);
      const backwardValues = Array.from(iterateToHead(tail)).map(n => n.value);
      
      expect(forwardValues).toEqual(arr);
      expect(backwardValues).toEqual(arr.reverse());
    });

    it('should handle empty array', () => {
      const { head, tail } = fromArray([]);
      expect(head).toBeUndefined();
      expect(tail).toBeUndefined();
    });
  });

  describe('findNode', () => {
    it('should find a node matching the predicate', () => {
      const { head } = fromArray([1, 2, 3, 4]);
      const found = findNode(head!, value => value === 3);
      expect(found?.value).toBe(3);
    });

    it('should return undefined when no match found', () => {
      const { head } = fromArray([1, 2, 3, 4]);
      const found = findNode(head!, value => value === 5);
      expect(found).toBeUndefined();
    });
  });

  describe('reduceList', () => {
    it('should reduce the list using the provided reducer', () => {
      const { head } = fromArray([1, 2, 3, 4]);
      const sum = reduceList(
        head!,
        (acc, node) => acc + node.value,
        0
      );
      expect(sum).toBe(10);
    });
  });
}); 