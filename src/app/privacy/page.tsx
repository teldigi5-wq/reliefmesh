import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Cookie, LockKeyhole, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { CookieSettingsButton } from "@/components/privacy/cookie-preferences";

export const metadata: Metadata = {
  title: "Privacy & Cookies | ReliefMesh",
  description: "Learn how ReliefMesh uses essential sign-in cookies and optional appearance preferences.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-14 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <article className="mx-auto max-w-3xl">
        <Link href="/" className="mb-9 inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 hover:underline dark:text-cyan-300">
          <ArrowLeft size={16} /> Back to ReliefMesh
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300"><Cookie /></span>
          <div><p className="text-xs font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-400">Account & preferences</p>
            <h1 className="text-3xl font-extrabold tracking-tight">Privacy & cookies</h1></div>
        </div>
        <p className="mb-10 text-sm leading-7 text-slate-600 dark:text-slate-300">
          ReliefMesh is a hackathon prototype. This page explains the browser storage used by the application itself.
          Review the policy before collecting real personal or emergency-response data in a production deployment.
        </p>
        <div className="space-y-5">
          <section className="rounded-2xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="flex items-center gap-2 text-lg font-bold"><LockKeyhole size={19} className="text-cyan-600"/> Essential account cookies</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              The <code>reliefmesh_session</code> cookie keeps your sign-in session available for up to 7 days.
              It is set by the authentication service, is HttpOnly, and uses SameSite=Lax.
              Secure is enabled in production. It is required for cookie-based web sign-in.
            </p>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="flex items-center gap-2 text-lg font-bold"><ShieldCheck size={19} className="text-cyan-600"/> Cookie choice</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              The first-party <code>reliefmesh_cookie_choice</code> cookie remembers whether you selected
              necessary-only or optional appearance preferences. It expires after 180 days and does not contain
              your identity. It is used to avoid repeatedly showing the cookie notice.
            </p>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="flex items-center gap-2 text-lg font-bold"><SlidersHorizontal size={19} className="text-cyan-600"/> Optional appearance preference</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              If you allow site preferences, <code>localStorage</code> remembers your selected light/dark theme
              under the key <code>theme</code>. Choosing necessary-only removes that saved theme value.
              The website does not configure advertising or analytics tracking cookies.
            </p>
          </section>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <CookieSettingsButton className="rounded-xl bg-cyan-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-cyan-700" />
          <p className="max-w-xl text-xs leading-6 text-slate-500 dark:text-slate-400">Browser/session activity may still be processed by your hosting and authentication infrastructure. For privacy inquiries, use the project owner's official contact channel.</p>
        </div>
      </article>
    </main>
  );
}
