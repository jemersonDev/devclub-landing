"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { HeroBackdrop } from "@/components/animations/hero-backdrop";
import { HeroCta } from "@/components/ui/hero-cta";
import { useMouseTracking } from "@/hooks/use-mouse-tracking";

export function HeroIntro() {
  const pointerRef = useMouseTracking();
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);

  // Professional GSAP entrance timeline: the copy rises and unblurs in a
  // staggered cascade, then the scroll cue fades in and bobs. Mouse parallax
  // gives the whole block subtle depth.
  useEffect(() => {
    if (!contentRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });

      tl.fromTo(
        ".hero-line",
        { opacity: 0, y: 40, filter: "blur(12px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.15,
        }
      ).fromTo(
        scrollCueRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        "-=0.3"
      );

      if (!prefersReducedMotion) {
        const quickX = gsap.quickTo(contentRef.current, "x", {
          duration: 0.8,
          ease: "power3.out",
        });
        const quickY = gsap.quickTo(contentRef.current, "y", {
          duration: 0.8,
          ease: "power3.out",
        });

        const onMove = (e: PointerEvent) => {
          const nx = (e.clientX / window.innerWidth - 0.5) * 2;
          const ny = (e.clientY / window.innerHeight - 0.5) * 2;
          quickX(nx * -14);
          quickY(ny * -10);
        };
        window.addEventListener("pointermove", onMove, { passive: true });

        gsap.to(scrollCueRef.current, {
          y: 10,
          repeat: -1,
          yoyo: true,
          duration: 1.1,
          ease: "sine.inOut",
          delay: 1.6,
        });

        return () => window.removeEventListener("pointermove", onMove);
      }
    }, contentRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-bg-primary"
    >
      {/* base glow + GPU-free aurora/particle backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-radial-glow" />
      <HeroBackdrop pointerRef={pointerRef} />

      {/* soft dark scrim so the copy always reads over the bright field */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg-primary/40 via-transparent to-bg-primary/70" />

      <div
        ref={contentRef}
        className="relative z-10 mx-auto max-w-3xl px-6 text-center will-change-transform"
      >
        <p className="hero-line glass-panel glass-sheen mx-auto inline-flex rounded-full px-4 py-1.5 font-mono text-xs uppercase tracking-[0.3em] text-accent-cyan">
          DevClub
        </p>

        <h1 className="headline-glow mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-display-tighter text-text-primary sm:text-6xl md:text-7xl">
          <span className="hero-line block">A evolução do</span>
          <span className="hero-line block">desenvolvedor</span>
          <span className="hero-line block text-gradient-evolution">
            começa aqui
            <span
              aria-hidden
              className="hero-caret ml-1 inline-block h-[0.75em] w-[3px] translate-y-[0.05em] rounded-sm bg-accent-cyan align-middle"
            />
          </span>
        </h1>

        <p className="hero-line mx-auto mt-6 max-w-xl text-balance text-lg text-text-secondary sm:text-xl">
          Do primeiro console.log ao primeiro emprego full stack — uma jornada
          cinematográfica até você virar um dev extraordinário.
        </p>

        <div className="hero-line mt-10 flex justify-center">
          <HeroCta href="#quem-somos">Começar minha jornada</HeroCta>
        </div>
      </div>

      {/* animated scroll indicator */}
      <div
        ref={scrollCueRef}
        aria-hidden
        className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 opacity-0"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-secondary/70">
          Scroll
        </span>
        <div className="flex h-9 w-6 items-start justify-center rounded-full border border-white/20 p-1.5">
          <div className="h-1.5 w-1 animate-bounce rounded-full bg-accent-cyan" />
        </div>
      </div>
    </section>
  );
}
