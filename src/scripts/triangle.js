export const TRIANGLE_SIZE = 100;
export const TRIANGLE_HEIGHT = TRIANGLE_SIZE * 0.866 // Equilateral triangles have height equal to 86.6% (sqrt(3)/2);
const CORNER_RADIUS = 6;
const PADDING = 8;

export const NEIGHBORHOOD_POSITION = {
  TOP: 1,
  LEFT: 2,
  RIGHT: 3,
  BOTTOM: 4
};

export const ORIENTATIONS = {
  UP: 1,
  DOWN: -1
};

export default class Triangle {
  constructor({orientation, row, column}, neighborhood = []) {
    this.orientation = orientation;
    this.row = row;
    this.column = column;
    this.neighborhood = {};
  }

  addNeighbour(position, neighbourTriangle) {
    this.neighborhood[position] = neighbourTriangle;
  }

  draw(context) {
    const x = this.column * TRIANGLE_SIZE / 2;
    const y = (this.row + (this.orientation === ORIENTATIONS.UP ? 1 : 0)) * TRIANGLE_HEIGHT;
    const dx = 3 / Math.sqrt(3) * PADDING;
    const dy = 2 * PADDING;

    context.beginPath();

    // Without rounded corners
    // if (this.orientation === ORIENTATIONS.UP) {
    //   context.moveTo(x + dx, y - PADDING);
    //   context.lineTo(x + TRIANGLE_SIZE - dx, y - PADDING);
    //   context.lineTo(x + TRIANGLE_SIZE / 2, y - TRIANGLE_HEIGHT + dy);
    //   context.closePath();
    // } else {
    //   context.moveTo(x + dx, y + PADDING);
    //   context.lineTo(x + TRIANGLE_SIZE - dx, y + PADDING);
    //   context.lineTo(x + TRIANGLE_SIZE / 2, y + TRIANGLE_HEIGHT - dy);
    //   context.closePath();
    // }

    // With rounded corners
    if (this.orientation === ORIENTATIONS.UP) {
      context.arc(x + dx + Math.sqrt(3) * CORNER_RADIUS, y - PADDING - CORNER_RADIUS, CORNER_RADIUS, 7 * Math.PI / 6, Math.PI / 2, true);
      context.arc(x + TRIANGLE_SIZE - dx - Math.sqrt(3) * CORNER_RADIUS, y - PADDING - CORNER_RADIUS, CORNER_RADIUS, Math.PI / 2, -1 * Math.PI / 6, true);
      context.arc(x + TRIANGLE_SIZE / 2, y - TRIANGLE_HEIGHT + dy + 2 * CORNER_RADIUS, CORNER_RADIUS, -1 * Math.PI / 6, -5 * Math.PI / 6, true);

      context.closePath();
    } else {
      context.arc(x + dx + Math.sqrt(3) * CORNER_RADIUS, y + PADDING + CORNER_RADIUS, CORNER_RADIUS, 5 * Math.PI / 6, 3 * Math.PI / 2);
      context.arc(x + TRIANGLE_SIZE - dx - Math.sqrt(3) * CORNER_RADIUS, y + PADDING + CORNER_RADIUS, CORNER_RADIUS, -1 * Math.PI / 2, Math.PI / 6);
      context.arc(x + TRIANGLE_SIZE / 2, y + TRIANGLE_HEIGHT - dy - 2 * CORNER_RADIUS, CORNER_RADIUS, Math.PI / 6, 5 * Math.PI / 6);
      context.closePath();
    }

    context.fill();
  }
}
