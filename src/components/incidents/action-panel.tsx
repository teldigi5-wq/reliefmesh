"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { IncidentStatus, Role } from "@prisma/client";

type VolunteerOption = {
  id: string;
  skills: string[];
  user: { fullName: string; email: string };
};

export function ActionPanel({
  incidentId,
  status,
  role,
  availableVolunteers,
}: {
  incidentId: string;
  status: IncidentStatus;
  role: Role;
  availableVolunteers: VolunteerOption[];
}) {
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // These controls are server-rendered, but their event handlers do not exist
  // until React hydrates the client component. Keeping them disabled for that
  // brief window prevents fast users (and automated browsers) from clicking a
  // button that looks ready while its click would still be ignored.
  useEffect(() => setIsHydrated(true), []);

  async function transition(toStatus: IncidentStatus) {
    setIsBusy(true);
    setError(null);
    const res = await fetch(`/api/incidents/${incidentId}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toStatus }),
    });
    setIsBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Action failed");
      return;
    }
    // A hard reload rather than router.refresh(): the status update has
    // already committed server-side at this point, but refresh() relies on
    // the same RSC-payload fetch that occasionally fails silently in Next's
    // dev mode (see incidents/new/page.tsx) — leaving the action looking
    // like it did nothing even though it succeeded. A full reload always
    // picks up the new state.
    window.location.reload();
  }

  async function assign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const volunteerId = formData.get("volunteerId");

    if (typeof volunteerId !== "string" || !volunteerId) {
      setError("Choose a responder first");
      return;
    }
    setIsBusy(true);
    setError(null);
    const res = await fetch(`/api/incidents/${incidentId}/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ volunteerId }),
    });
    setIsBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Assignment failed");
      return;
    }
    window.location.reload();
  }

  const isOperatorOrAdmin = role === "OPERATOR" || role === "ADMIN";
  const isResponder = role === "RESPONDER";

  return (
    <Card>
      <h2 className="font-semibold text-slate-900 dark:text-slate-100">Actions</h2>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <div className="mt-3 flex flex-wrap gap-2">
        {isOperatorOrAdmin && status === "REPORTED" && (
          <Button
            disabled={isBusy || !isHydrated}
            onClick={() => transition("UNDER_REVIEW")}
          >
            Mark under review
          </Button>
        )}

        {isOperatorOrAdmin &&
          (status === "REPORTED" || status === "UNDER_REVIEW") && (
            <Button
              disabled={isBusy || !isHydrated}
              onClick={() => transition("VERIFIED")}
            >
              Verify incident
            </Button>
          )}

        {isResponder && status === "ASSIGNED" && (
          <Button
            disabled={isBusy || !isHydrated}
            onClick={() => transition("RESPONDING")}
          >
            Accept &amp; start response
          </Button>
        )}

        {isResponder && status === "RESPONDING" && (
          <Button
            disabled={isBusy || !isHydrated}
            onClick={() => transition("RESOLVED")}
          >
            Mark resolved
          </Button>
        )}

        {isOperatorOrAdmin && status === "RESOLVED" && (
          <Button
            disabled={isBusy || !isHydrated}
            onClick={() => transition("CLOSED")}
          >
            Close incident
          </Button>
        )}
      </div>

      {isOperatorOrAdmin && status === "VERIFIED" && (
        <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-800">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Assign a responder
          </p>
          {availableVolunteers.length === 0 ? (
            <p className="mt-1 text-sm text-slate-500">
              No available volunteers right now — register volunteers on the{" "}
              <a href="/volunteers" className="font-medium text-brand-600 hover:text-brand-700">
                Volunteers
              </a>{" "}
              page first.
            </p>
          ) : (
            <form className="mt-2 flex gap-2" onSubmit={assign}>
              <label htmlFor="volunteerId" className="sr-only">
                Responder
              </label>
              <select
                id="volunteerId"
                name="volunteerId"
                defaultValue=""
                disabled={isBusy || !isHydrated}
                className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900"
              >
                <option value="">Select a responder...</option>
                {availableVolunteers.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.user.fullName} ({v.skills.join(", ") || "no listed skills"})
                  </option>
                ))}
              </select>
              <Button type="submit" disabled={isBusy || !isHydrated}>
                Assign
              </Button>
            </form>
          )}
        </div>
      )}

      {status === "CLOSED" && (
        <p className="mt-3 text-sm text-slate-500">
          This incident is closed. No further actions are available.
        </p>
      )}
    </Card>
  );
}
