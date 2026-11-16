import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { incidentService } from "@/services/incident.service";
import { AppNav } from "@/components/layout/app-nav";
import { SeverityBadge, StatusBadge } from "@/components/incidents/badges";
import { hasPermission } from "@/lib/permissions";

export default async function IncidentsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const incidents = await incidentService.listIncidents({
    id: session.userId,
    role: session.role,
  });

  const canReport = hasPermission(session.role, "incident:report");

  return (
    <>
      <AppNav role={session.role} />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Incidents</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {hasPermission(session.role, "incident:view_all")
                ? "All reported incidents."
                : "Incidents you reported or are assigned to."}
            </p>
          </div>
          {canReport && (
            <Link
              href="/incidents/new"
              className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              Report incident
            </Link>
          )}
        </div>

        <div className="mt-6 divide-y divide-slate-200 rounded-lg border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
          {incidents.length === 0 && (
            <p className="p-6 text-sm text-slate-500">
              No incidents yet.{" "}
              {canReport && (
                <>
                  <Link href="/incidents/new" className="text-brand-600">
                    Report one
                  </Link>
                  .
                </>
              )}
            </p>
          )}
          {incidents.map((incident) => (
            <Link
              key={incident.id}
              href={`/incidents/${incident.id}`}
              className="flex items-center justify-between gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              <div>
                <p className="font-medium">{incident.title}</p>
                <p className="text-xs text-slate-500">
                  {incident.category.replace(/_/g, " ")} ·{" "}
                  {new Date(incident.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <SeverityBadge severity={incident.severity} />
                <StatusBadge status={incident.status} />
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
