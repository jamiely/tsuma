import { describe, expect, it } from 'vitest'
import {
  add,
  angleBetweenVectors,
  chaikinSmoothing,
  defaultColors,
  distance,
  dotProduct,
  getIntersection,
  inBounds,
  magnitude,
  normal,
  radiansToDegrees,
  randomColor,
  scale,
  setPoint,
  subtract,
  toUnit,
  waypointVector,
} from './util'
import { ChainedBall, Node, Waypoint, Color } from './types'

describe('Point Operations', () => {
  describe('distance', () => {
    it('calculates distance between two points', () => {
      expect(distance({x: 0, y: 0}, {x: 2, y: 3})).toBe(Math.sqrt(13));
    });

    it('returns 0 for same point', () => {
      expect(distance({x: 1, y: 1}, {x: 1, y: 1})).toBe(0);
    });
  });

  describe('magnitude', () => {
    it('calculates magnitude of a vector', () => {
      expect(magnitude({x: 1, y: 2})).toBe(Math.sqrt(5));
    });

    it('returns 0 for zero vector', () => {
      expect(magnitude({x: 0, y: 0})).toBe(0);
    });
  });

  describe('add', () => {
    it('adds two points', () => {
      const pt = {x: 1, y: 1};
      add(pt, {x: 3, y: 4});
      expect(pt).toStrictEqual({x: 4, y: 5});
    });

    it('handles zero vector', () => {
      const pt = {x: 1, y: 1};
      add(pt, {x: 0, y: 0});
      expect(pt).toStrictEqual({x: 1, y: 1});
    });
  });

  describe('subtract', () => {
    it('subtracts two points', () => {
      const pt = {x: 3, y: 4};
      subtract(pt, {x: 1, y: 1});
      expect(pt).toStrictEqual({x: 2, y: 3});
    });

    it('handles zero vector', () => {
      const pt = {x: 1, y: 1};
      subtract(pt, {x: 0, y: 0});
      expect(pt).toStrictEqual({x: 1, y: 1});
    });
  });

  describe('scale', () => {
    it('scales a point', () => {
      const pt = {x: 2, y: 3};
      scale(pt, 2);
      expect(pt).toStrictEqual({x: 4, y: 6});
    });

    it('handles zero scale', () => {
      const pt = {x: 2, y: 3};
      scale(pt, 0);
      expect(pt).toStrictEqual({x: 0, y: 0});
    });

    it('handles negative scale', () => {
      const pt = {x: 2, y: 3};
      scale(pt, -1);
      expect(pt).toStrictEqual({x: -2, y: -3});
    });
  });

  describe('toUnit', () => {
    it('normalizes a vector', () => {
      const pt = {x: 2, y: 3};
      toUnit(pt);
      expect(pt.x - 0.5547001962252291).toBeLessThan(0.0001);
      expect(pt.y - 0.8320502943378437).toBeLessThan(0.0001);
    });

    it('handles zero vector', () => {
      const pt = {x: 0, y: 0};
      toUnit(pt);
      expect(pt).toStrictEqual({x: 0, y: 0});
    });
  });

  describe('setPoint', () => {
    it('copies point values', () => {
      const pt = {x: 1, y: 1};
      setPoint(pt, {x: 2, y: 3});
      expect(pt).toStrictEqual({x: 2, y: 3});
    });
  });

  describe('normal', () => {
    it('calculates normal vector', () => {
      expect(normal({x: 1, y: 2})).toStrictEqual({x: -2, y: 1});
    });

    it('handles zero vector', () => {
      expect(normal({x: 0, y: 0})).toStrictEqual({x: 0, y: 0});
    });
  });
});

describe('Geometric Operations', () => {
  describe('getIntersection', () => {
    it('finds intersection of two lines', () => {
      const intersection = getIntersection(
        {x: 1, y: 1}, {x: 5, y: 5},
        {x: -1, y: -1}, {x: -5, y: 2}
      );
      expect(intersection).toStrictEqual({x: -1, y: -1});
    });

    it('returns null for parallel lines', () => {
      const intersection = getIntersection(
        {x: 0, y: 0}, {x: 1, y: 1},
        {x: 0, y: 1}, {x: 1, y: 2}
      );
      expect(intersection).toBeNull();
    });
  });

  describe('dotProduct', () => {
    it('calculates dot product', () => {
      expect(dotProduct({x: 1, y: 2}, {x: 3, y: 4})).toBe(11);
    });

    it('returns 0 for perpendicular vectors', () => {
      expect(dotProduct({x: 1, y: 0}, {x: 0, y: 1})).toBe(0);
    });
  });

  describe('angleBetweenVectors', () => {
    it('calculates angle between vectors', () => {
      const angle = angleBetweenVectors({x: 1, y: 0}, {x: 0, y: 1});
      expect(angle).toBeCloseTo(Math.PI / 2);
    });

    it('returns 0 for parallel vectors', () => {
      const angle = angleBetweenVectors({x: 1, y: 0}, {x: 2, y: 0});
      expect(angle).toBeCloseTo(0);
    });
  });

  describe('radiansToDegrees', () => {
    it('converts radians to degrees', () => {
      expect(radiansToDegrees(Math.PI)).toBe(180);
      expect(radiansToDegrees(Math.PI / 2)).toBe(90);
    });
  });
});

describe('Game Utilities', () => {
  describe('inBounds', () => {
    const bounds = {position: {x: 1, y: 1}, size: {width: 4, height: 9}};

    it('checks if point is in bounds without padding', () => {
      const noPadding = {padding: {x: 0, y: 0}};
      expect(inBounds({x: 1, y: 1}, bounds, noPadding)).toBe(true);
      expect(inBounds({x: 5, y: 10}, bounds, noPadding)).toBe(true);
      expect(inBounds({x: 0, y: 1}, bounds, noPadding)).toBe(false);
      expect(inBounds({x: 6, y: 10}, bounds, noPadding)).toBe(false);
    });

    it('respects padding', () => {
      const padding = {padding: {x: 1, y: 1}};
      expect(inBounds({x: 0, y: 1}, bounds, padding)).toBe(true);
      expect(inBounds({x: 6, y: 10}, bounds, padding)).toBe(true);
    });

    it('uses default padding', () => {
      expect(inBounds({x: -19, y: 1}, bounds)).toBe(true);
      expect(inBounds({x: -21, y: 1}, bounds)).toBe(false);
    });
  });

  describe('randomColor', () => {
    it('returns a color from the default colors', () => {
      const color = randomColor();
      expect(defaultColors).toContain(color);
    });

    it('returns a color from custom colors', () => {
      const customColors = ['red', 'blue'] as Color[];
      const color = randomColor(customColors);
      expect(customColors).toContain(color);
    });
  });

  describe('waypointVector', () => {
    it('calculates vector to next waypoint', () => {
      const waypoint: Node<Waypoint> = {
        value: { id: 1, x: 3, y: 4 }
      };
      const chainedBall: ChainedBall = {
        ball: { position: { x: 0, y: 0 }, color: 'red' },
        waypoint
      };
      const vector = waypointVector(chainedBall);
      expect(vector.x).toBeCloseTo(0.6);
      expect(vector.y).toBeCloseTo(0.8);
    });

    it('throws error when waypoint is missing', () => {
      const chainedBall: ChainedBall = {
        ball: { position: { x: 0, y: 0 }, color: 'red' }
      };
      expect(() => waypointVector(chainedBall)).toThrow();
    });

    it('applies scale factor', () => {
      const waypoint: Node<Waypoint> = {
        value: { id: 1, x: 3, y: 4 }
      };
      const chainedBall: ChainedBall = {
        ball: { position: { x: 0, y: 0 }, color: 'red' },
        waypoint
      };
      const vector = waypointVector(chainedBall, { scale: 2 });
      expect(vector.x).toBeCloseTo(1.2);
      expect(vector.y).toBeCloseTo(1.6);
    });
  });

  describe('chaikinSmoothing', () => {
    it('smooths a path of points', () => {
      const result = chaikinSmoothing([
        {x: 0, y: 1},
        {x: 1, y: 1},
        {x: 1, y: 0}
      ]);
      expect(result).toMatchSnapshot();
    });

    it('handles custom iterations', () => {
      const result = chaikinSmoothing([
        {x: 0, y: 0},
        {x: 1, y: 1}
      ], 1);
      expect(result).toHaveLength(2);
    });

    it('handles custom smoothing factor', () => {
      const result = chaikinSmoothing([
        {x: 0, y: 0},
        {x: 1, y: 1}
      ], 1, 0.5);
      expect(result[0]).toStrictEqual({x: 0.5, y: 0.5});
      expect(result[1]).toStrictEqual({x: 0.5, y: 0.5});
    });
  });
});
