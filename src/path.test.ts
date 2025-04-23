import { describe, it, expect } from 'vitest';
import {
  createWaypointPath,
  createWaypointPathFromArray,
  createWaypointPathCustom,
  simplify,
  sinWave,
  archimedeanSpiral,
  linePath,
} from './path';
import { Point, Rectangle, WaypointPath } from './types';

describe('path', () => {
  describe('createWaypointPath', () => {
    it('should create a waypoint path between two points', () => {
      const start = { x: 0, y: 0 };
      const end = { x: 100, y: 100 };
      
      const path = createWaypointPath(start, end);
      
      expect(path.start.value.x).toBe(start.x);
      expect(path.start.value.y).toBe(start.y);
      expect(path.end.value.x).toBe(end.x);
      expect(path.end.value.y).toBe(end.y);
      expect(path.start.next).toBe(path.end);
      expect(path.end.previous).toBe(path.start);
    });
  });

  describe('createWaypointPathFromArray', () => {
    it('should create a waypoint path from an array of points', () => {
      const points: Point[] = [
        { x: 0, y: 0 },
        { x: 50, y: 50 },
        { x: 100, y: 100 }
      ];
      
      const path = createWaypointPathFromArray(points);
      
      let current = path.start;
      let index = 0;
      while (current) {
        expect(current.value.x).toBe(points[index].x);
        expect(current.value.y).toBe(points[index].y);
        current = current.next;
        index++;
      }
      expect(index).toBe(points.length);
    });
  });

  describe('simplify', () => {
    it('should remove points that are too close together', () => {
      const points = [
        { x: 0, y: 0 },
        { x: 1, y: 1 }, // Should be removed (too close)
        { x: 10, y: 10 },
        { x: 11, y: 11 }, // Should be removed (too close)
        { x: 20, y: 20 }
      ];

      function* generator() {
        for (const point of points) {
          yield point;
        }
      }

      const simplified = Array.from(simplify(5, generator)());
      expect(simplified).toHaveLength(3);
      expect(simplified[0]).toEqual(points[0]);
      expect(simplified[1]).toEqual(points[2]);
      expect(simplified[2]).toEqual(points[4]);
    });
  });

  describe('sinWave', () => {
    it('should generate points along a sine wave', () => {
      const bounds: Rectangle = {
        position: { x: 0, y: 0 },
        size: { width: 100, height: 100 }
      };
      const origin = { x: 0, y: 50 };
      const frequency = 0.1;
      const amplitude = 20;

      const points = Array.from(sinWave({ bounds, origin, frequency, amplitude })());
      
      expect(points.length).toBeGreaterThan(0);
      points.forEach(point => {
        expect(point.x).toBeGreaterThanOrEqual(origin.x);
        expect(point.x).toBeLessThanOrEqual(bounds.size.width - 50);
        expect(point.y).toBeGreaterThanOrEqual(origin.y - amplitude);
        expect(point.y).toBeLessThanOrEqual(origin.y + amplitude);
      });
    });
  });

  describe('archimedeanSpiral', () => {
    it('should generate points along a spiral', () => {
      const bounds: Rectangle = {
        position: { x: 0, y: 0 },
        size: { width: 200, height: 200 }
      };

      const points = Array.from(archimedeanSpiral({
        bounds,
        startingRadius: 10,
        turnDistance: { x: 2, y: 2 },
        squash: { x: 1, y: 1 },
        startAngle: Math.PI * 2,
        stopAngle: Math.PI,
        origin: { x: 100, y: 100 }
      })());
      
      expect(points.length).toBeGreaterThan(0);
      points.forEach(point => {
        expect(point.x).toBeGreaterThanOrEqual(0);
        expect(point.x).toBeLessThanOrEqual(bounds.size.width);
        expect(point.y).toBeGreaterThanOrEqual(0);
        expect(point.y).toBeLessThanOrEqual(bounds.size.height);
      });
    });

    it('should respect the predicate parameter', () => {
      const bounds: Rectangle = {
        position: { x: 0, y: 0 },
        size: { width: 200, height: 200 }
      };

      const baseConfig = {
        bounds,
        startingRadius: 10,
        turnDistance: { x: 2, y: 2 },
        squash: { x: 1, y: 1 },
        startAngle: Math.PI * 2,
        stopAngle: 0,
        origin: { x: 100, y: 100 }
      };

      const predicate = (angle: number) => angle >= Math.PI; // Only first half rotation
      const pointsWithPredicate = Array.from(archimedeanSpiral({
        ...baseConfig,
        predicate
      })());
      
      const pointsWithoutPredicate = Array.from(archimedeanSpiral(baseConfig)());
      
      expect(pointsWithPredicate.length).toBeGreaterThan(0);
      expect(pointsWithPredicate.length).toBeLessThan(pointsWithoutPredicate.length);
    });
  });

  describe('linePath', () => {
    it('should generate points along a line', () => {
      const bounds: Rectangle = {
        position: { x: 0, y: 0 },
        size: { width: 100, height: 100 }
      };
      const slope = 1;
      const yIntercept = 0;

      const points = Array.from(linePath({ bounds, slope, yIntercept })());
      
      expect(points.length).toBeGreaterThan(0);
      points.forEach((point, index) => {
        if (index > 0) {
          const prevPoint = points[index - 1];
          expect(point.x - prevPoint.x).toBe(10); // Default xIncrement
          expect(point.y - prevPoint.y).toBe(10); // Slope of 1
        }
      });
    });

    it('should respect custom xIncrement', () => {
      const bounds: Rectangle = {
        position: { x: 0, y: 0 },
        size: { width: 100, height: 100 }
      };
      const slope = 1;
      const yIntercept = 0;
      const xIncrement = 5;

      const points = Array.from(linePath({ bounds, slope, yIntercept, xIncrement })());
      
      points.forEach((point, index) => {
        if (index > 0) {
          const prevPoint = points[index - 1];
          expect(point.x - prevPoint.x).toBe(xIncrement);
        }
      });
    });
  });
}); 