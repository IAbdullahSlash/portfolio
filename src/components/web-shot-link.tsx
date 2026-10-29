import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  type AnchorHTMLAttributes,
} from "react";
import { motion, useReducedMotion } from "framer-motion";

/* ==========================================================================
   Web Shot Link

   A glass pill link that shoots silk at the pointer. Bring the cursor near and
   thin threads leave the edge facing it, meet at the pointer and hang there
   with a little slack; move away and they let go and spring back.

   The threads are drawn in the current text colour (white in dark theme,
   black in light), only while the pointer is within reach, and are dropped
   entirely for reduced motion. Only the pill takes the click.
   ========================================================================== */

type Variant = "accent" | "solid" | "clear";

export interface WebShotLinkProps extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"
> {
  /** `md` (44px) or `lg` (56px). Default `md`. */
  size?: "md" | "lg";
  /** `accent` red glass, `solid` foreground-coloured glass, `clear` untinted glass. Default `clear`. */
  variant?: Variant;
  /** How far from the pill, in pixels, the pointer is noticed. Default 140. */
  reach?: number;
  /** Number of threads. Default 5. */
  threads?: number;
}

const SIZES = {
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-sm",
};

const VARIANTS: Record<Variant, { background?: string; color?: string }> = {
  accent: {
    background: "color-mix(in oklab, var(--pf-accent) 92%, transparent)",
    color: "var(--pf-text-on-accent)",
  },
  solid: {
    background: "color-mix(in oklab, var(--pf-fg) 92%, transparent)",
    color: "var(--pf-bg)",
  },
  clear: {},
};

/* Glass: frosted backdrop, theme-aware rim, soft inner shade and drop shadow. */
const GLASS =
  "bg-white/[0.05] backdrop-blur-md backdrop-saturate-150 ring-1 ring-inset ring-[var(--pf-glass-border-strong)] shadow-[inset_0_1px_0_rgb(255_255_255/0.35),inset_0_-12px_18px_-10px_rgb(0_0_0/0.35),inset_0_10px_16px_-8px_rgb(255_255_255/0.08),0_12px_28px_-12px_rgb(0_0_0/0.5)]";

const SPRING = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.8,
} as const;

const SEGS = 16;
const SPREAD = 17;
const DAMP = 0.9;
const GRAVITY = 0.05;

type Pt = { x: number; y: number; px: number; py: number };
type Thread = {
  pts: Pt[];
  lag: number;
  ax: number;
  ay: number;
  seeded: boolean;
};

export const WebShotLink = forwardRef<HTMLAnchorElement, WebShotLinkProps>(
  function WebShotLink(
    {
      size = "md",
      variant = "clear",
      reach = 140,
      threads = 5,
      className = "",
      style,
      children,
      ...rest
    },
    ref,
  ) {
    const reduced = useReducedMotion();
    const linkRef = useRef<HTMLAnchorElement | null>(null);
    const wrapRef = useRef<HTMLSpanElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const setRefs = useCallback(
      (node: HTMLAnchorElement | null) => {
        linkRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    useEffect(() => {
      const btn = linkRef.current;
      const wrap = wrapRef.current;
      const cv = canvasRef.current;
      const ctx = cv?.getContext("2d");
      if (reduced || !btn || !wrap || !cv || !ctx) return;

      const n = Math.max(1, Math.round(threads));
      const pad = reach + 24;
      let w = 0;
      let h = 0;
      let dpr = 1;
      let ink = "#fff";
      let active = false;
      let ext = 0;
      let raf = 0;
      const pointer = { x: 0, y: 0, known: false };
      const hold = { x: 0, y: 0 };
      const list: Thread[] = Array.from({ length: n }, (_, i) => ({
        pts: Array.from({ length: SEGS }, () => ({ x: 0, y: 0, px: 0, py: 0 })),
        lag: 0.14 + (((i * 37) % 10) / 10) * 0.22,
        ax: 0,
        ay: 0,
        seeded: false,
      }));

      const measure = () => {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = btn.offsetWidth;
        h = btn.offsetHeight;
        const cw = w + pad * 2;
        const ch = h + pad * 2;
        Object.assign(cv.style, {
          width: `${cw}px`,
          height: `${ch}px`,
          left: `${-pad}px`,
          top: `${-pad}px`,
        });
        cv.width = Math.round(cw * dpr);
        cv.height = Math.round(ch * dpr);
      };

      /* The pointer in canvas space, read from the centre so a press does not shift it. */
      const local = () => {
        const r = btn.getBoundingClientRect();
        return {
          x: pointer.x - (r.left + r.width / 2) + pad + w / 2,
          y: pointer.y - (r.top + r.height / 2) + pad + h / 2,
        };
      };

      /* Nearest point of the pill: centre of the end circle, the outward normal, and the distance outside the edge. */
      const cap = (x: number, y: number) => {
        const r = Math.min(w, h) / 2;
        const cy = pad + h / 2;
        const cx = Math.min(Math.max(x, pad + r), pad + w - r);
        const dx = x - cx;
        const dy = y - cy;
        const d = Math.hypot(dx, dy) || 1e-6;
        return { cx, cy, r, nx: dx / d, ny: dy / d, dist: d - r };
      };

      const kick = () => {
        if (!raf) raf = requestAnimationFrame(tick);
      };

      const path = (pts: { x: number; y: number }[]) => {
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let j = 1; j < pts.length - 1; j++) {
          ctx.quadraticCurveTo(
            pts[j].x,
            pts[j].y,
            (pts[j].x + pts[j + 1].x) / 2,
            (pts[j].y + pts[j + 1].y) / 2,
          );
        }
        ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
      };

      const draw = () => {
        ctx.save();
        ctx.strokeStyle = ink;
        ctx.lineCap = "round";
        ctx.globalAlpha = 0.92;
        ctx.lineWidth = 1.15;
        for (const s of list) {
          ctx.beginPath();
          path(s.pts);
          ctx.stroke();
        }
        if (ext > 0.35) {
          ctx.lineWidth = 0.8;
          ctx.globalAlpha = 0.7 * Math.min(1, (ext - 0.35) * 3);
          for (const at of [0.55, 0.78]) {
            const j = Math.round(at * (SEGS - 1));
            for (let i = 0; i < list.length - 1; i++) {
              const a = list[i].pts[j];
              const b = list[i + 1].pts[j];
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.quadraticCurveTo(
                (a.x + b.x) / 2,
                (a.y + b.y) / 2 + 3,
                b.x,
                b.y,
              );
              ctx.stroke();
            }
          }
        }
        ctx.restore();
      };

      const tick = () => {
        raf = 0;
        const p = local();
        const here = cap(p.x, p.y);
        const want = pointer.known && here.dist > 1 && here.dist < reach;
        // Re-read the colour each time threads appear, so a theme switch is picked up.
        if (want && !active) ink = getComputedStyle(wrap).color || ink;
        active = want;
        if (active) {
          hold.x = p.x;
          hold.y = p.y;
        }
        ext += ((active ? 1 : 0) - ext) * (active ? 0.1 : 0.2);
        if (!active && ext < 0.003) ext = 0;

        const hc = cap(hold.x, hold.y);
        const perpX = -hc.ny;
        const perpY = hc.nx;
        const inset = Math.min(6, hc.r * 0.5);

        list.forEach((s, i) => {
          const o = i - (n - 1) / 2;
          const b = cap(
            hc.cx + hc.nx * (hc.r - inset) + perpX * o * SPREAD,
            hc.cy + hc.ny * (hc.r - inset) + perpY * o * SPREAD,
          );
          const axT = b.cx + b.nx * (b.r - inset);
          const ayT = b.cy + b.ny * (b.r - inset);
          if (!s.seeded) {
            s.ax = axT;
            s.ay = ayT;
            for (const q of s.pts) {
              q.x = q.px = axT;
              q.y = q.py = ayT;
            }
            s.seeded = true;
          }
          if (active) {
            s.ax += (axT - s.ax) * 0.3;
            s.ay += (ayT - s.ay) * 0.3;
          }
          const dx = hold.x - s.ax;
          const dy = hold.y - s.ay;
          const d = Math.hypot(dx, dy) || 1e-6;
          const len = ext * Math.min(d, reach + hc.r);
          const seg = len / (SEGS - 1);
          const pts = s.pts;
          for (let j = 1; j < pts.length; j++) {
            const q = pts[j];
            const vx = (q.x - q.px) * DAMP;
            const vy = (q.y - q.py) * DAMP;
            q.px = q.x;
            q.py = q.y;
            q.x += vx;
            q.y += vy + GRAVITY * ext;
          }
          const tip = pts[pts.length - 1];
          tip.x += (s.ax + (dx / d) * len - tip.x) * s.lag;
          tip.y += (s.ay + (dy / d) * len - tip.y) * s.lag;
          pts[0].x = pts[0].px = s.ax;
          pts[0].y = pts[0].py = s.ay;
          for (let k = 0; k < 6; k++) {
            for (let j = 1; j < pts.length; j++) {
              const a = pts[j - 1];
              const q = pts[j];
              const ex = q.x - a.x;
              const ey = q.y - a.y;
              const el = Math.hypot(ex, ey) || 1e-6;
              if (el <= seg) continue;
              const diff = (el - seg) / el;
              if (j === 1) {
                q.x -= ex * diff;
                q.y -= ey * diff;
              } else {
                a.x += ex * diff * 0.5;
                a.y += ey * diff * 0.5;
                q.x -= ex * diff * 0.5;
                q.y -= ey * diff * 0.5;
              }
            }
          }
        });

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w + pad * 2, h + pad * 2);
        if (ext > 0.01) draw();

        if (active || ext > 0) kick();
        else for (const s of list) s.seeded = false;
      };

      const onMove = (e: PointerEvent) => {
        if (e.pointerType === "touch" && e.buttons === 0) return;
        pointer.x = e.clientX;
        pointer.y = e.clientY;
        pointer.known = true;
        if (raf) return;
        const r = btn.getBoundingClientRect();
        if (
          e.clientX > r.left - reach &&
          e.clientX < r.right + reach &&
          e.clientY > r.top - reach &&
          e.clientY < r.bottom + reach
        )
          kick();
      };
      const onEnd = (e: PointerEvent) => {
        if (e.pointerType !== "touch") return;
        pointer.known = false;
        kick();
      };
      const onOut = (e: PointerEvent) => {
        if (e.relatedTarget) return;
        pointer.known = false;
        kick();
      };

      measure();
      const ro = new ResizeObserver(() => {
        measure();
        kick();
      });
      ro.observe(btn);
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onMove, { passive: true });
      window.addEventListener("pointerup", onEnd, { passive: true });
      window.addEventListener("pointercancel", onEnd, { passive: true });
      document.addEventListener("pointerout", onOut, { passive: true });
      return () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerdown", onMove);
        window.removeEventListener("pointerup", onEnd);
        window.removeEventListener("pointercancel", onEnd);
        document.removeEventListener("pointerout", onOut);
      };
    }, [reduced, reach, threads]);

    const tint = VARIANTS[variant];

    return (
      <span
        ref={wrapRef}
        className="relative isolate inline-flex text-[var(--pf-fg)]"
      >
        {!reduced && (
          <canvas
            ref={canvasRef}
            aria-hidden
            className="pointer-events-none absolute -z-10"
          />
        )}
        <motion.a
          ref={setRefs}
          whileTap={reduced ? undefined : { scale: 0.96 }}
          transition={SPRING}
          className={`relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold tracking-[-0.01em] text-[var(--pf-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pf-accent)] ${GLASS} ${SIZES[size]} ${className}`}
          style={{
            ...(tint.background && { backgroundColor: tint.background }),
            ...(tint.color && { color: tint.color }),
            ...style,
          }}
          {...rest}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-[7%] top-[2px] h-[48%] rounded-full bg-gradient-to-b from-white/25 to-white/0"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-[20%] bottom-[2px] h-[34%] rounded-full bg-gradient-to-t from-white/15 to-white/0 blur-[2px]"
          />
          <span className="relative inline-flex items-center gap-3">
            {children}
          </span>
        </motion.a>
      </span>
    );
  },
);
