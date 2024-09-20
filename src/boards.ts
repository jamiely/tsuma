import {
  archimedeanSpiral,
  createWaypointPathCustom,
  createWaypointPathFromArray,
  linePath,
  simplify,
  sinWave,
} from "./path";
import { Board, Color, Game, Point, Rectangle } from "./types";
import { chaikinSmoothing, defaultColors } from "./util";

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

  const halfHeight = bounds.size.height / 2;

  return {
    'test-chains-cross': testChainsCross(bounds),
    'test-chains': testChains(bounds),
    board11: board11(bounds),
    board12: board12(bounds),
    board13: board13(bounds),
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

const board11 = (bounds: Rectangle): Board => {
  function* points() {
    const spiral = archimedeanSpiral({
      bounds,
      squash: {
        x: 1.5,
        y: 1,
      },
      stopAngle: 9,
    })();

    const { done, value } = spiral.next();

    if (done) return;

    yield {
      x: value.x,
      y: 0,
    };

    yield {
      x: value.x,
      y: bounds.size.height / 2 + bounds.position.y,
    };

    for (const { x, y } of spiral) {
      yield { x, y: bounds.size.height - y };
    }
  }

  return {
    launcherPosition: {
      x: bounds.size.width / 2 + 20,
      y: bounds.size.height / 2,
    },
    ballCount: 100,
    paths: [createWaypointPathCustom(points)],
    colors: defaultColors,
  };
};

const board12 = ({ size: { width, height } }: Rectangle): Board => {
  function points() {
    function pt(x: number, y: number) {
      return { x, y };
    }

    const keyPoints = [
      pt((width * 9) / 10, height),
      pt((width * 9) / 10, (height * 2) / 10),
      pt((width * 4) / 5, (height * 1) / 10),
      pt((width * 1) / 10, (height * 3) / 10),
      pt((width * 1) / 20, (height * 9) / 10),
      pt((width * 8) / 10, (height * 9) / 10),
      pt((width * 8) / 10, (height * 1) / 3),
      pt((width * 6) / 10, (height * 7) / 10),
      pt((width * 2) / 10, (height * 7) / 10),
      pt((width * 2) / 10, (height * 2.5) / 5),
      pt((width * 6) / 10, (height * 1.3) / 5),
      pt((width * 5.7) / 10, (height * 3) / 5),
    ];

    return chaikinSmoothing(keyPoints);
  }

  return {
    launcherPosition: { x: (width * 4.5) / 10, y: height / 2 },
    ballCount: 100,
    paths: [createWaypointPathFromArray(points())],
    colors: defaultColors,
  };
};

const board13 = (bounds: Rectangle): Board => {
  function* points() {
    const spiral = archimedeanSpiral({
      bounds,
      squash: {
        x: 1.5,
        y: 1,
      },
      startAngle: Math.PI * 6,
      stopAngle: 8,
    })();

    const { done, value } = spiral.next();

    if (done) return;

    yield {
      x: bounds.size.width + 20,
      y: (bounds.size.height * 9) / 10,
    }

    const keyPoints = [
      {
        x: bounds.size.width + 20,
        y: (bounds.size.height * 9) / 10,
      },
      {
        x: (bounds.size.width * 2) / 10,
        y: (bounds.size.height * 9) / 10,
      },
      {
        x: (bounds.size.width * 1) / 10,
        y: (bounds.size.height * 5) / 10,
      },
      {
        x: (bounds.size.width * 1) / 10,
        y: (bounds.size.height * 1) / 10,
      },
      {
        x: bounds.size.width - value.x,
        y: (bounds.size.height * 1) / 10,
      },
      {
        x: bounds.size.width - value.x,
        y: (bounds.size.height * 2) / 10,
      },
    ];

    for(const pt of chaikinSmoothing(keyPoints)) {
      yield pt;
    }


    for (const { x, y } of spiral) {
      yield { x: bounds.size.width - x, y: bounds.size.height - y };
    }
  }

  return {
    launcherPosition: {
      x: bounds.size.width * 9 / 20,
      y: bounds.size.height / 2,
    },
    ballCount: 100,
    paths: [createWaypointPathCustom(points)],
    colors: defaultColors,
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
    ballCount: 2,
    colors: testColors,
    paths: [
      ...line1.paths,
      ...line2.paths,
    ],
      launcherPosition: {
        x: bounds.size.width / 2,
        y: bounds.size.height / 2,
      },
  }
}

const testChainsCross = (bounds: Rectangle): Board => {
  const line1 = line({
      bounds,
      startX: bounds.size.width * 0.25,
      stopX: bounds.size.width * 0.75,
      slope: .5,
      yIntercept: 0,
    }),
    line2 = line({
      bounds,
      startX: bounds.size.width * 0.25,
      stopX: bounds.size.width * 0.75,
      slope: -.5,
      yIntercept: bounds.size.height * 0.8,
    });

    console.log(line1.paths);

  return {
    ballCount: 2,
    colors: testColors,
    paths: [
      ...line1.paths,
      ...line2.paths,
    ],
      launcherPosition: {
        x: bounds.size.width / 2,
        y: bounds.size.height *  4/5,
      },
  }
};
