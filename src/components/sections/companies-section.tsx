"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AmbientParticles } from "@/components/animations/ambient-particles";
import { RevealText } from "@/components/animations/reveal-text";
import { HIRING_COMPANIES } from "@/constants/content";
import { useContainerWidth } from "@/hooks/use-container-width";
import {
  useNonCollidingLayout,
  type FloatPosition,
} from "@/hooks/use-non-colliding-layout";
import { useGsapContext } from "@/hooks/use-gsap-context";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface ChipData extends FloatPosition {
  id: string;
  name: string;
  sector: string;
}

/**
 * A single floating company chip. Depth (0 far → 1 near) drives its scale,
 * blur, opacity and z-order so the field reads with real perceived depth.
 * The float itself is a GSAP tween (see the parent context) targeting the
 * `.chip-floater` wrapper, keeping the hover scale on the inner button
 * independent from the drift transform (no transform conflicts).
 */
function CompanyChip({
  chip,
  compact,
}: {
  chip: ChipData;
  compact: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  // depth-derived visual layering
  const scale = 0.82 + chip.depth * 0.28; // far smaller, near bigger
  const blur = (1 - chip.depth) * 2.4; // far blurrier
  const opacity = 0.55 + chip.depth * 0.45; // far dimmer
  const z = Math.round(chip.depth * 100);

  return (
    <div
      className="absolute"
      style={{
        left: `${chip.x * 100}%`,
        top: `${chip.y * 100}%`,
        transform: "translate(-50%, -50%)",
        zIndex: hovered ? 200 : z,
      }}
    >
      {/* GSAP animates this wrapper's y; hover state lives on the button */}
      <div
        className="chip-floater"
        data-travel={chip.travel}
        data-duration={chip.duration}
        data-delay={chip.delay}
        style={{ filter: blur > 0.1 ? `blur(${blur}px)` : undefined, opacity }}
      >
        <div
          className="relative flex flex-col items-center"
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.9 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-bg-primary/90 px-3 py-1.5 shadow-lg shadow-black/30 backdrop-blur-md"
              >
                <span className="font-mono text-[11px] uppercase tracking-wider text-accent-cyan">
                  {chip.sector}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            data-cursor-hover
            aria-label={`${chip.name} — ${chip.sector}`}
            className={cn(
              "glass-panel glass-sheen inline-flex items-center gap-2 whitespace-nowrap rounded-full font-display font-medium text-text-primary",
              "transition-[transform,border-color,box-shadow] duration-300 ease-cinematic",
              "hover:scale-110 hover:border-accent-cyan/40 hover:text-white hover:shadow-glow-cyan",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary",
              compact ? "px-4 py-2 text-sm" : "px-5 py-2.5 text-base"
            )}
          >
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full bg-gradient-evolution"
            />
            {chip.name}
          </button>
        </div>
      </div>
    </div>
  );
}

export function CompaniesSection() {
  const [stageRef, stageWidth] = useContainerWidth<HTMLDivElement>();
  const compact = stageWidth > 0 && stageWidth < 560;

  const positions = useNonCollidingLayout(HIRING_COMPANIES.length, {
    minDist: compact ? 0.32 : 0.24,
    padding: compact ? 0.13 : 0.09,
    centerExclusion: compact ? 0.2 : 0.16,
  });

  const chips: ChipData[] = HIRING_COMPANIES.map((c, i) => ({
    ...positions[i]!,
    id: c.id,
    name: c.name,
    sector: c.sector,
  })).filter((c) => c.x !== undefined);

  // GSAP float: each chip drifts vertically at its own depth-driven speed and
  // distance. Runs only when the stage has measured (chips are in the DOM),
  // and is fully reverted on cleanup. Respects reduced-motion.
  const fieldRef = useGsapContext<HTMLDivElement>(() => {
    if (stageWidth === 0) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const floaters = gsap.utils.toArray<HTMLElement>(".chip-floater");
    floaters.forEach((el) => {
      const travel = Number(el.dataset.travel ?? 8);
      const duration = Number(el.dataset.duration ?? 5);
      const delay = Number(el.dataset.delay ?? 0);
      gsap.to(el, {
        y: travel,
        duration,
        delay,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    });
  }, [stageWidth]);

  return (
    <section
      id="empresas"
      className="cv-auto relative overflow-hidden bg-bg-secondary px-6 py-28 lg:px-16"
    >
      {/* layered background particles for depth (cheap Canvas 2D) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-60">
        <AmbientParticles count={compact ? 30 : 55} className="h-full w-full" />
      </div>
      {/* soft radial glow anchoring the center badge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-radial-glow opacity-70"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent-cyan">
            Empresas
          </span>
          <RevealText
            as="h2"
            className="mt-4 font-display text-3xl font-semibold leading-[1.1] tracking-display-tight text-text-primary sm:text-5xl"
          >
            Nossos alunos já estão dentro de quem você conhece
          </RevealText>
          <p className="mt-6 text-lg text-text-secondary">
            Times de engenharia de todos os tamanhos já contrataram
            desenvolvedores formados pelo DevClub.
          </p>
        </div>

        {/* Accessible flat list — the floating field is decorative */}
        <ul className="sr-only">
          {HIRING_COMPANIES.map((c) => (
            <li key={c.id}>
              {c.name} — {c.sector}
            </li>
          ))}
        </ul>

        <div
          ref={(node) => {
            stageRef.current = node;
            fieldRef.current = node;
          }}
          aria-hidden="true"
          className="relative mx-auto mt-16 h-[460px] max-w-4xl sm:h-[540px]"
        >
          {stageWidth > 0 &&
            chips.map((chip) => (
              <CompanyChip key={chip.id} chip={chip} compact={compact} />
            ))}

          {/* center badge */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-[150] -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="font-display text-4xl font-semibold tracking-display-tight text-gradient-evolution sm:text-5xl">
              +200
            </p>
            <p className="mt-1 font-mono text-xs uppercase tracking-[0.25em] text-text-secondary">
              empresas parceiras
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
