import { redirect } from "next/navigation";
import Link from "next/link";
import { Radio, AlertTriangle, MapPinned, Siren } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { guardianService } from "@/services/guardian.service";
import { AppNav } from "@/components/layout/app-nav";
import { OpsPageHeader } from "@/components/layout/ops-page-header";
import { SOSMapLoader } from "@/components/guardian/sos-map-loader";
import { PermissionError } from "@/lib/permissions";
import { GuardianLiveRefresh } from "@/components/guardian/live-refresh";

export default async function GuardianPage() {
 const session = await getSession();
 if (!session) redirect("/login");
 let data;
 try {
  data = await guardianService.getMonitoringData({ role: session.role });
 } catch (err) {
  if (err instanceof PermissionError) redirect("/sos");
  throw err;
 }
 const { devices, sosEvents } = data;
 const mapEvents = sosEvents.map(e => ({
  id:e.id, latitude:e.latitude, longitude:e.longitude,
  triggeredAt:e.triggeredAt.toISOString(), deviceSerial:e.device.deviceSerial, isSimulated:e.isSimulated,
 }));
 return (
 <>
  <AppNav role={session.role} />
  <main className="ops-page">
   <div className="ops-container">
    <GuardianLiveRefresh />
    <OpsPageHeader icon={Radio} eyebrow="GUARDIAN / MONITORING" title="Guardian monitoring"
      description="Review registered prototype devices, simulated SOS events and their live locations."
      action={<Link href="/sos" className="ops-button ops-button-primary"><Siren size={17}/> Open SOS remote</Link>} />
    <div className="ops-notice" role="note"><strong>Simulation only:</strong> No physical Guardian SOS hardware exists yet. All events are simulated test data; this interface is not a live emergency-response service.</div>
    <section className="ops-info-grid" aria-label="Guardian test overview">
     <div className="ops-info-card"><span>Registered test devices</span><strong>{devices.length}</strong></div>
     <div className="ops-info-card"><span>Simulated SOS events</span><strong>{sosEvents.length}</strong></div>
     <div className="ops-info-card"><span>Hardware status</span><strong className="text-lg">Concept</strong></div>
    </section>
    <section className="ops-panel">
     <div className="ops-panel-heading"><div><span className="ops-panel-kicker">SIMULATED LOCATIONS</span><h3>Guardian SOS map</h3></div><MapPinned size={20} className="ops-faint" /></div>
     <SOSMapLoader events={mapEvents} />
    </section>
    <div className="ops-bottom-grid">
     <section className="ops-panel">
      <div className="ops-panel-heading"><div><span className="ops-panel-kicker">TEST INVENTORY</span><h3>Registered devices</h3></div><span className="ops-panel-badge">{devices.length} devices</span></div>
      <div className="ops-list">
       {devices.length === 0 && <div className="ops-empty">No test devices registered. Run the simulation script documented in docs/GUARDIAN.md to generate sample data.</div>}
       {devices.map(d => <article key={d.id} className="ops-list-row"><div className="ops-list-main"><span className="ops-list-icon"><Radio size={20}/></span><div><p className="ops-list-title">{d.deviceSerial}</p><p className="ops-list-caption">{d.lastSeenAt ? "Last seen " + new Date(d.lastSeenAt).toLocaleString() : "Never seen"}</p></div></div>
        <div className="text-right"><p className="ops-list-title">{d.status}</p>{d.batteryPct !== null && <p className="ops-list-caption">{d.batteryPct}% battery</p>}</div></article>)}
      </div>
     </section>
     <section className="ops-panel">
      <div className="ops-panel-heading"><div><span className="ops-panel-kicker">TEST ALERTS</span><h3>Recent SOS events</h3></div><span className="ops-panel-badge">SIMULATED</span></div>
      <div className="ops-list">
       {sosEvents.length === 0 && <div className="ops-empty">No simulated SOS events yet.</div>}
       {sosEvents.map(e => <article key={e.id} className="ops-list-row"><div className="ops-list-main"><span className="ops-list-icon"><AlertTriangle size={19}/></span><div>
        <p className="ops-list-title">{e.device.deviceSerial}</p>
        <p className="ops-list-caption">{e.latitude.toFixed(4)}, {e.longitude.toFixed(4)} · {new Date(e.triggeredAt).toLocaleString()}</p>
        {e.incident && <p className="ops-list-caption">Linked incident: {e.incident.title}</p>}
        </div></div><span className="ops-panel-badge">SIMULATED</span></article>)}
      </div>
     </section>
    </div>
   </div>
  </main>
 </>
 );
}
