import { useEffect, useRef } from "react";

export interface PointerPosition {
  /** -1 to 1, relative to viewport center */
  x: number;
  y: number;
  /** raw client coordinates */
  clientX: number;
  clientY: number;
}

/**
 * Tracks pointer position without triggering React re-renders — consumers
 * read `positionRef.current` inside rAF/useFrame loops for smooth,
 * allocation-free animation.
 */
export function useMouseTracking() {
  const positionRef = useRef<PointerPosition>({
    x: 0,
    y: 0,
    clientX: 0,
    clientY: 0,
  });

  useEffect(() => {
    function handlePointerMove(event: PointerEvent) {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;
      positionRef.current = {
        x,
        y,
        clientX: event.clientX,
        clientY: event.clientY,
      };
    }

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return positionRef;
}
