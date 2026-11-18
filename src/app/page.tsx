import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BellRing,
  CheckCircle2,
  LocateFixed,
  MapPin,
  Radio,
  ShieldCheck,
  Siren,
  UsersRound,
  Zap,
} from "lucide-react";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const capabilities = [
  {
    icon: Siren,
    eyebrow: "Citizen reporting",
    title: "Turn a distress signal into verified action.",
    body: "Location-rich reports, severity context and live status updates give operators a clear starting point within seconds.",
    accent: "critical",
  },
  {
    icon: UsersRound,
    eyebrow: "Response coordination",
    title: "Keep every role aligned on one operational picture.",
    body: "Admins, operators and responders share assignments, incident state and an auditable trail from report to resolution.",
    accent: "brand",
  },
  {
    icon: Radio,
    eyebrow: "Connected infrastructure",
    title: "Ready for mobile, IoT and field intelligence.",
    body: "A secure API, Guardian device pathway and native push delivery extend the platform beyond the control room.",
    accent: "amber",
  },
] as const;

const workflow = [
  { number: "01", title: "Signal received", body: "A citizen or connected device submits a location-aware incident report." },
  { number: "02", title: "Context verified", body: "Operators validate severity, enrich the record and coordinate the right resources." },
  { number: "03", title: "Response mobilised", body: "Responders receive the assignment, update progress and close the loop in real time." },
];

export default function LandingPage() {
  return (
    <main className="landing-page min-h-screen overflow-hidden bg-[#f7faf9] text-slate-950 dark:bg-[#06110f] dark:text-white">
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-[#f7faf9]/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#06110f]/80">
        <nav className="landing-container flex h-[76px] items-center justify-between">
          <Link href="/" aria-label="ReliefMesh home">
            <Logo badgeSize="h-9 w-9" wordmarkClassName="text-[17px] font-semibold tracking-[-0.025em] text-slate-950 dark:text-white" />
          </Link>
          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex dark:text-slate-300">
            <a className="landing-nav-link" href="#platform">Platform</a>
            <a className="landing-nav-link" href="#workflow">How it works</a>
            <a className="landing-nav-link" href="#mission">Mission</a>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Link href="/login" className="landing-login hidden sm:inline-flex">Log in</Link>
            <Link href="/register" className="landing-button landing-button-primary !px-4 !py-2.5 text-sm">Report emergency</Link>
          </div>
        </nav>
      </header>

      <section className="landing-hero relative isolate">
        <div className="landing-grid-overlay" aria-hidden="true" />
        <div className="hero-glow hero-glow-left" aria-hidden="true" />
        <div className="hero-glow hero-glow-right" aria-hidden="true" />
        <div className="landing-container grid gap-16 py-20 lg:min-h-[820px] lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-20 lg:py-24 xl:gap-28">
          <div className="relative z-10 max-w-3xl">
            <div className="hero-enter hero-enter-1 inline-flex items-center gap-2.5 rounded-full border border-brand-200/80 bg-white/80 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.13em] text-brand-800 shadow-sm backdrop-blur dark:border-brand-700/60 dark:bg-brand-950/60 dark:text-brand-200">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
              </span>
              Live emergency coordination
            </div>
            <h1 className="hero-enter hero-enter-2 mt-7 max-w-[780px] text-[clamp(3.25rem,7vw,6.6rem)] font-semibold leading-[0.94] tracking-[-0.067em] text-slate-950 dark:text-white">
              Response moves faster when the whole network is <span className="landing-gradient-text">connected.</span>
            </h1>
            <p className="hero-enter hero-enter-3 mt-8 max-w-[650px] text-lg leading-8 text-slate-600 sm:text-xl dark:text-slate-300">
              ReliefMesh unifies citizens, control rooms, responders and organisations around one verified, real-time view of an emergency.
            </p>
            <div className="hero-enter hero-enter-4 mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/register" className="landing-button landing-button-primary group">
                Activate ReliefMesh
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link href="/login" className="landing-button landing-button-secondary">Open operations portal</Link>
            </div>
            <div className="hero-enter hero-enter-5 mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-slate-200/80 pt-7 text-sm text-slate-600 dark:border-white/10 dark:text-slate-400">
              <TrustItem>Role-aware access</TrustItem>
              <TrustItem>Live incident lifecycle</TrustItem>
              <TrustItem>Native mobile alerts</TrustItem>
            </div>
          </div>
          <div className="hero-enter hero-enter-visual relative mx-auto w-full max-w-[620px] lg:mx-0 lg:justify-self-end">
            <HeroNetworkVisual />
          </div>
        </div>

        <div className="landing-container relative pb-10 lg:pb-14">
          <div className="grid divide-y divide-slate-200/80 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/70 shadow-[0_24px_70px_-45px_rgba(15,23,42,.38)] backdrop-blur-xl sm:grid-cols-3 sm:divide-x sm:divide-y-0 dark:divide-white/10 dark:border-white/10 dark:bg-white/[0.04]">
            <Metric value="One source" label="A shared incident record for every role" />
            <Metric value="Real time" label="Assignments, status and alerts stay in sync" />
            <Metric value="Field ready" label="Web, native mobile and IoT pathways" />
          </div>
        </div>
      </section>

      <section id="platform" className="landing-section scroll-mt-24">
        <div className="landing-container">
          <ScrollReveal className="max-w-3xl">
            <SectionEyebrow>One operational layer</SectionEyebrow>
            <h2 className="landing-section-title mt-5">Clarity for every decision between alert and arrival.</h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Designed around the moments where information is fragmented, responsibility changes hands and time matters most.
            </p>
          </ScrollReveal>
          <div className="mt-14 grid gap-5 lg:grid-cols-3 lg:gap-6">
            {capabilities.map((capability, index) => (
              <ScrollReveal key={capability.title} delay={index * 110} className="h-full">
                <article className="landing-capability-card group h-full">
                  <div className={"capability-icon capability-icon-" + capability.accent}>
                    <capability.icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
                  </div>
                  <p className="mt-8 text-xs font-bold uppercase tracking-[0.16em] text-brand-700 dark:text-brand-300">{capability.eyebrow}</p>
                  <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.035em] text-slate-950 dark:text-white">{capability.title}</h3>
                  <p className="mt-5 text-[15px] leading-7 text-slate-600 dark:text-slate-300">{capability.body}</p>
                  <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                    Explore capability <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="landing-section landing-section-dark scroll-mt-24">
        <div className="landing-container grid gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:items-start lg:gap-24">
          <ScrollReveal direction="left" className="lg:sticky lg:top-32">
            <SectionEyebrow dark>From signal to safety</SectionEyebrow>
            <h2 className="landing-section-title mt-5 text-white">A response flow that never loses the thread.</h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">Every transition is visible, attributable and delivered to the people who need to act next.</p>
            <div className="mt-9 inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.055] px-4 py-3 text-sm text-slate-200">
              <ShieldCheck className="h-5 w-5 text-brand-300" /> Secure role-based coordination
            </div>
          </ScrollReveal>
          <div className="space-y-4">
            {workflow.map((step, index) => (
              <ScrollReveal key={step.number} delay={index * 120} direction="right">
                <article className="workflow-card">
                  <div className="workflow-number">{step.number}</div>
                  <div>
                    <h3 className="text-xl font-semibold tracking-[-0.025em] text-white">{step.title}</h3>
                    <p className="mt-2 leading-7 text-slate-300">{step.body}</p>
                  </div>
                  <CheckCircle2 className="workflow-status h-5 w-5" />
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="mission" className="landing-section scroll-mt-24">
        <div className="landing-container">
          <ScrollReveal direction="scale">
            <div className="landing-cta relative overflow-hidden rounded-[2rem] border border-brand-200/70 bg-brand-950 px-7 py-12 text-white shadow-[0_40px_100px_-45px_rgba(5,39,35,.65)] sm:px-12 sm:py-16 lg:px-16 lg:py-20 dark:border-brand-800/70">
              <div className="cta-grid" aria-hidden="true" />
              <div className="cta-orb" aria-hidden="true" />
              <div className="relative z-10 max-w-3xl">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.17em] text-brand-200"><Zap className="h-4 w-4" /> Built for the next critical moment</div>
                <h2 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-5xl lg:text-6xl">Put a coordinated response network in every hand.</h2>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-brand-100/80">Start with the operational platform today and extend into native mobile response, connected devices and community-scale resilience.</p>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Link href="/register" className="landing-button bg-white text-brand-950 shadow-xl shadow-black/15 hover:-translate-y-0.5 hover:bg-brand-50">Create an account <ArrowRight className="h-4 w-4" /></Link>
                  <Link href="/login" className="landing-button border border-white/15 bg-white/10 text-white hover:bg-white/15">Access ReliefMesh</Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <footer className="border-t border-slate-200/80 py-9 dark:border-white/10">
        <div className="landing-container flex flex-col gap-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:text-slate-400">
          <Logo wordmarkClassName="font-semibold tracking-tight text-slate-800 dark:text-slate-100" />
          <p>Emergency coordination, designed for trust and speed.</p>
        </div>
      </footer>
    </main>
  );
}

function HeroNetworkVisual() {
  return (
    <div className="hero-network-shell">
      <div className="hero-network-topbar">
        <div className="flex items-center gap-2"><Activity className="h-4 w-4 text-brand-500" /><span className="font-semibold text-slate-800 dark:text-white">Operational mesh</span></div>
        <span className="flex items-center gap-2 text-xs font-medium text-brand-700 dark:text-brand-300"><span className="h-1.5 w-1.5 rounded-full bg-brand-500 shadow-[0_0_0_4px_rgba(30,164,140,.12)]" /> Live</span>
      </div>
      <div className="hero-network-stage">
        <div className="network-ring network-ring-outer" /><div className="network-ring network-ring-inner" /><div className="network-scan" />
        <svg className="network-lines" viewBox="0 0 520 420" fill="none" aria-hidden="true">
          <path d="M84 90L260 210L438 80M260 210L455 342M260 210L95 345" />
          <path className="network-line-active" d="M84 90L260 210L438 80L455 342L260 210L95 345Z" />
        </svg>
        <div className="network-core"><div className="network-core-pulse" /><Logo badgeSize="h-14 w-14" wordmarkClassName="hidden" /></div>
        <NetworkNode className="left-[15%] top-[20%]" icon={<Siren />} label="Alert" tone="critical" />
        <NetworkNode className="right-[13%] top-[17%]" icon={<BellRing />} label="Control" tone="brand" />
        <NetworkNode className="bottom-[13%] right-[9%]" icon={<UsersRound />} label="Responder" tone="brand" />
        <NetworkNode className="bottom-[10%] left-[16%]" icon={<LocateFixed />} label="Location" tone="amber" />
        <div className="incident-float-card">
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-red-600 dark:text-red-300"><span className="h-2 w-2 rounded-full bg-red-500" /> Critical signal</span>
            <span className="text-[11px] text-slate-400">Now</span>
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">Flood risk reported</p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400"><MapPin className="h-3 w-3" /> Verified coordinates</p>
        </div>
        <div className="response-float-card">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-200"><CheckCircle2 className="h-4 w-4" /></div>
          <div><p className="text-xs text-slate-500 dark:text-slate-400">Response assigned</p><p className="text-sm font-semibold text-slate-900 dark:text-white">Unit R-07 en route</p></div>
        </div>
      </div>
      <div className="hero-network-footer">
        <div><p className="text-[11px] uppercase tracking-[0.13em] text-slate-400">Signal integrity</p><p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">Verified</p></div>
        <div className="h-9 w-px bg-slate-200 dark:bg-white/10" />
        <div><p className="text-[11px] uppercase tracking-[0.13em] text-slate-400">Active roles</p><p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">4 connected</p></div>
        <div className="ml-auto flex items-end gap-1" aria-label="Strong network activity">
          {[12, 18, 26, 34, 42].map((height, index) => <span key={height} className="network-bar" style={{ height, animationDelay: index * 110 + "ms" }} />)}
        </div>
      </div>
    </div>
  );
}

function TrustItem({ children }: { children: React.ReactNode }) {
  return <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-600" />{children}</span>;
}

function NetworkNode({ className, icon, label, tone }: { className: string; icon: React.ReactElement; label: string; tone: "critical" | "brand" | "amber" }) {
  return <div className={"network-node network-node-" + tone + " " + className}><span>{icon}</span><small>{label}</small></div>;
}

function Metric({ value, label }: { value: string; label: string }) {
  return <div className="px-6 py-6 sm:px-8 lg:px-10"><p className="text-lg font-semibold tracking-[-0.025em] text-slate-950 dark:text-white">{value}</p><p className="mt-1.5 text-sm leading-6 text-slate-500 dark:text-slate-400">{label}</p></div>;
}

function SectionEyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return <div className={"inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.17em] " + (dark ? "text-brand-300" : "text-brand-700 dark:text-brand-300")}><span className="h-px w-8 bg-current" />{children}</div>;
}
