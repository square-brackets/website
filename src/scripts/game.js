// Transition functions: https://gist.github.com/gre/1650294

import Tile, {TILE_SIZE} from './tile';
import noise from './noise';
import Player from './player';

export default class Game {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.tiles = [];
    this.terrainOffset = Math.random();

    this.originalOffsetX = Math.round(options.offsetX);
    this.originalOffsetY = Math.round(options.offsetY);
    this.offsetX = this.originalOffsetX % TILE_SIZE;
    this.offsetY = this.originalOffsetY % TILE_SIZE;

    this.mapOffsetX = 0;
    this.mapOffsetY = 0;

    this.tilesInRow = Math.floor((this.canvas.width + this.offsetX) / TILE_SIZE) + 2;
    this.tilesInColumn = Math.floor((this.canvas.height + this.offsetY) / TILE_SIZE) + 2;

    this.generateTiles();
  }

  start() {
    this.startTime = Date.now();
    this.player = new Player(this.context, this.originalOffsetX, this.originalOffsetY);

    this.addControls();
    this.scheduleRedraw();
  }

  clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  showTrigger() {
    // TODO: mousemove

    const triggerTriangle = new Tile({
      context: this.context,
      x: this.originalOffsetX,
      y: this.originalOffsetY
    });

    triggerTriangle.draw();
  }

  addControls() {
    document.addEventListener('keydown', (event) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          this.player.y -= TILE_SIZE;
          break;
        case 'ArrowDown':
        case 'KeyS':
          this.player.y += TILE_SIZE;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          this.player.x -= TILE_SIZE;
          break;
        case 'ArrowRight':
        case 'KeyD':
          this.player.x += TILE_SIZE;
          break;
        default:
          console.log(`${event.code} is not supported key`);
          // ignore other codes
          break;
      }

      this.updateMapPosition();
      this.scheduleRedraw();
    });
  }

  updateMapPosition() {
    const PADDING = 3 * TILE_SIZE;
    const {x: playerX, y: playerY} = this.player;
    let dx = 0;
    let dy = 0;
    if (playerX < PADDING) {
      dx = TILE_SIZE;
    } else if (playerX > this.canvas.width - PADDING) {
      dx = -TILE_SIZE;
    }

    if (playerY < PADDING) {
      dy = TILE_SIZE;
    } else if (playerY > this.canvas.height - PADDING) {
      dy = -TILE_SIZE;
    }

    if (dx || dy) {
      this.mapOffsetX += dx;
      this.mapOffsetY += dy;

      this.tiles.forEach((tilesInColumn) => {
        tilesInColumn.forEach((tile) => {
          tile.x += dx;
          tile.y += dy;
        });
      });

      const firstTile = this.tiles[0][0];
      const lastTile = this.tiles[this.tilesInRow - 1][this.tilesInColumn - 1];

      if (firstTile.x < - TILE_SIZE) {
        const firstColumn = this.tiles.shift()
        this.tiles.push(firstColumn); // Move first column to the end

        firstColumn.forEach((tile) => {
          tile.x += this.tilesInRow * TILE_SIZE;
          tile.terrainGradient = this.getNoiseForCoordinates(tile.x - this.mapOffsetX, tile.y - this.mapOffsetY);
          tile.updateTerrainColor();
        });

      } else if (lastTile.x > this.canvas.width) {
        const lastColumn = this.tiles.pop();
        this.tiles.unshift(lastColumn); // Move last column to the start

        lastColumn.forEach((tile) => {
          tile.x -= this.tilesInRow * TILE_SIZE;
          tile.terrainGradient = this.getNoiseForCoordinates(tile.x - this.mapOffsetX, tile.y - this.mapOffsetY);
          tile.updateTerrainColor();
        });
      }

      if (firstTile.y < - TILE_SIZE) {
        this.tiles.forEach((tiles) => {
          const firstTile = tiles.shift();
          tiles.push(firstTile); // Move first row to the end

          firstTile.y += this.tilesInColumn * TILE_SIZE;
          firstTile.terrainGradient = this.getNoiseForCoordinates(firstTile.x - this.mapOffsetX, firstTile.y - this.mapOffsetY);
          firstTile.updateTerrainColor();
        });
      } else if (lastTile.y > this.canvas.height) {
        this.tiles.forEach((tiles) => {
          const lastTile = tiles.pop();
          tiles.unshift(lastTile); // Move last row to the start

          lastTile.y -= this.tilesInColumn * TILE_SIZE;
          lastTile.terrainGradient = this.getNoiseForCoordinates(lastTile.x - this.mapOffsetX, lastTile.y - this.mapOffsetY);
          lastTile.updateTerrainColor();
        });
      }

      this.player.x = this.player.x + dx;
      this.player.y = this.player.y + dy;
    }
  }

  scheduleRedraw() {
    if (this.hasScheduledRedrawn) {
      return;
    }

    this.hasScheduledRedrawn = true;

    requestAnimationFrame(() => {
      const time = Date.now() - this.startTime;
      this.clearCanvas();

      const shouldRedrawForTiles = this.redrawTiles(time);
      const shouldRedrawForPlayer = this.player.draw(time);

      this.hasScheduledRedrawn = false;

      if (shouldRedrawForTiles || shouldRedrawForPlayer) {
        this.scheduleRedraw();
      }
    });
  }

  redrawTiles(time) {
    return this.tiles.reduce((shouldRedrawRow, rowTiles) => {
      return rowTiles.reduce((shouldRedraw, tile) => {
        return tile.draw(time) || shouldRedraw;
      }, shouldRedrawRow);
    }, false);
  }

  getNoiseForCoordinates(x, y) {
    const terrainGradient = noise(x * 0.0008 + this.terrainOffset, y * 0.0008 + this.terrainOffset); // Generates noise value between -1 and 1;
    const normalizedTerrainGradient = (terrainGradient + 1) / 2; // Normalize values between 0 and 1

    return normalizedTerrainGradient;
  }

  generateTiles() {
    for (var i = 0; i < this.tilesInRow; i++) {
      this.tiles[i] = [];

      for (var j = 0; j < this.tilesInColumn; j++) {
        const x = (i - 1) * TILE_SIZE + this.offsetX;
        const y = (j - 1) * TILE_SIZE + this.offsetY;

        const dx = this.originalOffsetX - x;
        const dy = this.originalOffsetY - y;
        const distanceToTrigger = Math.abs(dx) + Math.abs(dy);
        const delay = distanceToTrigger + Math.random() * 150;

        const tile = new Tile({
          context: this.context,
          x,
          y,
          terrainGradient: this.getNoiseForCoordinates(x, y),
          initialDelay: delay
        });

        this.tiles[i][j] = tile;
      }
    }
  }
}
