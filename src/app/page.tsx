import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Logo } from "@/components/ui/logo";

export default function LandingPage() {
  return (
    <main className="app-backdrop min-h-screen">
      <header className="border-b border-slate-200/80 dark:border-slate-800/80">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo wordmarkClassName="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50" />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-brand-700 hover:shadow-md"
            >
              Report an emergency
            </Link>
          </div>
        </nav>
      </header>

      <section className="mx-auto max-w-4xl animate-fade-in-up px-6 py-24 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:border-brand-800 dark:bg-brand-900/30 dark:text-brand-300">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-500" />
          </span>
          Built for real-time disaster response
        </span>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl dark:text-slate-50">
          Connecting people, emergency{" "}
          <span className="bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
            information
          </span>{" "}
          and responders when every second matters.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
          ReliefMesh is a disaster-response coordination platform linking
          citizens, operators, volunteers and organisations around a single,
          verified view of what is happening and who is responding.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/register"
            className="rounded-lg bg-brand-600 px-6 py-3 text-base font-medium text-white shadow-md shadow-brand-600/20 transition-all hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-600/30"
          >
            Get started
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-base font-medium text-slate-900 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            I already have an account
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-16 sm:grid-cols-3">
        <FeatureCard
          icon={
            <path
              d="M9 11l3 3L22 4M2 12l5 5L22 2M2 20h20"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          }
          title="Report & verify"
          body="Citizens report incidents with location and severity. Operators review and verify before resources are committed."
        />
        <FeatureCard
          icon={
            <path
              d="M17 20h5v-2a4 4 0 0 0-3-3.87M9 20H4v-2a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v2M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          }
          title="Coordinate response"
          body="Operators assign responders and track every incident from report through resolution with a full audit trail."
        />
        <FeatureCard
          icon={
            <path
              d="M12 2a10 10 0 1 0 10 10M12 2v10l7 7"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          }
          title="IoT-ready by design"
          body="The backend is built to accept a future Guardian SOS remote — GPS, cellular, battery status — without a redesign."
        />
      </section>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="surface-card hover-lift p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
        <svg viewBox="0 0 24 24" className="h-5 w-5">
          {icon}
        </svg>
      </div>
      <h3 className="mt-4 font-semibold text-slate-900 dark:text-slate-100">
        {title}
      </h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{body}</p>
    </div>
  );
}
