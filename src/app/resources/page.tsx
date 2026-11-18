import { redirect } from "next/navigation";
import { Boxes, PackagePlus, ArrowUpRight, PackageCheck } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { resourceService } from "@/services/resource.service";
import { incidentService } from "@/services/incident.service";
import { AppNav } from "@/components/layout/app-nav";
import { OpsPageHeader } from "@/components/layout/ops-page-header";
import { hasPermission } from "@/lib/permissions";
import { ResourceCreateForm } from "@/components/resources/create-form";
import { AllocateRow } from "@/components/resources/allocate-row";

export default async function ResourcesPage() {
 const session = await getSession();
 if (!session) redirect("/login");
 const actor = { id: session.userId, role: session.role };
 const canManage = hasPermission(session.role, "resource:manage");
 const canAllocate = hasPermission(session.role, "resource:allocate");
 const [resources, incidents] = await Promise.all([
  resourceService.listAll(),
  canAllocate ? incidentService.listIncidents(actor) : Promise.resolve([]),
 ]);
 const allocatableIncidents = incidents.filter(i => !["RESOLVED", "CLOSED"].includes(i.status)).map(i => ({ id: i.id, title: i.title, status: i.status }));
 const availableTypes = resources.filter(r => r.quantityTotal > r.quantityInUse).length;
 const inUseTypes = resources.filter(r => r.quantityInUse > 0).length;
 return (
 <>
  <AppNav role={session.role} />
  <main className="ops-page">
   <div className="ops-container">
    <OpsPageHeader icon={Boxes} eyebrow="OPERATIONS / LOGISTICS" title="Resource inventory"
      description="Track equipment and supplies, available stock and assignments to active incidents." />
    <section className="ops-info-grid" aria-label="Resource summary">
     <div className="ops-info-card"><span>Resource types</span><strong>{resources.length}</strong></div>
     <div className="ops-info-card"><span>Types with available stock</span><strong>{availableTypes}</strong></div>
     <div className="ops-info-card"><span>Types currently allocated</span><strong>{inUseTypes}</strong></div>
    </section>
    {canManage && <section className="ops-panel mb-6">
      <div className="ops-panel-heading"><div><span className="ops-panel-kicker">INVENTORY MANAGEMENT</span><h3>Add a resource</h3></div><PackagePlus size={20} className="ops-faint" /></div>
      <ResourceCreateForm />
    </section>}
    <div className="ops-section-heading"><div><span className="ops-eyebrow">STOCK REGISTER</span><h2>Available resources</h2><p>Inventory is grouped by resource type; unit quantities are shown individually.</p></div><span className="ops-meta-chip"><PackageCheck size={14} /> {resources.length} types</span></div>
    <section className="ops-list" aria-label="Resource register">
     {resources.length === 0 && <div className="ops-empty">No resources are registered yet.</div>}
     {resources.map(resource => {
      const available = resource.quantityTotal - resource.quantityInUse;
      const percent = resource.quantityTotal > 0 ? Math.max(0, Math.min(100, available / resource.quantityTotal * 100)) : 0;
      return (
       <article key={resource.id} className="ops-panel">
        <div className="ops-panel-heading"><div><span className="ops-panel-kicker">{resource.category.replace(/_/g, " ")}</span><h3>{resource.name}</h3></div>
          <span className="ops-panel-badge">{available} / {resource.quantityTotal} {resource.unit} available</span></div>
        <div className="ops-resource-progress" role="meter" aria-label={"Stock availability for " + resource.name} aria-valuemin={0} aria-valuemax={resource.quantityTotal} aria-valuenow={Math.max(0,available)}>
         <div style={{ width: percent + "%" }} /></div>
        {canAllocate && <div className="mt-5 border-t pt-5" style={{borderColor:"var(--ops-border)"}}><p className="ops-feature-description mb-3">Allocate this resource to an open incident.</p>
          <AllocateRow resourceId={resource.id} available={available} unit={resource.unit} incidents={allocatableIncidents} /></div>}
       </article>
      );
     })}
    </section>
   </div>
  </main>
 </>
 );
}
