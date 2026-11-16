"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

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
    <main className="mx-auto max-w-xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Report an emergency</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Give as much detail as you safely can. An operator will review and
        verify this report.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Field label="Title" name="title" required placeholder="Brief summary" />

        <label className="block text-sm">
          <span className="mb-1 block font-medium">Description</span>
          <textarea
            name="description"
            required
            minLength={10}
            rows={4}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-900"
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Category</span>
            <select
              name="category"
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium">Severity</span>
            <select
              name="severity"
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            >
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

        <div className="rounded-md border border-slate-200 p-4 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Location</span>
            <button
              type="button"
              onClick={useMyLocation}
              disabled={locating}
              className="text-sm text-brand-600 hover:underline disabled:opacity-50"
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
      <span className="mb-1 block font-medium">{label}</span>
      <input
        name={name}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-900"
        {...props}
      />
    </label>
  );
}
