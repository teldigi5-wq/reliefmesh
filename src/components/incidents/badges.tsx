import { clsx } from "clsx";
import type { Severity, IncidentStatus } from "@prisma/client";

const severityClasses: Record<Severity, string> = {
  LOW: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  MEDIUM: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  HIGH: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  CRITICAL: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span
      className={clsx(
        "rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide ring-1 ring-inset ring-black/5 dark:ring-white/10",
        severityClasses[severity]
      )}
    >
      {severity}
    </span>
  );
}

const statusClasses: Record<IncidentStatus, string> = {
  REPORTED: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  UNDER_REVIEW: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  VERIFIED: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  ASSIGNED: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
  RESPONDING: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  RESOLVED: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  CLOSED: "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400",
};

export function StatusBadge({ status }: { status: IncidentStatus }) {
  return (
    <span
      className={clsx(
        "rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide ring-1 ring-inset ring-black/5 dark:ring-white/10",
        statusClasses[status]
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
