import { clsx } from "clsx";

type Tone = "default" | "critical" | "positive";

const toneClasses: Record<Tone, string> = {
  default: "text-slate-900 dark:text-slate-100",
  critical: "text-severity-critical",
  positive: "text-severity-low",
};

export function StatCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: Tone;
}) {
  return (
    <div className="rounded-lg border border-slate-200 p-5 dark:border-slate-800">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className={clsx("mt-2 text-3xl font-semibold", toneClasses[tone])}>
        {value}
      </p>
    </div>
  );
}
