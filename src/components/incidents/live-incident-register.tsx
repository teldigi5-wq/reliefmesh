"use client";

import Link from "next/link";
import { AlertTriangle, ArrowUpRight, ClipboardList, Plus, RefreshCw } from "lucide-react";
import { SeverityBadge, StatusBadge } from "@/components/incidents/badges";
import { useLiveIncidents, type LiveIncident } from "@/components/incidents/use-live-incidents";

export function LiveIncidentRegister({
  initialIncidents,
  canReport,
}: {
  initialIncidents: LiveIncident[];
  canReport: boolean;
}) {
  const { incidents, connection } = useLiveIncidents(initialIncidents);
  const active = incidents.filter(i => ["VERIFIED", "ASSIGNED", "RESPONDING"].includes(i.status)).length;
  const critical = incidents.filter(i => i.severity === "CRITICAL").length;
  const completed = incidents.filter(i => ["RESOLVED", "CLOSED"].includes(i.status)).length;

  return (
    <>
      <section className="ops-info-grid" aria-label="Incident summary">
        <div className="ops-info-card"><span>Visible incidents</span><strong>{incidents.length}</strong></div>
        <div className="ops-info-card"><span>Active responses</span><strong>{active}</strong></div>
        <div className="ops-info-card"><span>Critical severity</span><strong style={{ color: "#f45b69" }}>{critical}</strong></div>
      </section>
      <div className="ops-section-heading">
        <div>
          <span className="ops-eyebrow">CASE REGISTER</span>
          <h2>Incident records</h2>
          <p>Select a report to review its details and history.</p>
        </div>
        <span className="ops-meta-chip" aria-live="polite">
          {connection === "offline" ? <AlertTriangle size={14} /> : <RefreshCw size={14} />}
          {connection === "offline" ? "Connection interrupted · retrying every 2s" : `${incidents.length} entries · Live 2s`}
        </span>
      </div>
      <section className="ops-list" aria-label="Incident records">
        {incidents.length === 0 && (
          <div className="ops-empty">
            No incidents are visible to your account.{" "}
            {canReport && <Link href="/incidents/new" className="font-semibold underline">Create your first incident report</Link>}
          </div>
        )}
        {incidents.map(incident => (
          <Link href={`/incidents/${incident.id}`} key={incident.id} className="ops-list-row">
            <div className="ops-list-main">
              <span className="ops-list-icon"><AlertTriangle size={20} aria-hidden="true" /></span>
              <div>
                <p className="ops-list-title">{incident.title}</p>
                <p className="ops-list-caption">
                  {incident.title.startsWith("WhatsApp SOS") ? "WHATSAPP · UNVERIFIED" : incident.category.replace(/_/g, " ")}
                  {" · "}
                  {incident.createdAt ? new Date(incident.createdAt).toLocaleString() : "Time unavailable"}
                </p>
                {incident.title.startsWith("WhatsApp SOS") && (
                  <p className="ops-list-caption mt-1">
                    Last website update: {incident.updatedAt ? new Date(incident.updatedAt).toLocaleString() : "Not available"}
                    {" · "}Last reported pin: {incident.latitude.toFixed(5)}, {incident.longitude.toFixed(5)}
                    {" · "}Not live GPS tracking
                  </p>
                )}
              </div>
            </div>
            <div className="ops-list-status">
              <SeverityBadge severity={incident.severity} />
              <StatusBadge status={incident.status} />
              <ArrowUpRight size={16} className="ops-faint" aria-hidden="true" />
            </div>
          </Link>
        ))}
      </section>
      <p className="ops-footnote">
        Summary figures reflect only incidents you are authorised to view.
        Resolved and closed cases: {completed}. Updates check every 2 seconds while this tab is visible.
      </p>
    </>
  );
}
