import Triangle, {ORIENTATIONS, NEIGHBORHOOD_POSITION, TRIANGLE_SIZE, TRIANGLE_HEIGHT} from './triangle';

export default class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.triangles = [];

    this.numberOfRows = Math.ceil(this.canvas.height / TRIANGLE_HEIGHT);
    this.numberOfColumns = Math.ceil(this.canvas.width / TRIANGLE_SIZE);

    this.trianglesInRow = this.numberOfColumns * 2;
    this.trianglesInColumn = this.numberOfRows;
  }

  start() {
    this.step = 0;
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
    this.step++;

    this.animations.forEach(({drawFunction, startTime, duration}) => {
      const percentage = (time - startTime) / duration;
      drawFunction(percentage);
    });

    requestAnimationFrame(() => this.loop());
  }

  // TODO: Add delay
  animate(drawFunction, duration) {
    this.animations.push({
      startStep: this.step,
      startTime: Date.now(),
      drawFunction,
      duration
    });
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
    for (var i = 0; i < this.trianglesInColumn; i++) {
      for (var j = 0; j < this.trianglesInRow; j++) {
        const orientation = (i + j) % 2 ? ORIENTATIONS.UP : ORIENTATIONS.DOWN;
        const triangle = new Triangle({orientation, row: i, column: j});
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
    const triangleGroups = [[this.triangles[122]]]; // Group of traingles scheduled to be drawn
    let resolvedTriangles = [this.triangles[122]]; // Triangles that are drawn or scheduled to be drawn
    while (triangleGroups.length) {
      const group = triangleGroups.shift();
      const nextGroup = [];

      group.forEach((triangle) => {
        this.animateTriangle(triangle);
        drawnTriangles.push(triangle);

        const rightTriangle = triangle.neighborhood[NEIGHBORHOOD_POSITION.RIGHT];
        const leftTriangle = triangle.neighborhood[NEIGHBORHOOD_POSITION.LEFT];
        const bottomTriangle = triangle.neighborhood[NEIGHBORHOOD_POSITION.BOTTOM];
        const topTriangle = triangle.neighborhood[NEIGHBORHOOD_POSITION.TOP];

        if (rightTriangle && !resolvedTriangles.includes(rightTriangle) && !nextGroup.includes(rightTriangle)) {
          nextGroup.push(rightTriangle);
        }

        if (leftTriangle && !resolvedTriangles.includes(leftTriangle) && !nextGroup.includes(leftTriangle)) {
          nextGroup.push(leftTriangle);
        }

        if (bottomTriangle && !resolvedTriangles.includes(bottomTriangle) && !nextGroup.includes(bottomTriangle)) {
          nextGroup.push(bottomTriangle);
        }

        if (topTriangle && !resolvedTriangles.includes(topTriangle) && !nextGroup.includes(topTriangle)) {
          nextGroup.push(topTriangle);
        }
      });

      if (nextGroup.length) {
        triangleGroups.push(nextGroup);
        resolvedTriangles = resolvedTriangles.concat(nextGroup);
      }

       // TODO: Add delay yo animation and replace async with delayed animation;
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });
    }
  }

  animateTriangle(triangle) {
    this.animate((percentage) => {
      // Linear opacity change
      this.context.fillStyle = `rgba(255, 255, 255, ${percentage})`;
      triangle.draw(this.context);
    }, 500);
  }
}
