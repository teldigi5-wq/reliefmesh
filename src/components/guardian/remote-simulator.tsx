"use client";

import { useState } from "react";
import Link from "next/link";

type TransmissionState =
  | { status: "idle" }
  | { status: "sending"; attempt: number }
  | { status: "failed"; message: string; attempt: number }
  | { status: "cancelled" }
  | { status: "sent"; incidentId: string; eventId: string };

const CATEGORIES = [
  ["MEDICAL_EMERGENCY", "Medical emergency"],
  ["FIRE", "Fire"],
  ["FLOOD", "Flood"],
  ["LANDSLIDE", "Landslide"],
  ["ROAD_ACCIDENT", "Road accident"],
  ["MISSING_PERSON", "Missing person"],
  ["INFRASTRUCTURE_DAMAGE", "Infrastructure damage"],
  ["OTHER", "Other emergency"],
] as const;

export function RemoteSimulator() {
  const [deviceSerial] = useState(
    () => `SIM-REMOTE-${Math.random().toString(36).slice(2, 7).toUpperCase()}`
  );
  const [category, setCategory] = useState("MEDICAL_EMERGENCY");
  const [description, setDescription] = useState("");
  const [batteryPct, setBatteryPct] = useState(84);
  const [networkAvailable, setNetworkAvailable] = useState(true);
  const [gpsAvailable, setGpsAvailable] = useState(true);
  const [armed, setArmed] = useState(false);
  const [latitude, setLatitude] = useState(6.9271);
  const [longitude, setLongitude] = useState(79.8612);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [locationSource, setLocationSource] = useState<
    "SIMULATED_GPS" | "PHONE_GPS"
  >("SIMULATED_GPS");
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const [transmission, setTransmission] = useState<TransmissionState>({
    status: "idle",
  });

  function usePhoneLocation() {
    setLocationMessage("Requesting phone location permission…");
    if (!navigator.geolocation) {
      setLocationMessage("This browser does not expose phone GPS.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setAccuracy(position.coords.accuracy);
        setLocationSource("PHONE_GPS");
        setGpsAvailable(true);
        setLocationMessage("Phone GPS fix acquired.");
      },
      (error) => {
        setLocationMessage(
          error.code === error.PERMISSION_DENIED
            ? "Location permission was denied. Simulated GPS remains selected."
            : "A phone GPS fix was not available."
        );
      },
      { enableHighAccuracy: true, timeout: 12_000, maximumAge: 5_000 }
    );
  }

  async function transmit() {
    if (!armed || transmission.status === "sending") return;
    const attempt =
      transmission.status === "failed" ? transmission.attempt + 1 : 1;

    if (!networkAvailable) {
      setTransmission({
        status: "failed",
        message: "SIM800L could not register on the network. Restore connectivity and retry.",
        attempt,
      });
      return;
    }
    if (!gpsAvailable) {
      setTransmission({
        status: "failed",
        message: "NEO-6M has no GPS fix. Restore GPS availability and retry.",
        attempt,
      });
      return;
    }

    setTransmission({ status: "sending", attempt });

    try {
      const response = await fetch("/api/guardian/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceSerial,
          latitude,
          longitude,
          batteryPct,
          category,
          description,
          networkType: locationSource === "PHONE_GPS" ? "PHONE_DATA" : "GPRS",
          locationSource,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error ?? "ReliefMesh did not acknowledge the transmission.");
      }
      setTransmission({
        status: "sent",
        incidentId: data.incidentId,
        eventId: data.eventId,
      });
      setArmed(false);
    } catch (error) {
      setTransmission({
        status: "failed",
        message: error instanceof Error ? error.message : "Transmission failed.",
        attempt,
      });
    }
  }

  function cancel() {
    setArmed(false);
    setTransmission({ status: "cancelled" });
  }

  function reset() {
    setArmed(false);
    setTransmission({ status: "idle" });
  }

  const isSending = transmission.status === "sending";
  const isSent = transmission.status === "sent";

  return (
    <section className="mt-8" aria-labelledby="virtual-remote-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">
            Software-in-the-loop demo
          </p>
          <h2
            id="virtual-remote-heading"
            className="mt-1 text-xl font-bold text-slate-950 dark:text-white"
          >
            Virtual Guardian SOS remote
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
            Emulates ESP32, SIM800L and NEO-6M telemetry. A successful send creates a
            real ReliefMesh incident; the hardware itself is simulated.
          </p>
        </div>
        <span className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
          SIMULATED HARDWARE
        </span>
      </div>

      <div className="mt-4 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-950 p-5 text-white shadow-2xl shadow-slate-950/20">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">ReliefMesh Guardian</p>
              <p className="font-mono text-sm font-semibold">{deviceSerial}</p>
            </div>
            <div className="flex gap-2 text-xs">
              <span className={networkAvailable ? "text-emerald-400" : "text-red-400"}>
                ● {networkAvailable ? "GPRS" : "NO NET"}
              </span>
              <span className={gpsAvailable ? "text-emerald-400" : "text-red-400"}>
                ● {gpsAvailable ? "GPS" : "NO FIX"}
              </span>
            </div>
          </div>

          <div className="py-6 text-center">
            <button
              type="button"
              onClick={transmit}
              disabled={!armed || isSending || isSent}
              className="mx-auto flex h-48 w-48 flex-col items-center justify-center rounded-full border-8 border-red-950 bg-gradient-to-b from-red-500 to-red-700 shadow-[0_14px_0_#7f1d1d,0_24px_50px_rgba(239,68,68,0.35)] transition enabled:active:translate-y-2 enabled:active:shadow-[0_6px_0_#7f1d1d] disabled:cursor-not-allowed disabled:grayscale disabled:opacity-60"
            >
              <span className="text-5xl font-black tracking-widest">SOS</span>
              <span className="mt-2 text-xs font-bold uppercase tracking-wider">
                {isSending ? "Transmitting…" : armed ? "Press to send" : "Arm first"}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setArmed((value) => !value)}
              disabled={isSending || isSent}
              className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${
                armed
                  ? "border-amber-400 bg-amber-400/15 text-amber-300"
                  : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500"
              }`}
            >
              {armed ? "ARMED" : "Arm remote"}
            </button>
            <button
              type="button"
              onClick={cancel}
              disabled={isSending || isSent}
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-bold text-slate-300 hover:border-red-500 hover:text-red-300 disabled:opacity-40"
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="surface-card space-y-4 p-5">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Emergency category
            </label>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              disabled={isSending || isSent}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            >
              {CATEGORIES.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Telemetry note
            </label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={isSending || isSent}
              placeholder="Optional details for responders"
              maxLength={500}
              className="mt-1 min-h-20 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
              <label htmlFor="battery">Battery</label><span>{batteryPct}%</span>
            </div>
            <input id="battery" type="range" min="1" max="100" value={batteryPct}
              onChange={(event) => setBatteryPct(Number(event.target.value))}
              disabled={isSending || isSent} className="mt-2 w-full accent-red-600" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setNetworkAvailable((value) => !value)}
              disabled={isSending || isSent}
              className={`rounded-lg border p-3 text-left text-sm ${networkAvailable ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300" : "border-red-300 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"}`}>
              <span className="block text-xs font-semibold uppercase">SIM800L</span>
              {networkAvailable ? "Connected" : "Disconnected"}
            </button>
            <button type="button" onClick={() => setGpsAvailable((value) => !value)}
              disabled={isSending || isSent}
              className={`rounded-lg border p-3 text-left text-sm ${gpsAvailable ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300" : "border-red-300 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"}`}>
              <span className="block text-xs font-semibold uppercase">NEO-6M</span>
              {gpsAvailable ? "GPS fix" : "No fix"}
            </button>
          </div>

          <div className="rounded-lg bg-slate-100 p-3 text-xs text-slate-600 dark:bg-slate-800/70 dark:text-slate-300">
            <div className="flex items-center justify-between gap-3">
              <span>
                {latitude.toFixed(5)}, {longitude.toFixed(5)}
                {accuracy !== null ? ` · ±${Math.round(accuracy)}m` : " · simulated"}
              </span>
              <button type="button" onClick={usePhoneLocation} disabled={isSending || isSent}
                className="shrink-0 font-bold text-brand-600 hover:text-brand-700">
                Use phone GPS
              </button>
            </div>
            {locationMessage && <p className="mt-1">{locationMessage}</p>}
          </div>

          {transmission.status === "sending" && (
            <p className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-200">
              Attempt {transmission.attempt}: sending telemetry and waiting for acknowledgement…
            </p>
          )}
          {transmission.status === "failed" && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
              <p>{transmission.message}</p>
              <button type="button" onClick={transmit} className="mt-2 font-bold underline">
                Retry transmission
              </button>
            </div>
          )}
          {transmission.status === "cancelled" && (
            <p className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              Transmission cancelled before acknowledgement.
            </p>
          )}
          {transmission.status === "sent" && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200">
              <p className="font-bold">Acknowledged — genuine incident created.</p>
              <p className="mt-1 font-mono text-xs">Event {transmission.eventId}</p>
              <Link href={`/incidents/${transmission.incidentId}`} className="mt-2 inline-block font-bold underline">
                Open incident
              </Link>
            </div>
          )}
          {(transmission.status === "cancelled" || isSent) && (
            <button type="button" onClick={reset} className="text-sm font-semibold text-brand-600 hover:text-brand-700">
              Reset remote
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
