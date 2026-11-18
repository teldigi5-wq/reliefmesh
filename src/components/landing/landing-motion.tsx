"use client";

import { useEffect } from "react";

/**
 * Landing-only progressive enhancement.
 * Static HTML remains visible if JS, IntersectionObserver, or motion is disabled.
 * Uses native IntersectionObserver rather than a heavy animation dependency.
 */
export function LandingMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".rm-site");
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const revealItems = Array.from(root.querySelectorAll<HTMLElement>("[data-rm-reveal]"));
    let observer: IntersectionObserver | undefined;

    if (!reduced.matches && "IntersectionObserver" in window) {
      // Reveal initially visible content BEFORE enabling hidden-entrance styles.
      for (const element of revealItems) {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.98 && rect.bottom > 0) {
          element.classList.add("rm-in-view");
        }
      }

      observer = new IntersectionObserver(
        entries => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            (entry.target as HTMLElement).classList.add("rm-in-view");
            observer?.unobserve(entry.target);
          }
        },
        { rootMargin: "0px 0px -7% 0px", threshold: 0.06 }
      );
      for (const element of revealItems) {
        if (!element.classList.contains("rm-in-view")) observer.observe(element);
      }
      root.dataset.motion = "ready";
    } else {
      for (const item of revealItems) item.classList.add("rm-in-view");
    }

    // Only one passive listener plus one RAF. No React state updates on scroll.
    let frame = 0;
    const syncProgress = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.max(0, Math.min(1, window.scrollY / max)) : 0;
      root.style.setProperty("--rm-scroll-progress", ratio.toFixed(4));
    };
    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(syncProgress);
    };
    syncProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      observer?.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      root.removeAttribute("data-motion");
      root.style.removeProperty("--rm-scroll-progress");
    };
  }, []);

  return <div className="rm-scroll-progress" aria-hidden="true"><span /></div>;
}
