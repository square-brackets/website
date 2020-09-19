import Tile, {TILE_SIZE} from './tile';
import noise from './noise';

const NOISE_SCALE_FACTOR = 0.06;
const NOISE_OFFSET = Math.random() * 10;

const TILES_IN_CHUNK = 8;
const CHUNK_SIZE = TILE_SIZE * TILES_IN_CHUNK;

export default class TilesContainer {
  constructor({sprite}) {
    this.sprite = sprite;
    this.tilesCache = {};

    this.chunkCache = {};
  }

  getOrCreateChunk(x, y) {
    const cacheKey = this.getCacheKey(x, y);
    if (this.chunkCache[cacheKey] === undefined) {
      const tiles = [];

      for (let i = 0; i <= TILES_IN_CHUNK; i++) {
        for (let j = 0; j <= TILES_IN_CHUNK; j++) {
          tiles.push(this.getOrCreateTile({
            i,
            j,
            realI: y * TILES_IN_CHUNK + i,
            realJ: x * TILES_IN_CHUNK + j
          }));
        }
      }

      this.chunkCache[cacheKey] = {
        image: new Image(CHUNK_SIZE, CHUNK_SIZE),
        x,
        y,
        tiles,
      };

      const chunkCanvas = new OffscreenCanvas(CHUNK_SIZE, CHUNK_SIZE)
      const chunkContext = chunkCanvas.getContext('2d');

      tiles.forEach((tile, index) => {
        const tileRow = Math.floor(index / (TILES_IN_CHUNK + 1));
        const tileColumn = index % (TILES_IN_CHUNK + 1);
        chunkContext.save();
        chunkContext.translate(tileColumn * TILE_SIZE, tileRow * TILE_SIZE);
        tile.render(chunkContext);
        chunkContext.restore();
      });

      this.chunkCache[cacheKey].canvas = chunkCanvas;
    }

    return this.chunkCache[cacheKey];
  }

  renderChunk(chunk, context) {
    var renderCoordinate = this.chunkToRenderCoordinates(chunk.x, chunk.y);
    context.drawImage(chunk.canvas, renderCoordinate.x, renderCoordinate.y);
  }

  getCacheKey(i, j) {
    return `${i}:${j}`;
  }

  getVisibleChunksInRect(x, y, width, height) {
    const topLeft = this.worldToChunkCoordinates(x, y);
    const bottomRight = this.worldToChunkCoordinates(x + width, y + height);

    const chunks = [];

    const chunksOnXAxis = bottomRight.x - topLeft.x;
    const chunksOnYAxis = bottomRight.y - topLeft.y;
    for (let i = 0; i <= chunksOnXAxis; i++) {
      for (let j = 0; j <= chunksOnYAxis; j++) {
        const chunk = this.getOrCreateChunk(topLeft.x + i, topLeft.y + j);
        chunks.push(chunk);
      }
    }

    return chunks;
  }

  chunkToRenderCoordinates(x, y) {
    return {
      x: x * CHUNK_SIZE,
      y: y * CHUNK_SIZE
    };
  }

  worldToChunkCoordinates(x, y) {
    return {
      x: Math.floor(x / CHUNK_SIZE),
      y: Math.floor(y / CHUNK_SIZE)
    }
  }

  getTileCacheKey(i, j) {
    return this.getCacheKey(i, j)
  }

  getOrCreateTile({i, j, realI, realJ}) {
    const cacheKey = this.getTileCacheKey(realI, realJ);
    if (this.tilesCache[cacheKey] === undefined) {
      this.tilesCache[cacheKey] = new Tile({
        i,
        j,
        terrainGradient: this.getNoiseForCoordinates(realI, realJ),
        sprite: this.sprite
      });
    }

    return this.tilesCache[cacheKey];
  }

  getNoiseForCoordinates(x, y) {
    // Generates noise value between -1 and 1;
    const terrainGradient = noise(x * NOISE_SCALE_FACTOR + NOISE_OFFSET, y * NOISE_SCALE_FACTOR + NOISE_OFFSET);
    // Normalize values between 0 and 1
    return (terrainGradient + 1) / 2;
  }
}
