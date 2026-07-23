"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CarouselArrowProps {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
  label: string;
  /** distance from the top of the track, in px */
  offsetTop?: number;
}

export function CarouselArrow({
  direction,
  disabled,
  onClick,
  label,
  offsetTop = 150,
}: CarouselArrowProps) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      style={{ top: offsetTop }}
      className={cn(
        "group/arrow absolute z-30 flex h-28 w-14 -translate-y-1/2 items-center justify-center overflow-hidden rounded-2xl",
        "border border-white/20 bg-white/[0.07] backdrop-blur-md",
        "shadow-panel",
        "transition-all duration-300 ease-cinematic",
        "opacity-0 group-hover/carousel:opacity-100 focus-visible:opacity-100 max-md:opacity-100",
        "hover:scale-[1.04] hover:border-accent-cyan/60 hover:bg-white/[0.12]",
        "hover:shadow-glow-cyan-lg",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan",
        "disabled:pointer-events-none disabled:!opacity-0",
        direction === "prev" ? "left-0 -translate-x-2" : "right-0 translate-x-2"
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/[0.06]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/arrow:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(56,189,248,0.28), transparent 70%)",
        }}
      />
      <Icon
        className="relative h-9 w-9 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] transition-transform duration-300 ease-cinematic group-hover/arrow:scale-110"
        strokeWidth={2.25}
        aria-hidden
      />
    </button>
  );
}
