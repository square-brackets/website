import Game from './game';

const gameTrigger = document.querySelector('.js-game-trigger');
const gameWrapper = document.querySelector('.js-game-wrapper');
const canvas = gameWrapper.querySelector('#game-canvas');


const gameWrapperSize = gameWrapper.getBoundingClientRect();

// update canvas size
canvas.width = gameWrapperSize.width;
canvas.height = gameWrapperSize.height;

// On resize update canvas size

const gameTriggerSize = gameTrigger.getBoundingClientRect();
const game = new Game(canvas, {
  offsetX: gameTriggerSize.x,
  offsetY: gameTriggerSize.y
});

gameTrigger.addEventListener('click', () => game.start(), {once: true});
game.showTrigger();
