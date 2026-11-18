import { Activity, AlertTriangle, CheckCircle2, Clock3, Layers3, type LucideIcon } from "lucide-react";
type Tone = "default" | "critical" | "positive";
const ICONS: Record<string, LucideIcon> = {
 "Total incidents": Layers3,
 "Active emergencies": Activity,
 "Critical": AlertTriangle,
 "Resolved": CheckCircle2,
 "Avg. resolution time": Clock3,
};
export function StatCard({ label, value, tone = "default", hint }: {
 label: string; value: number | string; tone?: Tone; hint?: string;
}) {
 const Icon = ICONS[label] ?? Activity;
 return (
   <article className={"ops-stat ops-stat-" + tone}>
     <div className="ops-stat-top"><p>{label}</p><span className="ops-stat-icon"><Icon size={19} strokeWidth={1.9} aria-hidden="true" /></span></div>
     <div className="ops-stat-bottom"><strong>{value}</strong><span>{hint ?? "From incident records"}</span></div>
   </article>
 );
}
