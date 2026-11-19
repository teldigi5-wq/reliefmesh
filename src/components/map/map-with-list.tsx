"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { MapPin, ArrowUpRight, RefreshCw } from "lucide-react";
import { SeverityBadge, StatusBadge } from "@/components/incidents/badges";
import { useLiveIncidents } from "@/components/incidents/use-live-incidents";
import type { MapIncident } from "@/components/map/incident-map";
const IncidentMap = dynamic(
 () => import("@/components/map/incident-map").then(m => m.IncidentMap),
 { ssr: false, loading: () => <div className="ops-map-loading">Loading map tiles…</div> }
);
export function MapWithList({ incidents, focusIncidentId }: { incidents: MapIncident[]; focusIncidentId?: string }) {
 const { incidents: liveIncidents, connection } = useLiveIncidents(incidents);
 return (
 <div className="ops-map-grid">
  <div className="ops-panel ops-map-frame"><IncidentMap incidents={liveIncidents} focusIncidentId={focusIncidentId} /></div>
  <aside className="ops-panel ops-map-sidebar">
   <div className="ops-panel-heading"><div><span className="ops-panel-kicker">VISIBLE REPORTS</span><h3>Incident locations</h3></div><span className="ops-panel-badge">{liveIncidents.length}</span></div>
   <p className="px-5 pb-3 text-xs text-slate-500 flex items-center gap-2"><RefreshCw size={12} /> {connection === "offline" ? "Connection interrupted · retrying every 2 seconds" : "Live incident updates · every 2 seconds"}</p>
   <div className="ops-map-sidebar-list">
    {liveIncidents.length === 0 && <div className="ops-empty">No incident locations to show. WhatsApp SOS cases appear after a location pin is shared and the integration is configured.</div>}
    {liveIncidents.map(i => (
     <Link key={i.id} href={"/incidents/" + i.id} className="ops-map-sidebar-item">
      <div className="ops-map-sidebar-icon"><MapPin size={16} /></div>
      <div className="min-w-0 flex-1"><p className="ops-list-title">{i.title}</p><p className="ops-list-caption">{i.title.startsWith("WhatsApp SOS") ? "WhatsApp · UNVERIFIED" : i.category.replace(/_/g, " ")}</p><div className="mt-3 flex flex-wrap gap-2"><SeverityBadge severity={i.severity} /><StatusBadge status={i.status} /></div></div>
      <ArrowUpRight size={16} className="ops-faint" />
     </Link>
    ))}
   </div>
  </aside>
 </div>);
}
