export type RGB = [number, number, number];

// One shared 1×1 canvas for every conversion.
let probe: CanvasRenderingContext2D | null = null;

/**
 * Any CSS colour → sRGB, by letting the browser paint it, so oklch, color-mix,
 * names and resolved custom properties all work. Null when the colour is
 * empty, invalid or (nearly) transparent.
 */
export function toRGB(color: string): RGB | null {
  if (!color) return null;
  if (!probe) {
    const c = document.createElement("canvas");
    c.width = c.height = 1;
    probe = c.getContext("2d", { willReadFrequently: true });
  }
  if (!probe) return null;
  probe.clearRect(0, 0, 1, 1);
  probe.fillStyle = "rgba(0,0,0,0)";
  probe.fillStyle = color;
  probe.fillRect(0, 0, 1, 1);
  const d = probe.getImageData(0, 0, 1, 1).data;
  return d[3] < 8 ? null : [d[0], d[1], d[2]];
}
