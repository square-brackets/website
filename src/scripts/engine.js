import Triangle, {ORIENTATIONS, NEIGHBORHOOD_POSITION, TRIANGLE_SIZE, TRIANGLE_HEIGHT} from './triangle';
import noise from './noise';

export default class Engine {
  constructor(options) {
    this.drawableObjects = [];
    this.isStopped = true;
    this.options = options;
  }

  start() {
    this.startTime = Date.now();

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

    this.time = Date.now() - this.startTime;

    if (this.options && this.options.beforeLoop) {
      this.options.beforeLoop();
    }

    this.performDrawing();

    requestAnimationFrame(() => this.loop());
  }

  performDrawing() {
    this.drawableObjects.forEach((drawable) => drawable.draw(this.time));
  }

  addDrawableObject(drawable) {
    this.drawableObjects.push(drawable);
  }
}
