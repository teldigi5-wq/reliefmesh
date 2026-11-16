import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";

export default async function ResourcesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-semibold capitalize">resources</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        This module is scaffolded (route, layout, auth check) but the
        feature itself is a Day 2/3 build item — see docs/ROADMAP.md.
      </p>
    </main>
  );
}
