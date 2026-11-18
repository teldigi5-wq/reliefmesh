import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, ArrowUpRight, Activity, CircleDot, LayoutDashboard, MapPinned, Radio, Plus } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { incidentService } from "@/services/incident.service";
import { StatCard } from "@/components/dashboard/stat-card";
import { AppNav } from "@/components/layout/app-nav";
import { DisclaimerBanner } from "@/components/ui/disclaimer-banner";
import { OpsPageHeader } from "@/components/layout/ops-page-header";
import { CategoryBarChart, SeverityBarChart, IncidentsOverTimeChart } from "@/components/dashboard/charts";

const SEVERITY_COLOR: Record<string, string> = {
 LOW: "#20ae8a", MEDIUM: "#e8b54d", HIGH: "#f1844a", CRITICAL: "#fa5165",
};
const STATUS_ORDER = ["REPORTED", "UNDER_REVIEW", "VERIFIED", "ASSIGNED", "RESPONDING", "RESOLVED", "CLOSED"];

export default async function DashboardPage() {
 const session = await getSession();
 if (!session) redirect("/login");

 const { byStatus, bySeverity, byCategory, recent, avgResolutionHours } = await incidentService.dashboardCounts();
 const totalIncidents = byStatus.reduce((n, row) => n + row._count._all, 0);
 const activeIncidents = byStatus.filter(row => ["VERIFIED", "ASSIGNED", "RESPONDING"].includes(row.status)).reduce((n, row) => n + row._count._all, 0);
 const criticalIncidents = bySeverity.find(row => row.severity === "CRITICAL")?._count._all ?? 0;
 const resolvedIncidents = byStatus.find(row => row.status === "RESOLVED")?._count._all ?? 0;
 const categoryData = byCategory.map(row => ({ label: row.category.replace(/_/g, " "), count: row._count._all }));
 const severityData = (["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const).map(severity => ({
  label: severity,
  count: bySeverity.find(row => row.severity === severity)?._count._all ?? 0,
  color: SEVERITY_COLOR[severity],
 }));
 const dayBuckets = new Map<string, number>();
 for (let i = 13; i >= 0; i--) {
  const date = new Date();
  date.setDate(date.getDate() - i);
  dayBuckets.set(date.toLocaleDateString(undefined, { month: "short", day: "numeric" }), 0);
 }
 for (const incident of recent) {
  const date = incident.createdAt.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  if (dayBuckets.has(date)) dayBuckets.set(date, (dayBuckets.get(date) ?? 0) + 1);
 }
 const trend = Array.from(dayBuckets, ([date, count]) => ({ date, count }));
 const stages = STATUS_ORDER.map(status => ({
  status, value: byStatus.find(row => row.status === status)?._count._all ?? 0
 }));

 return (
 <>
 <AppNav role={session.role} />
 <main className="ops-page">
  <div className="ops-container">
   <DisclaimerBanner />
   <OpsPageHeader eyebrow="OPERATIONS / OVERVIEW" title="Command center" icon={LayoutDashboard}
     description={"Incident intelligence and response coordination · Signed in as " + session.email}
     action={<div className="ops-header-actions">
       <Link href="/incidents" className="ops-button ops-button-outline">View incidents <ArrowUpRight size={16} /></Link>
       <Link href="/map" className="ops-button ops-button-primary">Explore incident map <MapPinned size={16} /></Link>
     </div>} />

   <section className="ops-summary-banner" aria-label="Operations status">
     <div className="ops-summary-icon"><Activity size={25} strokeWidth={1.7} aria-hidden="true" /></div>
     <div><div className="ops-summary-kicker">RESPONSE OVERVIEW</div>
       <h2>Operational visibility at a glance.</h2>
       <p>All indicators below use incident records from your ReliefMesh database.</p>
     </div>
     <div className="ops-summary-count"><strong>{activeIncidents}</strong><span>Active cases</span></div>
   </section>

   <section className="ops-stats" aria-label="Key performance indicators">
     <StatCard label="Total incidents" value={totalIncidents} hint="All reported cases" />
     <StatCard label="Active emergencies" value={activeIncidents} hint="Verified, assigned, responding" />
     <StatCard label="Critical" value={criticalIncidents} tone="critical" hint="Critical severity" />
     <StatCard label="Resolved" value={resolvedIncidents} tone="positive" hint="Resolved status" />
     <StatCard label="Avg. resolution time"
       value={avgResolutionHours === null ? "—" : Math.round(avgResolutionHours * 10) / 10}
       hint={avgResolutionHours === null ? "No qualifying cases yet" : "Hours · verified to resolved"} />
   </section>

   <div className="ops-section-heading">
     <div><span className="ops-eyebrow">ANALYTICS</span><h2>Incident intelligence</h2>
       <p>Distribution of incidents, risk levels and recent reporting volume.</p></div>
     <span className="ops-meta-chip"><CircleDot size={13} /> Database-backed</span>
   </div>
   <section className="ops-dashboard-charts" aria-label="Incident analytics">
     <article className="ops-panel ops-analytics-card">
       <div className="ops-panel-heading"><div><span className="ops-panel-kicker">CATEGORIES</span><h3>Incidents by category</h3></div><span className="ops-panel-badge">All time</span></div>
       <CategoryBarChart data={categoryData} />
     </article>
     <article className="ops-panel ops-analytics-card">
       <div className="ops-panel-heading"><div><span className="ops-panel-kicker">RISK PROFILE</span><h3>Severity distribution</h3></div><span className="ops-panel-badge">All time</span></div>
       <SeverityBarChart data={severityData} />
     </article>
     <article className="ops-panel ops-analytics-card ops-full-width">
       <div className="ops-panel-heading"><div><span className="ops-panel-kicker">TREND ANALYSIS</span><h3>Incident reports over time</h3></div><span className="ops-panel-badge">Last 14 days</span></div>
       <IncidentsOverTimeChart data={trend} />
     </article>
   </section>

   <div className="ops-bottom-grid">
     <section className="ops-panel">
       <div className="ops-panel-heading"><div><span className="ops-panel-kicker">CASE WORKFLOW</span><h3>Incident lifecycle</h3></div>
         <Link className="ops-panel-link" href="/incidents">View all <ArrowRight size={16} /></Link></div>
       <div className="ops-lifecycle">
         {stages.map(stage => (
           <div className="ops-lifecycle-row" key={stage.status}>
             <span className="ops-lifecycle-label">{stage.status.replace(/_/g, " ")}</span>
             <div className="ops-lifecycle-track"><div style={{ width: totalIncidents ? (stage.value * 100 / totalIncidents).toFixed(1) + "%" : "0%" }} /></div>
             <strong>{stage.value}</strong>
           </div>
         ))}
       </div>
     </section>
     <section className="ops-panel">
       <div className="ops-panel-heading"><div><span className="ops-panel-kicker">QUICK ACCESS</span><h3>Operational shortcuts</h3></div></div>
       <div className="ops-shortcuts">
         <Link href="/incidents" className="ops-shortcut"><span><Plus size={19}/></span><div><strong>Incident management</strong><small>Review and manage cases</small></div><ArrowUpRight size={16}/></Link>
         <Link href="/map" className="ops-shortcut"><span><MapPinned size={19}/></span><div><strong>Geographic overview</strong><small>Explore reports on the map</small></div><ArrowUpRight size={16}/></Link>
         <Link href="/guardian" className="ops-shortcut"><span><Radio size={19}/></span><div><strong>Guardian monitoring</strong><small>Simulated device and SOS data</small></div><ArrowUpRight size={16}/></Link>
       </div>
     </section>
   </div>
   <p className="ops-footnote">ReliefMesh is a hackathon prototype, not an official emergency dispatch service. Response indicators are operational data, not guaranteed emergency coverage.</p>
  </div>
 </main>
 </>
 );
}
