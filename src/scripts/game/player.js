export default class Player {
  constructor({tile}) {
    this.tile = tile;
  }

  draw(context) {
    const {x, y} = this.tile;
    context.fillStyle = 'red';
    context.fillRect(x + 8, y + 8, 48, 48);
  }

  moveToTile(tile) {
    this.tile.shouldRedraw = true;
    this.tile = tile;
    this.tile.shouldRedraw = true;
    this.shouldRedraw = true;
  }
}
