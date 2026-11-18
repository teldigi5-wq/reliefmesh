"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Logo } from "@/components/ui/logo";
import { inputClass, labelClass } from "@/components/ui/field-styles";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<"idle" | "submitting" | "redirecting">("idle");
  const isSubmitting = phase !== "idle";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) return;
    setError(null);
    setPhase("submitting");

    try {
      const form = new FormData(e.currentTarget);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        cache: "no-store",
        body: JSON.stringify({
          fullName: form.get("fullName"),
          email: form.get("email"),
          password: form.get("password"),
          phone: form.get("phone") || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Registration failed. Please try again.");
        setPhase("idle");
        return;
      }
      try { sessionStorage.setItem("reliefmesh_flash", "Your ReliefMesh account is ready."); } catch {}
      setPhase("redirecting");
      window.location.replace("/dashboard");
    } catch {
      setError("Unable to connect. Check your connection and try again.");
      setPhase("idle");
    }
  }

  return (
    <main className="app-backdrop relative flex min-h-screen flex-col items-center justify-center px-6 py-10">
      <div className="absolute right-6 top-6"><ThemeToggle /></div>
      <Link href="/" className="mb-8">
        <Logo badgeSize="h-9 w-9" wordmarkClassName="text-lg font-semibold tracking-tight" />
      </Link>
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Create your account</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Citizens can register directly. Operator, responder and organisation accounts are provisioned by an administrator.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4" aria-busy={isSubmitting}>
          <Field label="Full name" name="fullName" required autoComplete="name" disabled={isSubmitting} />
          <Field label="Email" name="email" type="email" required autoComplete="email" disabled={isSubmitting} />
          <Field label="Phone (optional)" name="phone" autoComplete="tel" disabled={isSubmitting} />
          <Field label="Password" name="password" type="password" required minLength={8} autoComplete="new-password" disabled={isSubmitting} />
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center gap-2">
            {isSubmitting && <span className="rm-auth-spinner" aria-hidden="true" />}
            {phase === "submitting" ? "Creating your account…" : phase === "redirecting" ? "Opening dashboard…" : "Create account"}
          </Button>
          <p aria-live="polite" className="min-h-4 text-center text-xs text-slate-500 dark:text-slate-400">
            {phase === "submitting" ? "Setting up your secure session…" : phase === "redirecting" ? "Your account is ready. Loading your workspace…" : ""}
          </p>
        </form>
        <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-cyan-700 hover:underline dark:text-cyan-300">Log in</Link>
        </p>
      </Card>
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
