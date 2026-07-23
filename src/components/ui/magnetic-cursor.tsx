"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Renders a custom cursor ring that lags behind the real pointer and
 * expands over any element carrying `data-cursor-hover`. Fully skips
 * itself on touch/coarse-pointer devices (no DOM mounted at all, so
 * there's no stray dot pinned at the corner on mobile) and fades in
 * only after the first real pointer movement to avoid a flash at 0,0
 * before any coordinates are known.
 */
export function MagneticCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [isFinePointer, setIsFinePointer] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(pointer: fine)");
    setIsFinePointer(mql.matches);
    const handleChange = (event: MediaQueryListEvent) =>
      setIsFinePointer(event.matches);
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (!isFinePointer || !ringRef.current || !dotRef.current) return;

    const ring = ringRef.current;
    const dot = dotRef.current;

    gsap.set([ring, dot], { xPercent: -50, yPercent: -50, opacity: 0 });

    const quickRingX = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3.out" });
    const quickRingY = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3.out" });
    const quickDotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
    const quickDotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });

    let hasMoved = false;

    function handlePointerMove(event: PointerEvent) {
      quickRingX(event.clientX);
      quickRingY(event.clientY);
      quickDotX(event.clientX);
      quickDotY(event.clientY);

      if (!hasMoved) {
        hasMoved = true;
        gsap.to([ring, dot], { opacity: (i) => (i === 0 ? 0.5 : 1), duration: 0.3 });
      }
    }

    function handleOver(event: PointerEvent) {
      const target = (event.target as HTMLElement)?.closest(
        "[data-cursor-hover]"
      );
      gsap.to(ring, {
        scale: target ? 2.2 : 1,
        opacity: target ? 0.9 : 0.5,
        duration: 0.35,
        ease: "power3.out",
      });
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerover", handleOver, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerover", handleOver);
    };
  }, [isFinePointer]);

  if (!isFinePointer) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100]">
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-accent-cyan opacity-0"
      />
      <div
        ref={ringRef}
        className="fixed left-0 top-0 h-8 w-8 rounded-full border border-accent-cyan/60 opacity-0"
      />
    </div>
  );
}
