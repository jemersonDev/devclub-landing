import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);

  // CSS transitions/animations are already neutralized globally for
  // prefers-reduced-motion (see globals.css), but GSAP tweens manipulate
  // inline styles directly via rAF and are invisible to that CSS rule.
  // Cranking the global timeline's playback speed makes every
  // duration-based tween (entrance reveals, the Hero sequence, counters)
  // resolve almost instantly, without threading a manual check through
  // every single component that uses GSAP.
  const reducedMotionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  function applyMotionPreference(prefersReduced: boolean) {
    gsap.globalTimeline.timeScale(prefersReduced ? 50 : 1);
  }

  applyMotionPreference(reducedMotionQuery.matches);
  reducedMotionQuery.addEventListener("change", (event) =>
    applyMotionPreference(event.matches)
  );
}

export { gsap, ScrollTrigger };
