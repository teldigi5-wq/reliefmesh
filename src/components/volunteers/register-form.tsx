"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { inputClass, labelClass } from "@/components/ui/field-styles";

export function VolunteerRegisterForm({
  initialSkills,
  initialAvailable,
}: {
  initialSkills: string[];
  initialAvailable: boolean;
}) {
  const [skills, setSkills] = useState(initialSkills.join(", "));
  const [isAvailable, setIsAvailable] = useState(initialAvailable);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSaved(false);

    const res = await fetch("/api/volunteers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        skills: skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        isAvailable,
      }),
    });

    setIsSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to save");
      return;
    }

    // No router.refresh() here: everything this form shows (skills,
    // availability, the "Saved." confirmation) is already reflected in
    // local state, so there's nothing stale to pull from the server, and
    // refresh() relies on the same RSC-payload fetch that's occasionally
    // flaky in Next's dev mode (see action-panel.tsx) — it would also wipe
    // the "Saved." message the instant it (hopefully) completed.
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-sm">
        <span className={labelClass}>Skills (comma-separated)</span>
        <input
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="first-aid, swiftwater-rescue, logistics"
          className={inputClass}
        />
      </label>

      <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
        <input
          type="checkbox"
          checked={isAvailable}
          onChange={(e) => setIsAvailable(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500/30 dark:border-slate-700"
        />
        Available to be assigned right now
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && <p className="text-sm text-green-600">Saved.</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save volunteer profile"}
      </Button>
    </form>
  );
}
