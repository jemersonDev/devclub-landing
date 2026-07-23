"use client";

import { AmbientParticles } from "@/components/animations/ambient-particles";
import { HeroCta } from "@/components/ui/hero-cta";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { useGsapContext } from "@/hooks/use-gsap-context";
import { gsap } from "@/lib/gsap";

export function FinalCta() {
  const scopeRef = useGsapContext<HTMLDivElement>(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Cinematic darkening as the visitor arrives at the closing beat.
    gsap.fromTo(
      ".final-cta-overlay",
      { opacity: 0 },
      {
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: scopeRef.current,
          start: "top bottom",
          end: "top center",
          scrub: 0.6,
        },
      }
    );

    // Headline reveals word-by-word, rising and unblurring in a cascade.
    gsap.fromTo(
      ".cta-word",
      { opacity: 0, y: 40, filter: "blur(10px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: scopeRef.current,
          start: "top 65%",
        },
      }
    );

    // Sub-copy and buttons follow.
    gsap.fromTo(
      ".cta-follow",
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: scopeRef.current,
          start: "top 55%",
        },
      }
    );

    // Slow, continuous drift of the aurora glow for a living background.
    if (!prefersReducedMotion) {
      gsap.to(".cta-glow", {
        scale: 1.15,
        opacity: 0.8,
        duration: 6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }
  }, []);

  const headline = "O próximo desenvolvedor extraordinário pode ser você.";
  const words = headline.split(" ");

  return (
    <section
      id="mercado-final"
      ref={scopeRef}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-bg-primary px-6 text-center"
    >
      {/* cinematic layered background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-mesh" />
      <div
        aria-hidden
        className="cta-glow pointer-events-none absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-evolution opacity-30 blur-[120px]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-70">
        <AmbientParticles count={70} className="h-full w-full" />
      </div>

      {/* darkening overlay on scroll-in */}
      <div
        aria-hidden
        className="final-cta-overlay pointer-events-none absolute inset-0 bg-black opacity-0"
      />

      <div className="relative z-10 max-w-3xl">
        <h2 className="headline-glow text-balance font-display text-4xl font-semibold leading-[1.08] tracking-display-tighter text-text-primary sm:text-6xl">
          {words.map((word, i) => {
            const isAccent = word.startsWith("você");
            return (
              <span
                key={`${word}-${i}`}
                className={`cta-word inline-block ${
                  isAccent ? "text-gradient-evolution" : ""
                }`}
              >
                {word}
                {i < words.length - 1 ? "\u00A0" : ""}
              </span>
            );
          })}
        </h2>

        <p className="cta-follow mx-auto mt-6 max-w-xl text-balance text-lg text-text-secondary">
          A vaga que você quer já existe. Falta o desenvolvedor que o mercado
          está procurando — e ele começa a ser construído hoje.
        </p>

        <div className="cta-follow mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <HeroCta href="#quem-somos">Começar minha jornada</HeroCta>
          <MagneticButton href="#formacoes" variant="glass">
            Ver formações
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
