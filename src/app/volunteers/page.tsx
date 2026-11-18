import { redirect } from "next/navigation";
import { UsersRound, UserCheck, HeartHandshake } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { volunteerService } from "@/services/volunteer.service";
import { AppNav } from "@/components/layout/app-nav";
import { OpsPageHeader } from "@/components/layout/ops-page-header";
import { VolunteerRegisterForm } from "@/components/volunteers/register-form";
import { hasPermission } from "@/lib/permissions";

export default async function VolunteersPage() {
 const session = await getSession();
 if (!session) redirect("/login");
 const canRegister = hasPermission(session.role, "volunteer:register");
 const canManage = hasPermission(session.role, "volunteer:manage");
 const [ownProfile, roster] = await Promise.all([
  canRegister ? volunteerService.getOwnProfile({ id: session.userId }) : null,
  canManage ? volunteerService.listAll({ role: session.role }) : null,
 ]);
 const available = roster ? roster.filter(v => v.isAvailable).length : 0;
 return (
 <>
  <AppNav role={session.role} />
  <main className="ops-page">
   <div className="ops-container">
    <OpsPageHeader icon={UsersRound} eyebrow="OPERATIONS / PEOPLE" title="Volunteer network"
      description="Manage volunteer capabilities and availability for coordinated incident response." />
    {canManage && roster && <section className="ops-info-grid" aria-label="Volunteer summary">
      <div className="ops-info-card"><span>Registered volunteers</span><strong>{roster.length}</strong></div>
      <div className="ops-info-card"><span>Available volunteers</span><strong>{available}</strong></div>
      <div className="ops-info-card"><span>Currently unavailable</span><strong>{roster.length - available}</strong></div>
    </section>}
    {canRegister && (
      <section className="ops-panel mb-6">
       <div className="ops-panel-heading"><div><span className="ops-panel-kicker">YOUR PROFILE</span><h3>Volunteer availability and skills</h3></div><UserCheck className="ops-faint" size={20}/></div>
       <p className="ops-feature-description mb-5">List your skills and update your availability so authorised operators can coordinate suitable assignments.</p>
       <VolunteerRegisterForm initialSkills={ownProfile?.skills ?? []} initialAvailable={ownProfile?.isAvailable ?? true} />
      </section>
    )}
    {canManage && roster && (
     <section className="ops-panel">
      <div className="ops-panel-heading"><div><span className="ops-panel-kicker">RESPONSE COMMUNITY</span><h3>Volunteer roster</h3></div><span className="ops-panel-badge">{roster.length} profiles</span></div>
      <div className="ops-list">
       {roster.length === 0 && <p className="ops-empty">No one has registered as a volunteer yet.</p>}
       {roster.map(v => (
        <article key={v.id} className="ops-list-row">
         <div className="ops-list-main"><span className="ops-list-icon"><HeartHandshake size={20} /></span>
          <div><p className="ops-list-title">{v.user.fullName}</p><p className="ops-list-caption">{v.user.email}</p><p className="ops-list-caption">{v.skills.length ? v.skills.join(", ") : "No skills listed"}</p></div>
         </div>
         <span className={v.isAvailable ? "rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 dark:bg-green-900/40 dark:text-green-300" : "rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400"}>{v.isAvailable ? "Available" : "Unavailable"}</span>
        </article>
       ))}
      </div>
     </section>
    )}
    {!canRegister && !canManage && <div className="ops-empty">Your role does not have access to volunteer profile management.</div>}
   </div>
  </main>
 </>
 );
}
