import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { incidentService } from "@/services/incident.service";
import { AppNav } from "@/components/layout/app-nav";
import { MapWithList } from "@/components/map/map-with-list";

export default async function MapPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const incidents = await incidentService.listIncidents({
    id: session.userId,
    role: session.role,
  });

  const mapIncidents = incidents.map((i) => ({
    id: i.id,
    title: i.title,
    category: i.category,
    severity: i.severity,
    status: i.status,
    latitude: i.latitude,
    longitude: i.longitude,
  }));

  return (
    <>
      <AppNav role={session.role} />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-2xl font-semibold">Incident map</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Marker size and color reflect severity. Click a marker, or an item
          in the list, to open the incident.
        </p>

        <div className="mt-6">
          <MapWithList incidents={mapIncidents} />
        </div>
      </main>
    </>
  );
}
