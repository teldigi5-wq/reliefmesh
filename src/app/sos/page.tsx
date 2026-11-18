import { redirect } from "next/navigation";
import { Siren } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { AppNav } from "@/components/layout/app-nav";
import { OpsPageHeader } from "@/components/layout/ops-page-header";
import { RemoteSimulator } from "@/components/guardian/remote-simulator";

export default async function SOSRemotePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <>
      <AppNav role={session.role} />
      <main className="ops-page">
        <div className="ops-container">
          <OpsPageHeader
            icon={Siren}
            eyebrow={`EMERGENCY ACCESS / ${session.role}`}
            title="Virtual SOS remote"
            description="Share live browser GPS, trigger a critical Supabase incident and stream your position to the operations team."
          />
          <div className="ops-summary-banner">
            <span className="ops-summary-icon"><Siren size={25} /></span>
            <div>
              <span className="ops-summary-kicker">REAL SOFTWARE WORKFLOW</span>
              <h2>One SOS connects the citizen to ReliefMesh operations</h2>
              <p>Browser GPS → authenticated API → Supabase incident → operator notification → live Guardian map</p>
            </div>
            <div className="ops-summary-count"><strong>5s</strong><span>location sync</span></div>
          </div>
          <RemoteSimulator />
        </div>
      </main>
    </>
  );
}
