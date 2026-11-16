"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
  const router = useRouter();
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState("");

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
    router.refresh();
  }

  async function assign() {
    if (!selectedVolunteer) {
      setError("Choose a responder first");
      return;
    }
    setIsBusy(true);
    setError(null);
    const res = await fetch(`/api/incidents/${incidentId}/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ volunteerId: selectedVolunteer }),
    });
    setIsBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Assignment failed");
      return;
    }
    router.refresh();
  }

  const isOperatorOrAdmin = role === "OPERATOR" || role === "ADMIN";
  const isResponder = role === "RESPONDER";

  return (
    <div className="rounded-lg border border-slate-200 p-5 dark:border-slate-800">
      <h2 className="font-semibold">Actions</h2>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <div className="mt-3 flex flex-wrap gap-2">
        {isOperatorOrAdmin && status === "REPORTED" && (
          <Button disabled={isBusy} onClick={() => transition("UNDER_REVIEW")}>
            Mark under review
          </Button>
        )}

        {isOperatorOrAdmin &&
          (status === "REPORTED" || status === "UNDER_REVIEW") && (
            <Button disabled={isBusy} onClick={() => transition("VERIFIED")}>
              Verify incident
            </Button>
          )}

        {isResponder && status === "ASSIGNED" && (
          <Button disabled={isBusy} onClick={() => transition("RESPONDING")}>
            Start responding
          </Button>
        )}

        {isResponder && status === "RESPONDING" && (
          <Button disabled={isBusy} onClick={() => transition("RESOLVED")}>
            Mark resolved
          </Button>
        )}

        {isOperatorOrAdmin && status === "RESOLVED" && (
          <Button disabled={isBusy} onClick={() => transition("CLOSED")}>
            Close incident
          </Button>
        )}
      </div>

      {isOperatorOrAdmin && status === "VERIFIED" && (
        <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-800">
          <p className="text-sm font-medium">Assign a responder</p>
          {availableVolunteers.length === 0 ? (
            <p className="mt-1 text-sm text-slate-500">
              No available volunteers right now — register volunteers on the{" "}
              <a href="/volunteers" className="text-brand-600">
                Volunteers
              </a>{" "}
              page first.
            </p>
          ) : (
            <div className="mt-2 flex gap-2">
              <select
                value={selectedVolunteer}
                onChange={(e) => setSelectedVolunteer(e.target.value)}
                className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
              >
                <option value="">Select a responder...</option>
                {availableVolunteers.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.user.fullName} ({v.skills.join(", ") || "no listed skills"})
                  </option>
                ))}
              </select>
              <Button disabled={isBusy} onClick={assign}>
                Assign
              </Button>
            </div>
          )}
        </div>
      )}

      {status === "CLOSED" && (
        <p className="mt-3 text-sm text-slate-500">
          This incident is closed. No further actions are available.
        </p>
      )}
    </div>
  );
}
