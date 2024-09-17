import {
  archimedeanSpiral,
  createWaypointPathCustom,
  linePath,
  simplify,
  sinWave,
} from "./path";
import { Board, Color, Game, Point, Rectangle } from "./types";
import { defaultColors } from "./util";

const line = ({
  launcherPosition,
  yIntercept = 400,
  slope = -0.2,
  bounds,
  ...rest
}: { bounds: Rectangle; launcherPosition?: Point } & Partial<
  Parameters<typeof linePath>[0]
>): Board => ({
  colors: defaultColors,
  launcherPosition: launcherPosition || {
    x: bounds.size.width / 2,
    y: (bounds.size.height * 5) / 6,
  },
  paths: [
    createWaypointPathCustom(
      simplify(
        10,
        linePath({
          ...rest,
          bounds,
          slope,
          yIntercept,
        })
      )
    ),
  ],
});

export const archimedes = (bounds: Rectangle): Board => ({
  launcherPosition: { x: 450, y: 300 },
  paths: [
    createWaypointPathCustom(simplify(10, archimedeanSpiral({ bounds }))),
  ],
  colors: defaultColors,
});

const waveBoard = ({ bounds, ...rest }: Parameters<typeof sinWave>[0]) => ({
  colors: defaultColors,
  launcherPosition: {
    x: bounds.size.width / 2,
    y: (bounds.size.height * 5) / 6,
  },
  paths: [
    createWaypointPathCustom(
      simplify(
        10,
        sinWave({
          bounds,
          ...rest,
        })
      )
    ),
  ],
});

export const wave = (bounds: Rectangle) =>
  waveBoard({
    frequency: 0.02,
    amplitude: 100,
    bounds,
    origin: { x: -10, y: 150 },
  });

export const shallowWave = (bounds: Rectangle) =>
  waveBoard({
    frequency: 0.01,
    amplitude: 50,
    bounds,
    origin: { x: -10, y: 150 },
  });

export const buildBoards = (bounds: Rectangle): Game["boards"] => {
  const testBallCount = 1;
  const testColors: Color[] = ['red', 'green'];

  const halfHeight = bounds.size.height / 2;

  return {
    shallowWave: shallowWave(bounds),
    wave: wave(bounds),
    archimedes: archimedes(bounds),
    line: line({ bounds }),
    "test-tail": {
      ballCount: testBallCount,
      ...line({
        launcherPosition: {
          x: bounds.size.width * 0.2,
          y: halfHeight,
        },
        bounds,
        startX: bounds.size.width * 0.3,
        stopX: bounds.size.width * 0.8,
        slope: 0,
        yIntercept: halfHeight,
      }),
      colors: testColors,
    },
    "test-head": {
      ballCount: testBallCount,
      ...line({
        launcherPosition: {
          x: bounds.size.width * 0.7,
          y: halfHeight,
        },
        bounds,
        startX: bounds.size.width * 0.25,
        stopX: bounds.size.width * 0.6,
        slope: 0,
        yIntercept: halfHeight,
      }),
      colors: testColors,
    },
    test: {
      ballCount: 2,
      ...line({
        launcherPosition: {
          x: bounds.size.width / 2,
          y: (bounds.size.height * 5) / 6,
        },
        bounds,
        startX: bounds.size.width * 0.25,
        stopX: bounds.size.width * 0.75,
        slope: 0,
        yIntercept: bounds.size.height * 0.4,
      }),
      colors: testColors,
    },
  };
};
