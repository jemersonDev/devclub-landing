"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** max rotation in degrees */
  maxTilt?: number;
}

export function TiltCard({ children, className, maxTilt = 10 }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  // gsap.set once so the glare's centering transform (xPercent/yPercent)
  // is established independently of the left/top position we tween later —
  // mixing translate-* utility classes with gsap's own `x`/`y` properties
  // would fight over the same `transform` CSS property.
  useEffect(() => {
    if (glareRef.current) {
      gsap.set(glareRef.current, { xPercent: -50, yPercent: -50 });
    }
  }, []);

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    const rotateY = (px - 0.5) * maxTilt * 2;
    const rotateX = (0.5 - py) * maxTilt * 2;

    gsap.to(card, {
      rotateX,
      rotateY,
      transformPerspective: 800,
      duration: 0.5,
      ease: "power3.out",
    });

    if (glareRef.current) {
      gsap.to(glareRef.current, {
        left: `${px * 100}%`,
        top: `${py * 100}%`,
        opacity: 0.15,
        duration: 0.4,
        ease: "power3.out",
      });
    }
  }

  function handlePointerLeave() {
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.7,
      ease: "elastic.out(1, 0.6)",
    });
    if (glareRef.current) {
      gsap.to(glareRef.current, { opacity: 0, duration: 0.4 });
    }
  }

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn(
        "relative [transform-style:preserve-3d] will-change-transform",
        className
      )}
    >
      {children}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
      >
        <div
          ref={glareRef}
          className="absolute left-1/2 top-1/2 h-[140%] w-[140%] opacity-0"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.6), transparent 55%)",
          }}
        />
      </div>
    </div>
  );
}
