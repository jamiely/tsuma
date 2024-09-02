import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'
import { renderGame } from './renderer.ts'
import { createGame, step } from './game.ts'
import { createInterface } from './interface.ts'

const game = createGame();

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <canvas id="game" width="${game.bounds.size.width}" height="${game.bounds.size.height}" />
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

const canvas = document.getElementById('game')! as HTMLCanvasElement;

function run() {
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