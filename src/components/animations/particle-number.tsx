"use client";

import { useEffect, useRef } from "react";
import { sampleGlyphPoints } from "@/three/utils/sample-glyph-points";
import { BRAND_COLORS } from "@/constants/colors";

interface ParticleNumberProps {
  text: string;
  className?: string;
  particleColor?: string;
  particleCount?: number;
}

/**
 * Cheap Canvas 2D counterpart to the Hero's WebGL particle symbol: samples
 * the target text's glyph shape and animates scattered dots converging into
 * it once the element scrolls into view. No extra WebGL context needed.
 */
export function ParticleNumber({
  text,
  className,
  particleColor = BRAND_COLORS.blue,
  particleCount = 900,
}: ParticleNumberProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !container) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let progress = 0;
    let started = false;

    // Reuse the glyph-sampling utility (built for the Hero's 3D symbol) in
    // 2D screen-space: sample in a normalized 512x512 canvas, then scale.
    const targetPoints3D = sampleGlyphPoints(text, {
      count: particleCount,
      canvasSize: 512,
      planeWidth: 1,
    });

    const particles = Array.from({ length: particleCount }, (_, i) => ({
      startX: Math.random(),
      startY: Math.random(),
      targetX: targetPoints3D[i * 3]! + 0.5,
      targetY: -targetPoints3D[i * 3 + 1]! + 0.5,
      radius: Math.random() * 1.4 + 0.6,
    }));

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2);
      width = canvas!.clientWidth;
      height = canvas!.clientHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.scale(dpr, dpr);
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);
      const eased = 1 - Math.pow(1 - progress, 3);

      for (const p of particles) {
        const x = (p.startX + (p.targetX - p.startX) * eased) * width;
        const y = (p.startY + (p.targetY - p.startY) * eased) * height;
        ctx!.beginPath();
        ctx!.fillStyle = particleColor;
        ctx!.globalAlpha = 0.5 + eased * 0.5;
        ctx!.arc(x, y, p.radius, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;

      if (progress < 1) {
        progress = Math.min(1, progress + 0.018);
        animationFrame = requestAnimationFrame(draw);
      }
    }

    resize();
    window.addEventListener("resize", resize);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !started) {
          started = true;
          if (prefersReducedMotion) {
            progress = 1;
            draw();
          } else {
            animationFrame = requestAnimationFrame(draw);
          }
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(container);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, [text, particleColor, particleCount]);

  return (
    <div ref={containerRef} className={className}>
      <canvas ref={canvasRef} aria-hidden style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
