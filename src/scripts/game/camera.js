export default class CameraControls {
  constructor() {
    this.wheelDeltas = {x: 0, y: 0};
    this.eventHandlers = {};

    this.onWheelBound = this.onWheel.bind(this);

    this.setupEventListener();
  }

  destroy() {
    this.removeEventListener();
  }

  setupEventListener() {
    window.addEventListener('wheel', this.onWheelBound);
  }

  removeEventListener() {
    window.removeEventListener('wheel', this.onWheelBound);
  }

  onWheel(event) {
    if (!this.isWaitingHandler) {
      this.wheelDeltas.x = event.deltaX;
      this.wheelDeltas.y = event.deltaY;

      requestAnimationFrame(() => {
        this.trigger('position:changed', this.wheelDeltas);

        this.wheelDeltas.x = 0;
        this.wheelDeltas.y = 0;
        this.isWaitingHandler = false;
      });

      this.isWaitingHandler = true;
    } else {
      this.wheelDeltas.x += event.deltaX;
      this.wheelDeltas.y += event.deltaY;
    }
  }

  on(eventName, handler) {
    this.eventHandlers[eventName] = this.eventHandlers[eventName] || [];
    this.eventHandlers[eventName].push(handler);
  }

  trigger(eventName, ...args) {
    const handlers = this.eventHandlers[eventName] || [];
    handlers.forEach((handler) => handler(...args));
  }
}
