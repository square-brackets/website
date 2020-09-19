import Game from './game/game';

const gameTrigger = document.querySelector('.js-game-trigger');

if (gameTrigger) {
  gameTrigger.addEventListener('click', () => {
    const gameTriggerSize = gameTrigger.getBoundingClientRect();

    const triggerWidth = gameTrigger.offsetWidth;
    const triggerHeight = gameTrigger.offsetHeight;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const horizontalScaling = windowWidth / triggerWidth;
    const verticalScaling = windowHeight / triggerHeight;
    const verticalTranslation = windowHeight / 2 - (gameTriggerSize.top + triggerHeight / 2);

    gameTrigger.style.setProperty('--horizontal-scaling', horizontalScaling);
    gameTrigger.style.setProperty('--vertical-scaling', verticalScaling);
    gameTrigger.style.setProperty('--vertical-translation', `${verticalTranslation / verticalScaling}px`);

    document.body.classList.add('is-game-running');

    gameTrigger.addEventListener('animationend', () => {
      const canvas = document.querySelector('.js-game-canvas');

      canvas.width = windowWidth;
      canvas.height = windowHeight;

      canvas.classList.add('is-visible');

      const game = new Game(canvas);

      game.start();

      window.game = game;
    }, {once: true});
  }, {once: true});
}
