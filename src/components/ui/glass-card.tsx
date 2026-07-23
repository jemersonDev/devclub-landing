import { cn } from "@/lib/utils";
import { usePointerGlow } from "@/hooks/use-pointer-glow";
import type { HTMLAttributes, PointerEvent } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  /** adds a subtle gradient border glow on hover */
  glow?: boolean;
}

export function GlassCard({
  className,
  glow = true,
  children,
  onPointerMove,
  ...props
}: GlassCardProps) {
  const handlePointerGlow = usePointerGlow<HTMLDivElement>();

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    handlePointerGlow(event);
    onPointerMove?.(event);
  }

  return (
    <div
      className={cn(
        "glass-sheen group relative overflow-hidden rounded-2xl border border-white/10 bg-glass p-8 backdrop-blur-xl transition-all duration-500 ease-cinematic",
        glow && "hover:border-white/20 hover:bg-white/[0.06]",
        className
      )}
      onPointerMove={handlePointerMove}
      {...props}
    >
      {glow && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-cinematic group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(400px circle at var(--mx, 50%) var(--my, 50%), rgba(56,189,248,0.12), transparent 60%)",
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
