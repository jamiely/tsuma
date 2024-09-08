import './style.css'
import { renderGame } from './renderer.ts'
import { createGame, step } from './game.ts'
import { createInterface } from './interface.ts'
import { Game } from './types.ts';

function run() {
  const params = new URLSearchParams(window.location.search);
  const game = createGame({
    debug: {
      enabled: Boolean(params.get('debug')),
    },
    currentBoard: params.get('board') as Game['currentBoard'] || "archimedes",
  });

  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <div>
      <canvas 
        id="game" 
        width="${game.bounds.position.x + game.bounds.size.width}" 
        height="${game.bounds.position.y + game.bounds.size.height}" />
    </div>
  `

  document.getElementById('pause')?.addEventListener('click', () => {
    game.debug.stop = !Boolean(game.debug.stop);
  });
  const elementDebug = document.getElementById('debug');
  elementDebug?.addEventListener('click', () => {
    game.debug.enabled = !Boolean(game.debug.enabled);
    elementDebug.innerHTML = game.debug.enabled ? 'Debug ✅' : 'Debug ❌';
  });

  document.getElementById('step')?.addEventListener('click', () => {
    game.debug.debugSteps++;
  });

  const canvas = document.getElementById('game')! as HTMLCanvasElement;

  createInterface(game)(canvas);

  function render() {
    requestAnimationFrame(() => {
      step(game);
      renderGame(canvas)(game)

      render();
    })
  }

  render();
}

run();