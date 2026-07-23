"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, Pause, Play, Quote } from "lucide-react";
import { RevealText } from "@/components/animations/reveal-text";
import { CarouselArrow } from "@/components/ui/carousel-arrow";
import { useCarousel } from "@/hooks/use-carousel";
import { useYouTubePlayer } from "@/hooks/use-youtube-player";
import { GlassCard } from "@/components/ui/glass-card";
import { TESTIMONIALS } from "@/constants/content";

function TestimonialVideo({
  youtubeId,
  name,
}: {
  youtubeId: string;
  name: string;
}) {
  const { containerRef, playing, failed, toggle } = useYouTubePlayer(youtubeId);
  const [started, setStarted] = useState(false);

  function handleToggle() {
    if (!started) setStarted(true);
    toggle();
  }

  return (
    <div
      data-lenis-prevent
      className="relative aspect-video w-full overflow-hidden rounded-xl bg-gradient-to-br from-bg-secondary to-bg-primary"
    >
      {/* The API replaces this node with the player iframe on first play. */}
      <div ref={containerRef} className="absolute inset-0 h-full w-full" />

      {/* Poster stays until playback starts, so nothing flashes empty. */}
      {!started && (
        <Image
          src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
          alt=""
          aria-hidden
          fill
          sizes="(max-width: 640px) 85vw, (max-width: 1024px) 60vw, 32vw"
          className="object-cover opacity-60"
        />
      )}

      {failed ? (
        <a
          href={`https://www.youtube.com/watch?v=${youtubeId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-bg-primary/70 text-center backdrop-blur-sm"
        >
          <ExternalLink className="h-6 w-6 text-accent-cyan" aria-hidden />
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent-cyan">
            Assistir no YouTube
          </span>
        </a>
      ) : (
        <button
          type="button"
          onClick={handleToggle}
          data-cursor-hover
          aria-label={
            playing ? `Pausar vídeo: ${name}` : `Assistir vídeo: ${name}`
          }
          aria-pressed={playing}
          className={
            started
              ? "group absolute bottom-3 left-3 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-bg-primary/70 backdrop-blur-md transition-all duration-300 ease-cinematic hover:scale-110 hover:border-accent-cyan/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
              : "group absolute inset-0 z-20 flex h-full w-full items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-inset"
          }
        >
          {!started && (
            <span
              aria-hidden
              className="absolute inset-0 bg-gradient-radial-glow opacity-70 transition-opacity duration-500 group-hover:opacity-90"
            />
          )}
          <span
            className={
              started
                ? "relative flex items-center justify-center"
                : "relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-md transition-transform duration-300 ease-cinematic group-hover:scale-110"
            }
          >
            {playing ? (
              <Pause
                className="h-5 w-5 text-text-primary transition-transform duration-300 ease-cinematic"
                fill="currentColor"
              />
            ) : (
              <Play
                className={`text-text-primary transition-transform duration-300 ease-cinematic ${
                  started ? "ml-0.5 h-5 w-5" : "ml-1 h-6 w-6"
                }`}
                fill="currentColor"
              />
            )}
          </span>
        </button>
      )}
    </div>
  );
}

export function TestimonialsSection() {
  const { trackRef, canPrev, canNext, scrollPrev, scrollNext } = useCarousel({
    itemSelector: "[data-testimonial-card]",
    itemCount: TESTIMONIALS.length,
  });

  return (
    <section
      id="depoimentos"
      className="cv-auto relative bg-bg-secondary px-6 py-28 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent-cyan">
              DevClub em vídeo
            </span>
            <RevealText
              as="h2"
              className="mt-4 font-display text-3xl font-semibold leading-[1.1] tracking-display-tight text-text-primary sm:text-5xl"
            >
              A jornada, contada por quem vive ela
            </RevealText>
          </div>

        </div>

        <div className="group/carousel relative mt-16">
          <CarouselArrow
            direction="prev"
            disabled={!canPrev}
            onClick={scrollPrev}
            label="Depoimento anterior"
            offsetTop={140}
          />
          <CarouselArrow
            direction="next"
            disabled={!canNext}
            onClick={scrollNext}
            label="Próximo depoimento"
            offsetTop={140}
          />

        <div
          ref={trackRef}
          tabIndex={0}
          role="region"
          aria-label="Carrossel de depoimentos, use as setas do teclado para navegar"
          className="flex cursor-grab snap-x snap-mandatory gap-6 overflow-x-auto pb-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              data-testimonial-card
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="w-[85%] shrink-0 snap-center sm:w-[60%] lg:w-[32%]"
            >
              <GlassCard className="flex h-full flex-col gap-6">
                <TestimonialVideo
                  youtubeId={testimonial.youtubeId}
                  name={testimonial.name}
                />

                <Quote className="h-6 w-6 text-accent-cyan" aria-hidden />

                <p className="flex-1 text-balance text-text-secondary">
                  {testimonial.quote}
                </p>

                <div className="flex items-center justify-between border-t border-white/10 pt-5">
                  <div>
                    <p className="font-display font-medium text-text-primary">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {testimonial.role}
                    </p>
                  </div>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-accent-cyan">
                    {testimonial.company}
                  </span>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
