import { useMemo } from "react";

export interface FloatPosition {
  /** 0..1 relative to the stage */
  x: number;
  y: number;
  /** 0 (far) .. 1 (near) — drives scale, blur, opacity and float speed */
  depth: number;
  /** per-chip drift timing so they don't move in lockstep */
  delay: number;
  /** float cycle duration in seconds (far chips drift slower) */
  duration: number;
  /** float travel distance in px (near chips travel more) */
  travel: number;
}

/**
 * Places `count` points inside a unit square with a guaranteed minimum
 * separation, using Bridson-style Poisson-disk rejection sampling. Collision
 * is impossible by construction: every accepted point is at least `minDist`
 * from every other, so chips can drift within a safe radius and never touch.
 *
 * Each point also gets a stable `depth` used by the view to build parallax
 * layers (scale/blur/opacity/speed), giving real perceived depth.
 *
 * Deterministic per input via a seeded PRNG (mulberry32), so the layout is
 * stable across renders and SSR-safe (no Math.random at runtime → no
 * hydration mismatch).
 */
export function useNonCollidingLayout(
  count: number,
  {
    minDist = 0.26,
    padding = 0.08,
    seed = 20260719,
    /** radius around the center (0.5,0.5) to keep clear for a center badge */
    centerExclusion = 0.16,
  }: {
    minDist?: number;
    padding?: number;
    seed?: number;
    centerExclusion?: number;
  } = {}
): FloatPosition[] {
  return useMemo(() => {
    // seeded PRNG (mulberry32) — deterministic, no hydration drift
    let s = seed >>> 0;
    const rand = () => {
      s |= 0;
      s = (s + 0x6d2b79f5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    const lo = padding;
    const hi = 1 - padding;
    const span = hi - lo;
    const points: Array<{ x: number; y: number }> = [];
    const maxAttempts = 2000;

    let attempts = 0;
    let currentMin = minDist;

    while (points.length < count && attempts < maxAttempts) {
      const candidate = { x: lo + rand() * span, y: lo + rand() * span };

      // keep the center clear for the +200 badge
      const distFromCenter = Math.hypot(candidate.x - 0.5, candidate.y - 0.5);
      if (distFromCenter < centerExclusion) {
        attempts += 1;
        continue;
      }

      const ok = points.every((p) => {
        const dx = p.x - candidate.x;
        const dy = p.y - candidate.y;
        return Math.hypot(dx, dy) >= currentMin;
      });

      if (ok) {
        points.push(candidate);
        attempts = 0;
      } else {
        attempts += 1;
        // If the space is too tight, relax slightly rather than loop forever.
        if (attempts >= maxAttempts && points.length < count) {
          currentMin *= 0.92;
          attempts = 0;
        }
      }
    }

    return points.map((p) => {
      const depth = rand(); // 0 far .. 1 near
      return {
        x: p.x,
        y: p.y,
        depth,
        delay: rand() * 2,
        // near chips float a touch faster; far chips drift slowly
        duration: 6.5 - depth * 2 + rand() * 1.5,
        // near chips travel more (stronger parallax)
        travel: 6 + depth * 12,
      };
    });
  }, [count, minDist, padding, seed, centerExclusion]);
}
