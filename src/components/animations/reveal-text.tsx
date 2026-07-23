"use client";

import { useMemo } from "react";
import { useGsapContext } from "@/hooks/use-gsap-context";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface RevealTextProps {
  children: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  /** split granularity — words feel more editorial, lines feel more cinematic */
  splitBy?: "words" | "lines";
  /** delay before the reveal starts, in seconds */
  delay?: number;
  /** trigger once the element enters the viewport instead of immediately */
  scrollTriggered?: boolean;
}

export function RevealText({
  children,
  as: Tag = "p",
  className,
  splitBy = "words",
  delay = 0,
  scrollTriggered = true,
}: RevealTextProps) {
  const segments = useMemo(() => {
    if (splitBy === "words") return children.split(" ");
    return children.split("\n");
  }, [children, splitBy]);

  const scopeRef = useGsapContext<HTMLDivElement>(() => {
    const animation = {
      opacity: 1,
      yPercent: 0,
      duration: 0.9,
      ease: "power4.out",
      stagger: splitBy === "words" ? 0.035 : 0.12,
      delay,
    };

    if (scrollTriggered) {
      gsap.to(".reveal-segment", {
        ...animation,
        scrollTrigger: {
          trigger: scopeRef.current,
          start: "top 85%",
        },
      });
    } else {
      gsap.to(".reveal-segment", animation);
    }
  }, [children, scrollTriggered]);

  return (
    <Tag
      ref={scopeRef as never}
      className={cn("overflow-hidden", className)}
      aria-label={children}
    >
      {segments.map((segment, index) => (
        <span
          key={`${segment}-${index}`}
          className="inline-block overflow-hidden"
          aria-hidden
        >
          <span
            className="reveal-segment inline-block translate-y-full opacity-0 will-change-transform"
            style={{ transitionProperty: "none" }}
          >
            {segment}
            {splitBy === "words" && index < segments.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}
