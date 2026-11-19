"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Logo } from "@/components/ui/logo";
import { inputClass, labelClass } from "@/components/ui/field-styles";

type Phase = "idle" | "authenticating" | "redirecting";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const isSubmitting = phase !== "idle";

  // A valid seven-day HttpOnly session should not force a second login.
  // Only a verified, active server session redirects; network errors don't.
  useEffect(() => {
    const controller = new AbortController();
    void fetch("/api/auth/session", {
      cache: "no-store",
      credentials: "same-origin",
      signal: controller.signal,
    }).then(async response => {
      if (!response.ok || controller.signal.aborted) return;
      const result = await response.json().catch(() => null);
      if (result?.authenticated === true && !controller.signal.aborted)
        window.location.replace("/dashboard");
    }).catch(() => {});
    return () => controller.abort();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) return;
    setError(null);
    setPhase("authenticating");

    try {
      const form = new FormData(e.currentTarget);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        cache: "no-store",
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Login failed. Please try again.");
        setPhase("idle");
        return;
      }

      // Preserve a full navigation after session-cookie issuance.
      // Authenticated Next.js RSC prefetches from before login can be stale.
      try { sessionStorage.setItem("reliefmesh_flash", "Welcome back to ReliefMesh."); } catch {}
      setPhase("redirecting");
      window.location.replace("/dashboard");
    } catch {
      setError("Unable to connect. Check your connection and try again.");
      setPhase("idle");
    }
  }

  return (
    <main className="app-backdrop relative flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="absolute right-6 top-6"><ThemeToggle /></div>
      <Link href="/" className="mb-8" aria-label="Go to ReliefMesh homepage">
        <Logo badgeSize="h-9 w-9" wordmarkClassName="text-lg font-semibold tracking-tight" />
      </Link>

      <Card className="w-full max-w-md p-7 sm:p-8">
        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300">
          <LockKeyhole size={22} aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Welcome back</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Securely sign in to your ReliefMesh operations workspace.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4" aria-busy={isSubmitting}>
          <label className="block text-sm">
            <span className={labelClass}>Email</span>
            <input name="email" type="email" required autoComplete="email" autoFocus
              className={inputClass} disabled={isSubmitting} />
          </label>
          <label className="block text-sm">
            <span className={labelClass}>Password</span>
            <input name="password" type="password" required autoComplete="current-password"
              className={inputClass} disabled={isSubmitting} />
          </label>

          {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300" role="alert">{error}</p>}
          <Button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center gap-2">
            {phase === "authenticating" ? (
              <><span className="rm-auth-spinner" aria-hidden="true" /> Verifying credentials…</>
            ) : phase === "redirecting" ? (
              <><span className="rm-auth-spinner" aria-hidden="true" /> Opening dashboard…</>
            ) : (<>Log in <ArrowRight size={17} aria-hidden="true" /></>)}
          </Button>
          <p aria-live="polite" className="min-h-4 text-center text-xs text-slate-500 dark:text-slate-400">
            {phase === "authenticating" ? "Securing your session. Please stay on this page." :
             phase === "redirecting" ? "Signed in. Loading your workspace…" : ""}
          </p>
        </form>

        <div className="mt-5 flex items-center justify-center gap-2 border-t border-slate-200 pt-5 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <ShieldCheck size={15} className="text-teal-600 dark:text-teal-300" />
          Encrypted session · Existing security checks retained
        </div>
        <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-400">
          No account yet?{" "}
          <Link href="/register" className="font-semibold text-cyan-700 hover:underline dark:text-cyan-300">Register</Link>
        </p>
      </Card>
    </main>
  );
}
