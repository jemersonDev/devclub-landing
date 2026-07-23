import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

interface UseMagneticOptions {
  /** how strongly the element follows the pointer, 0-1 */
  strength?: number;
  /** disable on touch/coarse pointers automatically */
  disabled?: boolean;
}

export function useMagnetic<T extends HTMLElement>({
  strength = 0.4,
  disabled = false,
}: UseMagneticOptions = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;

    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarsePointer) return;

    const quickX = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const quickY = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
    const quickScale = gsap.quickTo(el, "scale", {
      duration: 0.4,
      ease: "power3.out",
    });

    function handlePointerMove(event: PointerEvent) {
      const rect = el!.getBoundingClientRect();
      const relX = event.clientX - (rect.left + rect.width / 2);
      const relY = event.clientY - (rect.top + rect.height / 2);
      quickX(relX * strength);
      quickY(relY * strength);
    }

    function handlePointerEnter() {
      quickScale(1.06);
    }

    function handlePointerLeave() {
      quickX(0);
      quickY(0);
      quickScale(1);
    }

    el.addEventListener("pointermove", handlePointerMove);
    el.addEventListener("pointerenter", handlePointerEnter);
    el.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      el.removeEventListener("pointermove", handlePointerMove);
      el.removeEventListener("pointerenter", handlePointerEnter);
      el.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [strength, disabled]);

  return ref;
}
