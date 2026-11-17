"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { inputClass, labelClass } from "@/components/ui/field-styles";
import { LocationPicker } from "@/components/incidents/location-picker";
import { DisclaimerBanner } from "@/components/ui/disclaimer-banner";

const CATEGORIES = [
  "FLOOD",
  "LANDSLIDE",
  "FIRE",
  "MEDICAL_EMERGENCY",
  "ROAD_ACCIDENT",
  "MISSING_PERSON",
  "INFRASTRUCTURE_DAMAGE",
  "OTHER",
] as const;

const SEVERITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;

export default function NewIncidentPage() {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [address, setAddress] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!coords) {
      setError("Set a location — search for one, use your current location, or enter coordinates.");
      setIsSubmitting(false);
      return;
    }

    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/incidents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        description: form.get("description"),
        category: form.get("category"),
        severity: form.get("severity"),
        latitude: coords.lat,
        longitude: coords.lng,
        address: address || undefined,
      }),
    });

    setIsSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to submit report");
      return;
    }

    const incident = await res.json();
    // A hard navigation rather than router.push(): this is a one-time
    // redirect straight after creating the record, so there's nothing to
    // preserve client-side, and it sidesteps a real Next.js dev-mode
    // flakiness where the RSC-payload prefetch for the destination
    // occasionally fails ("Failed to fetch") and its automatic fallback to
    // a full navigation doesn't always land before the next interaction —
    // same reasoning as the logout redirect elsewhere in this app.
    window.location.href = `/incidents/${incident.id}`;
  }

  return (
    <main className="app-backdrop min-h-screen px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-xl">
        <DisclaimerBanner />
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Report an emergency
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Give as much detail as you safely can. An operator will review and
          verify this report.
        </p>

        <Card className="mt-6 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Title" name="title" required placeholder="Brief summary" />

            <label className="block text-sm">
              <span className={labelClass}>Description</span>
              <textarea
                name="description"
                required
                minLength={10}
                rows={4}
                className={inputClass}
              />
            </label>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className={labelClass}>Category</span>
                <select name="category" required className={inputClass}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm">
                <span className={labelClass}>Severity</span>
                <select name="severity" required className={inputClass}>
                  {SEVERITIES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <LocationPicker
              address={address}
              onAddressChange={setAddress}
              coords={coords}
              onCoordsChange={setCoords}
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Submitting..." : "Submit report"}
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}

function Field({
  label,
  name,
  ...props
}: { label: string; name: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-sm">
      <span className={labelClass}>{label}</span>
      <input name={name} className={inputClass} {...props} />
    </label>
  );
}
