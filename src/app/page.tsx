import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Logo } from "@/components/ui/logo";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-navy-950">
      <header className="border-b border-navy-100 dark:border-navy-800">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo wordmarkClassName="text-lg font-semibold tracking-tight text-navy-900 dark:text-white" />
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-navy-600 transition-colors hover:text-navy-900 dark:text-navy-300 dark:hover:text-white"
            >
              Dashboard
            </Link>
            <Link
              href="/incidents"
              className="text-sm font-medium text-navy-600 transition-colors hover:text-navy-900 dark:text-navy-300 dark:hover:text-white"
            >
              Live map
            </Link>
            <Link
              href="/docs"
              className="text-sm font-medium text-navy-600 transition-colors hover:text-navy-900 dark:text-navy-300 dark:hover:text-white"
            >
              Resources
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-navy-700 transition-colors hover:bg-navy-50 dark:text-navy-200 dark:hover:bg-navy-900"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-brand-600/20 transition-all hover:bg-brand-700 hover:shadow-md"
            >
              Report an emergency
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero — full-bleed editorial layout: copy on the left, a real
          disaster-response photo on the right with a floating live-incident
          card overlapping its edge, instead of the usual boxed stock photo. */}
      <section className="grid items-stretch bg-ivory dark:bg-navy-900 md:grid-cols-2">
        <div className="flex flex-col justify-center gap-6 px-6 py-20 sm:px-10 md:py-28 lg:px-16">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-navy-800 shadow-sm dark:bg-navy-800 dark:text-navy-100">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-600" />
            </span>
            Built for real-time disaster response
          </span>
          <h1 className="max-w-xl text-4xl font-extrabold leading-[1.1] tracking-tight text-navy-900 sm:text-5xl lg:text-[52px] dark:text-white">
            Connecting people,{" "}
            <span className="text-brand-600 dark:text-brand-400">
              emergency information
            </span>{" "}
            and responders when every second matters.
          </h1>
          <p className="max-w-lg text-lg leading-relaxed text-navy-600 dark:text-navy-300">
            ReliefMesh is a disaster-response coordination platform linking
            citizens, operators, volunteers and organisations around a
            single, verified view of what is happening and who is
            responding.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/register"
              className="rounded-lg bg-brand-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-brand-600/25 transition-all hover:bg-brand-700 hover:shadow-xl hover:shadow-brand-600/30"
            >
              Get started
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-sand bg-white px-6 py-3 text-base font-semibold text-navy-900 shadow-sm transition-colors hover:bg-ivory dark:border-navy-700 dark:bg-navy-800 dark:text-white dark:hover:bg-navy-700"
            >
              I already have an account
            </Link>
          </div>
        </div>

        <div className="relative min-h-[320px] overflow-hidden md:min-h-0">
          <Image
            src="/images/hero-flood-rescue.jpg"
            alt="Rescue responders wading through a flooded residential street at dusk, guiding a boat toward stranded residents"
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-x-0 bottom-0 h-56"
            style={{
              background:
                "linear-gradient(to top, rgba(43,56,76,0.85), rgba(43,56,76,0))",
            }}
          />
          <div className="absolute bottom-6 left-6 right-6 flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-xl sm:right-auto">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-severity-critical" />
            <div>
              <p className="text-sm font-semibold text-navy-900">
                Flooding — Riverside District
              </p>
              <p className="text-xs text-navy-500">
                Responder dispatched · 2 min ago
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="bg-navy-900">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-12 sm:grid-cols-4 lg:px-16">
          <Stat value="< 60s" label="to report and geotag an incident" />
          <Stat value="24/7" label="operator coverage, no dead zones" />
          <Stat value="Full" label="audit trail from report to resolution" />
          <Stat value="IoT-ready" label="built-in Guardian SOS integration" />
        </div>
      </section>

      {/* Command center banner — a second full-width photo section to break
          up the card-after-card rhythm of the rest of the page. */}
      <section className="relative overflow-hidden">
        <div className="relative min-h-[420px]">
          <Image
            src="/images/command-center.jpg"
            alt="Emergency operators monitoring hazard maps and satellite storm imagery across a wall of screens in a command center"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(27,33,43,0.92) 0%, rgba(27,33,43,0.55) 50%, rgba(27,33,43,0.15) 100%)",
            }}
          />
          <div className="relative mx-auto flex max-w-6xl flex-col gap-4 px-6 py-20 sm:py-28 lg:px-16">
            <span className="text-xs font-bold uppercase tracking-wider text-sand">
              One command center
            </span>
            <h2 className="max-w-xl text-3xl font-bold leading-tight text-white sm:text-4xl">
              Every hazard, coordinated from a single verified view
            </h2>
            <p className="max-w-lg text-base leading-relaxed text-navy-100">
              Floods, fires, structural damage and missing-person cases all
              flow through the same operator view — verified, assigned, and
              tracked to resolution.
            </p>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="mx-auto max-w-6xl px-6 py-20 lg:px-16">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            What you get
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-navy-900 dark:text-white">
            Everything coordination needs, in one place
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
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
        </div>
      </section>

      {/* How it works */}
      <section className="bg-ivory dark:bg-navy-900">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-16">
          <div className="mx-auto mb-12 max-w-xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              How it works
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-navy-900 dark:text-white">
              From report to resolution
            </h2>
          </div>
          <div className="grid gap-10 sm:grid-cols-3">
            <Step
              number="01"
              title="Report"
              body="A citizen or a Guardian device reports an incident with GPS location and severity."
            />
            <Step
              number="02"
              title="Verify & assign"
              body="An operator reviews the report, verifies it, and assigns responders in the field."
            />
            <Step
              number="03"
              title="Resolve"
              body="Responders act and update status live; every step is logged in a full audit trail."
            />
          </div>
        </div>
      </section>

      <footer className="border-t border-navy-100 dark:border-navy-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row lg:px-16">
          <div className="flex items-center gap-2">
            <Logo wordmarkClassName="hidden" badgeSize="h-6 w-6" />
            <span className="text-sm text-navy-500 dark:text-navy-400">
              © 2026 ReliefMesh — built for disaster response coordination
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-navy-500 dark:text-navy-400">
            <Link href="/privacy" className="hover:text-navy-800 dark:hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-navy-800 dark:hover:text-white">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-navy-800 dark:hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl font-bold text-white sm:text-3xl">{value}</p>
      <p className="mt-1 text-sm text-navy-300">{label}</p>
    </div>
  );
}

function Step({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <div>
      <span className="text-sm font-bold text-brand-600 dark:text-brand-400">
        {number}
      </span>
      <h3 className="mt-2 font-semibold text-navy-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-navy-600 dark:text-navy-300">
        {body}
      </p>
    </div>
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
      <h3 className="mt-4 font-semibold text-navy-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 text-sm text-navy-600 dark:text-navy-300">{body}</p>
    </div>
  );
}
