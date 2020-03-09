// Transition functions: https://gist.github.com/gre/1650294

import {TILE_SIZE} from './tile';
import Player from './player';
import TilesContainer from './tiles-container';

export default class Game {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.originalOffsetX = Math.round(options.offsetX);
    this.originalOffsetY = Math.round(options.offsetY);
    this.offsetX = this.originalOffsetX % TILE_SIZE;
    this.offsetY = this.originalOffsetY % TILE_SIZE;

    this.tilesContainer = new TilesContainer({
      width: this.canvas.width,
      height: this.canvas.height,
      offsetX: this.offsetX,
      offsetY: this.offsetY,
    });

    this.tilesContainer.generateTiles();
  }

  start() {
    this.startTime = Date.now();

    const playerTile = this.tilesContainer.getTileForCoordinates(this.originalOffsetX, this.originalOffsetY);

    this.player = new Player(this.context, {
      tile: playerTile
    });

    this.addControls();
    this.scheduleRedraw();
  }

  clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  showTrigger() {
    // TODO: mousemove

    // this.triggerTile = new Tile({
    //   context: this.context,
    //   x: this.originalOffsetX,
    //   y: this.originalOffsetY
    // });
    //
    // this.triggerTile.draw();
  }

  addControls() {
    document.addEventListener('keydown', (event) => {
      const currentTile = this.player.tile;
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

    this.redrawPromise = new Promise((resolve) => {
      requestAnimationFrame(() => {
        const time = Date.now() - this.startTime;
        this.clearCanvas();

        const shouldRedrawForTiles = this.redrawTiles(time);
        const shouldRedrawForPlayer = this.player.draw(time);

        this.hasScheduledRedrawn = false;

        if (shouldRedrawForTiles || shouldRedrawForPlayer) {
          this.scheduleRedraw();
        }

        resolve();
      });
    });
  }

  redrawTiles(time) {
    return this.tilesContainer.tiles.reduce((shouldRedrawRow, rowTiles) => {
      return rowTiles.reduce((shouldRedraw, tile) => {
        return tile.draw(this.context, time) || shouldRedraw;
      }, shouldRedrawRow);
    }, false);
  }

  animateTilesEntry() {
    // this.
  }
}
