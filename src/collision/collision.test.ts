import { expect, describe, it } from 'vitest'
import { handleCollisions, ballsCollide, shouldInsertBefore, backoffFreeBall, addNewNode } from './collision'
import { Ball, ChainedBall, Game, Node, Waypoint, WaypointPath, Board, FreeBall, Chain } from '../types'

const createTestGame = (ballRadius: number): Game => {
  const testBoard: Board = {
    name: 'test',
    launcherPosition: { x: 0, y: 0 },
    paths: [],
    colors: ['red', 'blue']
  };

  const boards = {
    test: testBoard,
    shallowWave: testBoard,
    wave: testBoard,
    archimedes: testBoard,
    line: testBoard,
    'test-tail': testBoard,
    'test-head': testBoard,
    'test-sink': testBoard,
    'test-chains': testBoard,
    'test-chains-cross': testBoard,
    board11: testBoard,
    board12: testBoard,
    board13: testBoard,
    board14: testBoard,
    board15: testBoard,
    board21: testBoard,
    board22: testBoard,
    board23: testBoard,
    board24: testBoard,
    board25: testBoard,
    board31: testBoard,
    board32: testBoard,
    board33: testBoard,
    board34: testBoard,
    board35: testBoard,
    board41: testBoard,
    board42: testBoard,
    board43: testBoard,
    board44: testBoard,
    board45: testBoard,
    board46: testBoard,
    board51: testBoard,
    board52: testBoard,
    board53: testBoard,
    board54: testBoard,
    board55: testBoard,
    board56: testBoard,
    board61: testBoard,
    board62: testBoard,
    board63: testBoard,
    board64: testBoard,
    board65: testBoard,
    board66: testBoard,
    board71: testBoard,
    board72: testBoard,
    board73: testBoard,
    board74: testBoard,
    board75: testBoard,
    board76: testBoard,
    board77: testBoard,
    board81: testBoard,
    board82: testBoard,
    board83: testBoard,
    board84: testBoard,
    board85: testBoard,
    board86: testBoard,
    board87: testBoard,
    board91: testBoard,
    board92: testBoard,
    board93: testBoard,
    board94: testBoard,
    board95: testBoard,
    board96: testBoard,
    board97: testBoard,
  };

  return {
    ballRadius,
    chains: [],
    freeBalls: [],
    debug: {
      enabled: false,
      stop: false,
      collisionPoint: { x: 0, y: 0 },
      collisionChainedBallPosition: { x: 0, y: 0 },
      collisionFreeBallPosition: { x: 0, y: 0 },
      movementVector: { x: 0, y: 0 },
      stopOnCollision: false,
      enableMapEditMode: false,
      debugSteps: 0,
      debugHistory: false,
      history: [],
      historyLimit: 100
    },
    audio: { enabled: false },
    appliedEffects: { explosions: [] },
    boardSteps: 0,
    boardOverSteps: 0,
    chainedBallSpeed: 1,
    firingDelay: 0,
    options: {
      defaultChainedBallSpeed: 1,
      magneticBallSpeed: 1,
      launchedBallSpeed: 1,
      insertingBallSpeed: 1,
      defaultFiringDelay: 0,
      backwardsDuration: 0,
      accuracyDuration: 0,
      slowDuration: 0,
      explosionExpansionDuration: 0
    },
    ballsLeft: 0,
    launcher: {
      position: { x: 0, y: 0 },
      color: 'red',
      pointTo: { x: 0, y: 0 },
      launcherSpeed: 1
    },
    bounds: {
      position: { x: 0, y: 0 },
      size: { width: 100, height: 100 }
    },
    paths: [],
    lastFire: 0,
    boards,
    currentBoard: 'test',
    events: {
      dispatchEvent: () => true,
      removeAll: () => {},
      removeEventListener: () => {},
      addEventListener: () => {}
    },
    renderOptions: {
      scale: 1,
      size: { width: 100, height: 100 },
      showControls: false,
      waypoints: {
        enabled: false,
        color: 'black',
        radius: 5
      },
      paths: {
        color: 'black',
        width: 2
      }
    }
  };
};

const createWaypointPath = (): WaypointPath => {
  const startWaypoint = { id: 1, x: 0, y: 0 };
  const endWaypoint = { id: 2, x: 100, y: 0 };
  const startNode: Node<Waypoint> = { value: startWaypoint };
  const endNode: Node<Waypoint> = { value: endWaypoint };
  startNode.next = endNode;
  endNode.previous = startNode;
  return {
    start: startNode,
    end: endNode
  };
};

describe('ballsCollide', () => {
  it('returns true when balls overlap', () => {
    const game = createTestGame(5)
    const ball1: Ball = { position: { x: 0, y: 0 }, color: 'red' }
    const ball2: Ball = { position: { x: 8, y: 0 }, color: 'blue' }
    expect(ballsCollide(game, ball1, ball2)).toBe(true)
  })

  it('returns false when balls do not overlap', () => {
    const game = createTestGame(5)
    const ball1: Ball = { position: { x: 0, y: 0 }, color: 'red' }
    const ball2: Ball = { position: { x: 20, y: 0 }, color: 'blue' }
    expect(ballsCollide(game, ball1, ball2)).toBe(false)
  })

  it('returns true when balls just touch', () => {
    const game = createTestGame(5)
    const ball1: Ball = { position: { x: 0, y: 0 }, color: 'red' }
    const ball2: Ball = { position: { x: 10, y: 0 }, color: 'blue' }
    expect(ballsCollide(game, ball1, ball2)).toBe(true)
  })
})

describe('handleCollisions', () => {
  it('returns no collision when no balls present', () => {
    const game = createTestGame(5)
    const result = handleCollisions(game)
    expect(result.hasCollision).toBe(false)
  })

  it('returns no collision when balls do not overlap', () => {
    const game = createTestGame(5)
    const path = createWaypointPath()
    const chainedBall: ChainedBall = {
      ball: { position: { x: 0, y: 0 }, color: 'red' },
      waypoint: path.start,
      insertion: { position: { x: 0, y: 0 } }
    }
    const chainNode: Node<ChainedBall> = { value: chainedBall }

    game.chains.push({
      path,
      head: chainNode,
      foot: chainNode,
      inserting: 0,
      pauseStepsAfterMatch: undefined
    })

    game.freeBalls.push({
      position: { x: 20, y: 20 },
      color: 'blue',
      velocity: { x: 0, y: 0 }
    })

    const result = handleCollisions(game)
    expect(result.hasCollision).toBe(false)
  })

  it('detects collision between free ball and chain', () => {
    const game = createTestGame(5)
    const path = createWaypointPath()
    const chainedBall: ChainedBall = {
      ball: { position: { x: 0, y: 0 }, color: 'red' },
      waypoint: path.start,
      insertion: { position: { x: 0, y: 0 } }
    }
    const chainNode: Node<ChainedBall> = { value: chainedBall }

    game.chains.push({
      path,
      head: chainNode,
      foot: chainNode,
      inserting: 0,
      pauseStepsAfterMatch: undefined
    })

    game.freeBalls.push({
      position: { x: 8, y: 0 },
      color: 'blue',
      velocity: { x: -1, y: 0 }
    })

    const result = handleCollisions(game)
    expect(result.hasCollision).toBe(true)
    expect(game.freeBalls.length).toBe(0) // Free ball should be consumed
    expect(game.chains[0].inserting).toBe(1)
  })
})

describe('shouldInsertBefore', () => {
  it('returns true when collision point is ahead of chained ball movement', () => {
    const game = createTestGame(5)
    const waypoint: Node<Waypoint> = {
      value: { id: 1, x: 100, y: 0 },
      next: undefined
    }
    const chainedBall: ChainedBall = {
      ball: { position: { x: 0, y: 0 }, color: 'red' },
      waypoint
    }
    const freeBall: FreeBall = {
      position: { x: 10, y: 0 },
      velocity: { x: -1, y: 0 },
      color: 'blue'
    }

    expect(shouldInsertBefore(game, chainedBall, freeBall)).toBe(true)
  })

  it('returns false when collision point is behind chained ball movement', () => {
    const game = createTestGame(5)
    const waypoint: Node<Waypoint> = {
      value: { id: 1, x: 100, y: 0 },
      next: undefined
    }
    const chainedBall: ChainedBall = {
      ball: { position: { x: 10, y: 0 }, color: 'red' },
      waypoint
    }
    const freeBall: FreeBall = {
      position: { x: 0, y: 0 },
      velocity: { x: 1, y: 0 },
      color: 'blue'
    }

    expect(shouldInsertBefore(game, chainedBall, freeBall)).toBe(false)
  })
})

describe('backoffFreeBall', () => {
  it('backs off free ball until no collision', () => {
    const game = createTestGame(5)
    const chainedBall: ChainedBall = {
      ball: { position: { x: 0, y: 0 }, color: 'red' },
      waypoint: { value: { id: 1, x: 100, y: 0 } }
    }
    const chainNode: Node<ChainedBall> = { value: chainedBall }
    const freeBall: FreeBall = {
      position: { x: 8, y: 0 },
      velocity: { x: -1, y: 0 },
      color: 'blue'
    }

    backoffFreeBall({ game, collisionNode: chainNode, freeBall })

    // Should be backed off to at least the collision range (2 * radius = 10)
    expect(freeBall.position.x).toBeGreaterThanOrEqual(10)
  })
})

describe('addNewNode', () => {
  it('adds new node before collision node when appropriate', () => {
    const game = createTestGame(5)
    const path = createWaypointPath()
    const chainedBall: ChainedBall = {
      ball: { position: { x: 10, y: 0 }, color: 'red' },
      waypoint: path.start,
      insertion: { position: { x: 10, y: 0 } }
    }
    const chainNode: Node<ChainedBall> = { value: chainedBall }
    const chain: Chain = {
      path,
      head: chainNode,
      foot: chainNode,
      inserting: 0,
      pauseStepsAfterMatch: undefined
    }
    const freeBall: FreeBall = {
      position: { x: 0, y: 0 },
      velocity: { x: 1, y: 0 },
      color: 'blue'
    }

    const result = addNewNode({ game, chain, collisionNode: chainNode, freeBall })

    expect(result.insertingBefore).toBe(true)
    expect(result.newBall.ball.color).toBe('blue')
    expect(chain.inserting).toBe(0) // Should not modify chain.inserting
  })

  it('adds new node after collision node when appropriate', () => {
    const game = createTestGame(5)
    const path = createWaypointPath()
    const chainedBall: ChainedBall = {
      ball: { position: { x: 0, y: 0 }, color: 'red' },
      waypoint: path.start,
      insertion: { position: { x: 0, y: 0 } }
    }
    const chainNode: Node<ChainedBall> = { value: chainedBall }
    const chain: Chain = {
      path,
      head: chainNode,
      foot: chainNode,
      inserting: 0,
      pauseStepsAfterMatch: undefined
    }
    const freeBall: FreeBall = {
      position: { x: 10, y: 0 },
      velocity: { x: -1, y: 0 },
      color: 'blue'
    }

    const result = addNewNode({ game, chain, collisionNode: chainNode, freeBall })

    expect(result.insertingBefore).toBe(false)
    expect(result.newBall.ball.color).toBe('blue')
    expect(chain.inserting).toBe(0) // Should not modify chain.inserting
  })
}) 