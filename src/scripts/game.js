import Triangle, {ORIENTATIONS, NEIGHBORHOOD_POSITION, TRIANGLE_SIZE, TRIANGLE_HEIGHT} from './triangle';
import noise from './noise';
import Engine from './engine';

export default class Game {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.engine = new Engine({
      beforeLoop: () => this.clearCanvas()
    });
    this.triangles = [];

    this.numberOfRows = Math.ceil(this.canvas.height / TRIANGLE_HEIGHT);
    this.numberOfColumns = Math.ceil(this.canvas.width / TRIANGLE_SIZE);

    this.trianglesInRow = this.numberOfColumns * 2 + 2;
    this.trianglesInColumn = this.numberOfRows + 1;

    this.originalOffsetX = options.offsetX;
    this.originalOffsetY = options.offsetY;
    this.offsetX = options.offsetX % (TRIANGLE_SIZE / 2);
    this.offsetY = options.offsetY % TRIANGLE_HEIGHT;

    this.generateTriangles();
  }

  start() {
    this.engine.start();
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

  generateTriangles() {
    const offset = Math.random();
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
          terrainGradient: (noise(i * 0.04 + offset, j * 0.04 + offset) + 1) / 2,
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
