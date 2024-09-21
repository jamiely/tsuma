import './style.css'
import { RenderOptions, renderGame } from './renderer.ts'
import { createGame, step } from './game.ts'
import { createInterface } from './interface.ts'
import { AppConfig, Game } from './types.ts';

const renderOptions: RenderOptions = {
  waypoints: {
    enabled: false,
    color: "lightgray",
    radius: 10,
  },
  paths: {
    color: "lightgray",
    width: 10,
  }
}

function run() {
  const params = new URLSearchParams(window.location.search);
  const appConfig: AppConfig = {
    stepsPerFrame: 2
  }

  const game = createGame({
    debug: {
      enabled: Boolean(params.get('debug')),
    },
    currentBoard: params.get('board') as Game['currentBoard'] || "board11",
  });

  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <div>
      <canvas 
        id="game" 
        width="${game.bounds.position.x + game.bounds.size.width}" 
        height="${game.bounds.position.y + game.bounds.size.height}" />
    </div>
  `

  function toggler({id, labelTrue, labelFalse, get, set}: {get: () => Boolean | undefined, set: (_: boolean) => void, labelTrue: string, labelFalse: string, id: string}) {
    const element = document.getElementById(id);
    if(! element) return;

    const updateLabel = () => element.innerHTML = get() ? labelTrue : labelFalse;

    element.addEventListener('click', () => {
      set(!Boolean(get()));
      updateLabel();
    });

    updateLabel();    
  }

  toggler({
    id: 'pause',
    labelTrue: 'Paused',
    labelFalse: 'Pause',
    get: () => game.debug.stop,
    set: (value) => game.debug.stop = value,
  })
  
  toggler({
    id: 'debug',
    labelTrue: 'Debug on',
    labelFalse: 'Debug off',
    get: () => game.debug.enabled,
    set: (value) => game.debug.enabled = value,
  })

  document.getElementById('step')?.addEventListener('click', () => {
    game.debug.debugSteps++;
  });

  const canvas = document.getElementById('game')! as HTMLCanvasElement;

  createInterface(game)(canvas);

  function render() {
    requestAnimationFrame(() => {
      for(let i=0; i<appConfig.stepsPerFrame; i++) {
        step(game);
      }
      
      renderGame(canvas)(game, renderOptions)

      render();
    })
  }

  render();
}

run();