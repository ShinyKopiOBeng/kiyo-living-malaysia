import type { Metadata } from "next";
import { LegalShell } from "../components/LegalShell";

export const metadata: Metadata = {
  title: "Shipping & Returns | KIYO Living",
  description: "Delivery timelines, inspection, returns and cancellation for KIYO Living retail, wholesale and corporate gifting orders.",
  alternates: { canonical: "/shipping-returns" },
};

export default function ShippingReturnsPage() {
  return (
    <LegalShell
      eyebrow="Legal"
      title="Shipping & Returns"
      lede="How KIYO Living ships orders across Malaysia, what to check on arrival, and how returns, exchanges and cancellations work. This policy forms part of our Terms & Conditions."
    >
      <h2>1. Where we ship</h2>
      <p>
        We deliver nationwide across Peninsular Malaysia, Sabah and Sarawak. Deliveries to East Malaysia typically take
        two to four working days longer than the Peninsula. International shipping is arranged case by case for
        wholesale and corporate orders; ask us for a quotation.
      </p>

      <h2>2. Dispatch and delivery times</h2>
      <ul>
        <li><strong>In-stock retail items:</strong> dispatched within 1 to 3 working days, delivered in 2 to 5 working days.</li>
        <li><strong>Wholesale stock orders:</strong> dispatched once payment clears, usually within 5 working days.</li>
        <li><strong>Customised corporate gift sets:</strong> 6 to 8 weeks from artwork approval and deposit receipt.</li>
        <li><strong>UMRAH group sets:</strong> scheduled against your departure date and confirmed in writing on the quotation.</li>
      </ul>
      <p>
        These are working days and exclude weekends and public holidays. Peak periods and festive seasons can add time,
        and we will tell you if your order is affected.
      </p>

      <h2>3. Shipping charges</h2>
      <p>
        Retail shipping is charged at checkout on the marketplace you order from. For wholesale, corporate and UMRAH
        orders, delivery is quoted separately based on volume, weight and destination. Bulk orders can be collected from
        our Shah Alam warehouse by prior appointment at no delivery cost.
      </p>

      <h2>4. Tracking and receipt</h2>
      <p>
        You will receive tracking details once your order is dispatched. Someone must be available to receive and sign
        for bulk deliveries. If a delivery cannot be completed after the courier&apos;s attempts, redelivery may be
        chargeable.
      </p>

      <h2>5. Check your order on arrival</h2>
      <p>
        Please inspect your order when it arrives. If anything is damaged, missing or incorrect, tell us within{" "}
        <strong>7 calendar days</strong> of delivery, with photographs of the outer packaging, the item and any
        labels. Reporting quickly lets us claim against the courier where relevant and resolve it faster.
      </p>

      <h2>6. Returns and exchanges</h2>
      <p><strong>Retail purchases.</strong> Unused items in their original packaging may be returned within 14 days of delivery for exchange or refund. Return shipping is at your cost unless the item is faulty or we sent the wrong product.</p>
      <p><strong>Faulty or incorrect items.</strong> We cover return shipping and will repair, replace or refund at our option. Manufacturing defects are covered by the warranty described in our <a href="/terms">Terms &amp; Conditions</a>.</p>
      <p>
        <strong>Customised and branded goods.</strong> Items printed, embroidered or otherwise personalised to your
        artwork cannot be returned or exchanged unless they are faulty or do not match the proof you approved. This is
        why we ask you to check every digital proof carefully before production.
      </p>
      <p>
        <strong>Not covered.</strong> Normal wear, scuffs from airline or courier handling, damage from misuse or
        unauthorised repair, and items returned without their original packaging.
      </p>

      <h2>7. Refunds</h2>
      <p>
        Approved refunds are issued to the original payment method within 14 working days of us receiving and inspecting
        the returned goods. Refunds on marketplace orders are processed through that marketplace and follow its timeline.
        Original delivery charges are refunded only where the whole order was faulty or incorrect.
      </p>

      <h2>8. Cancellation</h2>
      <ul>
        <li><strong>Before dispatch or production:</strong> cancel in writing for a full refund of anything paid.</li>
        <li><strong>After artwork approval, before production:</strong> the deposit covers work already committed and is non-refundable.</li>
        <li><strong>Once production has started:</strong> customised orders cannot be cancelled, as materials and print set-up are already committed.</li>
      </ul>

      <h2>9. How to start a return or claim</h2>
      <p>
        Message us on WhatsApp at +60 13-276 7887 or email{" "}
        <a href="mailto:hello@kiyo.com.my">hello@kiyo.com.my</a> with your order reference, what went wrong and
        photographs. We will confirm the return address and next steps before you send anything back. Please do not
        return goods without confirming with us first.
      </p>
    </LegalShell>
  );
}
