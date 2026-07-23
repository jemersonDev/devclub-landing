"use client";

import { useMemo } from "react";
import { useGsapContext } from "@/hooks/use-gsap-context";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface SplitHeadlineProps {
  /** lines of the headline; each renders on its own row */
  lines: string[];
  className?: string;
  /** optional per-line className, e.g. to gradient the last line */
  lineClassName?: (index: number) => string | undefined;
}

/**
 * Reveals a headline character-by-character on scroll. Each glyph rises and
 * unblurs in a staggered cascade for a refined, editorial entrance.
 *
 * Accessibility: the animated glyphs are purely visual (aria-hidden), and a
 * visually-hidden copy of the full text carries the real, readable content
 * for assistive tech — so screen readers announce clean sentences, never a
 * stream of single letters.
 */
export function SplitHeadline({
  lines,
  className,
  lineClassName,
}: SplitHeadlineProps) {
  const fullText = useMemo(() => lines.join(" "), [lines]);

  const scopeRef = useGsapContext<HTMLHeadingElement>(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(".split-char", { opacity: 1, y: 0, filter: "blur(0px)" });
      return;
    }

    gsap.to(".split-char", {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.6,
      ease: "power3.out",
      stagger: 0.018,
      scrollTrigger: {
        trigger: scopeRef.current,
        start: "top 80%",
      },
    });
  }, [fullText]);

  return (
    <h2
      ref={scopeRef}
      className={cn("overflow-hidden", className)}
      aria-label={fullText}
    >
      {lines.map((line, lineIndex) => (
        <span
          key={lineIndex}
          aria-hidden
          className={cn("block", lineClassName?.(lineIndex))}
        >
          {Array.from(line).map((char, charIndex) => (
            <span
              key={charIndex}
              className="split-char inline-block translate-y-[0.4em] opacity-0 will-change-transform"
              style={{ filter: "blur(8px)" }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </span>
      ))}
    </h2>
  );
}
