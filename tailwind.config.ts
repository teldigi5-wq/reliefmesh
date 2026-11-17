import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // "Focus Green" — ReliefMesh's primary, from the "Executive Trust &
        // Relief" palette: a composed, institutional green that reads as
        // calm authority rather than alarm, leaving red free for its one
        // real job — CRITICAL severity.
        brand: {
          50: "#eafaf0",
          100: "#d2f2dd",
          200: "#a3e0bb",
          300: "#6cc98f",
          400: "#2fae63",
          500: "#0d8a3f",
          600: "#007330",
          700: "#045c28",
          800: "#0a4a22",
          900: "#0a3d1d",
          950: "#052712",
        },
        // "Deep Navy" — the palette's dark neutral, used for headings and
        // body text in place of slate so the whole site reads as one
        // considered system instead of default-UI grey.
        navy: {
          DEFAULT: "#2b384c",
          50: "#eef1f4",
          100: "#d6dce3",
          200: "#adb9c7",
          300: "#8496a9",
          400: "#5f7288",
          500: "#465873",
          600: "#384860",
          700: "#2b384c",
          800: "#222c3b",
          900: "#1a222d",
          950: "#11161d",
        },
        // "Crispy Ivory" / "Warm Sand" — the palette's warm neutrals, used
        // for section backgrounds and secondary accents instead of raw
        // white or slate-50.
        ivory: "#e3dac9",
        sand: "#bda891",
        // "Signal Amber" — the warm counterpart, used sparingly: gradient
        // accents, the logo's pulse dot, highlights that want urgency
        // without borrowing the severity-red vocabulary.
        accent: {
          50: "#fff8ec",
          100: "#ffecc8",
          200: "#ffd68c",
          300: "#ffbb52",
          400: "#fa9b2b",
          500: "#f17d12",
          600: "#d1620a",
          700: "#a84b0c",
          800: "#873d10",
          900: "#6f3310",
        },
        severity: {
          low: "#16a34a",
          medium: "#ca8a04",
          high: "#ea580c",
          critical: "#dc2626",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15,23,42,0.04), 0 8px 24px -12px rgba(15,23,42,0.08)",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
