/* Shared between the single-page experience and the standalone legal pages. */
/* eslint-disable @next/next/no-img-element */

import { ArrowUpRight } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa6";

export const WHATSAPP_E164 = "60132767887";
export const WHATSAPP_URL = "https://wa.me/60132767887?text=Hi%20KIYO%2C%20I%27m%20interested%20in%20your%20products%20or%20services.";
export const WHATSAPP_NUMBER = "+60 13-276 7887";

/** Build a wa.me deep link carrying a pre-written message. */
export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(message)}`;
}

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
