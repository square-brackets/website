import Game from './game';

window.addEventListener('DOMContentLoaded', () => {
  const gameTrigger = document.querySelector('.js-game-trigger');
  const gameWrapper = document.querySelector('.js-game-wrapper');
  const canvas = gameWrapper.querySelector('#game-canvas');

  const gameWrapperSize = gameWrapper.getBoundingClientRect();
  canvas.width = gameWrapperSize.width;
  canvas.height = gameWrapperSize.height;

  // On resize update canvas size

  const gameTriggerSize = gameTrigger.getBoundingClientRect();
  const game = new Game(canvas, {
    offsetX: gameTriggerSize.x,
    offsetY: gameTriggerSize.y
  });

  gameTrigger.addEventListener('click', () => {
    game.start();

    const heroContentElement = document.querySelector('.js-main-hero-section-content');
    heroContentElement.addEventListener('transitionend', () => {
      heroContentElement.remove();
    }, {once: true});

    heroContentElement.classList.add('is-hidden');
  }, {once: true});

  // game.showTrigger();
  window.game = game;
}, {once: true});
