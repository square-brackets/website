export default class Player {
  constructor(context, x, y) {
    this.context = context;
    this.x = x;
    this.y = y;
  }

  draw() {
    this.context.fillStyle = 'red';
    this.context.fillRect(this.x, this.y, 10, 10);
  }
}
