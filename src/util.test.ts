import { expect, test } from 'vitest'
import { add, distance, getIntersection, inBounds, magnitude, scale, setPoint, subtract, toUnit } from './util'

test('distance', () => {
  expect(distance({x: 0, y:0}, {x: 2, y: 3})).toBe(Math.sqrt(13));
})  

test('inBounds', () => {
  const bounds = {position: {x: 1, y: 1}, size: {width: 4, height: 9}}
  expect(inBounds({x: 1, y: 1}, bounds)).toBe(true);
  expect(inBounds({x: 5, y: 10}, bounds)).toBe(true);
  expect(inBounds({x: 0, y: 1}, bounds)).toBe(false);
  expect(inBounds({x: 1, y: 0}, bounds)).toBe(false);
  expect(inBounds({x: 6, y: 10}, bounds)).toBe(false);
  expect(inBounds({x: 5, y: 11}, bounds)).toBe(false);
})

test('magnitude', () => {
  expect(magnitude({x: 1, y: 2})).toBe(Math.sqrt(5));
})

test('add', () => {
  const pt = {x: 1, y: 1};
  add(pt, {x: 3, y: 4});
  expect(pt).toStrictEqual({x: 4, y: 5});
})

test('subtract', () => {
  const pt = {x: 3, y: 4};
  subtract(pt, {x: 1, y: 1});
  expect(pt).toStrictEqual({x: 2, y: 3});
})

test('scale', () => {
  const pt = {x: 2, y: 3};
  scale(pt, 2);
  expect(pt).toStrictEqual({x: 4, y: 6});
})

test('toUnit', () => {
  const pt = {x: 2, y: 3};
  toUnit(pt);
  expect(pt.x - 0.5547001962252291).toBeLessThan(0.0001);
  expect(pt.y - 0.8320502943378437).toBeLessThan(0.0001);
})

test('setPoint', () => {
  const pt = {x: 1, y: 1};
  setPoint(pt, {x: 2, y: 3});
  expect(pt).toStrictEqual({x: 2, y: 3});
});

test('getIntersection', () => {
  const intersection = getIntersection({x: 1, y:1}, {x: 5, y: 5}, {x: -1, y: -1}, {x: -5, y: 2});
  expect(intersection).toStrictEqual({x: -1, y: -1});
})
