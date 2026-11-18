import { redirect } from "next/navigation";
import Link from "next/link";
import { MapPinned, Layers3, ArrowRight } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { incidentService } from "@/services/incident.service";
import { AppNav } from "@/components/layout/app-nav";
import { OpsPageHeader } from "@/components/layout/ops-page-header";
import { MapWithList } from "@/components/map/map-with-list";

export default async function MapPage() {
 const session = await getSession();
 if (!session) redirect("/login");
 const incidents = await incidentService.listIncidents({ id: session.userId, role: session.role });
 const mapIncidents = incidents.map(i => ({ id: i.id, title: i.title, category: i.category, severity: i.severity, status: i.status, latitude: i.latitude, longitude: i.longitude }));
 return (
 <>
  <AppNav role={session.role} />
  <main className="ops-page">
   <div className="ops-container">
    <OpsPageHeader icon={MapPinned} eyebrow="OPERATIONS / GEOSPATIAL" title="Incident map"
      description="Explore authorised incident reports by location. Marker size and colour reflect severity."
      action={<Link href="/incidents" className="ops-button ops-button-outline">View incident records <ArrowRight size={16}/></Link>} />
    <div className="ops-section-heading"><div><span className="ops-eyebrow">LOCATION INTELLIGENCE</span><h2>Geographic overview</h2><p>Choose a map pin or incident listing to open the full record.</p></div><span className="ops-meta-chip"><Layers3 size={14} /> {mapIncidents.length} locations</span></div>
    <section className="ops-map-layout" aria-label="Incident locations"><MapWithList incidents={mapIncidents} /></section>
    <p className="ops-footnote">Map markers use the coordinates submitted with incident reports. Their presence does not confirm verification or emergency-response availability.</p>
   </div>
  </main>
 </>
 );
}
