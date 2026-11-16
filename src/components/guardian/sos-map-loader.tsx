"use client";

import dynamic from "next/dynamic";
import type { MapSOSEvent } from "@/components/guardian/sos-map";

const SOSMap = dynamic(
  () => import("@/components/guardian/sos-map").then((m) => m.SOSMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[450px] w-full items-center justify-center rounded-lg border border-slate-200 text-sm text-slate-400 dark:border-slate-800">
        Loading map...
      </div>
    ),
  }
);

export function SOSMapLoader({ events }: { events: MapSOSEvent[] }) {
  return <SOSMap events={events} />;
}
