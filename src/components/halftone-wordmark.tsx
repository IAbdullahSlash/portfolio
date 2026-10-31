import { useEffect, useRef } from "react";

import { toRGB, type RGB } from "@/lib/color";

/* ==========================================================================
   Halftone Wordmark

   A word set enormous, cropped by the bottom edge and printed as a field of
   halftone dots. Each dot is sized by how much of the letter covers its
   cell, so the type keeps its edges at any width. Move across it and the
   dots part around the pointer on springs, warming toward the accent as they
   are pushed off their place; click and a shock ring runs through the word.

   Colours come from --pf-fg (ink) and --pf-accent (warm) and are re-read
   when <html data-theme> changes. The block sets its own height from the
   width so the word always fits.
   ========================================================================== */

/** Dot radius for a cell coverage in [0, 1]: area-true, so tone stays even. */
function dotRadius(coverage: number, gap: number) {
  const c = coverage < 0 ? 0 : coverage > 1 ? 1 : coverage;
  return Math.sqrt(c) * gap * 0.56;
}

export function HalftoneWordmark({
  word,
  dotGap = 6,
  radius = 80,
  crop = 0.2,
  grain = 0.5,
  fontWeight = 900,
}: {
  /** The word printed in dots. */
  word: string;
  /** Distance between dot centres, in CSS px. */
  dotGap?: number;
  /** How far the pointer pushes, in CSS px. */
  radius?: number;
  /** How much of the word's cap height hangs below the bottom edge, 0–0.6. */
  crop?: number;
  /** Print grain over the dots, 0–1. */
  grain?: number;
  fontWeight?: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!root || !canvas || !ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let px = -1e5;
    let py = -1e5;
    let raf = 0;
    let visible = true;
    let awake = true;
    let ring = { x: 0, y: 0, t: -1 };
    // Flat arrays: x, y, vx, vy, hx, hy, r per dot.
    let dots = new Float32Array(0);
    let count = 0;
    let grainTile: HTMLCanvasElement | null = null;
    let grainPattern: CanvasPattern | null = null;
    let ink: RGB = [255, 255, 255];
    let warm: RGB = [255, 42, 42];

    const readColors = () => {
      const cs = getComputedStyle(root);
      ink = toRGB(cs.getPropertyValue("--pf-fg").trim()) ?? ink;
      warm = toRGB(cs.getPropertyValue("--pf-accent").trim()) ?? warm;
    };

    const layout = () => {
      w = Math.max(1, Math.round(root.clientWidth));
      const family = getComputedStyle(root).fontFamily || "sans-serif";

      // Set the word once, at a size that fills the width, on a 1x mask.
      const mask = document.createElement("canvas");
      const m = mask.getContext("2d", { willReadFrequently: true });
      if (!m) return;
      m.font = `${fontWeight} 100px ${family}`;
      const measured = m.measureText(word).width;
      const size = measured > 0 ? ((w * 0.98) / measured) * 100 : 0;
      m.font = `${fontWeight} ${size}px ${family}`;
      const box = m.measureText(word);
      const cap = box.actualBoundingBoxAscent || size * 0.72;
      const c = Math.max(0, Math.min(0.6, crop));
      // Height: the visible part of the letters plus a little air above them.
      h = Math.max(1, Math.round(cap * (1 - c) + Math.max(16, cap * 0.18)));
      root.style.height = `${h}px`;

      mask.width = w;
      mask.height = h;
      m.font = `${fontWeight} ${size}px ${family}`;
      m.fillStyle = "#000";
      m.textBaseline = "alphabetic";
      m.fillText(word, (w - box.width) / 2, h + cap * c);
      const img = m.getImageData(0, 0, w, h).data;

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);

      const gap = Math.max(3, dotGap);
      const cols = Math.ceil(w / gap);
      const rows = Math.ceil(h / gap);
      const tmp: number[] = [];
      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          // Coverage: average alpha over a 3×3 sample of the cell.
          let sum = 0;
          for (let sy = 0; sy < 3; sy++) {
            for (let sx = 0; sx < 3; sx++) {
              const x = Math.min(
                w - 1,
                Math.floor(gx * gap + ((sx + 0.5) * gap) / 3),
              );
              const y = Math.min(
                h - 1,
                Math.floor(gy * gap + ((sy + 0.5) * gap) / 3),
              );
              sum += img[(y * w + x) * 4 + 3];
            }
          }
          const cov = sum / (9 * 255);
          if (cov < 0.06) continue;
          const hx = gx * gap + gap / 2;
          const hy = gy * gap + gap / 2;
          tmp.push(hx, hy, 0, 0, hx, hy, dotRadius(cov, gap));
        }
      }
      dots = new Float32Array(tmp);
      count = tmp.length / 7;

      // A fixed tile of print grain, drawn once and laid over every frame.
      if (!grainTile) {
        grainTile = document.createElement("canvas");
        grainTile.width = grainTile.height = 256;
        const g = grainTile.getContext("2d");
        if (g) {
          const id = g.createImageData(256, 256);
          for (let i = 0; i < id.data.length; i += 4) {
            const v = Math.random() * 255;
            id.data[i] = id.data[i + 1] = id.data[i + 2] = v;
            id.data[i + 3] = Math.random() < 0.5 ? 0 : 255;
          }
          g.putImageData(id, 0, 0);
        }
      }
      awake = true;
    };

    const draw = (now: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const r = reduced ? 0 : Math.max(0, radius);
      const ringAge = ring.t < 0 ? 1e9 : now - ring.t;
      const ringR = ringAge * 0.9;
      const inkStr = `rgb(${ink[0]},${ink[1]},${ink[2]})`;
      const pointerIn = r > 0 && px > -1e4;
      const r2 = r * r;
      let moving = false;
      // Dots at rest share one path and one fill; only pushed dots get their own colour.
      ctx.fillStyle = inkStr;
      ctx.beginPath();
      for (let i = 0; i < count; i++) {
        const j = i * 7;
        let x = dots[j];
        let y = dots[j + 1];
        let vx = dots[j + 2];
        let vy = dots[j + 3];
        const hx = dots[j + 4];
        const hy = dots[j + 5];
        if (!reduced) {
          if (ringAge < 900) {
            const dx = hx - ring.x;
            const dy = hy - ring.y;
            const d = Math.sqrt(dx * dx + dy * dy) + 0.001;
            const band = 1 - Math.min(1, Math.abs(d - ringR) / 26);
            if (band > 0) {
              const f = band * 3.2 * (1 - ringAge / 900);
              vx += (dx / d) * f;
              vy += (dy / d) * f;
            }
          }
          // Spring back home, plus the push from the pointer.
          const dx = x - px;
          const dy = y - py;
          const d2 = dx * dx + dy * dy;
          if (r > 0 && d2 < r2) {
            const d = Math.sqrt(d2) + 0.001;
            const f = (1 - d / r) * 2.6;
            vx += (dx / d) * f;
            vy += (dy / d) * f;
          }
          vx = (vx + (hx - x) * 0.05) * 0.84;
          vy = (vy + (hy - y) * 0.05) * 0.84;
          x += vx;
          y += vy;
          const away = Math.abs(x - hx) + Math.abs(y - hy);
          if (Math.abs(vx) + Math.abs(vy) > 0.02 || (away > 0.05 && !pointerIn))
            moving = true;
          else if (away <= 0.05) {
            x = hx;
            y = hy;
            vx = 0;
            vy = 0;
          }
          dots[j] = x;
          dots[j + 1] = y;
          dots[j + 2] = vx;
          dots[j + 3] = vy;
        }
        // Warmth: 0 at home, 1 once pushed 28px or more away.
        const k = Math.min(1, Math.hypot(x - hx, y - hy) / 28);
        if (k > 0.02) continue;
        ctx.moveTo(x + dots[j + 6], y);
        ctx.arc(x, y, dots[j + 6], 0, 6.2832);
      }
      ctx.fill();
      for (let i = 0; i < count; i++) {
        const j = i * 7;
        const x = dots[j];
        const y = dots[j + 1];
        const k = Math.min(
          1,
          Math.hypot(x - dots[j + 4], y - dots[j + 5]) / 28,
        );
        if (k <= 0.02) continue;
        ctx.fillStyle = `rgb(${Math.round(ink[0] + (warm[0] - ink[0]) * k)},${Math.round(ink[1] + (warm[1] - ink[1]) * k)},${Math.round(ink[2] + (warm[2] - ink[2]) * k)})`;
        ctx.beginPath();
        ctx.arc(x, y, dots[j + 6], 0, 6.2832);
        ctx.fill();
      }

      if (grainTile && grain > 0) {
        // Grain only on the dots: source-atop keeps empty space transparent.
        ctx.globalAlpha = Math.min(1, grain) * 0.18;
        ctx.globalCompositeOperation = "source-atop";
        grainPattern ??= ctx.createPattern(grainTile, "repeat");
        if (grainPattern) {
          ctx.fillStyle = grainPattern;
          ctx.fillRect(0, 0, w, h);
        }
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
      }
      // Sleep once nothing is moving, even with the pointer resting on the word.
      awake = moving || ringAge < 900;
    };

    const loop = (now: number) => {
      raf = 0;
      if (!visible) return;
      draw(now);
      if (awake) raf = requestAnimationFrame(loop);
    };
    const wake = () => {
      awake = true;
      if (!raf && visible) raf = requestAnimationFrame(loop);
    };

    const toLocal = (e: PointerEvent) => {
      const b = canvas.getBoundingClientRect();
      return [e.clientX - b.left, e.clientY - b.top];
    };
    const onMove = (e: PointerEvent) => {
      [px, py] = toLocal(e);
      wake();
    };
    const onLeave = () => {
      px = -1e5;
      py = -1e5;
      wake();
    };
    const onDown = (e: PointerEvent) => {
      if (reduced) return;
      const [x, y] = toLocal(e);
      ring = { x, y, t: performance.now() };
      wake();
    };

    readColors();
    layout();
    draw(performance.now());
    wake();

    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    root.addEventListener("pointerdown", onDown);
    // Only a width change re-sets the word; the block sets its own height.
    const ro = new ResizeObserver(() => {
      if (Math.round(root.clientWidth) === w) return;
      layout();
      wake();
    });
    ro.observe(root);
    const io = new IntersectionObserver((entries) => {
      visible = entries[0] ? entries[0].isIntersecting : true;
      if (visible) wake();
    });
    io.observe(root);
    // The portfolio switches theme through <html data-theme>.
    const mo = new MutationObserver(() => {
      readColors();
      wake();
    });
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    // A web font that lands late re-sets the word in its real face.
    let alive = true;
    document.fonts?.ready.then(() => {
      if (!alive) return;
      layout();
      wake();
    });

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("pointerdown", onDown);
    };
  }, [word, dotGap, radius, crop, grain, fontWeight]);

  return (
    <div
      ref={rootRef}
      className="relative w-full overflow-hidden"
      style={{ height: "12vw" }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute inset-0 block h-full w-full"
      />
      <span className="sr-only">{word}</span>
    </div>
  );
}
