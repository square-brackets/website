export default class Renderer {
  constructor() {
    this.scheduledCallbacks = [];
  }

  schedule(callback) {
    this.scheduledCallbacks.push(callback);

    // If we added first callback start run loop
    if (this.scheduledCallbacks.length === 1) {
      return this.loop();
    }

    return this.redrawPromise;
  }

  loop() {
    this.redrawPromise = new Promise((resolve) => {
      requestAnimationFrame(() => {
        const time = Date.now();
        const callbacks = [...this.scheduledCallbacks];
        this.scheduledCallbacks = [];

        callbacks.forEach((callback) => callback(time));

        resolve(time);
      });
    });

    return this.redrawPromise;
  }
}
