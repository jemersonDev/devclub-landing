import { useCallback, type PointerEvent } from "react";

/**
 * Returns an `onPointerMove` handler that writes the pointer's position
 * (relative to the target element) into the `--mx` / `--my` CSS custom
 * properties. Pair it with a radial-gradient background that reads those
 * vars to get a cursor-following glow.
 *
 * Centralizes logic that was previously duplicated across GlassCard, the
 * Results cards, and the About cards.
 */
export function usePointerGlow<T extends HTMLElement = HTMLElement>() {
  return useCallback((event: PointerEvent<T>) => {
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    el.style.setProperty("--my", `${event.clientY - rect.top}px`);
  }, []);
}
