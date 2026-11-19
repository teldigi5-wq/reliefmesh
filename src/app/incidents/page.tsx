import { redirect } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, Plus } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { incidentService } from "@/services/incident.service";
import { AppNav } from "@/components/layout/app-nav";
import { OpsPageHeader } from "@/components/layout/ops-page-header";
import { LiveIncidentRegister } from "@/components/incidents/live-incident-register";
import { hasPermission } from "@/lib/permissions";

export default async function IncidentsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const incidents = await incidentService.listIncidents({ id: session.userId, role: session.role });
  const canReport = hasPermission(session.role, "incident:report");
  const initialIncidents = incidents.map(i => ({
    id: i.id,
    title: i.title,
    category: i.category,
    severity: i.severity,
    status: i.status,
    latitude: i.latitude,
    longitude: i.longitude,
    createdAt: i.createdAt.toISOString(),
  }));

  return (
    <>
      <AppNav role={session.role} />
      <main className="ops-page">
        <div className="ops-container">
          <OpsPageHeader
            icon={AlertTriangle}
            eyebrow="OPERATIONS / INCIDENTS"
            title="Incident management"
            description={hasPermission(session.role, "incident:view_all")
              ? "Review reports, monitor severity and follow cases through resolution."
              : "View incidents you've reported or been assigned to."}
            action={canReport
              ? <Link href="/incidents/new" className="ops-button ops-button-primary"><Plus size={17} /> Report incident</Link>
              : undefined}
          />
          <LiveIncidentRegister initialIncidents={initialIncidents} canReport={canReport} />
        </div>
      </main>
    </>
  );
}
