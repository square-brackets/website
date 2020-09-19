const spriteConfig = {
  location: '/assets/game/medievalRTS_vector.svg',
  spriteWidth: 1760,
  spriteHeight: 704,
  tileSize: 64,
  tiles: {
    grass1: {
      x: 32, y: 32
    },
    grass2: {
      x: 128, y: 32
    },
    sand1: {
      x: 224, y: 32
    },
    sand2: {
      x: 320, y: 32
    },
    dirt1: {
      x: 32, y: 128
    },
    dirt2: {
      x: 128, y: 128
    },
    gravel1: {
      x: 224, y: 128
    },
    gravel2: {
      x: 320, y: 128
    },
    water1: {
      x: 32, y: 224
    },
    water2: {
      x: 128, y: 224
    },
    ice1: {
      x: 224, y: 224
    },
    ice2: {
      x: 320, y: 224
    }
  }
}

export default spriteConfig

export function loadSprite() {
  return new Promise((resolve, reject) => {
    const sprite = new Image();
    sprite.src = spriteConfig.location;
    sprite.onload = () => {
      const spriteCanvas = new OffscreenCanvas(
        spriteConfig.spriteWidth,
        spriteConfig.spriteHeight
      );
      const spriteContext = spriteCanvas.getContext('2d');
      spriteContext.drawImage(sprite, 0, 0);

      resolve(spriteCanvas);
    };
    sprite.onerror = reject;
  })
}
