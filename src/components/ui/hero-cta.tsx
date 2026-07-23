"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { useMagnetic } from "@/hooks/use-magnetic";
import { cn } from "@/lib/utils";

interface HeroCtaProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * The Hero's primary call to action. Layers several micro-interactions:
 * magnetic pull toward the cursor, an inner glow that tracks the pointer
 * within the button, a sliding arrow, and a soft gradient sheen — all
 * GPU-friendly (transform/opacity only) and consistent with the site's
 * existing magnetic + glass language.
 */
export function HeroCta({ href, children, className }: HeroCtaProps) {
  const magneticRef = useMagnetic<HTMLAnchorElement>({ strength: 0.4 });
  const glowRef = useRef<HTMLSpanElement>(null);

  function handlePointerMove(event: React.PointerEvent<HTMLAnchorElement>) {
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    glowRef.current?.style.setProperty("--gx", `${x}px`);
    glowRef.current?.style.setProperty("--gy", `${y}px`);
  }

  return (
    <Link
      href={href}
      ref={magneticRef}
      data-cursor-hover
      onPointerMove={handlePointerMove}
      className={cn(
        "group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-evolution px-8 py-4 font-display text-sm font-medium text-bg-primary transition-[filter,transform] duration-300 ease-cinematic hover:brightness-110 active:scale-[0.97]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
        className
      )}
    >
      {/* cursor-following inner glow */}
      <span
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(120px circle at var(--gx, 50%) var(--gy, 50%), rgba(255,255,255,0.5), transparent 60%)",
        }}
      />
      <span className="relative">{children}</span>
      <ArrowRight className="relative h-4 w-4 transition-transform duration-300 ease-cinematic group-hover:translate-x-1" />
    </Link>
  );
}
