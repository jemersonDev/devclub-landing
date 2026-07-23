"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

const SESSION_KEY = "devclub_intro_seen";

/**
 * "Compile → Ship" intro — the signature opening moment.
 *
 * A build-style progress bar fills to 100%, a success check confirms, then
 * the panel splits into light curtains that part to reveal the page. It's
 * themed to the DevClub story (code that compiles and ships), fast (~1.6s),
 * and shows only once per browser session so it never gets in the way of
 * repeat visits or navigation.
 *
 * Non-blocking: the real page renders underneath immediately (good for
 * performance/SEO). This overlay simply sits on top and removes itself.
 * SSR-safe: renders nothing on the server and first client paint (so there's
 * no hydration mismatch and no flash for returning visitors), then mounts
 * only if this session hasn't seen it.
 */
export function IntroOverlay() {
  const [active, setActive] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const checkRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const topCurtainRef = useRef<HTMLDivElement>(null);
  const bottomCurtainRef = useRef<HTMLDivElement>(null);

  // Decide on the client only — avoids SSR/hydration mismatch.
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      seen = false;
    }
    if (!seen) setActive(true);
  }, []);

  useEffect(() => {
    if (!active) return;

    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // ignore (private mode etc.)
    }

    // lock scroll while the intro plays
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const cleanup = () => {
      document.body.style.overflow = prevOverflow;
      setActive(false);
    };

    if (prefersReducedMotion) {
      // No animation: show briefly, then remove.
      const t = window.setTimeout(cleanup, 300);
      return () => {
        window.clearTimeout(t);
        document.body.style.overflow = prevOverflow;
      };
    }

    const progress = { value: 0 };
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: cleanup });

      // 1) build progress fills
      tl.to(progress, {
        value: 100,
        duration: 1,
        ease: "power2.inOut",
        onUpdate: () => {
          const v = Math.round(progress.value);
          if (barRef.current) barRef.current.style.width = `${v}%`;
          if (pctRef.current) pctRef.current.textContent = `${v}%`;
        },
      });

      // 2) success beat: label switches, check pops
      tl.to(labelRef.current, { opacity: 0, duration: 0.15 })
        .set(labelRef.current, { textContent: "pronto" })
        .to(labelRef.current, { opacity: 1, duration: 0.15 })
        .fromTo(
          checkRef.current,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2)" },
          "<"
        );

      // 3) brief hold on success
      tl.to({}, { duration: 0.25 });

      // 4) light-curtain reveal — panels part vertically
      tl.to(
        [pctRef.current, labelRef.current, checkRef.current, barRef.current?.parentElement ?? null],
        { opacity: 0, duration: 0.3 }
      )
        .to(topCurtainRef.current, {
          yPercent: -100,
          duration: 0.9,
          ease: "power4.inOut",
        })
        .to(
          bottomCurtainRef.current,
          { yPercent: 100, duration: 0.9, ease: "power4.inOut" },
          "<"
        );
    }, rootRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = prevOverflow;
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={rootRef}
      role="status"
      aria-live="polite"
      aria-label="Carregando DevClub"
      className="fixed inset-0 z-[300] flex items-center justify-center"
    >
      {/* two curtains that part to reveal the page */}
      <div
        ref={topCurtainRef}
        className="absolute inset-x-0 top-0 h-1/2 bg-bg-primary"
      />
      <div
        ref={bottomCurtainRef}
        className="absolute inset-x-0 bottom-0 h-1/2 bg-bg-primary"
      />
      {/* seam glow between the curtains */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-evolution opacity-60" />

      {/* build UI */}
      <div className="relative z-10 flex w-[min(340px,80vw)] flex-col items-center gap-5">
        <div className="flex items-center gap-3 font-display text-2xl font-semibold tracking-display-tight text-text-primary">
          <span>Dev</span>
          <span className="text-gradient-evolution">Club</span>
        </div>

        <div className="h-px w-full overflow-hidden bg-white/10">
          <div
            ref={barRef}
            className="h-full w-0 bg-gradient-evolution"
            style={{ boxShadow: "0 0 12px rgba(56,189,248,0.6)" }}
          />
        </div>

        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-text-secondary">
          <span ref={checkRef} className="text-accent-cyan opacity-0">
            ✓
          </span>
          <span ref={labelRef}>compilando seu futuro</span>
          <span ref={pctRef} className="ml-1 text-text-secondary/60">
            0%
          </span>
        </div>
      </div>
    </div>
  );
}
