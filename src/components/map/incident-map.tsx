"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
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

function FitIncidentLocations({ incidents }: { incidents: MapIncident[] }) {
  const map = useMap();
  const signature = incidents.map(i => i.id + ":" + i.latitude + ":" + i.longitude).join("|");
  useEffect(() => {
    const valid = incidents.filter(i => Number.isFinite(i.latitude) && Number.isFinite(i.longitude));
    if (valid.length === 1) map.setView([valid[0].latitude, valid[0].longitude], 12);
    if (valid.length > 1) {
      const bounds = L.latLngBounds(valid.map(i => [i.latitude, i.longitude] as [number, number]));
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 12 });
    }
  // Recenter only when the coordinates change, not on every data refresh.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, signature]);
  return null;
}

export function IncidentMap({ incidents }: { incidents: MapIncident[] }) {
  const first = incidents[0];
  const center: [number, number] = first
    ? [first.latitude, first.longitude]
    : [6.9271, 79.8612]; // generic fallback — not tied to any real event

  return (
    <MapContainer
      center={center}
      zoom={incidents.length > 0 ? 11 : 7}
      scrollWheelZoom
      className="h-[600px] w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitIncidentLocations incidents={incidents} />
      {incidents.filter(i => Number.isFinite(i.latitude) && Number.isFinite(i.longitude)).map((incident) => (
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
                {incident.title.startsWith("WhatsApp SOS") ? "WhatsApp SOS · UNVERIFIED" : incident.category.replace(/_/g, " ")} · {incident.severity} ·{" "}
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
