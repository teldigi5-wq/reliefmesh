"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  // Starts false and corrects itself in an effect rather than reading
  // document.documentElement on first render, so server-rendered and
  // first-client-render markup match (the actual class was already set
  // pre-hydration by the inline script in layout.tsx — see the comment
  // there for why).
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      const prefersSavedTheme = document.cookie.split("; ").some(part => part === "reliefmesh_cookie_choice=preferences");
      if (prefersSavedTheme) localStorage.setItem("theme", next ? "dark" : "light");
      else localStorage.removeItem("theme");
    } catch {
      // Private browsing / storage disabled — theme just won't persist.
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="rounded-md p-1.5 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
          <path
            d="M12 3a6.5 6.5 0 1 0 9 9 9 9 0 1 1-9-9Z"
            fill="currentColor"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
          <circle cx="12" cy="12" r="4" fill="currentColor" />
          <path
            d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}
