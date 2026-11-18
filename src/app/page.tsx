import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Logo } from "@/components/ui/logo";

const ENQUIRY_EMAIL = "mailto:partners@reliefmesh.app";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-navy-950">
      <header className="sticky top-0 z-30 border-b border-navy-100 bg-white/90 backdrop-blur dark:border-navy-800 dark:bg-navy-950/90">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12">
          <Logo wordmarkClassName="text-lg font-semibold tracking-tight text-navy-900 dark:text-white" />
          <div className="hidden items-center gap-7 md:flex">
            <Link href="#products" className="text-sm font-medium text-navy-600 transition-colors hover:text-navy-900 dark:text-navy-300 dark:hover:text-white">
              Products
            </Link>
            <Link href="#solutions" className="text-sm font-medium text-navy-600 transition-colors hover:text-navy-900 dark:text-navy-300 dark:hover:text-white">
              Solutions
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-navy-600 transition-colors hover:text-navy-900 dark:text-navy-300 dark:hover:text-white">
              How It Works
            </Link>
            <Link href="#community" className="text-sm font-medium text-navy-600 transition-colors hover:text-navy-900 dark:text-navy-300 dark:hover:text-white">
              Community
            </Link>
            <Link href="#footer" className="text-sm font-medium text-navy-600 transition-colors hover:text-navy-900 dark:text-navy-300 dark:hover:text-white">
              About
            </Link>
            <Link href="#partner" className="text-sm font-medium text-navy-600 transition-colors hover:text-navy-900 dark:text-navy-300 dark:hover:text-white">
              Contact
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="hidden rounded-lg px-4 py-2 text-sm font-medium text-navy-700 transition-colors hover:bg-navy-50 dark:text-navy-200 dark:hover:bg-navy-900 sm:inline-block"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-brand-600/20 transition-all hover:bg-brand-700 hover:shadow-md"
            >
              Report an Emergency
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero — the one place motion is choreographed: badge, headline,
          copy and buttons arrive in a single staggered sequence on load.
          Nowhere else on the page animates on its own. */}
      <section className="grid items-stretch bg-ivory dark:bg-navy-900 md:grid-cols-2">
        <div className="flex flex-col justify-center gap-7 px-6 py-20 sm:px-10 md:py-28 lg:px-16 xl:px-20">
          <span
            className="animate-fade-in-up inline-flex w-fit items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-navy-700 shadow-soft dark:bg-navy-800 dark:text-navy-100"
            style={{ animationDelay: "0ms" }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-600" />
            </span>
            Emergency technology, built for humanitarian response
          </span>
          <h1
            className="animate-fade-in-up max-w-xl font-display text-6xl font-semibold leading-[0.98] tracking-tight text-navy-900 sm:text-7xl dark:text-white"
            style={{ animationDelay: "90ms" }}
          >
            Safety for every life.
          </h1>
          <p
            className="animate-fade-in-up max-w-md text-lg leading-relaxed text-navy-600 dark:text-navy-300"
            style={{ animationDelay: "180ms" }}
          >
            An emergency response ecosystem connecting people, wearable
            devices and responders — built so help can still find the
            people who are hardest to reach.
          </p>
          <div
            className="animate-fade-in-up flex flex-wrap gap-3 pt-2"
            style={{ animationDelay: "270ms" }}
          >
            <Link
              href="#products"
              className="group inline-flex items-center gap-2 rounded-xl bg-brand-600 px-7 py-4 text-base font-semibold text-white shadow-cta transition-all hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-xl"
            >
              Explore our products
              <ArrowIcon className="h-[18px] w-[18px] transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#partner"
              className="inline-flex items-center rounded-xl border border-sand bg-white px-7 py-4 text-base font-semibold text-navy-900 shadow-soft transition-colors hover:bg-ivory dark:border-navy-700 dark:bg-navy-800 dark:text-white dark:hover:bg-navy-700"
            >
              Partner with ReliefMesh
            </Link>
          </div>
        </div>

        <div className="relative min-h-[360px] overflow-hidden md:min-h-0">
          <Image
            src="/images/hero-network.jpg"
            alt="The Guardian Ring, Guardian Button and Guardian Remote arranged together, connected by an illustrated emergency-response network"
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-x-0 bottom-0 h-40"
            style={{ background: "linear-gradient(to top, rgba(27,33,43,0.8), rgba(27,33,43,0))" }}
          />
          <div className="absolute bottom-6 left-6 right-6 flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-xl sm:right-auto">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-brand-600" />
            <p className="text-sm font-semibold text-navy-900">
              Four devices, one response network
            </p>
          </div>
        </div>
      </section>

      {/* The problem */}
      <section className="bg-navy-900">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-9 px-6 py-24 text-center sm:py-28 lg:px-16">
          <h2 className="max-w-2xl font-display text-3xl font-semibold leading-tight text-white sm:text-5xl">
            Emergency help often arrives too late — or not at all.
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-navy-300">
            Remote communities, elderly residents and lone field workers are
            often the furthest from help, and the hardest to reach when a
            crisis hits. ReliefMesh closes that gap with devices and
            software built for the moment it matters most.
          </p>
          <div className="flex flex-wrap justify-center gap-10 sm:gap-16">
            <Stat value="One tap" label="to send an SOS with location" />
            <Stat value="24/7" label="operator coverage, no dead zones" />
            <Stat value="Full trail" label="from alert to resolution" />
          </div>
        </div>
      </section>

      {/* Product ecosystem */}
      <section id="products" className="mx-auto max-w-7xl px-6 py-24 sm:py-28 lg:px-16 xl:px-20">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="font-display text-lg italic text-brand-600 dark:text-brand-400">
            The Guardian ecosystem
          </p>
          <h2 className="mt-1 font-display text-4xl font-semibold tracking-tight text-navy-900 sm:text-5xl dark:text-white">
            One ecosystem. Five ways to stay protected.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-navy-600 dark:text-navy-300">
            From a free smartphone app to future wearable hardware, every
            Guardian product connects back to the same response network.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <ProductCard
            name="Guardian Mobile"
            status="Available now"
            statusTone="live"
            price="Free"
            desc="Smartphone SOS, GPS and incident reporting connected directly to the ReliefMesh platform."
            note="Depends on your phone's battery, GPS signal and connectivity."
          />
          <ProductCard
            name="Guardian Button"
            status="Future concept"
            statusTone="concept"
            price="Target LKR 1,500–2,500"
            image="/images/products/guardian-button.jpg"
            desc="A compact Bluetooth SOS button that pairs with your phone to send an emergency alert."
            note="Needs a connected phone nearby — can't transmit on its own yet."
          />
          <ProductCard
            name="Guardian Remote"
            status="Hardware concept"
            statusTone="concept"
            price="Target LKR 5,000–7,000"
            image="/images/products/guardian-remote.jpg"
            desc="A standalone SOS device with its own GPS and cellular connection — no phone required."
            note="Concept design — not yet commercially available or independently tested."
          />
          <ProductCard
            name="Guardian Ring Lite"
            status="Coming in the future"
            statusTone="concept"
            price="Target LKR 2,990–4,990"
            image="/images/products/guardian-ring-lite.jpg"
            desc="An affordable, discreet ring built for one job: reliable SOS activation for every family."
          />
          <ProductCard
            name="Guardian Ring Pro"
            status="Future R&D"
            statusTone="concept"
            price="Target LKR 24,900–34,900"
            image="/images/products/guardian-ring-pro.jpg"
            desc="Adds heart-rate, sleep and activity tracking alongside SOS, for premium wellness and safety."
            note="Wellness features only — not a medical device."
          />
          <Link
            href={ENQUIRY_EMAIL}
            className="flex flex-col items-start justify-center gap-2 rounded-2xl border border-dashed border-navy-200 p-8 transition-colors hover:border-brand-400 hover:bg-brand-50/40 dark:border-navy-700 dark:hover:border-brand-600 dark:hover:bg-brand-900/10"
          >
            <p className="font-display text-xl font-semibold text-navy-900 dark:text-white">
              See the full product comparison
            </p>
            <p className="text-sm text-navy-600 dark:text-navy-300">
              Price, standalone capability, connectivity and target audience, side by side.
            </p>
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-navy-900">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-28 lg:px-16 xl:px-20">
          <div className="mx-auto mb-14 max-w-xl text-center">
            <h2 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              From SOS to resolution
            </h2>
          </div>
          <div className="grid gap-12 sm:grid-cols-3">
            <Step number="01" title="Activate" body="Press SOS on any Guardian device, or the Guardian Mobile app, in seconds." />
            <Step number="02" title="Locate and transmit" body="GPS plus cellular or Bluetooth relay the alert and location to ReliefMesh's secure backend." />
            <Step number="03" title="Respond" body="Operators verify the alert and dispatch responders, tracked from first contact to resolution." />
          </div>
          <p className="mt-10 text-center text-sm text-navy-400">
            Connectivity depends on the device and network coverage in your area.
          </p>

          <div className="mt-16 overflow-hidden rounded-2xl border border-navy-800">
            <Image
              src="/images/iot-ecosystem.jpg"
              alt="Concept technical architecture diagram: Guardian device with ESP32 controller, GPS receiver and cellular modem relaying an SOS alert through ReliefMesh's backend to a responder dashboard"
              width={1672}
              height={941}
              className="w-full"
            />
            <p className="bg-navy-950 px-4 py-2 text-center text-xs text-navy-500">
              Illustrative concept architecture — not a certified or independently tested design.
            </p>
          </div>
        </div>
      </section>

      {/* Institutional solutions */}
      <section id="solutions" className="bg-ivory dark:bg-navy-900">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 px-6 py-24 text-center sm:py-28 lg:px-16">
          <h2 className="max-w-2xl font-display text-4xl font-semibold tracking-tight text-navy-900 sm:text-5xl dark:text-white">
            Built for governments, NGOs and hospitals.
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-navy-700 dark:text-navy-300">
            Incident management, device and responder coordination, and
            analytics — the same software already powering ReliefMesh&apos;s own
            response operations, available for institutional deployment.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {["Government", "NGOs & charities", "Hospitals", "Disaster-response authorities"].map((c) => (
              <span
                key={c}
                className="rounded-full border border-sand bg-white px-4 py-2 text-sm font-semibold text-navy-900 dark:border-navy-700 dark:bg-navy-800 dark:text-white"
              >
                {c}
              </span>
            ))}
          </div>
          <div className="rounded-xl bg-white px-7 py-5 shadow-sm dark:bg-navy-800">
            <p className="text-base font-bold text-navy-900 dark:text-white">
              Indicative pricing — from LKR 250,000 / year
            </p>
            <p className="text-sm text-navy-500 dark:text-navy-400">
              Subject to deployment scope and commercial discussion.
            </p>
          </div>
          <Link
            href={ENQUIRY_EMAIL}
            className="inline-flex items-center rounded-xl bg-navy-900 px-7 py-4 text-base font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-navy-700 hover:shadow-lg dark:bg-white dark:text-navy-900 dark:hover:bg-navy-100"
          >
            Request institutional proposal
          </Link>
        </div>
      </section>

      {/* Community impact */}
      <section id="community" className="grid md:grid-cols-2">
        <div className="relative min-h-[340px] md:min-h-0">
          <Image
            src="/images/community-care.jpg"
            alt="A ReliefMesh field worker showing a Guardian SOS device to an elderly woman, with flood relief underway in the background"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center gap-5 px-6 py-20 sm:px-10 lg:px-16 xl:px-20">
          <h2 className="max-w-md font-display text-4xl font-semibold leading-tight tracking-tight text-navy-900 dark:text-white">
            Sponsor a life. Protect a community.
          </h2>
          <p className="max-w-lg text-[15px] leading-relaxed text-navy-700 dark:text-navy-300">
            Donors, companies and charities can sponsor Guardian devices for
            elderly residents, rural communities and disaster-affected
            families through Sponsor a Life, and fund standing
            emergency-readiness infrastructure through Guardian Disaster
            Shield.
          </p>
          <p className="max-w-lg text-sm leading-relaxed text-sand">
            Coverage depends on local connectivity; offline events are queued
            and sent once a signal is available. This is emergency assistance
            infrastructure, not a guarantee of rescue.
          </p>
          <Link
            href={ENQUIRY_EMAIL}
            className="mt-2 inline-flex w-fit items-center rounded-xl bg-brand-600 px-7 py-4 text-base font-semibold text-white shadow-cta transition-all hover:-translate-y-0.5 hover:bg-brand-700"
          >
            Enquire about sponsorship
          </Link>
        </div>
      </section>

      {/* Partner CTA */}
      <section id="partner" className="bg-brand-600">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-24 text-center sm:py-28 lg:px-16">
          <h2 className="font-display text-4xl font-semibold text-white sm:text-5xl">
            Partner with ReliefMesh
          </h2>
          <p className="max-w-md text-base leading-relaxed text-brand-50">
            For governments, NGOs, hospitals and corporate partners who want
            to bring Guardian devices and response infrastructure to their
            community.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href={ENQUIRY_EMAIL}
              className="inline-flex items-center rounded-xl bg-white px-7 py-4 text-base font-semibold text-brand-600 shadow-soft transition-all hover:-translate-y-0.5 hover:bg-brand-50"
            >
              Request institutional proposal
            </Link>
            <Link
              href={ENQUIRY_EMAIL}
              className="inline-flex items-center rounded-xl border border-white/70 px-7 py-4 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>

      <footer id="footer" className="bg-navy-950">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-16 xl:px-20">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-1">
              <Logo wordmarkClassName="text-lg font-semibold tracking-tight text-white" />
              <p className="mt-3 max-w-[220px] text-sm leading-relaxed text-navy-400">
                Safety for every life. Connecting people, protecting
                communities, responding to emergencies.
              </p>
            </div>
            <FooterCol
              title="Products"
              links={["Guardian Mobile", "Guardian Button", "Guardian Remote", "Guardian Ring Lite", "Guardian Ring Pro"]}
            />
            <FooterCol title="Solutions" links={["Government", "Charities", "Disaster response", "Healthcare"]} />
            <FooterCol title="Community" links={["Sponsor a Life", "Guardian Disaster Shield"]} />
            <FooterCol title="Company" links={["About", "Contact", "Partners"]} />
          </div>
          <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-navy-800 pt-6 text-sm text-navy-500 sm:flex-row">
            <p>© 2026 ReliefMesh. Indicative pricing and concept products as noted above.</p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="hover:text-navy-200">Privacy</Link>
              <Link href="/terms" className="hover:text-navy-200">Terms</Link>
              <Link href={ENQUIRY_EMAIL} className="hover:text-navy-200">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="font-display text-3xl font-semibold text-white sm:text-4xl">{value}</p>
      <p className="mt-1.5 max-w-[160px] text-sm text-navy-300">{label}</p>
    </div>
  );
}

function Step({ number, title, body }: { number: string; title: string; body: string }) {
  return (
    <div>
      <span className="font-display text-3xl font-semibold text-sand">{number}</span>
      <h3 className="mt-3 text-lg font-bold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-navy-300">{body}</p>
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <p className="text-sm font-semibold text-sand">{title}</p>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l} className="text-sm text-navy-400">
            {l}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProductCard({
  name,
  status,
  statusTone,
  price,
  desc,
  note,
  image,
}: {
  name: string;
  status: string;
  statusTone: "live" | "concept";
  price: string;
  desc: string;
  note?: string;
  image?: string;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-card transition-shadow duration-300 hover:shadow-card-hover dark:border-slate-800 dark:bg-slate-900">
      {image ? (
        <div className="relative aspect-square w-full bg-navy-950">
          <Image
            src={image}
            alt={`${name} product photo`}
            fill
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex aspect-square w-full items-center justify-center bg-brand-50 dark:bg-brand-900/20">
          <svg viewBox="0 0 24 24" className="h-16 w-16 text-brand-600 dark:text-brand-400">
            <rect x="7" y="2" width="10" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <line x1="10" y1="18" x2="14" y2="18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2.5 p-7">
        <h3 className="font-display text-xl font-semibold text-navy-900 dark:text-white">{name}</h3>
        <span
          className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${
            statusTone === "live"
              ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400"
              : "bg-navy-100 text-navy-600 dark:bg-navy-800 dark:text-navy-300"
          }`}
        >
          {status}
        </span>
        <p className="text-sm font-semibold text-navy-700 dark:text-navy-200">{price}</p>
        <p className="text-sm leading-relaxed text-navy-600 dark:text-navy-300">{desc}</p>
        {note ? <p className="text-xs leading-relaxed text-sand">{note}</p> : null}
        <Link
          href="mailto:partners@reliefmesh.app"
          className="mt-auto w-fit pt-2 text-sm font-semibold text-brand-600 underline decoration-brand-300 decoration-2 underline-offset-4 transition-colors hover:text-brand-700 dark:text-brand-400"
        >
          Enquire about this product
        </Link>
      </div>
    </div>
  );
}

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
