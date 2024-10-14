import {
  archimedeanSpiral,
  createWaypointPathCustom,
  linePath,
  simplify,
  sinWave,
} from "@/path";
import { Board, Color, Game, Point, Rectangle } from "@/types";
import { defaultColors } from "@/util";
import { board22 } from "./board22";
import { board23 } from "./board23";
import { board24 } from "./board24";
import { board25 } from "./board25";
import { board31 } from "./board31";
import { board32 } from "./board32";
import { board33 } from "./board33";
import { board34 } from "./board34";
import { board35 } from "./board35";
import { board11 } from "./board11";
import { board12 } from "./board12";
import { board13 } from "./board13";
import { board14 } from "./board14";
import { board15 } from "./board15";
import { board21 } from "./board21";
import { board41, board42, board43, board44, board45, board46 } from "./board4";
import { board51, board52, board53, board54, board55, board56 } from "./board5";
import { board61, board62, board63, board64, board65, board66 } from "./board6";
import { board71, board72, board73, board74, board75, board76, board77 } from "./board7";
import { board81, board82, board83, board84, board85, board86, board87 } from "./board8";
import { board91, board92, board93, board94, board95, board96, board97 } from "./board9";
const testColors: Color[] = ["red", "green"];

const line = ({
  launcherPosition,
  yIntercept = 400,
  slope = -0.2,
  bounds,
  ...rest
}: { bounds: Rectangle; launcherPosition?: Point } & Partial<
  Parameters<typeof linePath>[0]
>): Board => ({
  name: "Line",
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
  name: "Archimedes",
  launcherPosition: { x: 450, y: 300 },
  paths: [
    createWaypointPathCustom(simplify(10, archimedeanSpiral({ bounds }))),
  ],
  ballCount: 5,
  colors: defaultColors,
});

const waveBoard = ({ bounds, ...rest }: Parameters<typeof sinWave>[0]) => ({
  name: "Wave",
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

  const halfHeight = bounds.size.height / 2;

  return {
    "test-chains-cross": testChainsCross(bounds),
    "test-chains": testChains(bounds),
    board11: board11(bounds),
    board12: board12(bounds),
    board13: board13(bounds),
    board14: board14(bounds),
    board15: board15(bounds),
    board21: board21(bounds),
    board22: board22(bounds),
    board23: board23(bounds),
    board24: board24(bounds),
    board25: board25(bounds),
    board31: board31(bounds),
    board32: board32(bounds),
    board33: board33(bounds),
    board34: board34(bounds),
    board35: board35(bounds),
    board41: board41(bounds),
    board42: board42(bounds),
    board43: board43(bounds),
    board44: board44(bounds),
    board45: board45(bounds),
    board46: board46(bounds),
    board51: board51(bounds),
    board52: board52(bounds),
    board53: board53(bounds),
    board54: board54(bounds),
    board55: board55(bounds),
    board56: board56(bounds),
    board61: board61(bounds),
    board62: board62(bounds),
    board63: board63(bounds),
    board64: board64(bounds),
    board65: board65(bounds),
    board66: board66(bounds),
    board71: board71(bounds),
    board72: board72(bounds),
    board73: board73(bounds),
    board74: board74(bounds),
    board75: board75(bounds),
    board76: board76(bounds),
    board77: board77(bounds),
    board81: board81(bounds),
    board82: board82(bounds),
    board83: board83(bounds),
    board84: board84(bounds),
    board85: board85(bounds),
    board86: board86(bounds),
    board87: board87(bounds),
    board91: board91(bounds),
    board92: board92(bounds),
    board93: board93(bounds),
    board94: board94(bounds),
    board95: board95(bounds),
    board96: board96(bounds),
    board97: board97(bounds),
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
      ballCount: 1,
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
      colors: ["red"],
    },
    "test-sink": {
      ballCount: 1,
      ...line({
        launcherPosition: {
          x: bounds.size.width / 2,
          y: (bounds.size.height * 5) / 6,
        },
        bounds,
        startX: bounds.size.width * 0.3,
        stopX: bounds.size.width * 0.5,
        slope: 0,
        yIntercept: bounds.size.height * 0.4,
      }),
      colors: ["red"],
    },
  };
};

const testChains = (bounds: Rectangle): Board => {
  const line1 = line({
      bounds,
      startX: bounds.size.width * 0.25,
      stopX: bounds.size.width * 0.75,
      slope: 0,
      yIntercept: bounds.size.height * 0.2,
    }),
    line2 = line({
      bounds,
      startX: bounds.size.width * 0.25,
      stopX: bounds.size.width * 0.75,
      slope: 0,
      yIntercept: bounds.size.height * 0.8,
    });

  return {
    name: "Test chains",
    ballCount: 2,
    colors: testColors,
    paths: [...line1.paths, ...line2.paths],
    launcherPosition: {
      x: bounds.size.width / 2,
      y: bounds.size.height / 2,
    },
  };
};

const testChainsCross = (bounds: Rectangle): Board => {
  const line1 = line({
      bounds,
      startX: bounds.size.width * 0.25,
      stopX: bounds.size.width * 0.75,
      slope: 0.5,
      yIntercept: 0,
    }),
    line2 = line({
      bounds,
      startX: bounds.size.width * 0.25,
      stopX: bounds.size.width * 0.75,
      slope: -0.5,
      yIntercept: bounds.size.height * 0.8,
    });

  return {
    name: "Test chains cross",
    ballCount: 2,
    colors: testColors,
    paths: [...line1.paths, ...line2.paths],
    launcherPosition: {
      x: bounds.size.width / 2,
      y: (bounds.size.height * 4) / 5,
    },
  };
};
