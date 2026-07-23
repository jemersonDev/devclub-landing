"use client";

import { memo, useState } from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Boxes,
  BrainCircuit,
  Clock,
  Cloud,
  Layers,
  Palette,
  PlayCircle,
  Rocket,
  Server,
  Star,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { RevealText } from "@/components/animations/reveal-text";
import { CarouselArrow } from "@/components/ui/carousel-arrow";
import { CourseModal } from "@/components/ui/course-modal";
import { COURSE_MODULES, type CourseModule } from "@/constants/content";
import { useCarousel } from "@/hooks/use-carousel";
import { useGsapContext } from "@/hooks/use-gsap-context";
import { usePointerGlow } from "@/hooks/use-pointer-glow";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

const ICONS: Record<CourseModule["icon"], LucideIcon> = {
  Layers,
  Rocket,
  Server,
  Palette,
  Zap,
  BrainCircuit,
  Cloud,
  Boxes,
};

const LEVEL_STYLES: Record<CourseModule["level"], string> = {
  Iniciante: "bg-emerald-400/20 text-emerald-200 ring-emerald-300/30",
  Intermediário: "bg-accent-cyan/20 text-accent-cyan ring-accent-cyan/30",
  Avançado: "bg-accent-purple/20 text-purple-200 ring-accent-purple/30",
};

function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <dd className="flex items-center gap-1.5 font-display text-sm font-semibold tabular-nums text-text-primary">
        <Icon className="h-3.5 w-3.5 text-accent-cyan" aria-hidden />
        {value}
      </dd>
      <dt className="text-[10px] uppercase tracking-wider text-text-secondary/70">
        {label}
      </dt>
    </div>
  );
}

const CourseCard = memo(function CourseCard({
  course,
  onOpen,
}: {
  course: CourseModule;
  onOpen: (course: CourseModule) => void;
}) {
  const handlePointerGlow = usePointerGlow<HTMLElement>();
  const [imageFailed, setImageFailed] = useState(false);
  const Icon = ICONS[course.icon];

  return (
    <article
      data-cursor-hover
      onPointerMove={handlePointerGlow}
      className={cn(
        "course-card group relative flex h-[540px] shrink-0 snap-start flex-col overflow-hidden rounded-3xl",
        "border border-white/10 bg-glass backdrop-blur-xl",
        "shadow-card",
        "transition-[transform,box-shadow,border-color] duration-500 ease-cinematic",
        "hover:-translate-y-2 hover:border-white/25 hover:shadow-card-hover",
        "w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]"
      )}
    >
      <div
        className="relative h-[320px] overflow-hidden"
        style={{
          background: `linear-gradient(140deg, ${course.cover[0]}, ${course.cover[1]})`,
        }}
      >
        {!imageFailed && (
          <Image
            src={course.image}
            alt=""
            aria-hidden
            fill
            loading="lazy"
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, (max-width: 1280px) 30vw, 23vw"
            className="object-cover transition-transform duration-700 ease-cinematic group-hover:scale-110"
            onError={() => setImageFailed(true)}
          />
        )}

        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/55 to-bg-primary/20"
        />
        <div
          aria-hidden
          className="absolute inset-0 mix-blend-soft-light opacity-70"
          style={{
            background: `linear-gradient(150deg, ${course.cover[0]}, transparent 60%)`,
          }}
        />

        <span
          aria-hidden
          className="absolute -right-2 top-1 font-mono text-6xl font-bold leading-none text-white/15"
        >
          {"</>"}
        </span>

        <div className="absolute inset-x-5 top-5 flex items-start justify-between gap-2">
          <span className="rounded-full bg-bg-primary/60 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-text-secondary ring-1 ring-white/15 backdrop-blur-md">
            {course.category}
          </span>
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ring-1 backdrop-blur-md",
              LEVEL_STYLES[course.level]
            )}
          >
            {course.level}
          </span>
        </div>

        <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-bg-primary/70 text-text-primary backdrop-blur-md transition-transform duration-500 ease-cinematic group-hover:scale-110">
            <Icon className="h-5 w-5" aria-hidden />
          </span>
          <span className="flex items-center gap-1 rounded-full bg-bg-primary/70 px-2.5 py-1 text-xs font-semibold text-text-primary ring-1 ring-white/15 backdrop-blur-md">
            <Star className="h-3.5 w-3.5 fill-accent-cyan text-accent-cyan" aria-hidden />
            {course.rating.toFixed(1)}
          </span>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--mx,50%) var(--my,50%), rgba(56,189,248,0.14), transparent 55%)",
        }}
      />

      <div className="relative flex flex-1 flex-col px-6 pb-6 pt-5">
        <h3 className="font-display text-xl font-semibold leading-tight tracking-display-tight text-text-primary">
          {course.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-text-secondary">
          {course.description}
        </p>

        <dl className="mt-auto grid grid-cols-3 gap-3 border-t border-white/10 pt-5">
          <Stat icon={Clock} value={`${course.hours}h`} label="Duração" />
          <Stat icon={PlayCircle} value={`${course.modules}`} label="Módulos" />
          <Stat
            icon={Users}
            value={course.students.toLocaleString("pt-BR")}
            label="Alunos"
          />
        </dl>

        <button
          type="button"
          data-cursor-hover
          onClick={() => onOpen(course)}
          className={cn(
            "mt-5 inline-flex items-center justify-between gap-2 rounded-2xl bg-gradient-evolution px-5 py-3.5 active:scale-[0.98]",
            "font-display text-sm font-semibold text-bg-primary",
            "transition-[filter,box-shadow] duration-300 ease-cinematic",
            "hover:brightness-110 hover:shadow-glow-cyan",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
          )}
        >
          Conhecer Formação
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </article>
  );
});

export function CoursesSection() {
  const [selectedCourse, setSelectedCourse] = useState<CourseModule | null>(
    null
  );
  const {
    trackRef,
    activeIndex,
    canPrev,
    canNext,
    scrollPrev,
    scrollNext,
    scrollToIndex,
  } = useCarousel({
    itemSelector: ".course-card",
    itemCount: COURSE_MODULES.length,
    autoplay: true,
  });

  const scopeRef = useGsapContext<HTMLDivElement>(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.fromTo(
      ".course-card",
      { opacity: 0, y: 56, filter: "blur(10px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.09,
        immediateRender: false,
        scrollTrigger: { trigger: ".course-track", start: "top 85%", once: true },
      }
    );
  }, []);

  return (
    <section
      id="formacoes"
      ref={scopeRef}
      className="relative overflow-hidden bg-bg-primary px-6 py-28 lg:px-16"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-radial-glow opacity-50 blur-2xl"
      />

      <div className="relative mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent-cyan">
              Formações
            </span>
            <RevealText
              as="h2"
              className="mt-4 font-display text-3xl font-semibold leading-[1.1] tracking-display-tight text-text-primary sm:text-5xl"
            >
              Trilhas completas para cada etapa da sua carreira
            </RevealText>
          </div>
        </div>

        <div className="group/carousel relative mt-14">
          <CarouselArrow
            direction="prev"
            disabled={!canPrev}
            onClick={scrollPrev}
            label="Formação anterior"
          />
          <CarouselArrow
            direction="next"
            disabled={!canNext}
            onClick={scrollNext}
            label="Próxima formação"
          />

          <div
            ref={trackRef}
            tabIndex={0}
            role="region"
            aria-label="Carrossel de formações, arraste ou use as setas para navegar"
            className={cn(
              "course-track flex cursor-grab snap-x snap-mandatory gap-6 overflow-x-auto pb-6",
              "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
            )}
          >
            {COURSE_MODULES.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onOpen={setSelectedCourse}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {COURSE_MODULES.map((course, index) => (
            <button
              key={course.id}
              type="button"
              onClick={() => scrollToIndex(index)}
              aria-label={`Ir para ${course.title}`}
              aria-current={index === activeIndex}
              className="flex h-6 w-6 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
            >
              <span
                aria-hidden
                className={cn(
                  "block h-2 rounded-full transition-all duration-300",
                  index === activeIndex
                    ? "w-8 bg-gradient-evolution"
                    : "w-2 bg-white/20 hover:bg-white/40"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <CourseModal
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
      />
    </section>
  );
}
