import Image from "next/image";
import Link from "next/link";
import LeadForm from "@/components/LeadForm";
import PrivacySettingsButton from "@/components/PrivacySettingsButton";
import SetupComparison from "@/components/SetupComparison";
import TrackedLink from "@/components/TrackedLink";
import { PilotSetupProvider } from "@/components/PilotSetupProvider";

const benefits = ["Guest convenience", "Clear product pricing", "Recorded purchases", "Planned replenishment"];
const audiences = [
  ["01", "Independent hosts", "A focused amenity and a practical restocking routine for one or several holiday homes."],
  ["02", "Holiday home operators", "A consistent guest offer with proposed purchase records organised by property."],
  ["03", "Property managers", "A measurable pilot across multiple units, with setup and service preferences captured clearly."],
];
const faqs = [
  ["Is POPS Minibar available to install now?", "No. POPS Minibar is collecting qualified interest for a proposed Dubai pilot. Hardware, suppliers, installation dates and commercial terms have not been finalised."],
  ["Is the minibar in the photograph the final POPS product?", "No. It is a real reference installation that demonstrates the intended compact form factor. POPS did not manufacture it, and the final pilot model has not been selected."],
  ["Can a QR code detect a product being taken?", "No. QR Checkout records only the products declared by the guest. The host would still verify physical stock between stays."],
  ["Are card authorizations, notifications and automated charges live?", "No. They are proposed workflows. Payment-provider support, consent, settlement rules and notifications must be validated before any pilot commitment."],
  ["Do the connected sensors already work?", "Not as a finished POPS system. Weight and door-state sensing are proposed for prototype testing. Product movement, returns and similar weights can create ambiguous events."],
  ["Who would supply and replenish the minibar?", "The pilot will test operating models with each applicant. Product sourcing, ownership, refill responsibility and service pricing would be agreed before installation."],
  ["Is POPS affiliated with Airbnb?", "No. POPS Minibar is an independent hospitality project and is not affiliated with, sponsored by or endorsed by Airbnb."],
];

export default function Home() {
  return (
    <PilotSetupProvider>
      <main id="top" className="pops-site">
        <div className="topline"><span>DUBAI · HOLIDAY HOME MINIBARS</span><a href="#enquiry">Pilot enquiries are open ↗</a></div>
        <header className="site-header">
          <a className="pops-logo" href="#top" aria-label="POPS Minibar home"><strong>POPS</strong><span>MINIBAR SYSTEMS</span></a>
          <nav aria-label="Primary navigation"><a href="#overview">Overview</a><a href="#process">How it works</a><a href="#setups">Choose your setup</a></nav>
          <TrackedLink className="outline-button" href="#enquiry" eventName="pilot_cta_click">Discuss your property <span>↗</span></TrackedLink>
        </header>

        <section className="hero" id="overview">
          <div className="hero-copy">
            <p className="section-tag dot">INTRODUCING THE DUBAI PILOT</p>
            <h1>A smarter minibar experience for <em>Dubai holiday homes.</em></h1>
            <p className="hero-lead">A proposed physical minibar system for hosts and property managers—clear product pricing, guest-led purchasing and practical replenishment records.</p>
            <div className="hero-actions"><TrackedLink className="primary-button" href="#enquiry" eventName="pilot_cta_click">Enquire about the Dubai pilot <span>↗</span></TrackedLink><a href="#setups" className="text-button">Compare the three setups <span>↓</span></a></div>
            <p className="hero-audience">For independent hosts, holiday home operators and property managers in Dubai.</p>
          </div>
          <figure className="hero-product">
            <div className="product-glow" />
            <div className="product-frame">
              <div className="product-meta"><span>THE IN-ROOM ESSENTIAL</span><b>01 / MINIBAR</b></div>
              <div className="product-photo"><Image src="/images/built-in-minibar.jpg" alt="Real stocked hotel minibar installed in guest-room cabinetry" fill priority sizes="(max-width: 800px) 100vw, 48vw" /><span className="real-photo-badge">REAL REFERENCE PHOTOGRAPH</span></div>
              <figcaption><strong>A real, stocked minibar.</strong><span>Photographed in a genuine guest-room installation. The final pilot hardware has not been selected and is not manufactured by POPS.</span></figcaption>
            </div>
          </figure>
        </section>

        <section className="benefit-strip" aria-label="Pilot benefits"><span>BUILT AROUND YOUR PROPERTY</span>{benefits.map((benefit) => <div key={benefit}><i />{benefit}</div>)}</section>

        <section className="statement section-shell">
          <div><p className="section-tag">THE COMMERCIAL IDEA</p><h2>Better amenities.<br />A new revenue opportunity.</h2></div>
          <div><p>Guests often want a cold drink, snack or useful essential after check-in. POPS Minibar proposes a convenient way to offer those products inside the property.</p><p>The pilot is designed to measure what matters: purchase behaviour, willingness to pay, refill effort, losses and real operator interest—without promising guaranteed income.</p></div>
        </section>

        <section className="process" id="process">
          <figure><Image src="/images/luxury-kitchen.jpg" alt="Real premium apartment kitchen suitable for a holiday home" fill sizes="(max-width: 900px) 100vw, 50vw" /><figcaption>REAL INTERIOR REFERENCE · PREMIUM HOLIDAY-HOME CONTEXT</figcaption></figure>
          <div className="process-copy"><p className="section-tag">FROM SETUP TO THE NEXT STAY</p><h2>A clear process.<br />For you and your guest.</h2>
            <ol><li><span>01</span><div><h3>Select the essentials</h3><p>Choose a focused range of drinks, snacks and useful items with prices displayed in AED.</p></div></li><li><span>02</span><div><h3>Let the guest choose and pay</h3><p>The proposed flow shows the selection and terms before the guest confirms a purchase or authorization.</p></div></li><li><span>03</span><div><h3>Verify and replenish</h3><p>Review the available record, check physical stock and prepare the minibar for the next arrival.</p></div></li></ol>
          </div>
        </section>

        <section className="setups section-shell" id="setups">
          <div className="split-heading"><div><p className="section-tag">CHOOSE YOUR LEVEL OF AUTOMATION</p><h2>One product idea.<br />Three proposed setups.</h2></div><p>Choose the approach that fits your operation. Your selection is transferred automatically into the pilot enquiry form.</p></div>
          <SetupComparison />
        </section>

        <section className="audience section-shell">
          <div><p className="section-tag">MADE FOR THE WAY YOU HOST</p><h2>One apartment.<br />Or a growing portfolio.</h2><p>The pilot begins with the real operation behind each property—not a generic consumer minibar.</p><a href="#enquiry">Tell us about your property ↗</a></div>
          <div className="audience-list">{audiences.map(([number, title, copy]) => <article key={number}><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div>
        </section>

        <section className="enquiry" id="enquiry">
          <div className="enquiry-copy"><p className="section-tag dot">DUBAI PILOT PROGRAMME</p><h2>Let’s talk about your property.</h2><p>Register concrete interest and help define which POPS Minibar configuration should be tested first.</p><div className="next-steps"><span>WHAT HAPPENS NEXT</span><ol><li><b>1</b>Tell us about the property.</li><li><b>2</b>Discuss the preferred setup and service budget.</li><li><b>3</b>Review real pilot terms before committing.</li></ol></div><small>No payment required. No installation commitment.</small></div>
          <div className="form-card"><p className="section-tag">PILOT ENQUIRY</p><h3>Enquire about the Dubai pilot.</h3><LeadForm /></div>
        </section>

        <section className="faq section-shell">
          <div><p className="section-tag">PRACTICAL DETAILS</p><h2>Before you enquire.</h2></div>
          <div>{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div>
        </section>

        <footer className="site-footer">
          <div className="footer-main"><a className="pops-logo" href="#top"><strong>POPS</strong><span>MINIBAR SYSTEMS</span></a><p>Thoughtful amenities.<br />A more measurable stay.</p><nav><a href="#setups">Explore setups</a><a href="#enquiry">Pilot enquiries</a><Link href="/privacy">Privacy</Link><PrivacySettingsButton /></nav></div>
          <div className="footer-meta"><span>© 2026 POPS Minibar</span><span>DUBAI · UNITED ARAB EMIRATES</span><span>Independent hospitality project</span></div>
          <p className="photo-credit">Reference photography: Mcrociani, CC BY-SA 3.0, via Wikimedia Commons; tommerton2010, CC BY 2.0, via Flickr/Openverse. Images depict real environments and reference equipment, not a POPS installation or supplier endorsement.</p>
        </footer>
      </main>
    </PilotSetupProvider>
  );
}
