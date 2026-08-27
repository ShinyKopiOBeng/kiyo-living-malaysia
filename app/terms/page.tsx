import type { Metadata } from "next";
import { LegalShell } from "../components/LegalShell";

export const metadata: Metadata = {
  title: "Terms & Conditions | KIYO Living",
  description: "The terms that apply when you buy luggage, corporate gifts, wholesale stock or UMRAH sets from KIYO Living.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalShell
      eyebrow="Legal"
      title="Terms & Conditions"
      lede="These terms govern your use of the KIYO Living website and any order you place with us, whether for retail purchase, wholesale supply, corporate gifting or an UMRAH programme."
    >
      <h2>1. Who we are</h2>
      <p>
        KIYO Living (&quot;KIYO&quot;, &quot;we&quot;, &quot;us&quot;) is a travel lifestyle and live-commerce business
        based in Kajang, Selangor, Malaysia. We supply luggage and travel goods through retail marketplaces, wholesale
        distribution, corporate gifting programmes and UMRAH travel sets.
      </p>

      <h2>2. Using this website</h2>
      <p>
        This site is provided for information about our products and services. You may browse and share it freely. You
        may not copy our photography, product imagery, written copy, logos or brand marks for commercial use without our
        written permission.
      </p>
      <p>
        We work to keep product information, specifications and availability accurate, but details can change. Nothing on
        this site is a binding offer to sell. An order becomes binding only once we confirm it in writing.
      </p>

      <h2>3. Enquiries and quotations</h2>
      <p>
        Corporate gifting, wholesale and UMRAH enquiries are handled directly, usually over WhatsApp or email. Any
        quotation we issue states the products, quantities, unit price, customisation, lead time and validity period.
        Unless stated otherwise, a quotation is valid for 14 days.
      </p>

      <h2>4. Orders, minimum quantities and lead times</h2>
      <ul>
        <li>Corporate gift sets carry a minimum order quantity, stated on each quotation. Standard sets start at 100 sets.</li>
        <li>Standard production lead time for customised sets is 6 to 8 weeks from artwork approval and deposit receipt.</li>
        <li>Lead times are estimates in good faith. They depend on stock, customisation and shipping, and can move.</li>
        <li>Changes requested after artwork approval may affect price and lead time, and may not be possible once production has begun.</li>
      </ul>

      <h2>5. Customisation and artwork</h2>
      <p>
        Where an order includes custom logo printing, embroidery or agency branding, you confirm that you own or are
        licensed to use the artwork you supply, and that its use does not infringe anyone else&apos;s rights. You are
        responsible for checking the digital proof we send. Once you approve a proof in writing, production runs to that
        proof.
      </p>
      <p>
        Printed and embroidered colour can vary slightly from what you see on screen. Small variations in placement,
        finish and shade are normal in manufacturing and are not treated as defects.
      </p>

      <h2>6. Pricing and payment</h2>
      <p>
        Prices are quoted in Malaysian Ringgit (MYR) and, unless stated otherwise, exclude delivery. For customised and
        bulk orders we normally require a deposit before production, with the balance due before dispatch. Retail
        purchases made through Shopee or TikTok Shop are governed by those platforms&apos; own payment and order terms in
        addition to these.
      </p>

      <h2>7. Delivery, returns and cancellation</h2>
      <p>
        Delivery, inspection, returns and cancellation are covered in our <a href="/shipping-returns">Shipping &amp; Returns</a>{" "}
        policy, which forms part of these terms.
      </p>

      <h2>8. Warranty</h2>
      <p>
        We warrant that goods will be free from manufacturing defects in materials and workmanship at the point of
        delivery. This warranty does not cover normal wear, airline or courier handling damage, misuse, unauthorised
        repair, or damage arising from use outside the product&apos;s intended purpose. Your statutory rights under
        Malaysian consumer law are not affected.
      </p>

      <h2>9. Liability</h2>
      <p>
        To the extent permitted by law, our total liability in connection with an order is limited to the amount you paid
        for that order. We are not liable for indirect or consequential loss, including loss of profit, loss of business
        or loss of opportunity. Nothing in these terms limits liability for death or personal injury caused by
        negligence, or for fraud.
      </p>

      <h2>10. Events outside our control</h2>
      <p>
        We are not in breach of these terms where performance is delayed or prevented by events beyond our reasonable
        control, including supplier failure, transport disruption, natural events, industrial action or government
        action. Where such an event occurs we will tell you promptly and agree a revised timeline with you.
      </p>

      <h2>11. Privacy</h2>
      <p>
        Personal data you share with us is handled as described in our <a href="/privacy">Privacy Policy</a>.
      </p>

      <h2>12. Changes to these terms</h2>
      <p>
        We may update these terms from time to time. The version published on this page at the time you place an order is
        the version that applies to that order.
      </p>

      <h2>13. Governing law</h2>
      <p>
        These terms are governed by the laws of Malaysia, and the courts of Malaysia have exclusive jurisdiction over any
        dispute arising from them.
      </p>

      <h2>14. Contact</h2>
      <p>
        KIYO Living, Kajang, Selangor, Malaysia. Email <a href="mailto:kiyoliving88@gmail.com">kiyoliving88@gmail.com</a> or
        message us on WhatsApp at +60 13-276 7887.
      </p>
    </LegalShell>
  );
}
