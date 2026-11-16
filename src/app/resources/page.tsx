import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { resourceService } from "@/services/resource.service";
import { incidentService } from "@/services/incident.service";
import { AppNav } from "@/components/layout/app-nav";
import { hasPermission } from "@/lib/permissions";
import { ResourceCreateForm } from "@/components/resources/create-form";
import { AllocateRow } from "@/components/resources/allocate-row";
import { Card } from "@/components/ui/card";

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

  const allocatableIncidents = incidents
    .filter((i) => !["RESOLVED", "CLOSED"].includes(i.status))
    .map((i) => ({ id: i.id, title: i.title, status: i.status }));

  return (
    <>
      <AppNav role={session.role} />
      <main className="app-backdrop min-h-[calc(100vh-57px)] mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Resources
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Medical supplies, food/water, vehicles, rescue equipment and
          shelters — tracked with quantity on hand and what&apos;s allocated.
        </p>

        {canManage && (
          <Card className="mt-6">
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">
              Add a resource
            </h2>
            <div className="mt-3">
              <ResourceCreateForm />
            </div>
          </Card>
        )}

        <section className="mt-8 space-y-4">
          {resources.length === 0 && (
            <p className="text-sm text-slate-500">No resources registered yet.</p>
          )}
          {resources.map((resource) => {
            const available = resource.quantityTotal - resource.quantityInUse;
            return (
              <Card key={resource.id} className="hover-lift p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {resource.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      {resource.category.replace(/_/g, " ")} ·{" "}
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {available} / {resource.quantityTotal} {resource.unit}
                      </span>{" "}
                      available
                    </p>
                  </div>
                </div>
                {canAllocate && (
                  <div className="mt-3">
                    <AllocateRow
                      resourceId={resource.id}
                      available={available}
                      unit={resource.unit}
                      incidents={allocatableIncidents}
                    />
                  </div>
                )}
              </Card>
            );
          })}
        </section>
      </main>
    </>
  );
}
