export const TILE_SIZE = 64;

export default class Tile {
  constructor({context, i, j, terrainGradient, initialDelay, tilesContainer}) {
    this.context = context;
    this.i = i;
    this.j = j;
    this.terrainGradient = terrainGradient;
    this.initialDelay = initialDelay;
    this.tilesContainer = tilesContainer;

    this.updateTerrainColor();
  }

  get isCollision() {
    return this.terrainGradient < 0.2 || this.terrainGradient >= 0.75;
  }

  get x() {
    return (this.i - 1) * TILE_SIZE + this.tilesContainer.offsetX;
  }

  get y() {
    return (this.j - 1) * TILE_SIZE + this.tilesContainer.offsetY;
  }

  get topTile() {
    return this.tilesContainer.tiles[this.i][this.j - 1] || null;
  }

  get bottomTile() {
    return this.tilesContainer.tiles[this.i][this.j + 1] || null;
  }

  get leftTile() {
    if (this.i > 0) {
      return this.tilesContainer.tiles[this.i - 1][this.j];
    }

    return null;
  }

  get rightTile() {
    if (this.i < this.tilesContainer.tilesInRow - 1) {
      return this.tilesContainer.tiles[this.i + 1][this.j];
    }

    return null;
  }

  draw(context, time) {
    if (time < this.initialDelay) {
      return true;
    } else if (time < this.initialDelay + 500) {
      const percentage = Math.min((time - this.initialDelay) / 500, 1);
      const opacity = percentage * (2 - percentage); //ease-out-quad
      context.globalAlpha = opacity;

      let offsetY = 0;
      if (this.terrainGradient >= 0.75) {
        offsetY = percentage < 0.75 ? 3 / 4 * percentage : -1 / 4 * percentage + 4;
      }

      context.fillStyle = this.terrainColor;
      context.fillRect(this.x, this.y - offsetY * 10, TILE_SIZE, TILE_SIZE);
      context.globalAlpha = 1;
    } else {
      context.fillStyle = this.terrainColor;
      context.fillRect(this.x, this.y, TILE_SIZE, TILE_SIZE);
      context.globalAlpha = 1;
    }

    return time < this.initialDelay + 500;
  }

  updateTerrainColor() {
    if (this.terrainGradient < 0.05) {
      this.terrainColor = '#425BBD';
    } else if (this.terrainGradient < 0.15) {
      this.terrainColor = '#4884D4';
    } else if (this.terrainGradient < 0.2) {
      this.terrainColor = '#45A1DE';
    } else if (this.terrainGradient < 0.25) {
      this.terrainColor = '#FFE88C';
    } else if (this.terrainGradient < 0.5) {
      this.terrainColor = '#C3D442';
    } else if (this.terrainGradient < 0.6) {
      this.terrainColor = '#82AA28';
    } else if (this.terrainGradient < 0.75) {
      this.terrainColor = '#597F1E';
    } else if (this.terrainGradient < 0.95) {
      this.terrainColor = '#B9B5C3';
    } else {
      this.terrainColor = '#F2F2F0';
    }

    // Redraw
  }

  setPosition(i, j) {
    this.i = i;
    this.j = j;
    // Redraw
  }
}
