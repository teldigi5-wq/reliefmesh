import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CheckCircle2, ChevronRight, MapPin, Menu, Radio, ShieldCheck, Users } from "lucide-react";
import "./reliefmesh-landing.css";
import { CookieSettingsButton } from "@/components/privacy/cookie-preferences";
import {
  guardianPricing, estimatedContribution, formatLkr, PRICING_REVIEW_DATE,
  unitCostEstimate, ESTIMATED_ORDER_RANGE, illustrativeVatInclusivePrice,
  savingsVsPreviousTarget,
} from "@/lib/guardian-pricing";

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
    slug: "ring-lite",
    eyebrow: "COMMUNITY FIRST",
    description: "An accessible, lightweight emergency SOS wearable concept.",
    detail: "Intentional emergency activation",
    image: "ring-lite.webp",
    alt: "Guardian Ring Lite portrait product poster showing a discreet emergency activation concept",
  },
  {
    name: "Guardian Ring Pro",
    slug: "ring-pro",
    eyebrow: "ADVANCED SAFETY",
    description: "An enhanced SOS ring concept with exploratory wellness sensing.",
    detail: "Safety and wellness concept",
    image: "ring-pro.webp",
    alt: "Guardian Ring Pro portrait product poster illustrating SOS and proposed wellness sensing features",
  },
  {
    name: "Guardian Button",
    slug: "guardian-button",
    eyebrow: "EVERYDAY PROTECTION",
    description: "A compact, easy-to-reach Bluetooth emergency button concept.",
    detail: "Small, simple and portable",
    image: "guardian-button.webp",
    alt: "Guardian Button portrait infographic with an SOS keychain design and technical concept",
  },
  {
    name: "Guardian Remote",
    slug: "guardian-remote",
    eyebrow: "CONNECTED RESPONSE",
    description: "A cellular and GPS-enabled remote SOS device concept.",
    detail: "Location and connectivity",
    image: "guardian-remote.webp",
    alt: "Guardian Remote portrait infographic outlining a GPS and cellular SOS design",
  },
] as const;

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
            <a href="#pricing">Device prices</a>
            <a href="#technology">How it works</a>
            <a href="#mission">Our mission</a>
          </nav>
          <div className="rm-header-actions">
            <Link href="/login" className="rm-login">Log in</Link>
            <Link href="/register" className="rm-button rm-button-red rm-button-small" prefetch>
              Get started <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <details className="rm-mobile-menu">
            <summary aria-label="Toggle navigation"><Menu size={22} aria-hidden="true" /></summary>
            <nav aria-label="Mobile navigation">
              <a href="#platform">Platform</a>
              <a href="#guardians">Guardian devices</a>
              <a href="#pricing">Device prices</a>
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
            <span className="rm-eyebrow"><span className="rm-signal-dot" /> CONNECTED EMERGENCY COORDINATION</span>
            <h1 id="rm-hero-heading">
              Response starts with <em>connection.</em>
            </h1>
            <p>
              Bring citizens, volunteers and response teams into one coordinated
              view. Report incidents, make informed decisions and keep communities connected.
            </p>
            <div className="rm-button-row">
              <Link href="/register" className="rm-button rm-button-red">
                Get started <ArrowUpRight size={19} aria-hidden="true" />
              </Link>
              <a href="#technology" className="rm-button rm-button-outline">
                Explore the platform <ArrowRight size={18} aria-hidden="true" />
              </a>
            </div>
            <div className="rm-hero-principles" aria-label="ReliefMesh approach">
              <span><ShieldCheck size={16} aria-hidden="true" /> People first</span>
              <span><MapPin size={16} aria-hidden="true" /> Location-aware</span>
              <span><Radio size={16} aria-hidden="true" /> Device-ready</span>
            </div>
            <p className="rm-hero-disclaimer">Hackathon prototype · Not an official emergency dispatch service.</p>
          </div>
          <div className="rm-hero-media">
            <div className="rm-media-heading"><span>RELIEFMESH / THE CONNECTED VISION</span><span>01 — 05</span></div>
            <div className="rm-hero-frame">
              <Artwork name="hero-network.webp" alt="Illustration of the ReliefMesh emergency network and Guardian SOS device concepts" priority />
              <div className="rm-hero-visual-badge">
                <span className="rm-hero-badge-icon"><Radio size={18} aria-hidden="true" /></span>
                <div><strong>A connected safety network</strong><small>Guardian product ecosystem · Concept</small></div>
              </div>
            </div>
            <div className="rm-hero-process" aria-label="Response workflow">
              <span><b>01</b> Report</span>
              <ArrowRight size={16} aria-hidden="true" />
              <span><b>02</b> Coordinate</span>
              <ArrowRight size={16} aria-hidden="true" />
              <span><b>03</b> Respond</span>
            </div>
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
                  <div className="rm-product-pricing">
                    <div>
                      <span className="rm-price-kicker">BULK PRICE TARGET · BEFORE VAT</span>
                      <strong>{formatLkr(guardianPricing[product.slug].targetRetailLkr)}</strong>
                    </div>
                    <span className="rm-pricing-concept-pill">-{savingsVsPreviousTarget(guardianPricing[product.slug])}% vs. previous</span>
                  </div>
                  <div className="rm-product-bottom"><span>{product.detail}</span><span className="rm-concept-tag">Concept</span></div>
                </div>
              </article>
            ))}
          </div>
          <p className="rm-product-tip"><span className="rm-signal-dot" /> Images are design concepts. Prices are illustrative targets, not offers to sell. Select an image to view the full poster.</p>
        </section>

        <section className="rm-container rm-pricing-section" id="pricing" aria-labelledby="rm-pricing-heading">
          <div className="rm-pricing-header">
            <div>
              <span className="rm-section-index">GUARDIAN / BULK-PROCUREMENT STRATEGY</span>
              <h2 id="rm-pricing-heading">A safer future should be <span>more affordable.</span></h2>
              <p>Our next target is lower-cost production through distributor agreements, shared components and local assembly. Pricing below assumes sourcing at the scale of {ESTIMATED_ORDER_RANGE}. These are planning targets, not confirmed consumer offers.</p>
            </div>
            <div className="rm-pricing-price-note">
              <span>PROPOSED ENTRY PRICE · BEFORE VAT</span>
              <strong>{formatLkr(guardianPricing["guardian-button"].targetRetailLkr)}</strong>
              <small>Guardian Button · bulk target</small>
            </div>
          </div>
          <div className="rm-tax-plan-banner" role="note">
            <ShieldCheck size={21} aria-hidden="true" />
            <div><strong>Government-supported VAT relief: proposed, not yet approved</strong>
              <p>We intend to discuss tax treatment and affordability support with relevant authorities. Until formal eligibility is confirmed, the prices below are <b>before any applicable VAT</b>. An illustrative VAT-inclusive total is shown separately for each product.</p>
            </div>
          </div>
          <div className="rm-pricing-grid">
            {products.map(product => {
              const model = guardianPricing[product.slug];
              return (
                <article className="rm-pricing-card" key={product.slug}>
                  <div className="rm-pricing-card-heading">
                    <span className="rm-pricing-card-label">{product.eyebrow}</span>
                    <span className="rm-pricing-unavailable">Not on sale</span>
                  </div>
                  <h3>{model.label}</h3>
                  <strong className="rm-pricing-card-price">{formatLkr(model.targetRetailLkr)}</strong>
                  <span className="rm-pricing-card-note">Bulk-sourcing target · before applicable VAT</span>
                  <span className="rm-pricing-savings">-{savingsVsPreviousTarget(model)}% from previous target</span>
                  <div className="rm-pricing-card-rule" />
                  <p className="rm-pricing-card-connection">{model.connection}</p>
                  <p className="rm-pricing-card-caution">{model.note}</p>
                  <div className="rm-pricing-card-foot">
                    <span>Est. unit cost target</span>
                    <strong>{formatLkr(unitCostEstimate(model))}</strong>
                  </div>
                  <div className="rm-pricing-card-foot">
                    <span>Est. balance after 3% fee, before fixed costs</span>
                    <strong className="rm-pricing-positive">+{formatLkr(estimatedContribution(model))}</strong>
                  </div>
                  <div className="rm-pricing-card-tax">
                    <span>If 18% VAT applies</span>
                    <strong>{formatLkr(illustrativeVatInclusivePrice(model))}</strong>
                    <small>Illustration only; depends on legal tax treatment</small>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="rm-bulk-strategy" aria-label="How ReliefMesh aims to lower device costs">
            <div><span>01 / SOURCING</span><strong>Manufacturer pricing</strong><p>Negotiate production modules, sensors, batteries and PCB components for 100 to 5,000-unit quotations.</p></div>
            <div><span>02 / PRODUCTION</span><strong>Local assembly</strong><p>Reduce imported finished-device costs where possible; budget testing, repairs, batteries and certified housings.</p></div>
            <div><span>03 / PARTNERSHIPS</span><strong>Government and NGOs</strong><p>Discuss humanitarian procurement, subsidies and legally approved tax treatment before promising VAT-free sales.</p></div>
          </div>

          <div className="rm-device-compare" id="device-comparison" aria-labelledby="rm-device-compare-heading">
            <div className="rm-device-compare-heading">
              <span className="rm-section-index">COMPARE THE GUARDIAN COLLECTION</span>
              <h3 id="rm-device-compare-heading">Which Guardian fits each situation?</h3>
              <p>Every device is an engineering concept, not independently tested hardware. This comparison shows the planned feature differences and connectivity requirements.</p>
            </div>
            <div className="rm-device-compare-scroll" role="region" tabIndex={0} aria-label="Guardian device feature comparison; scroll horizontally on smaller screens">
              <table>
                <caption className="sr-only">Guardian Button, Ring Lite, Ring Pro and Remote comparison</caption>
                <thead><tr>
                  <th scope="col">Feature</th>
                  {products.map(product => <th scope="col" key={product.slug}>{product.name}</th>)}
                </tr></thead>
                <tbody>
                  <tr><th scope="row">Base price target</th>
                    {products.map(p => <td key={p.slug}><strong>{formatLkr(guardianPricing[p.slug].targetRetailLkr)}</strong><small>Before applicable VAT</small></td>)}
                  </tr>
                  <tr><th scope="row">Best for</th>
                    {products.map(p => <td key={p.slug}>{guardianPricing[p.slug].bestFor}</td>)}
                  </tr>
                  <tr><th scope="row">SOS connection</th>
                    {products.map(p => <td key={p.slug}>{guardianPricing[p.slug].connection}</td>)}
                  </tr>
                  <tr><th scope="row">Requires smartphone</th>
                    {products.map(p => <td key={p.slug}>{guardianPricing[p.slug].phoneRequired ? "Yes — paired phone" : "No — planned LTE"}</td>)}
                  </tr>
                  <tr><th scope="row">Location source</th>
                    {products.map(p => <td key={p.slug}>{guardianPricing[p.slug].location}</td>)}
                  </tr>
                  <tr><th scope="row">Health and wellness</th>
                    {products.map(p => <td key={p.slug}>{guardianPricing[p.slug].wellness}</td>)}
                  </tr>
                  <tr><th scope="row">Network service cost</th>
                    {products.map(p => <td key={p.slug}>{guardianPricing[p.slug].networkCosts}</td>)}
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="rm-comparison-disclaimer">Bluetooth devices need the paired smartphone and its network connection to forward alerts. LTE requires a SIM/data plan and coverage. Water-resistance ratings, battery duration, medical sensing and direct emergency dispatch are not certified or guaranteed.</p>
          </div>
          <div className="rm-pricing-disclosure">
            <div>
              <strong>Planning prices, not confirmed manufacturing quotes</strong>
              <p>The unit-cost estimates cover components, battery, enclosure, assembly/testing, packaging, logistics and an allowance for warranty and tooling. The pre-VAT modelled balance subtracts a 3% payment-processing allowance and the target unit build cost; it is <b>not net profit</b>. Costs presume bulk procurement of {ESTIMATED_ORDER_RANGE}. Reviewed {PRICING_REVIEW_DATE}.</p>
              <p>Custom smart-ring engineering, regulatory approval, import taxes/levies, recurring SIM plans, cloud operations, installation, R&amp;D and distribution could cost more. Actual VAT obligations depend on current law and written determinations, not simply on an agreement to seek government support. No devices are being sold or offered for pre-order.</p>
            </div>
            <details className="rm-pricing-source-details">
              <summary>Component prices, sourcing references and tax rules</summary>
              <div>
                <p>Reference component listings and official VAT information; <b>none is a manufacturer quote for finished Guardian products</b>:</p>
                <ul>
                  <li><a href="https://www.lcsc.com/product-detail/wifi-modules_espressif-esp32-c3-mini-1-n4-a_C5224444.html" target="_blank" rel="noopener noreferrer">ESP32-C3-MINI production module, volume tiers</a></li>
                  <li><a href="https://www.tme.eu/en/katalog/m2m-gprs-lte-5g-modules_113195/p%2Csimcom_109/" target="_blank" rel="noopener noreferrer">SIMCom LTE/GNSS module sourcing</a></li>
                  <li><a href="https://www.ird.gov.lk/en/Type%20of%20Taxes/SitePages/Value%20Added%20Tax%20%28VAT%29.aspx" target="_blank" rel="noopener noreferrer">Sri Lanka Inland Revenue VAT rates and registration guidance</a></li>
                </ul>
                <p>Before setting a final retail price, obtain supplier quotes, test prototypes and get professional confirmation of tax obligations. The 18% VAT scenario is only illustrative.</p>
              </div>
            </details>
          </div>
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
              <Link href="/privacy">Privacy</Link>
            </nav>
          </div>
          <div className="rm-footer-bottom">
            <span>© 2026 ReliefMesh · Wearable imagery is illustrative.</span>
            <span><CheckCircle2 size={14} aria-hidden="true" /> Safety for Every Life. <CookieSettingsButton className="rm-cookie-footer-button" /></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
