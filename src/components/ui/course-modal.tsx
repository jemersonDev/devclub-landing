"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  Clock,
  Layers,
  Star,
  Users,
  X,
} from "lucide-react";
import type { CourseModule } from "@/constants/content";

interface CourseModalProps {
  course: CourseModule | null;
  onClose: () => void;
}

export function CourseModal({ course, onClose }: CourseModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!course) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [course, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {course && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            className="absolute inset-0 bg-bg-primary/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="course-modal-title"
            tabIndex={-1}
            className="relative z-10 flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-white/15 bg-bg-secondary shadow-card-hover focus:outline-none"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="relative h-32 shrink-0"
              style={{
                background: `linear-gradient(140deg, ${course.cover[0]}, ${course.cover[1]})`,
              }}
            >
              <span
                aria-hidden
                className="absolute -right-2 top-1 font-mono text-6xl font-bold leading-none text-white/20"
              >
                {"</>"}
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar"
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-bg-primary/60 text-text-primary backdrop-blur-md transition-transform duration-300 ease-cinematic hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
              <span className="absolute bottom-4 left-6 rounded-full bg-bg-primary/60 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-text-secondary ring-1 ring-white/15 backdrop-blur-md">
                {course.category}
              </span>
            </div>

            <div className="flex flex-col gap-5 overflow-y-auto p-6">
              <div>
                <h2
                  id="course-modal-title"
                  className="font-display text-2xl font-semibold leading-[1.1] tracking-display-tight text-text-primary"
                >
                  {course.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {course.description}
                </p>
              </div>

              <dl className="grid grid-cols-4 gap-3 border-y border-white/10 py-4">
                <Stat icon={Clock} value={`${course.hours}h`} label="Duração" />
                <Stat icon={Layers} value={`${course.modules}`} label="Módulos" />
                <Stat
                  icon={Users}
                  value={course.students.toLocaleString("pt-BR")}
                  label="Alunos"
                />
                <Stat
                  icon={Star}
                  value={course.rating.toFixed(1)}
                  label="Nota"
                />
              </dl>

              <div>
                <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-text-secondary">
                  O que você vai dominar
                </h3>
                <ul className="mt-3 flex flex-col gap-2.5">
                  {course.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-text-primary">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-cyan/15 text-accent-cyan">
                        <Check className="h-3 w-3" aria-hidden />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                className="mt-1 inline-flex items-center justify-between gap-2 rounded-2xl bg-gradient-evolution px-5 py-3.5 font-display text-sm font-semibold text-bg-primary transition-[filter,box-shadow] duration-300 ease-cinematic hover:brightness-110 hover:shadow-glow-cyan active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary"
              >
                Quero me inscrever
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Clock;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <Icon className="h-4 w-4 text-accent-cyan" aria-hidden />
      <span className="font-display text-sm font-semibold tabular-nums text-text-primary">
        {value}
      </span>
      <span className="text-[10px] uppercase tracking-wider text-text-secondary/70">
        {label}
      </span>
    </div>
  );
}
