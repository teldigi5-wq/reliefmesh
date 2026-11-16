import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { volunteerService } from "@/services/volunteer.service";
import { AppNav } from "@/components/layout/app-nav";
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

  return (
    <>
      <AppNav role={session.role} />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-2xl font-semibold">Volunteers</h1>

        {canRegister && (
          <section className="mt-6 rounded-lg border border-slate-200 p-5 dark:border-slate-800">
            <h2 className="font-semibold">Your volunteer profile</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              List your skills and toggle availability so operators can
              assign you to verified incidents.
            </p>
            <div className="mt-4">
              <VolunteerRegisterForm
                initialSkills={ownProfile?.skills ?? []}
                initialAvailable={ownProfile?.isAvailable ?? true}
              />
            </div>
          </section>
        )}

        {canManage && roster && (
          <section className="mt-8">
            <h2 className="font-semibold">Volunteer roster</h2>
            <div className="mt-3 divide-y divide-slate-200 rounded-lg border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
              {roster.length === 0 && (
                <p className="p-4 text-sm text-slate-500">
                  No one has registered as a volunteer yet.
                </p>
              )}
              {roster.map((v) => (
                <div key={v.id} className="flex items-center justify-between p-4 text-sm">
                  <div>
                    <p className="font-medium">{v.user.fullName}</p>
                    <p className="text-slate-500">{v.user.email}</p>
                    <p className="text-slate-500">
                      {v.skills.length ? v.skills.join(", ") : "No skills listed"}
                    </p>
                  </div>
                  <span
                    className={
                      v.isAvailable
                        ? "rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/40 dark:text-green-300"
                        : "rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    }
                  >
                    {v.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
