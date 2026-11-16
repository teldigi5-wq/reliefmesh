import { clsx } from "clsx";

type Tone = "default" | "critical" | "positive";

const toneClasses: Record<Tone, string> = {
  default: "text-slate-900 dark:text-slate-100",
  critical: "text-severity-critical",
  positive: "text-severity-low",
};

const toneAccent: Record<Tone, string> = {
  default: "bg-brand-500",
  critical: "bg-severity-critical",
  positive: "bg-severity-low",
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
    <div className="surface-card hover-lift relative overflow-hidden p-5">
      <span
        className={clsx("absolute inset-x-0 top-0 h-1", toneAccent[tone])}
      />
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p
        className={clsx(
          "mt-2 text-3xl font-bold tracking-tight",
          toneClasses[tone]
        )}
      >
        {value}
      </p>
    </div>
  );
}
