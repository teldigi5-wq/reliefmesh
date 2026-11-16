"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import type { Role } from "@prisma/client";
import { NotificationBell } from "@/components/layout/notification-bell";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Logo } from "@/components/ui/logo";

const roleClasses: Record<Role, string> = {
  ADMIN: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  OPERATOR: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  RESPONDER: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  CITIZEN: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  ORGANISATION: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
};

const LINKS: { href: string; label: string }[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/incidents", label: "Incidents" },
  { href: "/map", label: "Map" },
  { href: "/volunteers", label: "Volunteers" },
  { href: "/resources", label: "Resources" },
  { href: "/guardian", label: "Guardian" },
];

export function AppNav({ role }: { role: Role }) {
  const pathname = usePathname();
  // Below this, the 6 nav links + logo + bell + theme toggle + role badge
  // don't fit in one row (observed overflow starting around 820-900px on a
  // real layout with this many items), so they move into a collapsible
  // mobile menu instead of wrapping or scrolling horizontally.
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl items-center gap-1 px-4 py-3 sm:px-6">
        <Link href="/dashboard" className="shrink-0">
          <Logo />
        </Link>

        {/* Desktop/tablet link row — hidden once there isn't room for it. */}
        <div className="ml-6 hidden items-center gap-1 text-sm lg:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "rounded-md px-3 py-1.5 font-medium transition-colors",
                isActive(link.href)
                  ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <span className="ml-auto flex items-center gap-2 sm:gap-3">
          <span className="hidden sm:inline-flex">
            <ThemeToggle />
          </span>
          <NotificationBell />
          <span
            className={clsx(
              "hidden rounded-full px-2.5 py-1 text-xs font-semibold sm:inline-flex",
              roleClasses[role]
            )}
          >
            {role}
          </span>

          {/* Hamburger — only present below the breakpoint where the link
              row above is hidden, so it never shows up alongside it. */}
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
          >
            {mobileOpen ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </span>
      </div>

      {/* Mobile menu panel: links, then the role badge/theme toggle that got
          hidden from the top bar above, so nothing is unreachable on a
          phone-width screen. */}
      {mobileOpen && (
        <div className="border-t border-slate-200/80 px-4 pb-3 pt-2 dark:border-slate-800/80 lg:hidden">
          <div className="flex flex-col gap-1 text-sm">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={clsx(
                  "rounded-md px-3 py-2 font-medium transition-colors",
                  isActive(link.href)
                    ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-slate-200/80 pt-2 dark:border-slate-800/80 sm:hidden">
            <span className={clsx("rounded-full px-2.5 py-1 text-xs font-semibold", roleClasses[role])}>
              {role}
            </span>
            <ThemeToggle />
          </div>
        </div>
      )}
    </nav>
  );
}
