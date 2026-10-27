import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <Link className="pops-logo dark" href="/"><strong>POPS</strong><span>MINIBAR SYSTEMS</span></Link>
      <section>
        <p className="section-tag">PRIVACY NOTICE · DUBAI PILOT</p>
        <h1>Privacy for pilot enquiries.</h1>
        <p>This notice explains how information submitted through the POPS Minibar pilot enquiry form is used. POPS Minibar is an independent project initiated by Dragos Popescu. This page does not represent a registered company, commercial licence or affiliation with Airbnb.</p>

        <h2>Information collected</h2>
        <p>The enquiry form collects your name, email address, property location, number of properties, preferred proposed setup, monthly service-budget preference, contact consent and optional project-update consent. Campaign attribution may include allowlisted UTM parameters and Google click identifiers only after advertising-measurement consent.</p>

        <h2>Why it is used</h2>
        <p>The information is used to assess genuine interest in a Dubai pilot, understand operator requirements, contact applicants who requested a discussion, prevent duplicate or abusive submissions and measure campaign quality. Newsletter-style project updates are sent only when the separate optional checkbox is selected.</p>

        <h2>Storage and access</h2>
        <p>Enquiries are stored in a private database and are visible only through server-protected administration. They are not published or placed in ordinary analytics events. Hosting, database and measurement providers may process limited information when those services are configured.</p>

        <h2>Retention and deletion</h2>
        <p>Pilot enquiries are intended to be reviewed and removed when no longer necessary for the validation programme. Unless an applicant enters a continuing commercial discussion, the working retention target is 12 months. You can request access, correction or deletion at any time.</p>

        <h2>Optional measurement</h2>
        <p>Google measurement tags are blocked until a visitor makes an optional choice. Visitors may reject optional measurement, allow analytics only, or allow both analytics and advertising measurement. Advertising personalization remains disabled in the prepared configuration. Preferences can be reopened from the footer. Names, email addresses and other enquiry details are not sent in standard page or campaign events.</p>

        <h2>Contact</h2>
        <p>For access, correction, deletion or privacy questions, contact Dragos Popescu at <a href="mailto:popescudragos707@yahoo.com">popescudragos707@yahoo.com</a>.</p>

        <p className="legal-warning"><strong>Pre-launch note:</strong> this operational pilot notice should receive legal review before paid advertising or public production launch, particularly if targeting expands beyond the United Arab Emirates.</p>
        <Link className="text-link" href="/">← Back to POPS Minibar</Link>
      </section>
    </main>
  );
}
