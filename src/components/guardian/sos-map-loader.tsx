"use client";

import dynamic from "next/dynamic";
import type { MapSOSEvent } from "@/components/guardian/sos-map";

const SOSMap = dynamic(
  () => import("@/components/guardian/sos-map").then((m) => m.SOSMap),
  {
    ssr: false,
    loading: () => (
      <div className="surface-card flex h-[450px] w-full items-center justify-center text-sm text-slate-400">
        Loading map...
      </div>
    ),
  }
);

export function SOSMapLoader({ events }: { events: MapSOSEvent[] }) {
  return <SOSMap events={events} />;
}
