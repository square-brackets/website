// Transition functions: https://gist.github.com/gre/1650294

import Triangle, {ORIENTATIONS, NEIGHBORHOOD_POSITION, TRIANGLE_SIZE, TRIANGLE_HEIGHT} from './triangle';
import noise from './noise';
import Engine from './engine';
import Player from './player';

export default class Game {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.engine = new Engine({
      beforeLoop: () => this.clearCanvas()
    });
    this.triangles = [];
    this.terrainOffset = Math.random();

    this.originalOffsetX = options.offsetX;
    this.originalOffsetY = options.offsetY;
    this.offsetX = options.offsetX % (TRIANGLE_SIZE / 2);
    this.offsetY = options.offsetY % TRIANGLE_HEIGHT;

    this.mapOffsetX = 0;
    this.mapOffsetY = 0;

    this.trianglesInRow = Math.floor((this.canvas.width + this.offsetX) / TRIANGLE_SIZE * 2) + 2;
    this.trianglesInColumn = Math.floor((this.canvas.height + this.offsetY) / TRIANGLE_HEIGHT) + 2;

    this.generateTriangles();
  }

  start() {
    this.engine.start();

    this.player = new Player(this.context, this.originalOffsetX, this.originalOffsetY);
    this.engine.addDrawableObject(this.player, 2);

    this.addControls();
  }

  clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  showTrigger() {
    // TODO: mousemove

    const triggerTriangle = new Triangle({
      context: this.context,
      orientation: ORIENTATIONS.UP,
      x: this.originalOffsetX,
      y: this.originalOffsetY
    });

    this.context.fillStyle = 'red';
    triggerTriangle.drawTriangle();
    this.context.fill();
  }

  addControls() {
    document.addEventListener('keydown', (event) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          this.player.y -= 20;
          break;
        case 'ArrowDown':
        case 'KeyS':
          this.player.y += 20;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          this.player.x -= 20;
          break;
        case 'ArrowRight':
        case 'KeyD':
          this.player.x += 20;
          break;
        default:
          console.log(`${event.code} is not supported key`);
          // ignore other codes
          break;
      }

      this.updateMapPosition();
    });
  }

  updateMapPosition() {
    const PADDING = 50;
    const {x: playerX, y: playerY} = this.player;
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;
    let dx = 0;
    let dy = 0;
    if (playerX < PADDING) {
      dx = 20;
    } else if (playerX > this.canvas.width - PADDING) {
      dx = -20;
    }

    if (playerY < PADDING) {
      dy = 20;
    } else if (playerY > this.canvas.height - PADDING) {
      dy = -20;
    }

    if (dx || dy) {
      this.mapOffsetX += dx;
      this.mapOffsetY += dy;
    }

    // Flip orientation when moving in x direction where there are odd number of columns
    const flipOrientationX = this.trianglesInRow % 2 === 1;
    // Flip orientation when moving in y direction where there are odd number of rows
    const flipOrientationY = this.trianglesInColumn % 2 === 1;

    this.triangles.forEach((triangle) => {
      triangle.x = triangle.x + dx;
      triangle.y = triangle.y + dy;

      if (triangle.x > canvasWidth || triangle.x < -TRIANGLE_SIZE) {
        const factor = triangle.x > canvasWidth ? -1 : 1;
        triangle.x = triangle.x + factor * TRIANGLE_SIZE / 2 * this.trianglesInRow;

        if (flipOrientationX) {
          triangle.orientation = (triangle.orientation + 1) % 2; // Flip 0 -> 1 and 1 -> 0
        }

        triangle.terrainGradient = this.getNoiseForCoordinates(triangle.x - this.mapOffsetX, triangle.y - this.mapOffsetY);
        triangle.updateTerrainColor();
      }

      if (triangle.y > canvasHeight || triangle.y < -TRIANGLE_HEIGHT) {
        const factor = triangle.y > canvasHeight ? -1 : 1;
        triangle.y = triangle.y + factor * this.trianglesInColumn * TRIANGLE_HEIGHT;

        if (flipOrientationY) {
          triangle.orientation = (triangle.orientation + 1) % 2; // Flip 0 -> 1 and 1 -> 0
        }

        triangle.terrainGradient = this.getNoiseForCoordinates(triangle.x - this.mapOffsetX, triangle.y - this.mapOffsetY);
        triangle.updateTerrainColor();
      }
    });

    this.player.x = this.player.x + dx;
    this.player.y = this.player.y + dy;
  }

  drawGrid() {
    const {height, width} = this.canvas;
    const numberOfRows = Math.floor(height / TRIANGLE_HEIGHT);
    const clippedHeight = numberOfRows * TRIANGLE_HEIGHT;

    this.context.strokeStyle = 'white';
    this.context.beginPath();

    // Horizontal lines
    for (var i = 0; i < numberOfRows; i++) {
      this.context.moveTo(0, i * TRIANGLE_HEIGHT);
      this.context.lineTo(width, i * TRIANGLE_HEIGHT);
    }

    // Diagonal /
    const diagonalOffset = numberOfRows * TRIANGLE_SIZE * 0.5;
    for (var i = 0; i < numberOfRows + Math.floor(width / TRIANGLE_SIZE); i++) {
      this.context.moveTo(i * TRIANGLE_SIZE - diagonalOffset, clippedHeight);
      this.context.lineTo(i * TRIANGLE_SIZE, 0);
    }

    // Diagonal \
    for (var i = 0; i < numberOfRows + Math.floor(width / TRIANGLE_SIZE); i++) {
      this.context.moveTo(i * TRIANGLE_SIZE - diagonalOffset, 0);
      this.context.lineTo(i * TRIANGLE_SIZE, clippedHeight);
    }

    this.context.stroke();
  }

  getNoiseForCoordinates(x, y) {
    const terrainGradient = noise(x * 0.001 + this.terrainOffset, y * 0.001 + this.terrainOffset); // Generates noise value between -1 and 1;
    const normalizedTerrainGradient = (terrainGradient + 1) / 2; // Normalize values between 0 and 1

    return normalizedTerrainGradient;
  }

  generateTriangles() {
    for (var i = 0; i < this.trianglesInColumn; i++) {
      for (var j = 0; j < this.trianglesInRow; j++) {
        const orientation = (i + j) % 2 ? ORIENTATIONS.UP : ORIENTATIONS.DOWN;

        const x = (j - 2) * TRIANGLE_SIZE / 2 + this.offsetX;
        const y = (i - 1) * TRIANGLE_HEIGHT + this.offsetY;

        const dx = this.originalOffsetX - x;
        const dy = this.originalOffsetY - y;
        const distanceToTrigger = Math.sqrt(dx * dx + dy * dy);
        const delay = distanceToTrigger + Math.random() * 150;

        const triangle = new Triangle({
          context: this.context,
          orientation, x, y,
          terrainGradient: this.getNoiseForCoordinates(x, y),
          initialDelay: delay
        });

        this.triangles.push(triangle);

        if (j !== 0) { // Skip first column
          const lastTriangle = this.triangles[this.triangles.length - 2];
          triangle.addNeighbour(NEIGHBORHOOD_POSITION.LEFT, lastTriangle);
          lastTriangle.addNeighbour(NEIGHBORHOOD_POSITION.RIGHT, triangle);
        }

        if (i !== 0) { // Skip first row
          if (orientation === ORIENTATIONS.DOWN) {
            const upperTriangle = this.triangles[(i - 1) * this.trianglesInRow + j];
            triangle.addNeighbour(NEIGHBORHOOD_POSITION.TOP, upperTriangle);
            upperTriangle.addNeighbour(NEIGHBORHOOD_POSITION.BOTTOM, triangle);
          }
        }
        this.engine.addDrawableObject(triangle, 1);
      }
    }
  }
}
