// ReliefMesh's mark: a shield enclosing a hub-and-spoke sensor network
// around a map pin — reads literally as what the product is: a protected,
// geolocated network of reporters and responders. Supplied as a raster
// PNG (not redrawn as inline SVG), so it renders through next/image at
// every size from a 20px nav icon up to a 512px PWA icon.

import Image from "next/image";

export function LogoMark({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <Image
      src="/brand/logo-mark-256.png"
      alt=""
      width={256}
      height={256}
      className={className}
      priority
    />
  );
}

export function LogoBadge({ size = "h-8 w-8" }: { size?: string }) {
  return (
    <span className={`flex ${size} shrink-0 items-center justify-center`}>
      <LogoMark className="h-full w-full object-contain" />
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
