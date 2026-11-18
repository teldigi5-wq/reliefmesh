"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "scale";
};

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.classList.add("reveal-visible");
      return;
    }

    element.classList.add("reveal-pending");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        element.classList.add("reveal-visible");
        observer.unobserve(element);
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={elementRef}
      className={"scroll-reveal reveal-" + direction + " " + className}
      style={{ "--reveal-delay": delay + "ms" } as CSSProperties}
    >
      {children}
    </div>
  );
}
