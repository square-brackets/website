import Game from './game';

const gameTrigger = document.querySelector('.js-game-trigger');

gameTrigger.addEventListener('click', startGame, {once: true});

function startGame(ev) {
  // Prevent multiple game starts
  const gameWrapper = document.querySelector('.js-game-wrapper');
  const canvas = gameWrapper.querySelector('#game-canvas');

  const gameWrapperSize = gameWrapper.getBoundingClientRect();
  const gameTriggerSize = gameTrigger.getBoundingClientRect();

  // update canvas size
  canvas.width = gameWrapperSize.width;
  canvas.height = gameWrapperSize.height;

  // On resize update canvas size

  const game = new Game(canvas, {
    offsetX: gameTriggerSize.x,
    offsetY: gameTriggerSize.y
  });

  game.start();
}
