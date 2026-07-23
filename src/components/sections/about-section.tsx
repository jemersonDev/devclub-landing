"use client";

import { Code2, Users, Target, LifeBuoy, type LucideIcon } from "lucide-react";
import { AmbientParticles } from "@/components/animations/ambient-particles";
import { HologramBackdrop } from "@/components/animations/hologram-backdrop";
import { SplitHeadline } from "@/components/animations/split-headline";
import { TiltCard } from "@/components/ui/tilt-card";
import { ABOUT_PILLARS } from "@/constants/content";
import { useGsapContext } from "@/hooks/use-gsap-context";
import { usePointerGlow } from "@/hooks/use-pointer-glow";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import type { ValuePillar } from "@/constants/content";

const ICONS: Record<ValuePillar["icon"], LucideIcon> = {
  Code2,
  Users,
  Target,
  LifeBuoy,
};

export function AboutSection() {
  const handlePointerGlow = usePointerGlow<HTMLElement>();
  const scopeRef = useGsapContext<HTMLDivElement>(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Eyebrow line draws in, synced to the section entering the viewport.
    // fromTo declares both ends here so GSAP owns the transform outright —
    // a Tailwind scale-x-0 on the same element would compete with it.
    gsap.fromTo(
      ".about-eyebrow-line",
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.1,
        ease: "power3.out",
        immediateRender: false,
        scrollTrigger: {
          trigger: scopeRef.current,
          start: "top 78%",
          once: true,
        },
      }
    );

    // Intro paragraph rises in just after the headline. fromTo with
    // immediateRender:false keeps it visible if the trigger never fires.
    gsap.fromTo(
      ".about-lead",
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        immediateRender: false,
        scrollTrigger: { trigger: ".about-lead", start: "top 88%", once: true },
      }
    );

    // Cards cascade in with a soft blur + depth.
    gsap.fromTo(
      ".pillar-card",
      { opacity: 0, y: 56, filter: "blur(10px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        immediateRender: false,
        scrollTrigger: { trigger: ".pillar-grid", start: "top 85%", once: true },
      }
    );

    // Gentle parallax: the sticky intro column drifts as you scroll past.
    if (!prefersReducedMotion) {
      gsap.to(".about-intro", {
        yPercent: -6,
        ease: "none",
        scrollTrigger: {
          trigger: scopeRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      });
    }
  }, []);

  return (
    <section
      id="quem-somos"
      ref={scopeRef}
      className="relative overflow-hidden bg-bg-secondary px-6 py-28 lg:px-16 lg:py-36"
    >
      {/* layered atmosphere: hologram video + mesh gradient + particles */}
      <HologramBackdrop />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-mesh"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
      >
        <AmbientParticles count={40} className="h-full w-full" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        {/* Intro column (sticky on desktop) */}
        <div className="about-intro lg:sticky lg:top-32 lg:self-start">
          <div className="flex items-center gap-4">
            <span
              aria-hidden
              className="about-eyebrow-line h-px w-12 origin-left bg-gradient-evolution"
            />
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent-cyan">
              Quem somos
            </span>
          </div>

          <SplitHeadline
            lines={[
              "Não formamos alunos.",
              "Formamos desenvolvedores",
              "que o mercado disputa.",
            ]}
            className="mt-6 font-display text-3xl font-semibold leading-[1.1] tracking-display-tight text-text-primary sm:text-5xl"
            lineClassName={(i) => (i === 2 ? "text-gradient-evolution" : undefined)}
          />

          <p className="about-lead mt-8 max-w-md text-lg leading-relaxed text-text-secondary">
            O DevClub nasceu de uma pergunta simples: por que tantos cursos
            ensinam sintaxe e tão poucos ensinam a pensar como engenheiro? A
            resposta virou uma metodologia inteira — construída junto com
            empresas que contratam, não apenas com quem ensina.
          </p>
        </div>

        {/* Pillars grid */}
        <div className="pillar-grid grid gap-5 [perspective:1200px] sm:grid-cols-2 lg:grid-cols-1">
          {ABOUT_PILLARS.map((pillar) => {
            const Icon = ICONS[pillar.icon];
            return (
              <TiltCard key={pillar.id} className="pillar-card" maxTilt={5}>
                <article
                  data-cursor-hover
                  onPointerMove={handlePointerGlow}
                  className={cn(
                    "glass-sheen group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-glass p-7 backdrop-blur-xl",
                    "transition-colors duration-500 ease-cinematic hover:border-white/20"
                  )}
                >
                  {/* dynamic pointer-following glow */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(500px circle at var(--mx,50%) var(--my,50%), rgba(56,189,248,0.14), transparent 60%)",
                    }}
                  />

                  <div className="relative flex items-start justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-accent-cyan ring-1 ring-white/10 transition-transform duration-500 ease-cinematic group-hover:-translate-y-0.5">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="font-mono text-sm text-text-secondary/60">
                      {pillar.index}
                    </span>
                  </div>

                  <h3 className="relative mt-5 font-display text-xl font-semibold tracking-tight text-text-primary">
                    {pillar.title}
                  </h3>
                  <p className="relative mt-3 text-sm leading-relaxed text-text-secondary">
                    {pillar.description}
                  </p>
                </article>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
