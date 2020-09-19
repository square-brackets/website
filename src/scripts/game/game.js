// Transition functions: https://gist.github.com/gre/1650294

import Map from './map';
import Renderer from './renderer';
import TilesContainer from './tiles-container';
import Camera from './camera';
import {loadSprite} from './utils/sprite';

export default class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.renderer = new Renderer();

    loadSprite().then((sprite) => {
      this.tilesContainer = new TilesContainer({
        sprite
      });

      this.map = new Map({
        width: this.canvas.width,
        height: this.canvas.height,
        tilesContainer: this.tilesContainer
      });

      this.camera = new Camera();

      this.camera.on('position:changed', ({x, y}) => {
        this.map.centerX += x;
        this.map.centerY += y;
        this.renderer.schedule(() => {
          this.clearCanvas();
          this.map.render(this.context);
        })
      });

      this.map.render(this.context);
    });
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
          console.info(`${event.code} is not supported key`);
          // ignore other codes
          break;
      }

      const currentTile = this.player.tile;
      if (nextTilePosition) {
        if (currentTile.elevation === currentTile[nextTilePosition].elevation) {
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
