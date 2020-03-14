// Transition functions: https://gist.github.com/gre/1650294

import {TILE_SIZE} from './tile';
import Player from './player';
import Renderer from './renderer';
import TilesContainer from './tiles-container';

export default class Game {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.originalOffsetX = Math.round(options.offsetX);
    this.originalOffsetY = Math.round(options.offsetY);
    this.offsetX = this.originalOffsetX % TILE_SIZE;
    this.offsetY = this.originalOffsetY % TILE_SIZE;

    this.renderer = new Renderer();

    this.tilesContainer = new TilesContainer({
      width: this.canvas.width,
      height: this.canvas.height,
      offsetX: this.offsetX,
      offsetY: this.offsetY,
      triggerCenterX: this.originalOffsetX - this.offsetX + TILE_SIZE / 2,
      triggerCenterY: this.originalOffsetY - this.offsetY + TILE_SIZE / 2,
      renderer: this.renderer
    });

    this.tilesContainer.generateTiles();
  }

  async start() {
    await this.tilesContainer.animateTiles(this.context)

    const playerTile = this.tilesContainer.getTileForCoordinates(this.originalOffsetX, this.originalOffsetY);

    this.player = new Player({
      tile: playerTile
    });

    this.player.draw(this.context);
    this.addControls();
  }

  clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  addControls() {
    document.addEventListener('keydown', (event) => {
      let nextTilePosition;
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          nextTilePosition = 'topTile';
          break;
        case 'ArrowDown':
        case 'KeyS':
          nextTilePosition = 'bottomTile';
          break;
        case 'ArrowLeft':
        case 'KeyA':
          nextTilePosition = 'leftTile';
          break;
        case 'ArrowRight':
        case 'KeyD':
          nextTilePosition = 'rightTile';
          break;
        default:
          console.log(`${event.code} is not supported key`);
          // ignore other codes
          break;
      }

      const currentTile = this.player.tile;
      if (nextTilePosition) {
        if (!currentTile[nextTilePosition].isCollision) {
          this.player.moveToTile(currentTile[nextTilePosition]);
        }

        this.updateMapPosition();
        this.scheduleRedraw();
      }
    });
  }

  updateMapPosition() {
    let dx = 0;
    let dy = 0;

    if (!this.player.tile.leftTile.leftTile) {
      dx = -1;
    } else if (!this.player.tile.rightTile.rightTile) {
      dx = 1;
    }

    if (!this.player.tile.topTile.topTile) {
      dy = -1;
    } else if (!this.player.tile.bottomTile.bottomTile) {
      dy = 1;
    }

    if (dx || dy) {
      this.tilesContainer.offsetTiles(dx, dy);
    }
  }

  scheduleRedraw() {
    if (this.hasScheduledRedrawn) {
      return this.redrawPromise;
    }

    this.hasScheduledRedrawn = true;

    this.renderer.schedule(() => {
      this.clearCanvas();
      this.hasScheduledRedrawn = false;
    });

    this.tilesContainer.redrawTiles(this.context);

    this.renderer.schedule(() => {
      this.player.draw(this.context);
    });
  }
}
