"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { MapPin, ArrowUpRight } from "lucide-react";
import { SeverityBadge, StatusBadge } from "@/components/incidents/badges";
import type { MapIncident } from "@/components/map/incident-map";
const IncidentMap = dynamic(
 () => import("@/components/map/incident-map").then(m => m.IncidentMap),
 { ssr: false, loading: () => <div className="ops-map-loading">Loading map tiles…</div> }
);
export function MapWithList({ incidents }: { incidents: MapIncident[] }) {
 return (
 <div className="ops-map-grid">
  <div className="ops-panel ops-map-frame"><IncidentMap incidents={incidents} /></div>
  <aside className="ops-panel ops-map-sidebar">
   <div className="ops-panel-heading"><div><span className="ops-panel-kicker">VISIBLE REPORTS</span><h3>Incident locations</h3></div><span className="ops-panel-badge">{incidents.length}</span></div>
   <div className="ops-map-sidebar-list">
    {incidents.length === 0 && <div className="ops-empty">No incident locations to show.</div>}
    {incidents.map(i => (
     <Link key={i.id} href={"/incidents/" + i.id} className="ops-map-sidebar-item">
      <div className="ops-map-sidebar-icon"><MapPin size={16} /></div>
      <div className="min-w-0 flex-1"><p className="ops-list-title">{i.title}</p><p className="ops-list-caption">{i.category.replace(/_/g, " ")}</p><div className="mt-3 flex flex-wrap gap-2"><SeverityBadge severity={i.severity} /><StatusBadge status={i.status} /></div></div>
      <ArrowUpRight size={16} className="ops-faint" />
     </Link>
    ))}
   </div>
  </aside>
 </div>);
}
