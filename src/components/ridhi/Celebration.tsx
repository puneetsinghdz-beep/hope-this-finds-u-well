import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export type CelebrationVariant = "open" | "finale";

// Palette tokens only; a few deeper mixes so pastel confetti stays visible on the pale background.
const FILLS = [
  "var(--rose)", "var(--sky)", "var(--accent)", "var(--butter)", "var(--card)",
  "color-mix(in oklab, var(--rose) 75%, var(--heading))", "color-mix(in oklab, var(--sky) 70%, var(--heading))", "var(--heading)",
];
const GLYPH_FILLS = ["var(--rose)", "color-mix(in oklab, var(--rose) 70%, var(--heading))", "color-mix(in oklab, var(--sky) 65%, var(--heading))", "var(--butter)"];

type Bit = {
  x: number; y: number; // origin in vw / vh
  dx: number; dy: number; r: number; delay: number; dur: number; size: number;
  shape: "rect" | "dot" | "star" | "heart"; fill: string; motion: "burst" | "rain";
};

const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)]!;
const shape = (): Bit["shape"] => { const n = Math.random(); return n < 0.1 ? "heart" : n < 0.22 ? "star" : n < 0.5 ? "dot" : "rect"; };

/** A cannon at (x,y) firing `n` pieces in a cone around angle `deg` (0 = right, -90 = up). */
function cannon(x: number, y: number, deg: number, spread: number, n: number, delay: number, power: number, w: number, h: number): Bit[] {
  return Array.from({ length: n }, () => {
    const a = ((deg + rnd(-spread, spread)) * Math.PI) / 180;
    const v = rnd(0.35, 1) * power;
    const s = shape();
    return {
      x, y, dx: Math.cos(a) * v * w, dy: Math.sin(a) * v * h, r: rnd(-900, 900), delay: delay + rnd(0, 0.25),
      dur: rnd(2.4, 3.4), size: s === "heart" || s === "star" ? rnd(14, 22) : rnd(7, 13), shape: s,
      fill: s === "heart" || s === "star" ? pick(GLYPH_FILLS) : pick(FILLS), motion: "burst",
    };
  });
}

function rain(n: number, from: number, to: number, glyphsOnly = false): Bit[] {
  return Array.from({ length: n }, () => {
    const s = glyphsOnly ? (Math.random() < 0.5 ? "heart" : "star") : shape();
    return {
      x: rnd(2, 98), y: -6, dx: rnd(-40, 40), dy: 0, r: rnd(360, 900), delay: rnd(from, to), dur: rnd(2.6, 3.6),
      size: s === "heart" || s === "star" ? rnd(12, 20) : rnd(6, 11), shape: s,
      fill: s === "heart" || s === "star" ? pick(GLYPH_FILLS) : pick(FILLS), motion: "rain",
    };
  });
}

function makeBits(variant: CelebrationVariant): Bit[] {
  const w = window.innerWidth, h = window.innerHeight, small = w < 640, k = small ? 0.6 : 1;
  const n = (x: number) => Math.round(x * k);
  if (variant === "open") {
    return [
      // wave 1: party poppers from both bottom corners
      ...cannon(0, 100, -60, 22, n(34), 0, 1.05, w, h), ...cannon(100, 100, -120, 22, n(34), 0, 1.05, w, h),
      // wave 2: from the upper left and right edges
      ...cannon(0, 22, -15, 30, n(22), 0.35, 0.8, w, h), ...cannon(100, 22, -165, 30, n(22), 0.35, 0.8, w, h),
      // wave 3: a pop from the top centre
      ...cannon(50, 8, 90, 70, n(26), 0.7, 0.6, w, h),
      ...rain(n(30), 0.5, 1.8),
    ];
  }
  // finale: cannons from mid-height on both sides, twice, then a soft fall of hearts and stars
  return [
    ...cannon(0, 62, -45, 25, n(30), 0.15, 1, w, h), ...cannon(100, 62, -135, 25, n(30), 0.15, 1, w, h),
    ...cannon(0, 40, -30, 25, n(20), 0.8, 0.85, w, h), ...cannon(100, 40, -150, 25, n(20), 0.8, 0.85, w, h),
    ...rain(n(26), 0.4, 1.6), ...rain(n(14), 0.6, 2, true),
  ];
}

function Piece({ b, calm }: { b: Bit; calm: boolean }) {
  const glyph = b.shape === "heart" ? "♥" : b.shape === "star" ? "✦" : null;
  const style = ({
    left: `${b.x}vw`, top: `${b.y}vh`, lineHeight: 1,
    ...(glyph ? { fontSize: b.size, color: b.fill } : { width: b.size, height: b.shape === "rect" ? b.size * 1.6 : b.size, background: b.fill }),
    "--dx": `${b.dx}px`, "--dy": `${b.dy}px`, "--r": `${b.r}deg`,
    animation: calm
      ? `twinkle 3.4s ease-in-out ${b.delay}s both`
      : b.motion === "burst" ? `popper ${b.dur}s cubic-bezier(.12,.75,.3,1) ${b.delay}s both` : `rain ${b.dur}s linear ${b.delay}s both`,
  }) as unknown as React.CSSProperties;
  const cls = `absolute ${calm ? "calm-bit" : ""} ${glyph ? "" : b.shape === "rect" ? "rounded-[2px]" : "rounded-full"} ${glyph ? "" : "shadow-soft"}`;
  return <span className={cls} style={style}>{glyph}</span>;
}

/**
 * Viewport-level celebration rendered into <body>, so no card or overflow rule can clip it.
 * Mount it with a new `key` to fire again; it fades out after ~4s and unmounts itself.
 * With reduced motion it shows a gentle, still sparkle that fades in and out instead.
 */
export function Celebration({ variant }: { variant: CelebrationVariant }) {
  const [state] = useState(() => {
    if (typeof window === "undefined") return null;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const bits = calm
      ? Array.from({ length: 34 }, (_, i): Bit => ({ x: rnd(3, 97), y: rnd(4, 94), dx: 0, dy: 0, r: 0, delay: rnd(0, 0.6), dur: 3.4, size: i % 3 ? rnd(7, 11) : rnd(14, 20), shape: i % 3 ? (i % 2 ? "dot" : "rect") : i % 2 ? "heart" : "star", fill: i % 3 ? pick(FILLS) : pick(GLYPH_FILLS), motion: "burst" }))
      : makeBits(variant);
    return { calm, bits };
  });
  const [on, setOn] = useState(true);
  useEffect(() => { const t = setTimeout(() => setOn(false), 4800); return () => clearTimeout(t); }, []);
  if (!on || !state) return null;
  return createPortal(
    <div aria-hidden data-celebration={variant} className="pointer-events-none fixed inset-0 z-[45] overflow-hidden calm-bit" style={{ animation: "fade-out .9s 3.9s ease forwards" }}>
      {state.bits.map((b, i) => <Piece key={i} b={b} calm={state.calm} />)}
    </div>,
    document.body,
  );
}
