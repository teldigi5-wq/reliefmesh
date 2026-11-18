"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@prisma/client";
import { LayoutDashboard, AlertTriangle, MapPinned, UsersRound, Boxes, Radio, Siren, Menu, X, ChevronRight, LogOut } from "lucide-react";
import { NotificationBell } from "@/components/layout/notification-bell";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Logo } from "@/components/ui/logo";
const BASE_LINKS = [
 { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
 { href: "/incidents", label: "Incidents", icon: AlertTriangle },
 { href: "/map", label: "Map", icon: MapPinned },
 { href: "/volunteers", label: "Volunteers", icon: UsersRound },
 { href: "/resources", label: "Resources", icon: Boxes },
];
export function AppNav({ role }: { role: Role }) {
 const pathname = usePathname();
 const [mobileOpen, setMobileOpen] = useState(false);
 const links = [
  ...BASE_LINKS,
  { href: "/sos", label: "SOS Remote", icon: Siren },
  ...(["ADMIN", "OPERATOR", "RESPONDER"].includes(role)
   ? [{ href: "/guardian", label: "Guardian", icon: Radio }]
   : []),
 ];
 const active = (href: string) => pathname === href || pathname?.startsWith(href + "/");
 return (
   <nav className="ops-nav" aria-label="Application navigation">
     <div className="ops-nav-inner">
       <Link href="/dashboard" className="ops-nav-brand" aria-label="ReliefMesh operations home">
         <Logo badgeSize="h-9 w-9" wordmarkClassName="text-base font-extrabold tracking-tight text-slate-900 dark:text-white" />
         <span className="ops-brand-suffix">OPS</span>
       </Link>
       <div className="ops-nav-links">
         {links.map(({ href, label, icon: Icon }) => (
           <Link key={href} href={href} aria-current={active(href) ? "page" : undefined}
             className={"ops-nav-link" + (href === "/sos" ? " is-sos" : "") + (active(href) ? " is-active" : "")}>
             <Icon size={16} strokeWidth={1.9} aria-hidden="true" />{label}
           </Link>
         ))}
       </div>
       <div className="ops-nav-actions">
         <span className="ops-nav-theme"><ThemeToggle /></span>
         <NotificationBell />
         <span className="ops-role">{role.replace(/_/g, " ")}</span>
         <form action="/api/auth/logout" method="post"><button type="submit" className="ops-signout" aria-label="Log out" title="Log out"><LogOut size={17}/></button></form>
         <button type="button" className="ops-menu-btn"
           aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
           aria-expanded={mobileOpen} aria-controls="ops-mobile-menu"
           onClick={() => setMobileOpen(v => !v)}>
           {mobileOpen ? <X size={21} /> : <Menu size={21} />}
         </button>
       </div>
     </div>
     {mobileOpen && (
       <div id="ops-mobile-menu" className="ops-mobile-panel">
         <div className="ops-mobile-list">
           {links.map(({ href, label, icon: Icon }) => (
             <Link key={href} href={href} onClick={() => setMobileOpen(false)}
               aria-current={active(href) ? "page" : undefined}
               className={"ops-mobile-link" + (href === "/sos" ? " is-sos" : "") + (active(href) ? " is-active" : "")}>
               <Icon size={18} aria-hidden="true" />{label}<ChevronRight size={16} className="ml-auto" aria-hidden="true" />
             </Link>
           ))}
         </div>
         <div className="ops-mobile-footer"><span>{role}</span><ThemeToggle /></div>
       </div>
     )}
   </nav>
 );
}
