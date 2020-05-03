import Tile, {TILE_SIZE} from './tile';
import noise from './noise';

const NOISE_SCALE_FACTOR = 0.06;
const NOISE_OFFSET = Math.random() * 10;

export default class TilesContainer {
  constructor({width, height, offsetX, offsetY, triggerCenterX, triggerCenterY, renderer}) {
    this.width = width;
    this.height = height;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.triggerCenterX = triggerCenterX;
    this.triggerCenterY = triggerCenterY;
    this.renderer = renderer;

    this.tiles = [];
    this.initialAnimationDelays = [];

    this.tilesInRow = Math.floor((width + offsetX) / TILE_SIZE) + 2;
    this.tilesInColumn = Math.floor((height + offsetY) / TILE_SIZE) + 2;

    this.mapOffsetX = 0;
    this.mapOffsetY = 0;
  }

  generateTiles() {
    const {i: triggerI, j: triggerJ} = this.getPositionFromCoordinates(this.triggerCenterX, this.triggerCenterY);

    for (var i = 0; i < this.tilesInRow; i++) {
      this.tiles[i] = [];
      this.initialAnimationDelays[i] = [];

      for (var j = 0; j < this.tilesInColumn; j++) {
        const dx = triggerI - i;
        const dy = triggerJ - j;
        const distanceToTrigger = Math.sqrt(Math.abs(dx) * Math.abs(dx) + Math.abs(dy) * Math.abs(dy));
        const delay = distanceToTrigger * 50 + Math.random() * 150;
        this.initialAnimationDelays[i][j] = delay;

        const tile = new Tile({
          i, j,
          context: this.context,
          terrainGradient: this.getNoiseForCoordinates(i, j),
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

  getPositionFromCoordinates(x, y) {
    const normalizedX = x + this.offsetX;
    const normalizedY = y + this.offsetY;

    const i = Math.floor(normalizedX / TILE_SIZE);
    const j = Math.floor(normalizedY / TILE_SIZE);
    return {i, j};
  }

  getTileForCoordinates(x, y) {
    const {i, j} = this.getPositionFromCoordinates(x, y);

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

  animateTiles(context, startTime = Date.now()) {
    let shouldRedraw = false;

    return this.renderer.schedule((time) => {
      context.clearRect(0, 0, this.width, this.height);

      this.tiles.forEach((tileColumn, i) => {
        tileColumn.forEach((tile, j) => {
          const delay = this.initialAnimationDelays[i][j];
          const percentage = Math.max(Math.min((time - startTime - delay) / 500, 1), 0);
          const opacity = percentage * (2 - percentage); // ease-out-quad
          context.globalAlpha = opacity;

          tile.draw(context);

          shouldRedraw = shouldRedraw || percentage < 1;
        });
      });

      context.globalAlpha = 1;
    }).then(() => {
      if (shouldRedraw) {
        return this.animateTiles(context, startTime);
      }
    });
  }

  redrawTiles(context) {
    this.renderer.schedule(() => {
      this.tiles.forEach((tileColumn) => {
        tileColumn.forEach((tile) => {
          tile.draw(context);
        });
      });
    });
  }
}
