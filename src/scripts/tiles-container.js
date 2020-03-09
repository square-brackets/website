import Tile, {TILE_SIZE} from './tile';
import noise from './noise';

const NOISE_SCALE_FACTOR = 0.07;
const NOISE_OFFSET = Math.random();

export default class TilesContainer {
  constructor({width, height, offsetX, offsetY}) {
    this.width = width;
    this.height = height;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.tiles = [];

    this.tilesInRow = Math.floor((width + offsetX) / TILE_SIZE) + 2;
    this.tilesInColumn = Math.floor((height + offsetY) / TILE_SIZE) + 2;

    this.mapOffsetX = 0;
    this.mapOffsetY = 0;
  }

  generateTiles() {
    for (var i = 0; i < this.tilesInRow; i++) {
      this.tiles[i] = [];

      for (var j = 0; j < this.tilesInColumn; j++) {
        // const dx = this.originalOffsetX - x;
        // const dy = this.originalOffsetY - y;
        // const distanceToTrigger = Math.sqrt(Math.abs(dx) * Math.abs(dx) + Math.abs(dy) * Math.abs(dy));
        // const delay = distanceToTrigger + Math.random() * 150;

        const tile = new Tile({
          i, j,
          context: this.context,
          terrainGradient: this.getNoiseForCoordinates(i, j),
          // initialDelay: delay
          tilesContainer: this
        });

        this.tiles[i][j] = tile;
      }
    }
  }

  getNoiseForCoordinates(x, y) {
    // Generates noise value between -1 and 1;
    const terrainGradient = noise(x * NOISE_SCALE_FACTOR + NOISE_OFFSET, y * NOISE_SCALE_FACTOR + NOISE_OFFSET);
    // Normalize values between 0 and 1
    return (terrainGradient + 1) / 2;
  }

  getTileForCoordinates(x, y) {
    const normalizedX = x + this.offsetX;
    const normalizedY = y + this.offsetY;

    const i = Math.floor(normalizedX / TILE_SIZE);
    const j = Math.floor(normalizedY / TILE_SIZE);

    return this.tiles[i][j];
  }

  offsetTiles(dx, dy) {
    this.mapOffsetX += dx;
    this.mapOffsetY += dy;

    const tilesToUpdateTexture = [];

    if (dx === 1) {
      const firstColumn = this.tiles.shift();
      this.tiles.push(firstColumn); // Move first column to the end
      tilesToUpdateTexture.push(...firstColumn);
    } else if (dx === -1) {
      const lastColumn = this.tiles.pop();
      this.tiles.unshift(lastColumn); // Move last column to the start
      tilesToUpdateTexture.push(...lastColumn);
    }

    if (dy === 1) {
      this.tiles.forEach((tiles) => {
        const firstTile = tiles.shift();
        tiles.push(firstTile); // Move first row to the end

        tilesToUpdateTexture.push(firstTile);
      });
    } else if (dy === -1) {
      this.tiles.forEach((tiles) => {
        const lastTile = tiles.pop();
        tiles.unshift(lastTile); // Move last row to the start

        tilesToUpdateTexture.push(lastTile);
      });
    }

    this.updateTilePositions();
    this.updateGradientOnTiles(tilesToUpdateTexture);
  }

  updateGradientOnTiles(tiles) {
    tiles.forEach((tile) => {
      tile.terrainGradient = this.getNoiseForCoordinates(tile.i + this.mapOffsetX, tile.j + this.mapOffsetY);
      tile.updateTerrainColor();
    });
  }

  updateTilePositions() {
    for (var i = 0; i < this.tilesInRow; i++) {
      for (var j = 0; j < this.tilesInColumn; j++) {
        this.tiles[i][j].setPosition(i, j);
      }
    }
  }
}
