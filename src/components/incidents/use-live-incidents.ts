"use client";

import { useEffect, useRef, useState } from "react";
import type { MapIncident } from "@/components/map/incident-map";

export type LiveIncident = MapIncident & { createdAt?: string };
export type LiveConnection = "connecting" | "connected" | "offline";

const POLL_INTERVAL_MS = 2_000;

/** The incident API applies the logged-in user's existing role permissions. */
function readIncidents(value: unknown): LiveIncident[] {
  if (!Array.isArray(value)) throw new Error("Invalid incident response");

  return value.map((raw): LiveIncident => {
    if (typeof raw !== "object" || raw === null) throw new Error("Invalid incident");
    const i = raw as Record<string, unknown>;
    if (
      typeof i.id !== "string" || typeof i.title !== "string" ||
      typeof i.category !== "string" ||
      !["LOW", "MEDIUM", "HIGH", "CRITICAL"].includes(String(i.severity)) ||
      !["REPORTED", "UNDER_REVIEW", "VERIFIED", "ASSIGNED", "RESPONDING", "RESOLVED", "CLOSED"].includes(String(i.status)) ||
      typeof i.latitude !== "number" || !Number.isFinite(i.latitude) ||
      typeof i.longitude !== "number" || !Number.isFinite(i.longitude)
    ) throw new Error("Invalid incident record");

    return {
      id: i.id,
      title: i.title,
      category: i.category,
      severity: i.severity as LiveIncident["severity"],
      status: i.status as LiveIncident["status"],
      latitude: i.latitude,
      longitude: i.longitude,
      createdAt: typeof i.createdAt === "string" ? i.createdAt : undefined,
    };
  });
}

/**
 * Two-second *visible-tab* polling. Fetches incident JSON only (no full-page
 * refresh), skips overlapping requests, and doesn't redraw unchanged data.
 * Authorization is enforced by /api/incidents, not by this client hook.
 */
export function useLiveIncidents(initialIncidents: LiveIncident[]) {
  const [incidents, setIncidents] = useState<LiveIncident[]>(initialIncidents);
  const [connection, setConnection] = useState<LiveConnection>("connecting");
  const signatureRef = useRef(JSON.stringify(initialIncidents));

  useEffect(() => {
    let active = true;
    let controller: AbortController | null = null;

    const poll = async () => {
      if (!active || document.visibilityState !== "visible" || controller) return;
      const current = new AbortController();
      controller = current;
      try {
        const response = await fetch("/api/incidents", {
          method: "GET",
          credentials: "same-origin",
          cache: "no-store",
          headers: { Accept: "application/json" },
          signal: current.signal,
        });
        if (!response.ok) throw new Error("Incident refresh failed");
        const next = readIncidents(await response.json());
        if (!active || current.signal.aborted) return;

        const signature = JSON.stringify(next);
        if (signatureRef.current !== signature) {
          signatureRef.current = signature;
          setIncidents(next);
        }
        setConnection("connected");
      } catch {
        if (active && !current.signal.aborted) setConnection("offline");
      } finally {
        if (controller === current) controller = null;
      }
    };

    const onVisible = () => {
      if (document.visibilityState === "visible") void poll();
      else controller?.abort();
    };
    const timer = window.setInterval(() => { void poll(); }, POLL_INTERVAL_MS);
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    void poll();

    return () => {
      active = false;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
      controller?.abort();
    };
  }, []);

  return { incidents, connection, pollIntervalMs: POLL_INTERVAL_MS };
}
