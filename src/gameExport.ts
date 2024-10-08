import { Node } from "./types";
import { buildBoards } from "./boards";
import { fromArray, iterateToTail, reduceList } from "./linkedList";
import { Chain, ChainedBall, Game, Waypoint, WaypointPath } from "./types";

interface ExportedBall extends Omit<ChainedBall, 'waypoint'> {
  waypoint: {
    id: number,
  } | undefined;
}

interface ExportedChain extends Omit<Chain, 'head' | 'foot'> {
  exportedBalls: ExportedBall[],
}

interface ExportedGame extends Omit<Game, 'chains' | 'paths' | 'boards'> {
  chains: ExportedChain[],
  paths: Waypoint[][],
}

export const gameExport = (game: Game) => {
  const gameDupe: any = {...game};
  delete gameDupe.boards;
  delete gameDupe.events;
  gameDupe.debug = {
    ...game.debug,
  }
  // clear the history b/c it might be large
  gameDupe.debug.history = [];

  const {chains, paths} = game;

  const exportedGame: ExportedGame = {
    ...gameDupe,
    chains: chains.map(chain => {
      return {
        inserting: chain.inserting,
        pauseStepsAfterMatch: chain.pauseStepsAfterMatch,
        exportedBalls: Array.from(iterateToTail(chain.head)).map(node => ({
          ...node.value,
          waypoint: node.value.waypoint ? {
            id: node.value.waypoint.value.id
          } : undefined,
        }))
      }
    }),
    paths: paths.map((path) => 
      Array.from(iterateToTail(path.start)).map(node => node.value)),
  }

  return JSON.stringify(exportedGame);
}

export const gameImport = (json: string): Game => {
  const exportedGame: ExportedGame = JSON.parse(json);

  const exportedPathLists = exportedGame.paths.map(path => fromArray(path));
  const paths = exportedPathLists.map(({head: start, tail: end}): WaypointPath => {
    if(! start) throw 'gameImport requires start';
    if(! end) throw 'gameImport requires end';
    return {
      start,
      end,
    }
  });
  const game: Game = {
    ...exportedGame,
    boards: buildBoards(exportedGame.bounds),
    paths,
    chains: exportedGame.chains.map((chain, index): Chain => {
      const pathLookup = reduceList(paths[index].start, (memo, node) => {
        memo[node.value.id] = node;
        return memo;
      }, {} as Record<number, Node<Waypoint>>);

      const chainDupe: any = {...chain};
      delete chainDupe.exportedBalls;

      const chainedBalls = chain.exportedBalls.map((exportedBall): ChainedBall => {
        return {
          ...exportedBall,
          waypoint: exportedBall.waypoint ? 
            pathLookup[exportedBall.waypoint.id] :
            undefined,
        };
      })

      const {head, tail} = fromArray(chainedBalls);

      return {
        ...chainDupe,
        head,
        foot: tail,
        path: paths[index],
      }
    }),
  }
  return game;
}