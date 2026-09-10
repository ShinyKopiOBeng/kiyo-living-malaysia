/* Shared between the single-page experience and the standalone legal pages. */
/* eslint-disable @next/next/no-img-element */

import { ArrowUpRight } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa6";

export const WHATSAPP_E164 = "60132767887";
export const WHATSAPP_NUMBER = "+60 13-276 7887";

/** Build a wa.me deep link carrying a pre-written message. */
export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(message)}`;
}

/**
 * The point of a pre-written message is that it can carry what the page
 * already knows. Every button used to open the same "I'm interested in your
 * products or services", which told whoever answered nothing: they had to ask
 * what the visitor was looking at, and the thread started two messages behind.
 *
 * The closing line is not decoration either. It is how KIYO can see which part
 * of the site is producing enquiries without any analytics at all.
 */
export function enquiry(message: string, source: string) {
  return `${message}\n\nSent from the KIYO website, ${source}.`;
}

export const GENERAL_MESSAGE = enquiry(
  "Hi KIYO. I have a question about your luggage and gift sets.",
  "general enquiry",
);

export const UMRAH_MESSAGE = enquiry(
  "Hi KIYO. I am planning an UMRAH programme and would like to see the agency sets.",
  "UMRAH sets",
);

export const CORPORATE_MESSAGE = enquiry(
  "Hi KIYO. I am looking at corporate gift sets for my company.",
  "corporate gift sets",
);

export const VISIT_MESSAGE = enquiry(
  "Hi KIYO. I would like to arrange a visit to the Kajang showroom.",
  "visit us",
);

export function giftSetMessage(title: string) {
  return enquiry(`Hi KIYO. I would like a quote for the ${title}.`, title);
}

export const WHATSAPP_URL = whatsappLink(GENERAL_MESSAGE);

export const SHOPEE_URL = "https://shopee.com.my/kiyoliving";
export const TIKTOK_URL = "https://www.tiktok.com/@kiyoliving";
export const EMAIL = "kiyoliving88@gmail.com";

export const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/kiyoliving_", icon: FaInstagram },
  { label: "TikTok", href: TIKTOK_URL, icon: FaTiktok },
  { label: "Facebook", href: "https://www.facebook.com/kiyoliving", icon: FaFacebookF },
  { label: "YouTube", href: "https://www.youtube.com/@kiyoliving", icon: FaYoutube },
];

export const legalLinks = [
  ["Terms", "/terms"],
  ["Privacy", "/privacy"],
  ["Shipping & Returns", "/shipping-returns"],
] as const;

export function SocialLinks({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`socials${compact ? " socials--compact" : ""}`} aria-label="KIYO social media">
      {socialLinks.map(({ label, href, icon: Icon }) => (
        <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={`${label} (opens in a new tab)`}>
          <Icon aria-hidden="true" />
          {compact ? null : <span>{label}</span>}
        </a>
      ))}
    </div>
  );
}

/* Anchors resolve on the home page only, so the legal pages prefix them. */
function sectionHref(anchor: string, standalone: boolean) {
  return standalone ? `/${anchor}` : anchor;
}

export function SiteFooter({ standalone = false }: { standalone?: boolean }) {
  const link = (anchor: string) => sectionHref(anchor, standalone);

  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <div className="footer-brand">
          <a className="brand brand--footer" href={standalone ? "/" : "#home"} aria-label="Back to KIYO home">
            <img src="/images/kiyo-logo.png" alt="KIYO" width="653" height="258" />
          </a>
          <p>Designed for Your Journey.</p>
        </div>

        <nav className="footer-column" aria-label="B2B solutions">
          <h2>B2B Solutions</h2>
          <a href={link("#corporate")}>Corporate Gifts</a>
          <a href={link("#umrah")}>UMRAH Programmes</a>
          <a href={link("#customise")}>Customisation</a>
          <a href={link("#build")}>How It Works</a>
        </nav>

        <nav className="footer-column" aria-label="Retail">
          <h2>Retail</h2>
          <a href={link("#build")}>Product Collection</a>
          <a href={SHOPEE_URL} target="_blank" rel="noreferrer">
            Shopee Store <ArrowUpRight aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a href={TIKTOK_URL} target="_blank" rel="noreferrer">
            TikTok Shop <ArrowUpRight aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </nav>

        <div className="footer-column footer-column--contact">
          <h2>Visit &amp; Contact</h2>
          <address>
            No. 16, Jalan SC 1, Pusat Perindustrian Sungai Chua,
            <br />
            43000 Kajang, Selangor.
          </address>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
            WhatsApp {WHATSAPP_NUMBER}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <a href={link("#visit")}>Arrange a Visit</a>
        </div>

        <SocialLinks compact />
      </div>

      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} KIYO Living Sdn. Bhd. All rights reserved.
          <br />
          Company No. 202201026207 (1471904-T)
        </span>
        <nav className="footer-legal" aria-label="Legal">
          {legalLinks.map(([label, href]) => (
            <a key={href} href={href}>{label}</a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
