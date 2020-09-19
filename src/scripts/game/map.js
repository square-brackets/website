import {TILE_SIZE} from './tile';

const HALF_TILE = TILE_SIZE / 2;

export default class Map {
  constructor({width, height, tilesContainer}) {
    this.width = width;
    this.height = height;

    this.tilesContainer = tilesContainer;

    this.centerX = 0;
    this.centerY = 0;

    this.tilesInRow = Math.ceil(width / TILE_SIZE) + 1;
    this.tilesInColumn = Math.ceil(height / TILE_SIZE) + 1;
  }

  resize(width, height) {
    this.width = width;
    this.height = height;

    this.tilesInRow = Math.ceil(width / TILE_SIZE) + 1;
    this.tilesInColumn = Math.ceil(height / TILE_SIZE) + 1;
    // TODO: redraw
  }

  getVisibleTiles() {
    const {i: centerI, j: centerJ} = this.transformPixelsToCoordinates(this.centerX, this.centerY);

    const tilesAboveCenter = Math.ceil(this.height / 2 / TILE_SIZE);
    const tilesSideCenter = Math.ceil(this.width / 2 / TILE_SIZE);

    const visibleTiles = [];
    for (let i = centerI - tilesSideCenter; i <= centerI + tilesSideCenter; i++) {
      for (let j = centerJ - tilesAboveCenter; j <= centerJ + tilesAboveCenter; j++) {
        const tile = this.tilesContainer.getOrCreateTile(i, j);
        visibleTiles.push(tile);
      }
    }

    return visibleTiles;
  }

  transformPixelsToCoordinates(x, y) {
    return {
      i: Math.floor((-x + HALF_TILE) / TILE_SIZE),
      j: Math.floor((y + HALF_TILE) / TILE_SIZE)
    }
  }

  async render(context) {
    // Rounding to prevent subpixel rendering
    const horizontalOffset = Math.round(this.width / 2);
    const verticalOffset = Math.round(this.height / 2);

    context.save();

    const chunks = this.tilesContainer.getVisibleChunksInRect(
      -this.centerX - this.width / 2,
      -this.centerY - this.height / 2,
      this.width,
      this.height
    );

    context.translate(horizontalOffset + this.centerX, verticalOffset + this.centerY);
    for (let i = 0; i < chunks.length; i++) {
      this.tilesContainer.renderChunk(chunks[i], context);
    }

    // DEBUG
    context.fillStyle = 'red';
    context.fillRect(-10, -10, 20, 20);
    context.restore();

    context.fillStyle = 'blue';
    context.fillRect(this.width / 2 - 5, this.height / 2 - 5, 10, 10);
  }
}
