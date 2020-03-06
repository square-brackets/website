export const TRIANGLE_SIZE = 50;
export const TRIANGLE_HEIGHT = Math.round(TRIANGLE_SIZE * 0.866) // Equilateral triangles have height equal to 86.6% (sqrt(3)/2);
const CORNER_RADIUS = 2;
const PADDING = 2;

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
  constructor({context, orientation, x, y, terrainGradient, initialDelay}, neighbourhood = []) {
    this.context = context;
    this.orientation = orientation;
    this.x = x;
    this.y = y;
    this.neighbourhood = {};
    this.terrainGradient = terrainGradient;
    this.initialDelay = initialDelay;

    if (terrainGradient < 0.2) {
      this.terrainColor = 'rgb(0, 99, 178)';
    } else if (terrainGradient < 0.3) {
      this.terrainColor = 'rgb(239, 221, 165)';
    } else if (terrainGradient < 0.6) {
      this.terrainColor = 'rgb(136, 180, 100)';
    } else if (terrainGradient < 0.8) {
      this.terrainColor = 'rgb(0, 100, 0)';
    } else {
      this.terrainColor = 'rgb(255, 255, 255)';
    }
  }

  addNeighbour(position, neighbourTriangle) {
    this.neighbourhood[position] = neighbourTriangle;
  }

  draw(time) {
    if (time < this.initialDelay) {
      return
    } else if (time < this.initialDelay + 500) {
      const percentage = Math.min((time - this.initialDelay) / 500, 1);
      const opacity = percentage * (2 - percentage); //ease-out-quad
      this.context.globalAlpha = opacity;
    }

    this.context.fillStyle = this.terrainColor;
    this.drawTriangle();
    this.context.fill();
    this.context.globalAlpha = 1;
  }

  drawTriangle() {
    const x = this.x;
    const y = this.y + (this.orientation === ORIENTATIONS.UP ? 1 : 0) * TRIANGLE_HEIGHT;
    const dx = 3 / Math.sqrt(3) * PADDING;
    const dy = 2 * PADDING;

    this.context.beginPath();

    if (this.orientation === ORIENTATIONS.UP) {
      this.context.arc(x + dx + Math.sqrt(3) * CORNER_RADIUS, y - PADDING - CORNER_RADIUS, CORNER_RADIUS, 7 * Math.PI / 6, Math.PI / 2, true);
      this.context.arc(x + TRIANGLE_SIZE - dx - Math.sqrt(3) * CORNER_RADIUS, y - PADDING - CORNER_RADIUS, CORNER_RADIUS, Math.PI / 2, -1 * Math.PI / 6, true);
      this.context.arc(x + TRIANGLE_SIZE / 2, y - TRIANGLE_HEIGHT + dy + 2 * CORNER_RADIUS, CORNER_RADIUS, -1 * Math.PI / 6, -5 * Math.PI / 6, true);
    } else {
      this.context.arc(x + dx + Math.sqrt(3) * CORNER_RADIUS, y + PADDING + CORNER_RADIUS, CORNER_RADIUS, 5 * Math.PI / 6, 3 * Math.PI / 2);
      this.context.arc(x + TRIANGLE_SIZE - dx - Math.sqrt(3) * CORNER_RADIUS, y + PADDING + CORNER_RADIUS, CORNER_RADIUS, -1 * Math.PI / 2, Math.PI / 6);
      this.context.arc(x + TRIANGLE_SIZE / 2, y + TRIANGLE_HEIGHT - dy - 2 * CORNER_RADIUS, CORNER_RADIUS, Math.PI / 6, 5 * Math.PI / 6);
    }

    this.context.closePath();
  }
}
