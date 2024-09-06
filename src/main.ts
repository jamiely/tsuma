import './style.css'
import { renderGame } from './renderer.ts'
import { createGame, step } from './game.ts'
import { createInterface } from './interface.ts'

function run() {
  const game = createGame();

  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <div>
      <canvas 
        id="game" 
        width="${game.bounds.position.x + game.bounds.size.width}" 
        height="${game.bounds.position.y + game.bounds.size.height}" />
    </div>
  `

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