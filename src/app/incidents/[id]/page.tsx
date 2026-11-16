import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { incidentService } from "@/services/incident.service";
import { volunteerService } from "@/services/volunteer.service";
import { AppNav } from "@/components/layout/app-nav";
import { SeverityBadge, StatusBadge } from "@/components/incidents/badges";
import { ActionPanel } from "@/components/incidents/action-panel";
import { Card } from "@/components/ui/card";
import { PermissionError } from "@/lib/permissions";

export default async function IncidentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const actor = { id: session.userId, role: session.role };

  let incident;
  try {
    incident = await incidentService.getById(params.id, actor);
  } catch (err) {
    if (err instanceof PermissionError) {
      redirect("/incidents");
    }
    throw err;
  }
  if (!incident) notFound();

  const availableVolunteers =
    session.role === "OPERATOR" || session.role === "ADMIN"
      ? await volunteerService.listForAssignment({ role: session.role })
      : [];

  return (
    <>
      <AppNav role={session.role} />
      <main className="app-backdrop min-h-[calc(100vh-57px)] mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <Card className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                {incident.title}
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Reported by {incident.reportedBy.fullName} on{" "}
                {new Date(incident.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <SeverityBadge severity={incident.severity} />
              <StatusBadge status={incident.status} />
            </div>
          </div>

          <p className="mt-4 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
            {incident.description}
          </p>

          <dl className="mt-4 grid grid-cols-1 gap-4 rounded-lg bg-slate-50/80 p-4 text-sm dark:bg-slate-800/40 sm:grid-cols-2">
            <div>
              <dt className="text-slate-500">Category</dt>
              <dd className="font-medium">{incident.category.replace(/_/g, " ")}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Location</dt>
              <dd className="font-medium">
                {incident.latitude.toFixed(4)}, {incident.longitude.toFixed(4)}
                {incident.address ? ` — ${incident.address}` : ""}
              </dd>
            </div>
            {incident.verifiedBy && (
              <div>
                <dt className="text-slate-500">Verified by</dt>
                <dd className="font-medium">
                  {incident.verifiedBy.fullName} on{" "}
                  {incident.verifiedAt
                    ? new Date(incident.verifiedAt).toLocaleString()
                    : ""}
                </dd>
              </div>
            )}
            {incident.assignments.length > 0 && (
              <div>
                <dt className="text-slate-500">Assigned responder(s)</dt>
                <dd className="font-medium">
                  {incident.assignments
                    .map((a) => `${a.volunteer.user.fullName} (${a.status})`)
                    .join(", ")}
                </dd>
              </div>
            )}
          </dl>
        </Card>

        <div className="mt-6">
          <ActionPanel
            incidentId={incident.id}
            status={incident.status}
            role={session.role}
            availableVolunteers={availableVolunteers}
          />
        </div>

        <Card className="mt-6 p-6">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">History</h2>
          <ol className="mt-3 space-y-3 border-l-2 border-slate-200 pl-4 dark:border-slate-800">
            {incident.updates.map((update) => (
              <li key={update.id} className="relative text-sm">
                <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-brand-500 ring-2 ring-white dark:ring-slate-900" />
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {update.fromStatus ? `${update.fromStatus} → ` : ""}
                  {update.toStatus.replace(/_/g, " ")}
                </span>
                <span className="ml-2 text-slate-500">
                  {new Date(update.createdAt).toLocaleString()}
                </span>
                {update.note && <p className="text-slate-600 dark:text-slate-400">{update.note}</p>}
              </li>
            ))}
            {incident.updates.length === 0 && (
              <li className="text-sm text-slate-500">No status changes yet.</li>
            )}
          </ol>
        </Card>
      </main>
    </>
  );
}
