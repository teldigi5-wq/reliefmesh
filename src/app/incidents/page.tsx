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
      <main className="app-backdrop min-h-[calc(100vh-57px)] mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Incidents
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {hasPermission(session.role, "incident:view_all")
                ? "All reported incidents."
                : "Incidents you reported or are assigned to."}
            </p>
          </div>
          {canReport && (
            <Link
              href="/incidents/new"
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-brand-700 hover:shadow-md"
            >
              Report incident
            </Link>
          )}
        </div>

        <div className="surface-card mt-6 divide-y divide-slate-200/80 dark:divide-slate-800">
          {incidents.length === 0 && (
            <p className="p-6 text-sm text-slate-500">
              No incidents yet.{" "}
              {canReport && (
                <>
                  <Link href="/incidents/new" className="font-medium text-brand-600 hover:text-brand-700">
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
              className="flex flex-wrap items-center justify-between gap-3 p-4 transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-slate-50 dark:hover:bg-slate-800/60"
            >
              <div className="min-w-0">
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  {incident.title}
                </p>
                <p className="text-xs text-slate-500">
                  {incident.category.replace(/_/g, " ")} ·{" "}
                  {new Date(incident.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
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
