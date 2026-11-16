"use client";

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

export function AppNav({ role }: { role: Role }) {
  const pathname = usePathname();
  const links: { href: string; label: string }[] = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/incidents", label: "Incidents" },
    { href: "/map", label: "Map" },
    { href: "/volunteers", label: "Volunteers" },
    { href: "/resources", label: "Resources" },
    { href: "/guardian", label: "Guardian" },
  ];

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl items-center gap-1 px-6 py-3">
        <Link href="/dashboard" className="shrink-0">
          <Logo />
        </Link>
        <div className="ml-6 flex items-center gap-1 text-sm">
          {links.map((link) => {
            const active =
              pathname === link.href || pathname?.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "rounded-md px-3 py-1.5 font-medium transition-colors",
                  active
                    ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
        <span className="ml-auto flex items-center gap-3">
          <ThemeToggle />
          <NotificationBell />
          <span
            className={clsx(
              "rounded-full px-2.5 py-1 text-xs font-semibold",
              roleClasses[role]
            )}
          >
            {role}
          </span>
        </span>
      </div>
    </nav>
  );
}
