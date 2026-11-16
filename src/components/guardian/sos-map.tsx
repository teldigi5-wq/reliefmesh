"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export interface MapSOSEvent {
  id: string;
  latitude: number;
  longitude: number;
  triggeredAt: string;
  deviceSerial: string;
  isSimulated: boolean;
}

export function SOSMap({ events }: { events: MapSOSEvent[] }) {
  const first = events[0];
  const center: [number, number] = first
    ? [first.latitude, first.longitude]
    : [6.9271, 79.8612];

  return (
    <MapContainer
      center={center}
      zoom={events.length > 0 ? 11 : 7}
      scrollWheelZoom
      className="h-[450px] w-full rounded-lg border border-slate-200 dark:border-slate-800"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {events.map((event) => (
        <CircleMarker
          key={event.id}
          center={[event.latitude, event.longitude]}
          radius={10}
          pathOptions={{ color: "#dc2626", fillColor: "#dc2626", fillOpacity: 0.6 }}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-medium">
                {event.isSimulated ? "SIMULATED SOS" : "SOS"} — {event.deviceSerial}
              </p>
              <p className="text-slate-600">
                {new Date(event.triggeredAt).toLocaleString()}
              </p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
