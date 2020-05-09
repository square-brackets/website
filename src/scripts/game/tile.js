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

    this.hasReward = Math.random() < 0.01;
  }

  get elevation() {
    if (this.terrainGradient < 0.2) {
      return 0;
    } else if (this.terrainGradient < 0.75) {
      return 1;
    }
    return 2;
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

  draw(context) {
    // context.drawImage(myImage, 0, 0, 16, 16, this.x, this.y, 16, 16);

    if (this.bottomTile && this.bottomTile.elevation === 1 && this.elevation === 2 && this.topTile && this.topTile.elevation === 2) {
      context.fillStyle = 'saddlebrown';
    } else {
      context.fillStyle = this.terrainColor;
    }

    context.fillRect(this.x, this.y, TILE_SIZE, TILE_SIZE);

    if (this.leftTile && this.leftTile.elevation === 1 && this.elevation === 2) {
      context.fillStyle = 'saddlebrown';
      context.fillRect(this.x, this.y, 5, TILE_SIZE);
    }

    if (this.rightTile && this.rightTile.elevation === 1 && this.elevation === 2) {
      context.fillStyle = 'saddlebrown';
      context.fillRect(this.x + TILE_SIZE - 5, this.y, 5, TILE_SIZE);
    }

    if (this.hasReward) {
      context.fillStyle = 'yellow';
      context.fillRect(this.x + TILE_SIZE / 2 - 5, this.y + TILE_SIZE / 2 - 5, 10, 10);
    }
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
      // this.terrainColor = '#B9B5C3';
      this.terrainColor = '#82AA28';
    } else {
      // this.terrainColor = '#F2F2F0';
      this.terrainColor = '#597F1E';
    }
  }

  setPosition(i, j) {
    this.i = i;
    this.j = j;
  }
}
