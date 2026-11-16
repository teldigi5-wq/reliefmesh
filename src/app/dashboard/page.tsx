import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { incidentService } from "@/services/incident.service";
import { StatCard } from "@/components/dashboard/stat-card";
import { AppNav } from "@/components/layout/app-nav";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const { byStatus, bySeverity } = await incidentService.dashboardCounts();

  const totalIncidents = byStatus.reduce((sum, row) => sum + row._count._all, 0);
  const activeStatuses = ["VERIFIED", "ASSIGNED", "RESPONDING"];
  const activeIncidents = byStatus
    .filter((row) => activeStatuses.includes(row.status))
    .reduce((sum, row) => sum + row._count._all, 0);
  const criticalIncidents =
    bySeverity.find((row) => row.severity === "CRITICAL")?._count._all ?? 0;
  const resolvedIncidents =
    byStatus.find((row) => row.status === "RESOLVED")?._count._all ?? 0;

  return (
    <>
      <AppNav role={session.role} />
      <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Operations dashboard</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Signed in as {session.email} · Role: {session.role}
          </p>
        </div>
        <form action="/api/auth/logout" method="post">
          <button className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
            Log out
          </button>
        </form>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total incidents" value={totalIncidents} />
        <StatCard label="Active emergencies" value={activeIncidents} />
        <StatCard label="Critical" value={criticalIncidents} tone="critical" />
        <StatCard label="Resolved" value={resolvedIncidents} tone="positive" />
      </div>

      <p className="mt-8 text-sm text-slate-500">
        These counts come straight from the database via{" "}
        <code>incidentService.dashboardCounts()</code>. Category/severity/
        time-series charts are the next build stage — see{" "}
        <code>docs/ROADMAP.md</code>.
      </p>
      </main>
    </>
  );
}
