"use client";

import Link from "next/link";
import { useMagnetic } from "@/hooks/use-magnetic";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "glass";
  className?: string;
}

export function MagneticButton({
  href,
  children,
  variant = "glass",
  className,
}: MagneticButtonProps) {
  const magneticRef = useMagnetic<HTMLAnchorElement>({ strength: 0.35 });

  return (
    <Link
      href={href}
      ref={magneticRef}
      data-cursor-hover
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-8 py-4 font-display text-sm font-medium transition-colors duration-300 ease-cinematic",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
        variant === "glass" &&
          "glass-panel text-text-primary hover:bg-white/[0.12]",
        variant === "solid" &&
          "bg-gradient-evolution text-bg-primary hover:brightness-110",
        className
      )}
    >
      {children}
    </Link>
  );
}
