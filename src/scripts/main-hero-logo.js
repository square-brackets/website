import Game from './game/game';

const gameTrigger = document.querySelector('.js-game-trigger');

gameTrigger.addEventListener('click', () => {
  const gameWrapper = document.querySelector('.js-game-wrapper');
  const canvas = gameWrapper.querySelector('#game-canvas');

  // On resize update canvas size
  const gameWrapperSize = gameWrapper.getBoundingClientRect();
  canvas.width = gameWrapperSize.width;
  canvas.height = gameWrapperSize.height;

  const gameTriggerSize = gameTrigger.getBoundingClientRect();
  const game = new Game(canvas, {
    offsetX: gameTriggerSize.x,
    offsetY: gameTriggerSize.y
  });

  game.start();

  window.game = game;

  const heroContentElement = document.querySelector('.js-main-hero-section-content');
  heroContentElement.addEventListener('transitionend', () => {
    heroContentElement.remove();
  }, {once: true});

  heroContentElement.classList.add('is-hidden');
}, {once: true});

// game.showTrigger();
