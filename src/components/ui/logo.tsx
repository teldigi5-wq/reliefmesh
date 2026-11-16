// ReliefMesh's mark: a small hub-and-spoke mesh — one coordinating node
// connected to three outer ones, with a single node lit in accent amber.
// It's meant to read literally as what the product is: people/responders
// networked together with one active signal, not a generic shield or
// checkmark. Built as plain inline SVG (no icon library), so it's free to
// recolor via the brand/accent palette and scales cleanly from a 20px nav
// icon up to a 512px PWA icon from the same path data.

export function LogoMark({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <line x1="12" y1="12" x2="12" y2="5.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
      <line x1="12" y1="12" x2="6.3" y2="15.8" stroke="white" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
      <line x1="12" y1="12" x2="17.7" y2="15.8" stroke="white" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
      <circle cx="12" cy="12" r="2.6" fill="white" />
      <circle cx="12" cy="5.5" r="1.9" fill="#f17d12" />
      <circle cx="6.3" cy="15.8" r="1.9" fill="white" />
      <circle cx="17.7" cy="15.8" r="1.9" fill="white" />
    </svg>
  );
}

export function LogoBadge({ size = "h-8 w-8" }: { size?: string }) {
  return (
    <span
      className={`flex ${size} shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-800 shadow-sm`}
    >
      <LogoMark className="h-[60%] w-[60%]" />
    </span>
  );
}

export function Logo({
  wordmarkClassName = "text-[15px] font-semibold tracking-tight text-slate-900 dark:text-slate-50",
  badgeSize = "h-8 w-8",
}: {
  wordmarkClassName?: string;
  badgeSize?: string;
}) {
  return (
    <span className="flex items-center gap-2">
      <LogoBadge size={badgeSize} />
      <span className={wordmarkClassName}>ReliefMesh</span>
    </span>
  );
}
