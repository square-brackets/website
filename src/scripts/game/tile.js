import spriteConfig from './utils/sprite';
import config from './config';

export const TILE_SIZE = 64;

export default class Tile {
  constructor({terrainGradient, sprite}) {
    this.terrainGradient = terrainGradient;
    this.sprite = sprite;

    this.updateTerrainColor();
  }

  get elevation() {
    if (this.terrainGradient < 0.2) {
      return 0;
    } else if (this.terrainGradient < 0.75) {
      return 1;
    }
    return 2;
  }

  render(context) {
    if (config.useSpriteForTerrain) {
      context.drawImage(
        this.sprite,
        this.spriteConfig.x,
        this.spriteConfig.y,
        spriteConfig.tileSize,
        spriteConfig.tileSize,
        0,
        0,
        TILE_SIZE,
        TILE_SIZE
      );
    } else {
      context.fillStyle = this.terrainColor;
      context.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
    }
  }

  updateTerrainColor() {
    if (this.terrainGradient < 0.05) {
      this.terrainColor = '#425BBD';
      this.spriteConfig = spriteConfig.tiles.water2;
    } else if (this.terrainGradient < 0.15) {
      this.terrainColor = '#4884D4';
      this.spriteConfig = spriteConfig.tiles.water2;
    } else if (this.terrainGradient < 0.2) {
      this.terrainColor = '#45A1DE';
      this.spriteConfig = spriteConfig.tiles.water1;
    } else if (this.terrainGradient < 0.25) {
      this.terrainColor = '#FFE88C';
      this.spriteConfig = spriteConfig.tiles.sand1;
    } else if (this.terrainGradient < 0.5) {
      this.terrainColor = '#C3D442';
      this.spriteConfig = spriteConfig.tiles.grass1;
    } else if (this.terrainGradient < 0.6) {
      this.terrainColor = '#82AA28';
      this.spriteConfig = spriteConfig.tiles.grass1;
    } else if (this.terrainGradient < 0.75) {
      this.terrainColor = '#597F1E';
      this.spriteConfig = spriteConfig.tiles.grass1;
    } else if (this.terrainGradient < 0.95) {
      this.terrainColor = '#82AA28';
      this.spriteConfig = spriteConfig.tiles.grass2;
    } else {
      this.terrainColor = '#597F1E';
      this.spriteConfig = spriteConfig.tiles.grass2;
    }
  }
}
