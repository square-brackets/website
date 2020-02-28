import Triangle, {ORIENTATIONS, NEIGHBORHOOD_POSITION, TRIANGLE_SIZE, TRIANGLE_HEIGHT} from './triangle';
import noise from './noise';

export default class Game {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.triangles = [];

    this.numberOfRows = Math.ceil(this.canvas.height / TRIANGLE_HEIGHT);
    this.numberOfColumns = Math.ceil(this.canvas.width / TRIANGLE_SIZE);

    this.trianglesInRow = this.numberOfColumns * 2 + 2;
    this.trianglesInColumn = this.numberOfRows + 1;

    this.originalOffsetX = options.offsetX;
    this.originalOffsetY = options.offsetY;
    this.offsetX = options.offsetX % (TRIANGLE_SIZE / 2);
    this.offsetY = options.offsetY % TRIANGLE_HEIGHT;
  }

  start() {
    this.animations = [];

    // this.drawGrid();
    this.generateTriangles();
    this.animateTriangles();

    this.loop();
  }

  stop() {
    this.isStopped = true;
  }

  loop() {
    if (this.isStopped) {
      return;
    }

    const time = Date.now();

    this.animations = this.animations.filter(({drawFunction, startTime, duration, delay}) => {
      if (time - startTime < delay) {
        return true;
      }

      const percentage = Math.min((time - (startTime + delay)) / duration, 1);
      drawFunction(percentage);

      return percentage < 1;
    });

    requestAnimationFrame(() => this.loop());
  }

  animate(drawFunction, {duration, delay}) {
    this.continue();

    this.animations.push({
      startTime: Date.now(),
      drawFunction,
      duration,
      delay
    });
  }

  showTrigger() {
    // TODO: mousemove

    const triggerTriangle = new Triangle({
      orientation: ORIENTATIONS.UP,
      x: this.originalOffsetX,
      y: this.originalOffsetY
    });

    triggerTriangle.draw(this.context);
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
        const triangle = new Triangle({
          orientation,
          x: (j - 2) * TRIANGLE_SIZE / 2 + this.offsetX,
          y: (i - 1) * TRIANGLE_HEIGHT + this.offsetY,
          terrainGradient: (noise(i * 0.04 + offset, j * 0.04 + offset) + 1) / 2
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
      }
    }
  }

  async animateTriangles() {
    const drawnTriangles = [];

    const triggerTriangle = this.triangles.find((triangle) => {
      return triangle.x === this.originalOffsetX && triangle.y === this.originalOffsetY
    });

    const triangleGroups = [[triggerTriangle]]; // Group of traingles scheduled to be drawn
    let resolvedTriangles = [triggerTriangle]; // Triangles that are drawn or scheduled to be drawn

    while (triangleGroups.length) {
      const group = triangleGroups.shift();
      const nextGroup = [];

      group.forEach((triangle) => {
        this.animateTriangle(triangle);
        drawnTriangles.push(triangle);

        const rightTriangle = triangle.neighbourhood[NEIGHBORHOOD_POSITION.RIGHT];
        const leftTriangle = triangle.neighbourhood[NEIGHBORHOOD_POSITION.LEFT];
        const bottomTriangle = triangle.neighbourhood[NEIGHBORHOOD_POSITION.BOTTOM];
        const topTriangle = triangle.neighbourhood[NEIGHBORHOOD_POSITION.TOP];

        [
          NEIGHBORHOOD_POSITION.RIGHT, NEIGHBORHOOD_POSITION.LEFT,
          NEIGHBORHOOD_POSITION.BOTTOM, NEIGHBORHOOD_POSITION.TOP
        ].forEach((position) => {
          const neighbourTriangle = triangle.neighbourhood[position];

          if (
            neighbourTriangle &&
            !resolvedTriangles.includes(neighbourTriangle) &&
            !nextGroup.includes(neighbourTriangle)
          ) {
            nextGroup.push(neighbourTriangle);
          }
        });
      });

      if (nextGroup.length) {
        triangleGroups.push(nextGroup);
        resolvedTriangles = resolvedTriangles.concat(nextGroup);
      }

       // TODO: Add delay to animation and replace async with delayed animation;
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });
    }
  }

  animateTriangle(triangle) {
    this.animate((percentage) => {
      triangle.draw(this.context, percentage);
    }, 500);
  }
}
