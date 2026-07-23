"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import type { PointerPosition } from "@/hooks/use-mouse-tracking";

interface HeroBackdropProps {
  pointerRef: MutableRefObject<PointerPosition>;
}

interface Particle {
  x: number;
  y: number;
  z: number; // depth 0..1
  r: number;
  vx: number;
  vy: number;
  seed: number;
}

/**
 * GPU-free Hero backdrop. Two layers:
 *
 * 1. CSS aurora — large blurred gradient blobs animated purely with CSS
 *    transforms/opacity (compositor-only, no main-thread cost).
 * 2. Canvas 2D depth particles — a few hundred soft dots with depth-based
 *    size/opacity/parallax. Canvas 2D is dramatically cheaper than a WebGL
 *    context here and stays smooth on CPU, so it doesn't tank Lighthouse
 *    the way a software-rendered WebGL hero does.
 *
 * The render loop pauses when the tab is hidden and respects
 * prefers-reduced-motion (particles drawn once, no animation).
 */
export function HeroBackdrop({ pointerRef }: HeroBackdropProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles: Particle[] = [];
    let raf = 0;
    const smooth = { x: 0, y: 0 };

    function build() {
      // Scaled by CSS pixels (width/height are already DPR-multiplied) and
      // capped low: these run during initial load, so every particle costs
      // main-thread time when it matters most.
      const cssArea = (width * height) / (dpr * dpr);
      const count = Math.min(150, Math.max(70, Math.floor(cssArea / 7000)));
      particles = Array.from({ length: count }, () => {
        const z = Math.random();
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          z,
          r: (0.6 + z * 1.8) * dpr,
          vx: (Math.random() - 0.5) * 0.06 * (0.4 + z),
          vy: (Math.random() - 0.5) * 0.06 * (0.4 + z),
          seed: Math.random() * Math.PI * 2,
        };
      });
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width * dpr;
      height = rect.height * dpr;
      canvas!.width = width;
      canvas!.height = height;
      build();
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);

      // ease pointer for weighted parallax
      smooth.x += (pointerRef.current.x - smooth.x) * 0.05;
      smooth.y += (pointerRef.current.y - smooth.y) * 0.05;

      for (const p of particles) {
        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;
          // wrap around edges
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }

        // depth parallax: nearer particles shift more with the pointer
        const px = p.x + smooth.x * (10 + p.z * 40) * dpr;
        const py = p.y + smooth.y * (10 + p.z * 40) * dpr;

        const alpha = 0.15 + p.z * 0.5;
        const color = p.z > 0.6 ? "125, 211, 252" : "139, 92, 246";
        ctx!.beginPath();
        ctx!.arc(px, py, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${color}, ${alpha})`;
        ctx!.fill();
      }

      if (!prefersReducedMotion) raf = requestAnimationFrame(draw);
    }

    resize();
    draw();

    let inView = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        inView = entry.isIntersecting;
        cancelAnimationFrame(raf);
        if (inView && !document.hidden && !prefersReducedMotion) {
          raf = requestAnimationFrame(draw);
        }
      },
      { rootMargin: "100px" }
    );
    io.observe(canvas);

    const onVisibility = () => {
      if (document.hidden || !inView) {
        cancelAnimationFrame(raf);
      } else if (!prefersReducedMotion) {
        raf = requestAnimationFrame(draw);
      }
    };

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      io.disconnect();
    };
  }, [pointerRef]);

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {/* CSS aurora blobs (compositor-only) */}
      <div className="hero-aurora hero-aurora--a" />
      <div className="hero-aurora hero-aurora--b" />
      <div className="hero-aurora hero-aurora--c" />
      {/* Canvas 2D depth particles */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
