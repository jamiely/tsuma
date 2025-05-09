import 'github-fork-ribbon-css/gh-fork-ribbon.css'
import './style.css'

import './vendor/riffwave'
import './vendor/sfxr'

import { RenderOptions, renderGame } from './renderer.ts'
import { createGame, rewindHistory, setupNextGame, step } from './game.ts'
import { createInterface } from './interface.ts'
import { AppConfig, Game } from './types.ts';
import { gameExport, gameImport } from './gameExport.ts'

const renderOptions: RenderOptions = {
  scale: getRenderingScale(),
  size: { width: window.innerWidth, height: window.innerHeight },
  showControls: window.location.search.includes('controls'),
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

function getRenderingScale() {
  return Math.max(Math.min(window.innerWidth / 1000, window.innerHeight / 600), 0.1);
}

window.addEventListener('resize', () => {
  renderOptions.scale = getRenderingScale();
  renderOptions.size = { width: window.innerWidth, height: window.innerHeight };
  const canvas = document.getElementById('game') as HTMLCanvasElement;
  if(!canvas) {
    return;
  }
  canvas.width = renderOptions.size.width;
  canvas.height = renderOptions.size.height;
});

const gameRef: {game: Game} = {game: {} as any};

function run() {
  const params = new URLSearchParams(window.location.search);
  const appConfig: AppConfig = {
    stepsPerFrame: 2
  }

  gameRef.game = createGame({
    debug: {
      enabled: Boolean(params.get('debug')),
    },
    currentBoard: params.get('board') as Game['currentBoard'] || "board11",
    renderOptions,
  });

  gameRef.game.debug.enableMapEditMode = params.get('mapEditMode') !== null;


  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <div>
      <canvas 
        id="game" 
        width="${renderOptions.size.width}" 
        height="${renderOptions.size.height}" />
    </div>
  `

  function toggler({id, labelTrue, labelFalse, get, set}: {get: () => boolean, set: (_: boolean) => void, labelTrue: string, labelFalse: string, id: string}) {
    const element = document.getElementById(id);
    if(! element) return;

    const updateLabel = () => element.innerHTML = get() ? labelTrue : labelFalse;

    element.addEventListener('click', () => {
      set(!Boolean(get()));
      updateLabel();
    });

    set(get());
    updateLabel();    
  }

  if(renderOptions.showControls) {
    const controls = document.getElementById('controls');
    if(controls) {
      controls.style.display = '';
    }
  }

  if(window.location.search.includes('simple')) {
    const banner = document.querySelector('.github-fork-ribbon');
    if(banner instanceof HTMLElement) {
      banner.style.display = 'none';
    }
    gameRef.game.audio.enabled = false;
  }

  toggler({
    id: 'pause',
    labelTrue: 'Paused',
    labelFalse: 'Pause',
    get: () => gameRef.game.debug.stop || false,
    set: (value) => gameRef.game.debug.stop = value,
  })
  
  toggler({
    id: 'debug',
    labelTrue: 'Debug on',
    labelFalse: 'Debug off',
    get: () => gameRef.game.debug.enabled || false,
    set: (value) => gameRef.game.debug.enabled = value,
  })

  toggler({
    id: 'debugHistory',
    labelTrue: 'Debug history on',
    labelFalse: 'Debug history off',
    get: () => gameRef.game.debug.debugHistory,
    set: (value) => gameRef.game.debug.debugHistory = value,
  })
  
  let cursorEnabled = true;
  toggler({
    id: 'cursor',
    labelTrue: 'Cursor on',
    labelFalse: 'Cursor off',
    get: () => cursorEnabled,
    set: (value) => {
      cursorEnabled = value
      const el = document.getElementById('game');
      if(!el) return;
      el.style.cursor = value ? 'pointer' : 'none';
    },
  })

  document.getElementById('step')?.addEventListener('click', () => {
    gameRef.game.debug.debugSteps++;
  });
  
  document.getElementById('rewind')?.addEventListener('click', () => {
    gameRef.game = rewindHistory(gameRef.game);
  });

  document.getElementById('import')?.addEventListener('click', () => {
    const importedGame = gameImport((document.getElementById('gameJSON') as HTMLTextAreaElement)?.value);
    gameRef.game = setupNextGame(gameRef.game, importedGame);
  })

  document.getElementById('export')?.addEventListener('click', () => {
    const text = gameExport(gameRef.game);
    navigator.clipboard.writeText(text);

    console.log(Notification.permission)

    if (Notification.permission === 'granted') {
      showNotification();
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          showNotification();
        }
      });
    }

    function showNotification() {
      const notification = new Notification('Exported!', {
        body: 'Exported game JSON to clipboard',
      });
    
      notification.onclick = function() {
        window.focus();
        notification.close(); // Close the notification on click
      };
    }
  })

  const canvas = document.getElementById('game')! as HTMLCanvasElement;

  createInterface(gameRef)(canvas);

  const updatesPerMilliseconds = appConfig.stepsPerFrame/15;
  
  let lastTime: number = new Date().getTime();
  function render() {
    requestAnimationFrame(() => {
      const now = new Date().getTime();
      const elapsed = now - lastTime;
      const stepCount = Math.min(appConfig.stepsPerFrame, Math.floor(updatesPerMilliseconds * elapsed));
      for(let i=0; i<stepCount; i++) {
        step(gameRef.game);
      }
      lastTime = now;
      
      renderGame(canvas)(gameRef.game, renderOptions)
      render();
    })
  }

  render();

  mapEditMode(gameRef.game);
}

declare global {
  interface Window {
    __MAP_POINTS__: {x: number, y: number}[];
  }
}

function mapEditMode(game: Game) {
  if(!game.debug.enableMapEditMode) return;

  const points: any[] = [];
  const canvas = document.getElementById('game')! as HTMLCanvasElement;
  canvas.addEventListener('click', (event) => {
    const lastPoint = {x: event.offsetX, y: event.offsetY};
    console.log('lastPoint', lastPoint);
    points.push(lastPoint);
  });
  window.__MAP_POINTS__ = points;
  console.log('all points', points);
}

run();
