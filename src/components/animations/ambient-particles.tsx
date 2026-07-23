"use client";

import { useEffect, useRef } from "react";
import { PARTICLE_COLORS } from "@/constants/colors";

interface AmbientParticlesProps {
  count?: number;
  className?: string;
  colors?: string[];
}

const DEFAULT_COLORS = PARTICLE_COLORS;

/**
 * A cheap, dependency-free ambient particle field for sections that don't
 * warrant a full WebGL context (reserved for the Hero and Companies orbit).
 * Respects prefers-reduced-motion by rendering a single static frame.
 */
export function AmbientParticles({
  count = 60,
  className,
  colors = DEFAULT_COLORS,
}: AmbientParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let animationFrame = 0;

    const particles = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      radius: Math.random() * 1.6 + 0.4,
      speed: Math.random() * 0.00015 + 0.00004,
      drift: Math.random() * Math.PI * 2,
      color: colors[Math.floor(Math.random() * colors.length)]!,
      alpha: Math.random() * 0.4 + 0.15,
    }));

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2);
      width = canvas!.clientWidth;
      height = canvas!.clientHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.scale(dpr, dpr);
    }

    function draw(time: number) {
      ctx!.clearRect(0, 0, width, height);
      for (const p of particles) {
        const y = (p.y + time * p.speed) % 1;
        const x = p.x + Math.sin(time * 0.0002 + p.drift) * 0.02;
        ctx!.beginPath();
        ctx!.fillStyle = p.color;
        ctx!.globalAlpha = p.alpha;
        ctx!.arc(x * width, y * height, p.radius, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;
      animationFrame = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);

    // Only animate while the canvas is actually on-screen. Off-screen
    // sections stop their rAF loop entirely — big CPU saving with several
    // particle fields across the page.
    let inView = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        inView = entry.isIntersecting;
        if (inView && !prefersReducedMotion) {
          cancelAnimationFrame(animationFrame);
          animationFrame = requestAnimationFrame(draw);
        } else {
          cancelAnimationFrame(animationFrame);
        }
      },
      { rootMargin: "100px" }
    );
    io.observe(canvas);

    if (prefersReducedMotion) {
      draw(0);
    } else {
      animationFrame = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      io.disconnect();
    };
  }, [count, colors]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
