export default class Player {
  constructor(context, {tile}) {
    this.context = context;
    this.tile = tile;
  }

  draw() {
    const {x, y} = this.tile;
    this.context.fillStyle = 'red';
    this.context.fillRect(x + 8, y + 8, 48, 48);
  }

  moveToTile(tile) {
    this.tile.shouldRedraw = true;
    this.tile = tile;
    this.tile.shouldRedraw = true;
    this.shouldRedraw = true;
  }
}
