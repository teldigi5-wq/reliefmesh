"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import Link from "next/link";
import "leaflet/dist/leaflet.css";
import type { Severity, IncidentStatus } from "@prisma/client";

export interface MapIncident {
  id: string;
  title: string;
  category: string;
  severity: Severity;
  status: IncidentStatus;
  latitude: number;
  longitude: number;
}

const SEVERITY_COLOR: Record<Severity, string> = {
  LOW: "#16a34a",
  MEDIUM: "#ca8a04",
  HIGH: "#ea580c",
  CRITICAL: "#dc2626",
};

const SEVERITY_RADIUS: Record<Severity, number> = {
  LOW: 7,
  MEDIUM: 8,
  HIGH: 9,
  CRITICAL: 11,
};

export function IncidentMap({ incidents }: { incidents: MapIncident[] }) {
  const center: [number, number] =
    incidents.length > 0
      ? [incidents[0].latitude, incidents[0].longitude]
      : [6.9271, 79.8612]; // generic fallback — not tied to any real event

  return (
    <MapContainer
      center={center}
      zoom={incidents.length > 0 ? 11 : 7}
      scrollWheelZoom
      className="h-[600px] w-full rounded-lg border border-slate-200 dark:border-slate-800"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {incidents.map((incident) => (
        <CircleMarker
          key={incident.id}
          center={[incident.latitude, incident.longitude]}
          radius={SEVERITY_RADIUS[incident.severity]}
          pathOptions={{
            color: SEVERITY_COLOR[incident.severity],
            fillColor: SEVERITY_COLOR[incident.severity],
            fillOpacity: 0.7,
          }}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-medium">{incident.title}</p>
              <p className="text-slate-600">
                {incident.category.replace(/_/g, " ")} · {incident.severity} ·{" "}
                {incident.status.replace(/_/g, " ")}
              </p>
              <Link href={`/incidents/${incident.id}`} className="text-brand-600">
                View incident
              </Link>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
