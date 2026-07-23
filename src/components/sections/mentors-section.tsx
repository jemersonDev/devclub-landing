"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { useState } from "react";
import { RevealText } from "@/components/animations/reveal-text";
import { CarouselArrow } from "@/components/ui/carousel-arrow";
import { useCarousel } from "@/hooks/use-carousel";
import { TiltCard } from "@/components/ui/tilt-card";
import { MENTORS, type Mentor } from "@/constants/content";
import { useGsapContext } from "@/hooks/use-gsap-context";
import { usePointerGlow } from "@/hooks/use-pointer-glow";
import { gsap } from "@/lib/gsap";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function MentorCard({ mentor }: { mentor: Mentor }) {
  const handlePointerGlow = usePointerGlow<HTMLDivElement>();
  const [photoFailed, setPhotoFailed] = useState(false);

  return (
    <TiltCard
      className="mentor-card w-[280px] shrink-0 snap-start sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]"
      maxTilt={7}
    >
      <div
        data-cursor-hover
        onPointerMove={handlePointerGlow}
        className="glass-sheen group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-3xl border border-white/10 transition-all duration-500 ease-cinematic hover:-translate-y-1.5 hover:border-white/25 hover:shadow-card-hover"
      >
        {/* poster gradient background (fallback layer) */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `linear-gradient(160deg, ${mentor.cover[0]}, ${mentor.cover[1]})`,
          }}
        />
        {/* real portrait photo — falls back to the gradient on error */}
        {!photoFailed && (
          <Image
            src={mentor.photo}
            alt={mentor.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
            onError={() => setPhotoFailed(true)}
          />
        )}
        {/* oversized initials watermark — only when no photo */}
        {photoFailed && (
          <span
            aria-hidden
            className="absolute -right-4 top-2 font-display text-[7rem] font-bold leading-none text-white/15"
          >
            {initials(mentor.name)}
          </span>
        )}
        {/* readability scrim at the bottom */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/50 to-transparent"
        />
        {/* cursor-following light */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(360px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.15), transparent 55%)",
          }}
        />

        {/* default text block — fades out on hover */}
        <div className="relative z-10 px-6 pb-6 transition-opacity duration-300 group-hover:opacity-0">
          <h3 className="font-display text-lg font-semibold leading-tight tracking-tight text-text-primary">
            {mentor.name}
          </h3>
          <p className="mt-1 text-sm font-medium text-accent-cyan">
            {mentor.role}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            {mentor.focus}
          </p>
        </div>

        {/* hover overlay — DevClub-style: title, CTA, access date, progress */}
        <div className="absolute inset-x-0 bottom-0 z-20 translate-y-3 px-6 pb-6 opacity-0 transition-all duration-300 ease-cinematic group-hover:translate-y-0 group-hover:opacity-100">
          <h3 className="font-display text-lg font-semibold leading-tight tracking-tight text-text-primary">
            {mentor.name}
          </h3>
          <button
            type="button"
            data-cursor-hover
            aria-label={`Ver conteúdo de ${mentor.name}`}
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-5 py-2.5 font-display text-sm font-semibold text-bg-primary transition-transform duration-300 ease-cinematic hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
          >
            <Play className="h-4 w-4 fill-current" aria-hidden />
            Ver conteúdo
          </button>
          <p className="mt-3 text-xs text-text-secondary">
            Acesso até {mentor.accessUntil}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/15">
              <div className="h-full w-0 rounded-full bg-gradient-evolution" />
            </div>
            <span className="font-mono text-[11px] text-text-secondary">0%</span>
          </div>
        </div>
      </div>
    </TiltCard>
  );
}

export function MentorsSection() {
  const { trackRef, canPrev, canNext, scrollPrev, scrollNext } = useCarousel({
    itemSelector: ".mentor-card",
    itemCount: MENTORS.length,
  });

  const scopeRef = useGsapContext<HTMLDivElement>(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    gsap.fromTo(
      ".mentor-card",
      { opacity: 0, y: 56, scale: 0.94, filter: "blur(8px)" },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        immediateRender: false,
        scrollTrigger: {
          trigger: ".mentor-track",
          start: "top 85%",
          once: true,
        },
      }
    );
  }, []);

  return (
    <section
      id="mentores"
      ref={scopeRef}
      className="relative overflow-hidden bg-bg-primary px-6 py-28 lg:px-16"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-radial-glow opacity-50 blur-2xl"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent-cyan">
            Mentores
          </span>
          <RevealText
            as="h2"
            className="mt-4 font-display text-3xl font-semibold leading-[1.1] tracking-display-tight text-text-primary sm:text-5xl"
          >
            Quem já viveu o que você está prestes a viver
          </RevealText>
        </div>

        <div className="group/carousel relative mt-16">
          <CarouselArrow
            direction="prev"
            disabled={!canPrev}
            onClick={scrollPrev}
            label="Mentor anterior"
            offsetTop={180}
          />
          <CarouselArrow
            direction="next"
            disabled={!canNext}
            onClick={scrollNext}
            label="Próximo mentor"
            offsetTop={180}
          />

          <div
            ref={trackRef}
            tabIndex={0}
            role="region"
            aria-label="Carrossel de mentores, arraste ou use as setas para navegar"
            className="mentor-track flex cursor-grab snap-x snap-mandatory gap-6 overflow-x-auto pb-6 [perspective:1400px] [scrollbar-width:none] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan [&::-webkit-scrollbar]:hidden"
          >
            {MENTORS.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
