import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { AppNav } from "@/components/layout/app-nav";
import { RemoteSimulator } from "@/components/guardian/remote-simulator";

export default async function SOSRemotePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <>
      <AppNav role={session.role} />
      <main className="app-backdrop min-h-[calc(100vh-57px)]">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
          <div className="rounded-3xl border border-red-200 bg-gradient-to-br from-red-50 via-white to-cyan-50 p-6 shadow-sm dark:border-red-950 dark:from-red-950/30 dark:via-slate-950 dark:to-cyan-950/20 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-red-600 dark:text-red-400">
              Emergency access · {session.role}
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              Virtual SOS remote
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
              Share your browser&apos;s live location, arm the remote and press SOS.
              ReliefMesh creates a critical incident in Supabase, alerts the
              operations team and continues synchronizing your position.
            </p>
            <div className="mt-5 grid gap-3 text-xs font-semibold sm:grid-cols-3">
              <p className="rounded-xl bg-white/80 px-4 py-3 text-slate-700 ring-1 ring-slate-200 dark:bg-slate-900/70 dark:text-slate-200 dark:ring-slate-800">
                1 · Browser GPS permission
              </p>
              <p className="rounded-xl bg-white/80 px-4 py-3 text-slate-700 ring-1 ring-slate-200 dark:bg-slate-900/70 dark:text-slate-200 dark:ring-slate-800">
                2 · Authenticated SOS transmission
              </p>
              <p className="rounded-xl bg-white/80 px-4 py-3 text-slate-700 ring-1 ring-slate-200 dark:bg-slate-900/70 dark:text-slate-200 dark:ring-slate-800">
                3 · Live incident tracking
              </p>
            </div>
          </div>

          <RemoteSimulator />
        </div>
      </main>
    </>
  );
}
