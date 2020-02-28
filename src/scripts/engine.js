import Triangle, {ORIENTATIONS, NEIGHBORHOOD_POSITION, TRIANGLE_SIZE, TRIANGLE_HEIGHT} from './triangle';
import noise from './noise';

export default class Engine {
  constructor() {
    this.animations = [];
    this.isStopped = true;
  }

  start() {
    if (this.isStopped) {
      this.isStopped = false;

      this.loop();
    }
  }

  stop() {
    this.isStopped = true;
  }

  loop() {
    if (this.isStopped) {
      return;
    }

    this.performAnimations();

    requestAnimationFrame(() => this.loop());
  }

  performAnimations() {
    const time = Date.now();

    this.animations = this.animations.filter(({drawFunction, startTime, duration, delay}) => {
      if (time - startTime < delay) {
        return true;
      }

      const percentage = Math.min((time - (startTime + delay)) / duration, 1);
      drawFunction(percentage);

      return percentage < 1;
    });

    if (this.animations.length === 0) {
      this.stop();
      return;
    }
  }

  animate(drawFunction, {duration, delay}) {
    this.animations.push({
      startTime: Date.now(),
      drawFunction,
      duration,
      delay
    });

    this.start();
  }
}
