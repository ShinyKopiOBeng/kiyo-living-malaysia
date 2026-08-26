import type { Metadata } from "next";
import { LegalShell } from "../components/LegalShell";

export const metadata: Metadata = {
  title: "Privacy Policy | KIYO Living",
  description: "How KIYO Living collects, uses and protects personal data, in line with Malaysia's Personal Data Protection Act 2010.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalShell
      eyebrow="Legal"
      title="Privacy Policy"
      lede="This notice explains what personal data KIYO Living collects, why we collect it, who we share it with, and the choices you have. It is written to align with Malaysia's Personal Data Protection Act 2010 (PDPA)."
    >
      <h2>1. Who is responsible for your data</h2>
      <p>
        KIYO Living, Shah Alam, Selangor, Malaysia, is the data user for personal data collected through this website and
        through our sales channels. You can reach us at <a href="mailto:hello@kiyo.com.my">hello@kiyo.com.my</a>.
      </p>

      <h2>2. What we collect</h2>
      <ul>
        <li><strong>Contact details</strong> you give us when you enquire: name, company, phone number, email address.</li>
        <li><strong>Order details</strong>: delivery address, products, quantities, customisation artwork and payment references.</li>
        <li><strong>Correspondence</strong>: the content of WhatsApp, email and social media messages you send us.</li>
        <li><strong>Basic technical data</strong> when you visit this site: IP address, browser type, referring page and pages viewed.</li>
      </ul>
      <p>
        We do not ask for sensitive personal data. Please do not send us identity card numbers, passport details, health
        information or payment card numbers by message.
      </p>

      <h2>3. Why we use it</h2>
      <ul>
        <li>To answer your enquiry and prepare a quotation.</li>
        <li>To process, produce, deliver and support your order.</li>
        <li>To handle warranty claims, returns and after-sales questions.</li>
        <li>To keep proper business and accounting records as required by Malaysian law.</li>
        <li>To improve this website and understand which pages are useful.</li>
      </ul>
      <p>
        We will only send you marketing messages if you have asked for them or are an existing customer, and every such
        message will include a way to stop receiving them.
      </p>

      <h2>4. Who we share it with</h2>
      <p>We share personal data only where it is needed to run the business, specifically with:</p>
      <ul>
        <li>Manufacturing and printing partners, limited to what is needed to produce your order.</li>
        <li>Courier and logistics providers, for delivery.</li>
        <li>Payment processors and banks, for settlement.</li>
        <li>Marketplace operators, where you buy through Shopee or TikTok Shop.</li>
        <li>Professional advisers and regulators, where we are required to disclose.</li>
      </ul>
      <p>We do not sell personal data.</p>

      <h2>5. Transfers outside Malaysia</h2>
      <p>
        Some of our suppliers and service providers operate outside Malaysia. Where personal data is transferred abroad,
        we take reasonable steps to ensure it receives a comparable level of protection.
      </p>

      <h2>6. How long we keep it</h2>
      <p>
        Enquiries that do not become orders are kept for up to 24 months. Order and transaction records are kept for at
        least 7 years to meet Malaysian tax and accounting requirements. Custom artwork is kept for the duration of the
        commercial relationship so repeat orders can be matched, and deleted on request once no order is open.
      </p>

      <h2>7. Cookies and analytics</h2>
      <p>
        This site uses only what is necessary to serve pages and remember small interface preferences in your own
        browser. Your browser settings let you clear or block this storage at any time; the site will still work.
      </p>

      <h2>8. Security</h2>
      <p>
        We apply reasonable technical and organisational measures to protect personal data against loss, misuse and
        unauthorised access. No transmission over the internet is completely secure, so we cannot guarantee absolute
        security, but we take the obligation seriously and act quickly if something goes wrong.
      </p>

      <h2>9. Your rights</h2>
      <p>Under the PDPA you may:</p>
      <ul>
        <li>Ask for a copy of the personal data we hold about you.</li>
        <li>Ask us to correct data that is inaccurate or out of date.</li>
        <li>Withdraw consent to further processing, including marketing.</li>
        <li>Limit how we process your data in certain circumstances.</li>
      </ul>
      <p>
        Write to <a href="mailto:hello@kiyo.com.my">hello@kiyo.com.my</a> and we will respond within 21 days. We may ask
        you to confirm your identity before acting on a request.
      </p>

      <h2>10. Third-party sites</h2>
      <p>
        Links to Shopee, TikTok, Instagram, Facebook, YouTube and WhatsApp take you to services run by other companies,
        each with its own privacy notice. This policy does not cover what they do with your data.
      </p>

      <h2>11. Children</h2>
      <p>
        This site is not directed at children under 13, and we do not knowingly collect their personal data. If you
        believe a child has sent us personal data, contact us and we will delete it.
      </p>

      <h2>12. Changes</h2>
      <p>
        We may update this notice. The date at the top of this page shows when it last changed. Material changes will be
        highlighted on this page.
      </p>
    </LegalShell>
  );
}
