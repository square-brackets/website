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

    this.drawGrid();
    this.generateTriangles();

    this.animateTriangles();

    // this.context.fillStyle = 'blue';
    // this.triangles.forEach((triangle) => triangle.draw(this.context));
  }

  drawGrid() {
    this.context.fillStyle = 'green';
    this.context.fillRect(0, 0, 150, 100);
    this.context.strokeStyle = 'white';

    const {height, width} = this.canvas;
    const numberOfRows = Math.floor(height / TRIANGLE_HEIGHT);
    const clippedHeight = numberOfRows * TRIANGLE_HEIGHT;

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
    const trianglesToShow = [this.triangles[0]];
    const drawnTriangles = [];
    while (trianglesToShow.length) {
      const triangleToShow = trianglesToShow.shift();
      this.animateTriangle(triangleToShow);
      drawnTriangles.push(triangleToShow);
      const rightTriangle = triangleToShow.neighborhood[NEIGHBORHOOD_POSITION.RIGHT];
      const leftTriangle = triangleToShow.neighborhood[NEIGHBORHOOD_POSITION.LEFT];
      const bottomTriangle = triangleToShow.neighborhood[NEIGHBORHOOD_POSITION.BOTTOM];
      if (rightTriangle && !drawnTriangles.includes(rightTriangle) && !trianglesToShow.includes(rightTriangle)) {
        trianglesToShow.push(rightTriangle);
      }

      if (leftTriangle && !drawnTriangles.includes(leftTriangle) && !trianglesToShow.includes(leftTriangle)) {
        trianglesToShow.push(leftTriangle);
      }

      if (bottomTriangle && !drawnTriangles.includes(bottomTriangle) && !trianglesToShow.includes(bottomTriangle)) {
        trianglesToShow.push(bottomTriangle);
      }

      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });
    }
  }

  animateTriangle(triangle) {
    this.context.fillStyle = 'blue';
    triangle.draw(this.context);
  }
}
