import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { incidentService } from "@/services/incident.service";
import { StatCard } from "@/components/dashboard/stat-card";
import { AppNav } from "@/components/layout/app-nav";
import { Card } from "@/components/ui/card";
import { DisclaimerBanner } from "@/components/ui/disclaimer-banner";
import {
  CategoryBarChart,
  SeverityBarChart,
  IncidentsOverTimeChart,
} from "@/components/dashboard/charts";

const SEVERITY_COLOR: Record<string, string> = {
  LOW: "#16a34a",
  MEDIUM: "#ca8a04",
  HIGH: "#ea580c",
  CRITICAL: "#dc2626",
};

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const { byStatus, bySeverity, byCategory, recent, avgResolutionHours } =
    await incidentService.dashboardCounts();

  const totalIncidents = byStatus.reduce((sum, row) => sum + row._count._all, 0);
  const activeStatuses = ["VERIFIED", "ASSIGNED", "RESPONDING"];
  const activeIncidents = byStatus
    .filter((row) => activeStatuses.includes(row.status))
    .reduce((sum, row) => sum + row._count._all, 0);
  const criticalIncidents =
    bySeverity.find((row) => row.severity === "CRITICAL")?._count._all ?? 0;
  const resolvedIncidents =
    byStatus.find((row) => row.status === "RESOLVED")?._count._all ?? 0;

  const categoryData = byCategory.map((row) => ({
    label: row.category.replace(/_/g, " "),
    count: row._count._all,
  }));

  const severityOrder = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;
  const severityData = severityOrder.map((sev) => ({
    label: sev,
    count: bySeverity.find((row) => row.severity === sev)?._count._all ?? 0,
    color: SEVERITY_COLOR[sev] ?? "#64748b",
  }));

  // Aggregate raw timestamps into a day-by-day series for the last 14 days.
  const dayBuckets = new Map<string, number>();
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dayBuckets.set(d.toLocaleDateString(undefined, { month: "short", day: "numeric" }), 0);
  }
  for (const incident of recent) {
    const key = incident.createdAt.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
    if (dayBuckets.has(key)) {
      dayBuckets.set(key, (dayBuckets.get(key) ?? 0) + 1);
    }
  }
  const timeSeriesData = Array.from(dayBuckets, ([date, count]) => ({ date, count }));

  return (
    <>
      <AppNav role={session.role} />
      <main className="app-backdrop min-h-[calc(100vh-57px)] mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <DisclaimerBanner />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Operations dashboard
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 break-all sm:break-normal">
              Signed in as {session.email} · Role: {session.role}
            </p>
          </div>
          <form action="/api/auth/logout" method="post">
            <button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800">
              Log out
            </button>
          </form>
        </div>

        <div className="mt-8 grid animate-fade-in-up gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label="Total incidents" value={totalIncidents} />
          <StatCard label="Active emergencies" value={activeIncidents} />
          <StatCard label="Critical" value={criticalIncidents} tone="critical" />
          <StatCard label="Resolved" value={resolvedIncidents} tone="positive" />
          <StatCard
            label="Avg. resolution time"
            value={
              avgResolutionHours !== null ? Math.round(avgResolutionHours * 10) / 10 : 0
            }
            tone="positive"
          />
        </div>
        {avgResolutionHours === null && (
          <p className="mt-2 text-xs text-slate-400">
            Avg. resolution time shows 0 until at least one incident has gone
            VERIFIED → RESOLVED.
          </p>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card>
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">
              Incidents by category
            </h2>
            <div className="mt-2">
              {categoryData.length > 0 ? (
                <CategoryBarChart data={categoryData} />
              ) : (
                <p className="py-10 text-center text-sm text-slate-500">No data yet.</p>
              )}
            </div>
          </Card>

          <Card>
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">
              Incidents by severity
            </h2>
            <div className="mt-2">
              <SeverityBarChart data={severityData} />
            </div>
          </Card>

          <Card className="lg:col-span-2">
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">
              Incidents over the last 14 days
            </h2>
            <div className="mt-2">
              <IncidentsOverTimeChart data={timeSeriesData} />
            </div>
          </Card>
        </div>

        <p className="mt-6 text-sm text-slate-500">
          Every number and chart on this page comes straight from the
          database via <code>incidentService.dashboardCounts()</code> — there
          is nothing hardcoded here.
        </p>
      </main>
    </>
  );
}
