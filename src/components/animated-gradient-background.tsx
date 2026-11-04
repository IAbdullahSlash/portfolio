import { useEffect, useRef, type CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";

/* ==========================================================================
   Animated Gradient Background

   A radial gradient anchored near the top of its container that scales in
   on mount and, with `breathing`, slowly widens and narrows. Colours accept
   any CSS colour, theme tokens included, so it follows the light and dark
   themes. A still gradient is written once; only breathing runs a frame
   loop, and reduced motion keeps it still.
   ========================================================================== */

export interface AnimatedGradientBackgroundProps {
  /** Starting size of the gradient, in % of the container. */
  startingGap?: number;
  /** Slowly widen and narrow the gradient. */
  breathing?: boolean;
  /** Colours from the centre outward; one per entry in `gradientStops`. */
  gradientColors?: string[];
  /** Stop positions (0–100) matching `gradientColors`. */
  gradientStops?: number[];
  /** Breathing speed, in % per frame. */
  animationSpeed?: number;
  /** How far the gradient breathes either way, in %. */
  breathingRange?: number;
  /** Extra height added to the gradient, in %. */
  topOffset?: number;
  containerStyle?: CSSProperties;
  containerClassName?: string;
}

export function AnimatedGradientBackground({
  startingGap = 125,
  breathing = false,
  gradientColors = [
    "#0A0A0A",
    "#2979FF",
    "#FF80AB",
    "#FF6D00",
    "#FFD600",
    "#00E676",
    "#3D5AFE",
  ],
  gradientStops = [35, 50, 60, 70, 80, 90, 100],
  animationSpeed = 0.02,
  breathingRange = 5,
  topOffset = 0,
  containerStyle,
  containerClassName = "",
}: AnimatedGradientBackgroundProps) {
  if (gradientColors.length !== gradientStops.length) {
    throw new Error(
      `gradientColors and gradientStops must have the same length (got ${gradientColors.length} and ${gradientStops.length}).`,
    );
  }

  const reduced = useReducedMotion();
  const layerRef = useRef<HTMLDivElement>(null);
  // Joined so a new but equal array from the parent doesn't restart the loop.
  const stops = gradientStops
    .map((stop, i) => `${gradientColors[i]} ${stop}%`)
    .join(", ");

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    const paint = (width: number) => {
      layer.style.background = `radial-gradient(${width}% ${width + topOffset}% at 50% 20%, ${stops})`;
    };

    paint(startingGap);
    if (!breathing || reduced) return;

    let width = startingGap;
    let direction = 1;
    let raf = 0;
    const tick = () => {
      if (width >= startingGap + breathingRange) direction = -1;
      if (width <= startingGap - breathingRange) direction = 1;
      width += direction * animationSpeed;
      paint(width);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [
    stops,
    startingGap,
    breathing,
    reduced,
    animationSpeed,
    breathingRange,
    topOffset,
  ]);

  return (
    <motion.div
      aria-hidden
      initial={reduced ? false : { opacity: 0, scale: 1.5 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: { duration: 2, ease: [0.25, 0.1, 0.25, 1] },
      }}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${containerClassName}`}
    >
      <div ref={layerRef} style={containerStyle} className="absolute inset-0" />
    </motion.div>
  );
}
