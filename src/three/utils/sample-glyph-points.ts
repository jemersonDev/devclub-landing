/**
 * Renders text to an offscreen 2D canvas and samples the opaque pixel
 * coordinates, mapping them into a centered 3D plane. Used to turn the
 * DevClub mark ("</>") into a target point cloud for the particle system.
 */
export function sampleGlyphPoints(
  text: string,
  {
    count,
    fontFamily = "'JetBrains Mono', monospace",
    fontWeight = "700",
    canvasSize = 512,
    planeWidth = 6,
  }: {
    count: number;
    fontFamily?: string;
    fontWeight?: string;
    canvasSize?: number;
    planeWidth?: number;
  }
): Float32Array {
  const canvas = document.createElement("canvas");
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  const ctx = canvas.getContext("2d");

  const result = new Float32Array(count * 3);
  if (!ctx) return result;

  ctx.clearRect(0, 0, canvasSize, canvasSize);
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `${fontWeight} ${canvasSize * 0.42}px ${fontFamily}`;
  ctx.fillText(text, canvasSize / 2, canvasSize / 2);

  const imageData = ctx.getImageData(0, 0, canvasSize, canvasSize).data;
  const candidates: Array<[number, number]> = [];

  for (let y = 0; y < canvasSize; y += 1) {
    for (let x = 0; x < canvasSize; x += 1) {
      const alpha = imageData[(y * canvasSize + x) * 4 + 3];
      if (alpha && alpha > 128) {
        candidates.push([x, y]);
      }
    }
  }

  if (candidates.length === 0) return result;

  const planeHeight = planeWidth;
  const depthJitter = planeWidth * 0.04;

  for (let i = 0; i < count; i += 1) {
    const [px, py] = candidates[Math.floor(Math.random() * candidates.length)]!;
    const nx = px / canvasSize - 0.5;
    const ny = py / canvasSize - 0.5;

    result[i * 3] = nx * planeWidth;
    result[i * 3 + 1] = -ny * planeHeight;
    result[i * 3 + 2] = (Math.random() - 0.5) * depthJitter;
  }

  return result;
}

/** Generates a scattered "dissolving code" starting volume for the particles. */
export function sampleScatteredPoints(
  count: number,
  spread = 9
): Float32Array {
  const result = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    result[i * 3] = (Math.random() - 0.5) * spread;
    result[i * 3 + 1] = (Math.random() - 0.5) * spread * 1.4;
    result[i * 3 + 2] = (Math.random() - 0.5) * spread * 0.6 - 1;
  }
  return result;
}
