import {
  archimedeanSpiral,
  createWaypointPathCustom,
  linePath,
  simplify,
  sinWave,
} from "./path";
import { Board, Game, Rectangle } from "./types";

const line = (bounds: Rectangle): Board => ({
  launcherPosition: {
    x: bounds.size.width / 2,
    y: (bounds.size.height * 5) / 6,
  },
  paths: [
    createWaypointPathCustom(
      simplify(
        10,
        linePath({
          bounds,
          slope: -0.2, 
          yIntercept: 400,
        })
      )
    ),
  ],

})

export const archimedes = (bounds: Rectangle): Board => ({
  launcherPosition: { x: 450, y: 300 },
  paths: [
    createWaypointPathCustom(simplify(10, archimedeanSpiral({ bounds }))),
  ],
});

const waveBoard = ({ bounds, ...rest }: Parameters<typeof sinWave>[0]) => ({
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

export const buildBoards = (bounds: Rectangle): Game['boards'] => ({
  shallowWave: shallowWave(bounds),
  wave: wave(bounds),
  archimedes: archimedes(bounds),
  line: line(bounds),
});
