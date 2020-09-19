import simplexNoise from './vendor/simplex-noise';

export default function noiseValueForPoint(x, y) {
  let noiseSum = 0;
  let amplitude = 1;
  let frequency = 1;

  for (let i = 0; i < 5; i++) {
    noiseSum += simplexNoise(x * frequency, y * frequency) * amplitude;

    frequency *= 2;
    amplitude *= 0.5;
  }

  return noiseSum;
}
