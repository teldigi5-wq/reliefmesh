import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { guardianService } from "@/services/guardian.service";
import { AppNav } from "@/components/layout/app-nav";
import { SOSMapLoader } from "@/components/guardian/sos-map-loader";
import { PermissionError } from "@/lib/permissions";

export default async function GuardianPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  let data;
  try {
    data = await guardianService.getMonitoringData({ role: session.role });
  } catch (err) {
    if (err instanceof PermissionError) {
      redirect("/sos");
    }
    throw err;
  }

  const { devices, sosEvents } = data;

  const mapEvents = sosEvents.map((e) => ({
    id: e.id,
    latitude: e.latitude,
    longitude: e.longitude,
    triggeredAt: e.triggeredAt.toISOString(),
    deviceSerial: e.device.deviceSerial,
    isSimulated: e.isSimulated,
  }));

  return (
    <>
      <AppNav role={session.role} />
      <main className="app-backdrop min-h-[calc(100vh-57px)] mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Guardian device monitoring
        </h1>
        <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 shadow-sm dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          The virtual remote uses real browser GPS, the authenticated Guardian
          API and the production data model. Hardware is simulated, every event
          is tagged SIMULATED, and there is no code path that can mark one as
          physical hardware.
        </p>

        <div className="mt-5 grid gap-2 rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-sm sm:grid-cols-4 dark:border-slate-800 dark:bg-slate-900/70">
          <p className="rounded-xl bg-slate-50 px-3 py-3 text-center text-xs font-bold dark:bg-slate-800">1 · Virtual SOS remote</p>
          <p className="rounded-xl bg-slate-50 px-3 py-3 text-center text-xs font-bold dark:bg-slate-800">2 · Secured Next.js API</p>
          <p className="rounded-xl bg-slate-50 px-3 py-3 text-center text-xs font-bold dark:bg-slate-800">3 · Supabase incident + GPS</p>
          <p className="rounded-xl bg-slate-50 px-3 py-3 text-center text-xs font-bold dark:bg-slate-800">4 · Operator alerts + map</p>
        </div>

        <section className="mt-8">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
                Live operational view
              </p>
              <h2 className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                SOS location map
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Live GPS updates move the marker and linked incident coordinates.
            </p>
          </div>
          <SOSMapLoader events={mapEvents} />
        </section>

        <section className="mt-8">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">
            Registered devices
          </h2>
          <div className="surface-card mt-2 divide-y divide-slate-200/80 dark:divide-slate-800">
            {devices.length === 0 && (
              <p className="p-4 text-sm text-slate-500">
                No devices registered yet. Run{" "}
                <code>scripts/simulate-sos.ts</code> to create one.
              </p>
            )}
            {devices.map((d) => (
              <div key={d.id} className="flex items-center justify-between p-3 text-sm">
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {d.deviceSerial}
                  </p>
                  <p className="text-slate-500">
                    {d.lastSeenAt
                      ? `Last seen ${new Date(d.lastSeenAt).toLocaleString()}`
                      : "Never seen"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-900 dark:text-slate-100">{d.status}</p>
                  {d.batteryPct !== null && (
                    <p className="text-slate-500">{d.batteryPct}% battery</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">
            Recent SOS events (simulated)
          </h2>
          <div className="surface-card mt-2 divide-y divide-slate-200/80 dark:divide-slate-800">
            {sosEvents.length === 0 && (
              <p className="p-4 text-sm text-slate-500">No SOS events yet.</p>
            )}
            {sosEvents.map((e) => (
              <div key={e.id} className="p-3 text-sm">
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  {e.device.deviceSerial} —{" "}
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-600/20 dark:bg-red-900/40 dark:text-red-300">
                    SIMULATED
                  </span>
                </p>
                <p className="mt-1 text-slate-500">
                  {e.latitude.toFixed(4)}, {e.longitude.toFixed(4)} ·{" "}
                  {new Date(e.triggeredAt).toLocaleString()}
                </p>
                {e.incident && (
                  <p className="text-slate-500">
                    Linked incident: {e.incident.title}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
