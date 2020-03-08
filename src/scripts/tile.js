export const TILE_SIZE = 32;

export default class Tile {
  constructor({context, x, y, terrainGradient, initialDelay}) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.terrainGradient = terrainGradient;
    this.initialDelay = initialDelay;

    this.updateTerrainColor();
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
    // } else if (this.terrainGradient < 0.8) {
    //   this.terrainColor = 'rgb(0, 100, 0)';
    } else if (this.terrainGradient < 0.85) {
      this.terrainColor = '#76747D';
    } else if (this.terrainGradient < 0.95) {
      this.terrainColor = '#B9B5C3';
    } else {
      this.terrainColor = '#F2F2F0';
    }
  }

  draw(time) {
    if (time < this.initialDelay) {
      return true;
    } else if (time < this.initialDelay + 500) {
      const percentage = Math.min((time - this.initialDelay) / 500, 1);
      const opacity = percentage * (2 - percentage); //ease-out-quad
      this.context.globalAlpha = opacity;
    }

    this.context.fillStyle = this.terrainColor;
    this.context.fillRect(this.x, this.y, TILE_SIZE, TILE_SIZE);
    this.context.globalAlpha = 1;

    return time < this.initialDelay + 500;
  }
}
