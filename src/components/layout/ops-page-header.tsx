import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
export function OpsPageHeader({ eyebrow, title, description, action, icon: Icon }: {
 eyebrow: string; title: string; description: string; action?: ReactNode; icon?: LucideIcon;
}) {
 return (
 <header className="ops-page-heading">
  <div className="ops-page-heading-copy">
   <div className="ops-eyebrow">{Icon ? <Icon size={15} aria-hidden="true" /> : <span className="ops-eyebrow-dot" />}{eyebrow}</div>
   <h1>{title}</h1><p>{description}</p>
  </div>
  {action && <div className="ops-heading-action">{action}</div>}
 </header>);
}
