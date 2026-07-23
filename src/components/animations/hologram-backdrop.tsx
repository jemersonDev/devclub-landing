"use client";

import { useEffect, useRef } from "react";
import { useGsapContext } from "@/hooks/use-gsap-context";
import { gsap } from "@/lib/gsap";

export function HologramBackdrop() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const scopeRef = useGsapContext<HTMLDivElement>(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.fromTo(
      ".hologram-video",
      { opacity: 0, scale: 1.12 },
      {
        opacity: 0.45,
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: scopeRef.current,
          start: "top bottom",
          end: "center center",
          scrub: 1,
        },
      }
    );

    gsap.to(".hologram-video", {
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: scopeRef.current,
        start: "center center",
        end: "bottom top",
        scrub: 1,
      },
    });
  }, []);

  return (
    <div
      ref={scopeRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <video
        ref={videoRef}
        className="hologram-video absolute inset-0 h-full w-full object-cover opacity-0 motion-reduce:opacity-20"
        muted
        loop
        playsInline
        preload="none"
        poster="/assets/hologram-poster.jpg"
      >
        <source src="/assets/hologram-loop.mp4" type="video/mp4" />
      </video>
      {/* readability scrim so the About copy stays legible over the video */}
      <div className="absolute inset-0 bg-bg-secondary/70" />
    </div>
  );
}
