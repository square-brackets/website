export const TRIANGLE_SIZE = 50;
export const TRIANGLE_HEIGHT = TRIANGLE_SIZE * 0.87 // Equilateral triangles have height equal to 86.6% (sqrt(3)/2);
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

export const TERRAINS = {
  WATER: 1,
  GRASS: 2,
  SAND: 3,
  FOREST: 4,
  MOUNTAIN: 5
}

export default class Triangle {
  constructor({orientation, x, y, terrainGradient}, neighbourhood = []) {
    this.orientation = orientation;
    this.x = x;
    this.y = y;
    this.neighbourhood = {};
    this.terrainGradient = terrainGradient;

    if (terrainGradient < 0.2) {
      this.terrainColor = (opacity) => `rgba(0, 99, 178, ${opacity})`;
    } else if (terrainGradient < 0.3) {
      this.terrainColor = (opacity) => `rgba(239, 221, 165, ${opacity})`;
    } else if (terrainGradient < 0.6) {
      this.terrainColor = (opacity) => `rgba(136, 180, 100, ${opacity})`;
    } else if (terrainGradient < 0.8) {
      this.terrainColor = (opacity) => `rgba(0, 100, 0, ${opacity})`;
    } else {
      this.terrainColor = (opacity) => `rgba(255, 255, 255, ${opacity})`
    }
  }

  addNeighbour(position, neighbourTriangle) {
    this.neighbourhood[position] = neighbourTriangle;
  }

  draw(context) {
    const x = this.x;
    const y = this.y + (this.orientation === ORIENTATIONS.UP ? 1 : 0) * TRIANGLE_HEIGHT;
    const dx = 3 / Math.sqrt(3) * PADDING;
    const dy = 2 * PADDING;

    context.beginPath();

    if (this.orientation === ORIENTATIONS.UP) {
      context.arc(x + dx + Math.sqrt(3) * CORNER_RADIUS, y - PADDING - CORNER_RADIUS, CORNER_RADIUS, 7 * Math.PI / 6, Math.PI / 2, true);
      context.arc(x + TRIANGLE_SIZE - dx - Math.sqrt(3) * CORNER_RADIUS, y - PADDING - CORNER_RADIUS, CORNER_RADIUS, Math.PI / 2, -1 * Math.PI / 6, true);
      context.arc(x + TRIANGLE_SIZE / 2, y - TRIANGLE_HEIGHT + dy + 2 * CORNER_RADIUS, CORNER_RADIUS, -1 * Math.PI / 6, -5 * Math.PI / 6, true);
    } else {
      context.arc(x + dx + Math.sqrt(3) * CORNER_RADIUS, y + PADDING + CORNER_RADIUS, CORNER_RADIUS, 5 * Math.PI / 6, 3 * Math.PI / 2);
      context.arc(x + TRIANGLE_SIZE - dx - Math.sqrt(3) * CORNER_RADIUS, y + PADDING + CORNER_RADIUS, CORNER_RADIUS, -1 * Math.PI / 2, Math.PI / 6);
      context.arc(x + TRIANGLE_SIZE / 2, y + TRIANGLE_HEIGHT - dy - 2 * CORNER_RADIUS, CORNER_RADIUS, Math.PI / 6, 5 * Math.PI / 6);
    }

    context.closePath();

  }

  drawTerrain(context, percentage = 1) {
    context.fillStyle = this.terrainColor(percentage);
    this.draw(context);
    context.fill();
  }
}
