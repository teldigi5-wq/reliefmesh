import { ShieldCheck } from "lucide-react";

export function OpsLoading({ title = "Loading your workspace" }: { title?: string }) {
  return (
    <main className="ops-page" role="status" aria-live="polite" aria-label={title}>
      <div className="ops-container">
        <div className="mb-8 flex items-center gap-3 text-sm font-semibold" style={{ color: "var(--ops-accent)" }}>
          <ShieldCheck size={18} aria-hidden="true" />
          {title}
        </div>
        <div className="ops-skeleton ops-skeleton-heading" />
        <div className="ops-skeleton ops-skeleton-subheading" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0,1,2,3].map(n => <div className="ops-skeleton ops-skeleton-card" key={n}/>)}
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <div className="ops-skeleton ops-skeleton-chart"/>
          <div className="ops-skeleton ops-skeleton-chart"/>
        </div>
        <span className="sr-only">Loading data from ReliefMesh…</span>
      </div>
    </main>
  );
}
