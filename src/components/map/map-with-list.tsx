"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { SeverityBadge, StatusBadge } from "@/components/incidents/badges";
import type { MapIncident } from "@/components/map/incident-map";

// Leaflet touches `window` at import time, so the map must never render on
// the server — dynamic() with ssr: false keeps it out of the SSR pass.
const IncidentMap = dynamic(
  () => import("@/components/map/incident-map").then((m) => m.IncidentMap),
  { ssr: false, loading: () => <MapSkeleton /> }
);

function MapSkeleton() {
  return (
    <div className="flex h-[600px] w-full items-center justify-center rounded-lg border border-slate-200 text-sm text-slate-400 dark:border-slate-800">
      Loading map...
    </div>
  );
}

export function MapWithList({ incidents }: { incidents: MapIncident[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <IncidentMap incidents={incidents} />

      <div className="max-h-[600px] divide-y divide-slate-200 overflow-y-auto rounded-lg border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
        {incidents.length === 0 && (
          <p className="p-4 text-sm text-slate-500">No incidents to show.</p>
        )}
        {incidents.map((incident) => (
          <Link
            key={incident.id}
            href={`/incidents/${incident.id}`}
            className="block p-3 hover:bg-slate-50 dark:hover:bg-slate-900"
          >
            <p className="text-sm font-medium">{incident.title}</p>
            <div className="mt-1 flex gap-2">
              <SeverityBadge severity={incident.severity} />
              <StatusBadge status={incident.status} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
