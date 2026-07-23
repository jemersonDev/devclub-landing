import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/three/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#020617",
          secondary: "#0F172A",
        },
        glass: "rgba(255,255,255,0.08)",
        accent: {
          blue: "#38BDF8",
          cyan: "#06B6D4",
          purple: "#8B5CF6",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#CBD5E1",
        },
      },
      boxShadow: {
        card: "0 16px 40px -24px rgba(0,0,0,0.8)",
        "card-hover": "0 40px 70px -30px rgba(0,0,0,0.9)",
        panel: "0 8px 32px -10px rgba(0,0,0,0.7)",
        "glow-cyan": "0 0 28px -4px rgba(56,189,248,0.7)",
        "glow-cyan-lg": "0 0 40px -6px rgba(56,189,248,0.55)",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      letterSpacing: {
        // Tight tracking for large display type — the single biggest
        // "premium vs templated" tell in award-winning typography.
        "display-tight": "-0.03em",
        "display-tighter": "-0.045em",
      },
      backgroundImage: {
        "gradient-evolution":
          "linear-gradient(135deg, #38BDF8 0%, #06B6D4 45%, #8B5CF6 100%)",
        "gradient-radial-glow":
          "radial-gradient(circle at center, rgba(56,189,248,0.15) 0%, rgba(2,6,23,0) 70%)",
        "gradient-mesh":
          "radial-gradient(at 20% 20%, rgba(56,189,248,0.10) 0px, transparent 50%), radial-gradient(at 80% 40%, rgba(139,92,246,0.10) 0px, transparent 50%), radial-gradient(at 50% 90%, rgba(6,182,212,0.08) 0px, transparent 50%)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        blink: "blink 1s step-end infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      transitionTimingFunction: {
        cinematic: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
