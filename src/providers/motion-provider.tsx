"use client";

import { useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";

/**
 * Wraps the app in MotionConfig so every Framer Motion animation respects
 * the OS-level prefers-reduced-motion setting.
 *
 * IMPORTANT: `reducedMotion="user"` reads `window.matchMedia` internally.
 * During SSR there's no `window`, so the server always renders assuming
 * "no preference" — but a real visitor with reduced motion enabled would
 * get a different (reduced) style output on the client's first render,
 * which is a genuine hydration mismatch (Framer Motion's `initial` styles
 * are baked into the SSR markup as inline styles, and React compares
 * those against what the client computes during hydration).
 *
 * Fix: force "never" (matching the SSR default) until after mount, then
 * switch to the real "user" preference. The first client render this way
 * is byte-for-byte identical to the server output; the switch to the
 * real preference happens as a normal *post-hydration* state update,
 * which React does not warn about.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [reducedMotion, setReducedMotion] = useState<"never" | "user">(
    "never"
  );

  useEffect(() => {
    setReducedMotion("user");
  }, []);

  return (
    <MotionConfig reducedMotion={reducedMotion}>{children}</MotionConfig>
  );
}
