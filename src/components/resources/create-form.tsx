"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { inputClass } from "@/components/ui/field-styles";

const CATEGORIES = [
  "MEDICAL_SUPPLIES",
  "FOOD_AND_WATER",
  "VEHICLES",
  "RESCUE_EQUIPMENT",
  "TEMPORARY_SHELTER",
] as const;

export function ResourceCreateForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        category: form.get("category"),
        quantityTotal: Number(form.get("quantityTotal")),
        unit: form.get("unit") || "units",
      }),
    });

    setIsSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to create resource");
      return;
    }

    (e.target as HTMLFormElement).reset();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-5">
      <input
        name="name"
        required
        placeholder="Resource name"
        className={`${inputClass} sm:col-span-2`}
      />
      <select name="category" required className={inputClass}>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c.replace(/_/g, " ")}
          </option>
        ))}
      </select>
      <input
        name="quantityTotal"
        type="number"
        min={0}
        required
        placeholder="Quantity"
        className={inputClass}
      />
      <input name="unit" placeholder="Unit (e.g. liters)" className={inputClass} />
      <div className="sm:col-span-5">
        {error && <p className="mb-2 text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add resource"}
        </Button>
      </div>
    </form>
  );
}
