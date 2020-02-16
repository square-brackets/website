import Game from './game';

const gameTrigger = document.querySelector('.js-game-trigger');

gameTrigger.addEventListener('click', startGame);

let isGameRunning = false;

function startGame() {
  // Prevent multiple game starts
  if (isGameRunning) {
    return;
  }

  const gameWrapper = document.querySelector('.js-game-wrapper');
  const canvas = gameWrapper.querySelector('#game-canvas');

  const gameWrapperSize = gameWrapper.getBoundingClientRect();

  // update canvas size
  canvas.width = gameWrapperSize.width;
  canvas.height = gameWrapperSize.height;

  // On resize update canvas size

  const game = new Game(canvas);
  window.game = game;
  isGameRunning = true;
}
