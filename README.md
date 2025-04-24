# Tsuma

A modern TypeScript implementation of a ball-matching puzzle game inspired by classics like Zuma and Puzzle Bobble.

**[Play the demo here](https://jamiely.github.io/tsuma/)**

## Game Description

In Tsuma, players control a launcher that fires colored balls at a moving chain of balls. The goal is to match three or more balls of the same color to make them disappear. The game features:

- Multiple intricate levels with unique path patterns
- Smooth ball movement and collision detection
- Color matching mechanics
- Special effects and power-ups including:
  - Accuracy mode
  - Slow motion
  - Backwards movement
  - Explosions

## Technical Features

- Written in TypeScript for type safety and better development experience
- Modern game architecture with clean separation of concerns
- Smooth animations and physics
- Event-driven system for game state management
- Configurable rendering options
- Debug mode for development
- Comprehensive test coverage

## Project Structure

- `/src` - Source code
  - `/boards` - Level definitions and board layouts
  - `/collision` - Collision detection and handling
  - `/movement` - Ball and chain movement logic
  - `/types` - TypeScript type definitions
  - `/util` - Utility functions
  - `game.ts` - Core game logic
  - `renderer.ts` - Game rendering

## Getting Started

### Prerequisites

- Node.js (latest LTS version recommended)
- pnpm (package manager)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jamiely/tsuma
cd tsuma
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

## Development

### Running Tests

```bash
pnpm test
```

### Debug Mode

The game includes a debug mode that can be enabled to help with development:

```typescript
game.debug = {
  enabled: true,
  stop: false,
  collisionPoint: { x: 0, y: 0 },
  enableMapEditMode: false,
  debugSteps: 0,
  debugHistory: false
};
```
