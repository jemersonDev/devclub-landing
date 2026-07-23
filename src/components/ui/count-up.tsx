"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface CountUpProps {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;
}

export function CountUp({
  target,
  suffix = "",
  prefix = "",
  duration = 2.2,
  decimals = 0,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  const format = (value: number) =>
    `${prefix}${value.toLocaleString("pt-BR", {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
    })}${suffix}`;

  // Render the final value up front: it ships the real number in the SSR
  // markup and guarantees the correct figure even if the animation never runs.
  const [display, setDisplay] = useState(() => format(target));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const proxy = { value: 0 };
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        setDisplay(format(0));
        gsap.to(proxy, {
          value: target,
          duration,
          ease: "power2.out",
          onUpdate: () => setDisplay(format(proxy.value)),
          onComplete: () => setDisplay(format(target)),
        });
      },
    });

    return () => trigger.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, suffix, prefix, duration, decimals]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  );
}
