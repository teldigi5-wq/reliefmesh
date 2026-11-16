import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <header className="border-b border-slate-200 dark:border-slate-800">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold tracking-tight">
            ReliefMesh
          </span>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="rounded-md px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              Report an emergency
            </Link>
          </div>
        </nav>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Connecting people, emergency information and responders when every
          second matters.
        </h1>
        <p className="mt-6 text-lg text-slate-600 dark:text-slate-400">
          ReliefMesh is a disaster-response coordination platform linking
          citizens, operators, volunteers and organisations around a single,
          verified view of what is happening and who is responding.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/register"
            className="rounded-md bg-brand-600 px-6 py-3 text-base font-medium text-white hover:bg-brand-700"
          >
            Get started
          </Link>
          <Link
            href="/login"
            className="rounded-md border border-slate-300 px-6 py-3 text-base font-medium hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            I already have an account
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-16 sm:grid-cols-3">
        <FeatureCard
          title="Report & verify"
          body="Citizens report incidents with location and severity. Operators review and verify before resources are committed."
        />
        <FeatureCard
          title="Coordinate response"
          body="Operators assign responders and track every incident from report through resolution with a full audit trail."
        />
        <FeatureCard
          title="IoT-ready by design"
          body="The backend is built to accept a future Guardian SOS remote — GPS, cellular, battery status — without a redesign."
        />
      </section>
    </main>
  );
}

function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-slate-200 p-6 dark:border-slate-800">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{body}</p>
    </div>
  );
}
