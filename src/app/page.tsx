import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CheckCircle2, ChevronRight, MapPin, Menu, Radio, ShieldCheck, Users, Wifi } from "lucide-react";
import "./reliefmesh-landing.css";

export const metadata: Metadata = {
  title: "ReliefMesh | Connected Safety for Every Life",
  description:
    "A people-first disaster response coordination platform, with Guardian SOS product concepts and an IoT-ready response network.",
  openGraph: {
    title: "ReliefMesh — When Every Second Matters",
    description: "Connecting communities, operators, volunteers and responders.",
    images: [{ url: "/reliefmesh/hero-network.webp", width: 1672, height: 941 }],
  },
};

const ASSET_ROOT = "/reliefmesh";

const products = [
  {
    name: "Guardian Ring Lite",
    eyebrow: "COMMUNITY FIRST",
    description: "An accessible, lightweight emergency SOS wearable concept.",
    detail: "Intentional emergency activation",
    image: "ring-lite.webp",
    alt: "Guardian Ring Lite portrait product poster showing a discreet emergency activation concept",
  },
  {
    name: "Guardian Ring Pro",
    eyebrow: "ADVANCED SAFETY",
    description: "An enhanced SOS ring concept with exploratory wellness sensing.",
    detail: "Safety and wellness concept",
    image: "ring-pro.webp",
    alt: "Guardian Ring Pro portrait product poster illustrating SOS and proposed wellness sensing features",
  },
  {
    name: "Guardian Button",
    eyebrow: "EVERYDAY PROTECTION",
    description: "A compact, easy-to-reach Bluetooth emergency button concept.",
    detail: "Small, simple and portable",
    image: "guardian-button.webp",
    alt: "Guardian Button portrait infographic with an SOS keychain design and technical concept",
  },
  {
    name: "Guardian Remote",
    eyebrow: "CONNECTED RESPONSE",
    description: "A cellular and GPS-enabled remote SOS device concept.",
    detail: "Location and connectivity",
    image: "guardian-remote.webp",
    alt: "Guardian Remote portrait infographic outlining a GPS and cellular SOS design",
  },
];

const capabilities = [
  {
    index: "01",
    title: "Report incidents",
    description: "Location-aware reporting with severity, details and a review process.",
    icon: MapPin,
  },
  {
    index: "02",
    title: "Coordinate response",
    description: "Review reports, assign teams and track a shared emergency workflow.",
    icon: Users,
  },
  {
    index: "03",
    title: "Device-ready architecture",
    description: "An API and data model prepared for future Guardian SOS integrations.",
    icon: Radio,
  },
];

const steps = [
  ["01", "SOS activation", "An intentional request for assistance"],
  ["02", "Location and connectivity", "Proposed device GPS and cellular flow"],
  ["03", "Incident management", "Backend review and coordination"],
  ["04", "Responder visibility", "Clear information for assigned teams"],
];

function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <Link href="/" className="rm-brand" aria-label="ReliefMesh homepage">
      <svg className="rm-brand-mark" viewBox="0 0 64 70" fill="none" aria-hidden="true">
        <path d="M32 4 58 15v21c0 15-12 25-26 31C18 61 6 51 6 36V15Z" fill="#0C2333" stroke="#17DEE2" strokeWidth="4" />
        <path d="M32 8 54 18v14" stroke="#FF4056" strokeWidth="4" />
        <path d="M12 33c8-13 31-13 40 0M18 38c6-9 22-9 28 0" stroke="#17DEE2" strokeWidth="2" />
        <circle cx="32" cy="42" r="11" fill="#F44357" />
        <path d="M32 35v14M25 42h14" stroke="white" strokeWidth="4" strokeLinecap="round" />
      </svg>
      <span>RELIEF<span className="rm-cyan">MESH</span></span>
      {footer ? <span className="rm-brand-suffix">/ SAFETY FOR EVERY LIFE</span> : null}
    </Link>
  );
}

function Artwork({
  name,
  alt,
  portrait = false,
  priority = false,
}: {
  name: string;
  alt: string;
  portrait?: boolean;
  priority?: boolean;
}) {
  const url = ASSET_ROOT + "/" + name;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={portrait ? "rm-art rm-art-portrait" : "rm-art rm-art-landscape"}
      aria-label={"Open full-size image: " + alt}
    >
      <Image
        src={url}
        alt={alt}
        width={portrait ? 1122 : 1672}
        height={portrait ? 1402 : 941}
        sizes={portrait ? "(max-width: 540px) 90vw, (max-width: 900px) 44vw, 23vw" : "(max-width: 900px) 90vw, 55vw"}
        priority={priority}
        className="rm-art-image"
      />
      <span className="rm-art-zoom" aria-hidden="true"><ArrowUpRight size={16} /></span>
    </a>
  );
}

export default function LandingPage() {
  return (
    <div className="rm-site" id="top">
      <a className="rm-skip" href="#main">Skip to main content</a>

      <header className="rm-header">
        <div className="rm-container rm-header-inner">
          <Brand />
          <nav className="rm-nav-links" aria-label="Main navigation">
            <a href="#platform">Platform</a>
            <a href="#guardians">Guardian devices</a>
            <a href="#technology">How it works</a>
            <a href="#mission">Our mission</a>
          </nav>
          <div className="rm-header-actions">
            <Link href="/login" className="rm-login">Log in</Link>
            <Link href="/register" className="rm-button rm-button-red rm-button-small">
              Get started <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <details className="rm-mobile-menu">
            <summary aria-label="Toggle navigation"><Menu size={22} aria-hidden="true" /></summary>
            <nav aria-label="Mobile navigation">
              <a href="#platform">Platform</a>
              <a href="#guardians">Guardian devices</a>
              <a href="#technology">How it works</a>
              <a href="#mission">Our mission</a>
              <Link href="/login">Log in</Link>
              <Link href="/register">Create account</Link>
            </nav>
          </details>
        </div>
      </header>

      <main id="main">
        <section className="rm-container rm-hero" id="platform" aria-labelledby="rm-hero-heading">
          <div className="rm-hero-copy">
            <span className="rm-eyebrow"><span className="rm-signal-dot" /> Disaster response · Connected safety</span>
            <h1 id="rm-hero-heading">
              When every second matters, <em>connection</em> makes a difference.
            </h1>
            <p>
              A connected emergency-response platform for citizens, operators,
              volunteers and organisations — bringing critical information and
              coordinated action into one shared view.
            </p>
            <div className="rm-button-row">
              <Link href="/register" className="rm-button rm-button-red">
                Report an emergency <ArrowRight size={19} aria-hidden="true" />
              </Link>
              <a href="#technology" className="rm-button rm-button-outline">Explore the system</a>
            </div>
            <p className="rm-note"><ShieldCheck size={18} aria-hidden="true" /> People first. Built for clarity.</p>
          </div>
          <div className="rm-hero-media">
            <div className="rm-media-heading"><span>THE RELIEFMESH VISION</span><span>01 / 05</span></div>
            <div className="rm-hero-frame">
              <Artwork name="hero-network.webp" alt="Illustration of the ReliefMesh emergency network and connected Guardian devices" priority />
            </div>
            <p className="rm-image-caption"><span className="rm-signal-dot" /> One connected network. More informed response.</p>
          </div>
        </section>

        <section className="rm-container rm-capability-grid" aria-label="Core platform capabilities">
          {capabilities.map(({ index, title, description, icon: Icon }) => (
            <article className="rm-capability" key={index}>
              <div className="rm-capability-top"><span>{index}</span><Icon size={25} strokeWidth={1.6} aria-hidden="true" /></div>
              <h2>{title}</h2>
              <p>{description}</p>
            </article>
          ))}
        </section>

        <section className="rm-band" id="mission">
          <div className="rm-container rm-mission rm-section">
            <div>
              <span className="rm-section-index">01 / OUR MISSION</span>
              <h2>Technology should reach people <span>when they need it most.</span></h2>
              <p>ReliefMesh puts community safety at the centre of emergency coordination, helping connect people requesting assistance with the teams coordinating a response.</p>
              <p>Guardian wearable designs extend that vision through accessible, intentional SOS activation concepts.</p>
              <Link href="/register" className="rm-text-link">Start with ReliefMesh <ArrowUpRight size={20} aria-hidden="true" /></Link>
            </div>
            <figure className="rm-figure">
              <Artwork name="mission-flood.webp" alt="Concept illustration of volunteers and responders coordinating flood relief in a mountain community" />
              <figcaption>HUMANITARIAN IMPACT · VISUAL CONCEPT</figcaption>
            </figure>
          </div>
        </section>

        <section className="rm-container rm-section" id="guardians">
          <div className="rm-section-heading">
            <div>
              <span className="rm-section-index">02 / GUARDIAN COLLECTION</span>
              <h2>Safety you can <span>carry.</span></h2>
              <p>Four purpose-led device concepts designed around different needs — from everyday personal safety to future emergency connectivity.</p>
            </div>
            <span className="rm-section-pill">PRODUCT CONCEPT COLLECTION <ArrowUpRight size={15} aria-hidden="true" /></span>
          </div>

          <div className="rm-product-grid">
            {products.map((product) => (
              <article className="rm-product-card" key={product.name}>
                <Artwork name={product.image} alt={product.alt} portrait />
                <div className="rm-product-description">
                  <span className="rm-product-tag">{product.eyebrow}</span>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="rm-product-bottom"><span>{product.detail}</span><span className="rm-concept-tag">Concept</span></div>
                </div>
              </article>
            ))}
          </div>
          <p className="rm-product-tip"><span className="rm-signal-dot" /> Select any product image to view the complete poster without cropping.</p>
        </section>

        <section className="rm-container rm-section rm-comparison" aria-labelledby="rm-comparison-heading">
          <div className="rm-section-heading">
            <div>
              <span className="rm-section-index">03 / TWO LEVELS OF TECHNOLOGY</span>
              <h2 id="rm-comparison-heading">One commitment <span>to safety.</span></h2>
              <p>The proposed Guardian ring family balances accessibility with an expanded-feature concept for different individual and community needs.</p>
            </div>
          </div>
          <div className="rm-comparison-grid">
            <Artwork name="ring-comparison.webp" alt="Side-by-side comparison artwork of Guardian Ring Lite and Guardian Ring Pro" />
            <div className="rm-comparison-copy">
              <article>
                <span className="rm-product-tag rm-red">LITE / ESSENTIAL</span>
                <h3>Protection made accessible</h3>
                <p>An SOS-first design concept focused on affordability, comfort and intentional activation.</p>
              </article>
              <hr />
              <article>
                <span className="rm-product-tag">PRO / ADVANCED</span>
                <h3>Protection with insight</h3>
                <p>An extended safety concept with prospective wellness sensing and support features.</p>
              </article>
              <small>Visual concepts only. Product capabilities are not presented as tested or commercially available.</small>
            </div>
          </div>
        </section>

        <section className="rm-band" id="technology">
          <div className="rm-container rm-section">
            <div className="rm-section-heading">
              <div>
                <span className="rm-section-index">04 / TECHNICAL ARCHITECTURE</span>
                <h2>From signal <span>to response.</span></h2>
                <p>Explore how future Guardian SOS devices could connect to incident management, emergency teams and the existing ReliefMesh coordination platform.</p>
              </div>
            </div>
            <div className="rm-technology-grid">
              <Artwork name="architecture.webp" alt="ReliefMesh Emergency IoT Ecosystem infographic showing device, GPS, connectivity, cloud services and responders" />
              <div className="rm-flow-panel">
                <span className="rm-section-index">CONNECTED EMERGENCY FLOW</span>
                <ol>
                  {steps.map(([index, title, description]) => (
                    <li key={index}>
                      <span className="rm-flow-number">{index}</span>
                      <span><strong>{title}</strong><small>{description}</small></span>
                    </li>
                  ))}
                </ol>
                <p>Architecture is illustrative. Current Guardian device monitoring uses simulated test events, not live physical hardware.</p>
                <Link href="/login" className="rm-text-link">Open the platform <ArrowRight size={16} aria-hidden="true" /></Link>
              </div>
            </div>
          </div>
        </section>

        <section className="rm-container rm-section" id="community">
          <div className="rm-section-heading">
            <div>
              <span className="rm-section-index">05 / COMMUNITY IMPACT</span>
              <h2>Designed for <span>the real world.</span></h2>
              <p>Behind every alert is a person. Meaningful emergency technology starts with empathy, clear communication and coordinated action.</p>
            </div>
          </div>
          <div className="rm-community-grid">
            <figure>
              <Artwork name="community-care.webp" alt="Illustration of a volunteer demonstrating an accessible Guardian SOS device to an older person" />
              <figcaption><span>01 / COMMUNITY CARE</span><strong>Making protection easier to access.</strong></figcaption>
            </figure>
            <figure>
              <Artwork name="mission-flood.webp" alt="Concept depiction of coordinated flood relief in a mountainous rural community" />
              <figcaption><span>02 / RELIEF COORDINATION</span><strong>Connecting care with action.</strong></figcaption>
            </figure>
          </div>
        </section>

        <section className="rm-container rm-section rm-final-section">
          <div className="rm-cta-panel">
            <div>
              <span className="rm-section-index">MAKE RESILIENCE A SHARED MISSION</span>
              <h2>Build a safer tomorrow, <span>together.</span></h2>
              <p>Join the ReliefMesh platform to report incidents and participate in a more connected emergency-response community.</p>
            </div>
            <div className="rm-cta-actions">
              <Link className="rm-button rm-button-red" href="/register">Create an account <ArrowUpRight size={17} aria-hidden="true" /></Link>
              <Link className="rm-button rm-button-outline" href="/login">Log in <ChevronRight size={16} aria-hidden="true" /></Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="rm-footer">
        <div className="rm-container">
          <div className="rm-footer-top">
            <div><Brand footer /><p>Connecting people, emergency information and responders.</p></div>
            <nav aria-label="Footer navigation">
              <a href="#platform">Platform</a>
              <a href="#guardians">Guardian collection</a>
              <a href="#technology">Architecture</a>
              <Link href="/login">Log in</Link>
            </nav>
          </div>
          <div className="rm-footer-bottom">
            <span>© 2026 ReliefMesh · Wearable imagery is illustrative.</span>
            <span><CheckCircle2 size={14} aria-hidden="true" /> Safety for Every Life.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
