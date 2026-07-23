"use client";

import { ParticleNumber } from "@/components/animations/particle-number";
import { RevealText } from "@/components/animations/reveal-text";
import { CountUp } from "@/components/ui/count-up";
import { BRAND_COLORS } from "@/constants/colors";
import { RESULT_STATS } from "@/constants/content";
import { usePointerGlow } from "@/hooks/use-pointer-glow";
import { cn } from "@/lib/utils";

const GLYPH_TEXT: Record<string, string> = {
  alunos: "48K+",
  empregabilidade: "87%",
  salario: "R$3.2K",
  avaliacao: "4.9",
};

// Percentage-style stats get a subtle progress arc microinteraction.
const PROGRESS: Record<string, number> = {
  empregabilidade: 87,
  avaliacao: 98, // 4.9/5
};

export function ResultsSection() {
  const handlePointerGlow = usePointerGlow<HTMLElement>();
  return (
    <section
      id="resultados"
      className="relative overflow-hidden bg-bg-primary px-6 py-28 lg:px-16"
    >
      {/* modern layered background: mesh gradient + centered glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-mesh opacity-70"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-radial-glow opacity-50"
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent-cyan">
            Resultados
          </span>
          <RevealText
            as="h2"
            className="mt-4 font-display text-3xl font-semibold leading-[1.1] tracking-display-tight text-text-primary sm:text-5xl"
          >
            Números que a gente mede todo mês
          </RevealText>
          <p className="mt-6 text-lg text-text-secondary">
            Transparência total: acompanhamos cada métrica que importa para a
            sua carreira.
          </p>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {RESULT_STATS.map((stat) => {
            const progress = PROGRESS[stat.id];
            return (
              <article
                key={stat.id}
                data-cursor-hover
                onPointerMove={handlePointerGlow}
                className={cn(
                  "glass-sheen group relative overflow-hidden rounded-2xl border border-white/10 bg-glass p-8 text-center backdrop-blur-xl",
                  "transition-[transform,border-color] duration-500 ease-cinematic hover:-translate-y-1 hover:border-accent-cyan/30"
                )}
              >
                {/* pulsing ambient glow, per card */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -inset-px rounded-2xl opacity-40 transition-opacity duration-500 group-hover:opacity-70"
                  style={{
                    background:
                      "radial-gradient(400px circle at 50% 0%, rgba(56,189,248,0.12), transparent 70%)",
                  }}
                />
                {/* cursor-following light */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(300px circle at var(--mx,50%) var(--my,50%), rgba(139,92,246,0.14), transparent 60%)",
                  }}
                />

                {/* particle-formed glyph behind the number */}
                <ParticleNumber
                  text={GLYPH_TEXT[stat.id] ?? String(stat.value)}
                  className="pointer-events-none absolute inset-x-6 top-4 h-20 opacity-30"
                  particleColor={BRAND_COLORS.blue}
                  particleCount={420}
                />

                <p className="relative z-10 font-display text-4xl font-semibold tracking-display-tight text-text-primary sm:text-[2.75rem]">
                  <CountUp
                    target={stat.value}
                    suffix={stat.suffix}
                    prefix={stat.id === "salario" ? "R$ " : ""}
                    decimals={stat.id === "avaliacao" ? 1 : 0}
                  />
                </p>

                {/* progress arc for percentage-like stats */}
                {progress !== undefined && (
                  <div
                    aria-hidden
                    className="relative z-10 mx-auto mt-4 h-1 w-16 overflow-hidden rounded-full bg-white/10"
                  >
                    <div
                      className="h-full rounded-full bg-gradient-evolution transition-[width] duration-1000 ease-cinematic"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}

                <p className="relative z-10 mt-4 text-sm leading-relaxed text-text-secondary">
                  {stat.label}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
