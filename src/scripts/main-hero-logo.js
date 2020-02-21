import Game from './game';

const gameTrigger = document.querySelector('.js-game-trigger');

gameTrigger.addEventListener('click', startGame);

let isGameRunning = false;

function startGame() {
  // Prevent multiple game starts
  if (isGameRunning) {
    return;
  }

  const canvas = document.querySelector('#game-canvas');

  // On resize update canvas size

  const game = new Game(canvas);
  game.start();
  window.game = game;
  isGameRunning = true;
}
