import Link from "next/link";
import type { Role } from "@prisma/client";
import { NotificationBell } from "@/components/layout/notification-bell";

export function AppNav({ role }: { role: Role }) {
  const links: { href: string; label: string }[] = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/incidents", label: "Incidents" },
    { href: "/map", label: "Map" },
    { href: "/volunteers", label: "Volunteers" },
    { href: "/resources", label: "Resources" },
    { href: "/guardian", label: "Guardian" },
  ];

  return (
    <nav className="border-b border-slate-200 dark:border-slate-800">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-3 text-sm">
        <span className="font-semibold">ReliefMesh</span>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            {link.label}
          </Link>
        ))}
        <span className="ml-auto flex items-center gap-4">
          <NotificationBell />
          <span className="text-xs text-slate-400">{role}</span>
        </span>
      </div>
    </nav>
  );
}
