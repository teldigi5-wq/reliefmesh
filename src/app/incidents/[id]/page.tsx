import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { incidentService } from "@/services/incident.service";
import { volunteerService } from "@/services/volunteer.service";
import { AppNav } from "@/components/layout/app-nav";
import { SeverityBadge, StatusBadge } from "@/components/incidents/badges";
import { ActionPanel } from "@/components/incidents/action-panel";
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
      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{incident.title}</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Reported by {incident.reportedBy.fullName} on{" "}
              {new Date(incident.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="flex gap-2">
            <SeverityBadge severity={incident.severity} />
            <StatusBadge status={incident.status} />
          </div>
        </div>

        <p className="mt-4 whitespace-pre-wrap text-sm">{incident.description}</p>

        <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-slate-500">Category</dt>
            <dd>{incident.category.replace(/_/g, " ")}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Location</dt>
            <dd>
              {incident.latitude.toFixed(4)}, {incident.longitude.toFixed(4)}
              {incident.address ? ` — ${incident.address}` : ""}
            </dd>
          </div>
          {incident.verifiedBy && (
            <div>
              <dt className="text-slate-500">Verified by</dt>
              <dd>
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
              <dd>
                {incident.assignments
                  .map((a) => `${a.volunteer.user.fullName} (${a.status})`)
                  .join(", ")}
              </dd>
            </div>
          )}
        </dl>

        <div className="mt-6">
          <ActionPanel
            incidentId={incident.id}
            status={incident.status}
            role={session.role}
            availableVolunteers={availableVolunteers}
          />
        </div>

        <div className="mt-6">
          <h2 className="font-semibold">History</h2>
          <ol className="mt-2 space-y-2 border-l border-slate-200 pl-4 dark:border-slate-800">
            {incident.updates.map((update) => (
              <li key={update.id} className="text-sm">
                <span className="font-medium">
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
        </div>
      </main>
    </>
  );
}
