import { redirect } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, ArrowUpRight, ClipboardList, Plus } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { incidentService } from "@/services/incident.service";
import { AppNav } from "@/components/layout/app-nav";
import { OpsPageHeader } from "@/components/layout/ops-page-header";
import { SeverityBadge, StatusBadge } from "@/components/incidents/badges";
import { hasPermission } from "@/lib/permissions";

export default async function IncidentsPage() {
 const session = await getSession();
 if (!session) redirect("/login");
 const incidents = await incidentService.listIncidents({ id: session.userId, role: session.role });
 const canReport = hasPermission(session.role, "incident:report");
 const active = incidents.filter(i => ["VERIFIED","ASSIGNED","RESPONDING"].includes(i.status)).length;
 const critical = incidents.filter(i => i.severity === "CRITICAL").length;
 const completed = incidents.filter(i => ["RESOLVED","CLOSED"].includes(i.status)).length;
 return (
 <>
  <AppNav role={session.role} />
  <main className="ops-page">
   <div className="ops-container">
    <OpsPageHeader icon={AlertTriangle} eyebrow="OPERATIONS / INCIDENTS" title="Incident management"
      description={hasPermission(session.role, "incident:view_all") ? "Review reports, monitor severity and follow cases through resolution." : "View incidents you've reported or been assigned to."}
      action={canReport ? <Link href="/incidents/new" className="ops-button ops-button-primary"><Plus size={17} /> Report incident</Link> : undefined} />
    <section className="ops-info-grid" aria-label="Incident summary">
     <div className="ops-info-card"><span>Visible incidents</span><strong>{incidents.length}</strong></div>
     <div className="ops-info-card"><span>Active responses</span><strong>{active}</strong></div>
     <div className="ops-info-card"><span>Critical severity</span><strong style={{color:"#f45b69"}}>{critical}</strong></div>
    </section>
    <div className="ops-section-heading"><div><span className="ops-eyebrow">CASE REGISTER</span><h2>Incident records</h2><p>Select a report to review its details and history.</p></div><span className="ops-meta-chip"><ClipboardList size={14} /> {incidents.length} entries</span></div>
    <section className="ops-list" aria-label="Incident records">
     {incidents.length === 0 && <div className="ops-empty">No incidents are visible to your account. {canReport && <Link href="/incidents/new" className="font-semibold underline">Create your first incident report</Link>}</div>}
     {incidents.map(incident => (
      <Link href={"/incidents/" + incident.id} key={incident.id} className="ops-list-row">
       <div className="ops-list-main">
        <span className="ops-list-icon"><AlertTriangle size={20} aria-hidden="true" /></span>
        <div><p className="ops-list-title">{incident.title}</p><p className="ops-list-caption">{incident.category.replace(/_/g, " ")} · {new Date(incident.createdAt).toLocaleString()}</p></div>
       </div>
       <div className="ops-list-status"><SeverityBadge severity={incident.severity} /><StatusBadge status={incident.status} /><ArrowUpRight size={16} className="ops-faint" aria-hidden="true" /></div>
      </Link>
     ))}
    </section>
    <p className="ops-footnote">Summary figures reflect only incidents you are authorised to view. Resolved and closed cases: {completed}.</p>
   </div>
  </main>
 </>
 );
}
