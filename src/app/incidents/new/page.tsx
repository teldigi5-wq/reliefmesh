"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { inputClass, labelClass } from "@/components/ui/field-styles";

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
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [locating, setLocating] = useState(false);

  function useMyLocation() {
    if (!navigator.geolocation) {
      setError("Geolocation isn't available in this browser — enter coordinates manually.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setError("Couldn't get your location — enter coordinates manually.");
        setLocating(false);
      }
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const form = new FormData(e.currentTarget);
    const latitude = Number(form.get("latitude"));
    const longitude = Number(form.get("longitude"));

    const res = await fetch("/api/incidents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        description: form.get("description"),
        category: form.get("category"),
        severity: form.get("severity"),
        latitude,
        longitude,
        address: form.get("address") || undefined,
      }),
    });

    setIsSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to submit report");
      return;
    }

    const incident = await res.json();
    router.push(`/incidents/${incident.id}`);
  }

  return (
    <main className="app-backdrop min-h-screen px-6 py-10">
      <div className="mx-auto max-w-xl">
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

            <div className="grid grid-cols-2 gap-4">
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

            <Field
              label="Address (optional)"
              name="address"
              placeholder="Nearest landmark or address"
            />

            <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Location</span>
                <button
                  type="button"
                  onClick={useMyLocation}
                  disabled={locating}
                  className="text-sm font-medium text-brand-600 hover:text-brand-700 hover:underline disabled:opacity-50"
                >
                  {locating ? "Locating..." : "Use my current location"}
                </button>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-4">
                <Field
                  label="Latitude"
                  name="latitude"
                  type="number"
                  step="any"
                  required
                  defaultValue={coords?.lat}
                  key={coords?.lat}
                />
                <Field
                  label="Longitude"
                  name="longitude"
                  type="number"
                  step="any"
                  required
                  defaultValue={coords?.lng}
                  key={coords?.lng}
                />
              </div>
            </div>

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
