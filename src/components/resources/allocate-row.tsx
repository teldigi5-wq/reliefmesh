"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type IncidentOption = { id: string; title: string; status: string };

export function AllocateRow({
  resourceId,
  available,
  unit,
  incidents,
}: {
  resourceId: string;
  available: number;
  unit: string;
  incidents: IncidentOption[];
}) {
  const router = useRouter();
  const [incidentId, setIncidentId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function allocate() {
    if (!incidentId) {
      setError("Choose an incident first");
      return;
    }
    setIsBusy(true);
    setError(null);
    const res = await fetch(`/api/resources/${resourceId}/allocate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ incidentId, quantity }),
    });
    setIsBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Allocation failed");
      return;
    }
    router.refresh();
  }

  if (available <= 0) {
    return <p className="text-sm text-slate-500">None available to allocate.</p>;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={incidentId}
        onChange={(e) => setIncidentId(e.target.value)}
        className="rounded-md border border-slate-300 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-900"
      >
        <option value="">Select incident...</option>
        {incidents.map((i) => (
          <option key={i.id} value={i.id}>
            {i.title} ({i.status})
          </option>
        ))}
      </select>
      <input
        type="number"
        min={1}
        max={available}
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="w-20 rounded-md border border-slate-300 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-900"
      />
      <span className="text-xs text-slate-500">{unit}</span>
      <Button type="button" disabled={isBusy} onClick={allocate}>
        Allocate
      </Button>
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
}
