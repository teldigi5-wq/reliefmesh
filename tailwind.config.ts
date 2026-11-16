import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // "Signal Teal" — ReliefMesh's primary. Deliberately not the blue
        // every SaaS dashboard defaults to: a deep, composed teal reads as
        // trustworthy/operational without the alarm connotations of red,
        // and leaves red free for its one real job — CRITICAL severity.
        brand: {
          50: "#effdfa",
          100: "#d2f7ec",
          200: "#a6efdb",
          300: "#70e0c5",
          400: "#3fc7aa",
          500: "#1ea48c",
          600: "#148273",
          700: "#11675c",
          800: "#0f534b",
          900: "#0c423d",
          950: "#052723",
        },
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
