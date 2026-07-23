"use client";

import { useMagnetic } from "@/hooks/use-magnetic";
import { cn } from "@/lib/utils";

interface MagneticSubmitButtonProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export function MagneticSubmitButton({
  children,
  className,
  disabled,
}: MagneticSubmitButtonProps) {
  const magneticRef = useMagnetic<HTMLButtonElement>({ strength: 0.35 });

  return (
    <button
      ref={magneticRef}
      type="submit"
      disabled={disabled}
      data-cursor-hover
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-gradient-evolution px-8 py-4 font-display text-sm font-medium text-bg-primary transition-[filter] duration-300 ease-cinematic hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary",
        className
      )}
    >
      {children}
    </button>
  );
}
