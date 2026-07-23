import { useCallback, useEffect, useRef, useState } from "react";

interface UseCarouselOptions {
  /** selector for the scrollable items inside the track */
  itemSelector: string;
  /** total number of items, used for indicator state */
  itemCount: number;
  /** advance automatically while the user isn't interacting */
  autoplay?: boolean;
  /** delay between automatic advances, in ms */
  autoplayDelay?: number;
}

interface UseCarouselResult {
  trackRef: React.RefObject<HTMLDivElement | null>;
  activeIndex: number;
  canPrev: boolean;
  canNext: boolean;
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollToIndex: (index: number) => void;
}

const EDGE_TOLERANCE = 4;

export function useCarousel({
  itemSelector,
  itemCount,
  autoplay = false,
  autoplayDelay = 4500,
}: UseCarouselOptions): UseCarouselResult {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const interactingRef = useRef(false);

  const step = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const item = track.querySelector<HTMLElement>(itemSelector);
    if (!item) return track.clientWidth;
    const style = getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap || "0") || 0;
    return item.offsetWidth + gap;
  }, [itemSelector]);

  const scrollPrev = useCallback(() => {
    trackRef.current?.scrollBy({ left: -step(), behavior: "smooth" });
  }, [step]);

  const scrollNext = useCallback(() => {
    trackRef.current?.scrollBy({ left: step(), behavior: "smooth" });
  }, [step]);

  const scrollToIndex = useCallback(
    (index: number) => {
      trackRef.current?.scrollTo({ left: step() * index, behavior: "smooth" });
    },
    [step]
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const syncState = () => {
      const max = track.scrollWidth - track.clientWidth;
      const next = Math.round(track.scrollLeft / step());
      setActiveIndex((prev) => (prev === next ? prev : next));
      setCanPrev(track.scrollLeft > EDGE_TOLERANCE);
      setCanNext(track.scrollLeft < max - EDGE_TOLERANCE);
    };

    syncState();
    track.addEventListener("scroll", syncState, { passive: true });
    window.addEventListener("resize", syncState);

    return () => {
      track.removeEventListener("scroll", syncState);
      window.removeEventListener("resize", syncState);
    };
  }, [step, itemCount]);

  // Drag with a mouse. Touch is left to the browser's native momentum scroll.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let dragging = false;
    let startX = 0;
    let startScroll = 0;
    let moved = false;
    let capturedId: number | null = null;

    const DRAG_THRESHOLD = 6;

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      dragging = true;
      moved = false;
      startX = event.clientX;
      startScroll = track.scrollLeft;
      interactingRef.current = true;
      // No pointer capture here: capturing on press would redirect the
      // pointer stream to the track and buttons inside would never get
      // their click. Capture only starts once a real drag begins.
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      const delta = event.clientX - startX;
      if (!moved && Math.abs(delta) > DRAG_THRESHOLD) {
        moved = true;
        capturedId = event.pointerId;
        track.setPointerCapture(event.pointerId);
        track.classList.add("cursor-grabbing");
      }
      if (!moved) return;
      track.scrollLeft = startScroll - delta;
    };

    const endDrag = (event: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      interactingRef.current = false;
      if (capturedId !== null && track.hasPointerCapture(capturedId)) {
        track.releasePointerCapture(capturedId);
      }
      capturedId = null;
      track.classList.remove("cursor-grabbing");
      // Clear the drag flag after the click event for this gesture has been
      // dispatched, so a stale value never swallows the next click.
      window.setTimeout(() => {
        moved = false;
      }, 0);
      void event;
    };

    const suppressClickAfterDrag = (event: MouseEvent) => {
      if (!moved) return;
      event.preventDefault();
      event.stopPropagation();
    };

    track.addEventListener("pointerdown", onPointerDown);
    track.addEventListener("pointermove", onPointerMove);
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);
    track.addEventListener("click", suppressClickAfterDrag, true);

    return () => {
      track.removeEventListener("pointerdown", onPointerDown);
      track.removeEventListener("pointermove", onPointerMove);
      track.removeEventListener("pointerup", endDrag);
      track.removeEventListener("pointercancel", endDrag);
      track.removeEventListener("click", suppressClickAfterDrag, true);
    };
  }, []);

  // Vertical wheel scrolls the track horizontally, but only while the track
  // still has room in that direction so the page keeps scrolling at the edges.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      const max = track.scrollWidth - track.clientWidth;
      const goingForward = event.deltaY > 0;
      const hasRoom = goingForward
        ? track.scrollLeft < max - EDGE_TOLERANCE
        : track.scrollLeft > EDGE_TOLERANCE;
      if (!hasRoom) return;
      event.preventDefault();
      track.scrollLeft += event.deltaY;
    };

    track.addEventListener("wheel", onWheel, { passive: false });
    return () => track.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !autoplay) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const pause = () => {
      interactingRef.current = true;
    };
    const resume = () => {
      interactingRef.current = false;
    };

    const timer = window.setInterval(() => {
      if (interactingRef.current || document.hidden) return;
      const max = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= max - EDGE_TOLERANCE) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        track.scrollBy({ left: step(), behavior: "smooth" });
      }
    }, autoplayDelay);

    track.addEventListener("pointerenter", pause);
    track.addEventListener("pointerleave", resume);
    track.addEventListener("focusin", pause);
    track.addEventListener("focusout", resume);

    return () => {
      window.clearInterval(timer);
      track.removeEventListener("pointerenter", pause);
      track.removeEventListener("pointerleave", resume);
      track.removeEventListener("focusin", pause);
      track.removeEventListener("focusout", resume);
    };
  }, [autoplay, autoplayDelay, step]);

  return {
    trackRef,
    activeIndex,
    canPrev,
    canNext,
    scrollPrev,
    scrollNext,
    scrollToIndex,
  };
}
