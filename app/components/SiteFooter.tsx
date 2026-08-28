/* Shared between the single-page experience and the standalone legal pages. */
/* eslint-disable @next/next/no-img-element */

import { ArrowUpRight } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa6";

export const WHATSAPP_URL = "https://wa.me/60132767887?text=Hi%20KIYO%2C%20I%27m%20interested%20in%20your%20products%20or%20services.";
export const WHATSAPP_NUMBER = "+60 13-276 7887";

export const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/kiyoliving_", icon: FaInstagram },
  { label: "Facebook", href: "https://www.facebook.com/kiyoliving", icon: FaFacebookF },
  { label: "TikTok", href: "https://www.tiktok.com/@kiyoliving", icon: FaTiktok },
  { label: "YouTube", href: "https://www.youtube.com/@kiyoliving", icon: FaYoutube },
];

export const legalLinks = [
  ["Terms & Conditions", "/terms"],
  ["Privacy Policy", "/privacy"],
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
      <div className="site-footer__grid" data-reveal-group>
        <div className="footer-brand">
          <a className="brand brand--footer" href={standalone ? "/" : "#home"} aria-label="Back to KIYO home">
            <img src="/images/kiyo-logo.png" alt="KIYO" width="653" height="258" />
          </a>
          <p>Practical travel, presented with purpose. Luggage, corporate gifting, wholesale distribution and UMRAH sets, made in Malaysia for every journey.</p>
          <SocialLinks compact />
        </div>

        <nav className="footer-column" aria-label="Explore KIYO">
          <h2>Explore</h2>
          <a href={link("#about")}>About</a>
          <a href={link("#glance")}>At a Glance</a>
          <a href={link("#products")}>Products</a>
          <a href={link("#location")}>Location</a>
        </nav>

        <nav className="footer-column" aria-label="KIYO services">
          <h2>Services</h2>
          <a href={link("#corporate")}>Corporate Gifting</a>
          <a href={link("#services")}>UMRAH Sets</a>
          <a href={link("#glance")}>Wholesale Distribution</a>
          <a href={link("#glance")}>Live Commerce</a>
        </nav>

        <div className="footer-column footer-column--contact">
          <h2>Contact</h2>
          <address>
            KIYO Living Sdn. Bhd.
            <br />
            No. 16, Jalan SC 1,
            <br />
            Pusat Perindustrian Sungai Chua,
            <br />
            43000 Kajang, Selangor.
          </address>
          <a href="mailto:kiyoliving88@gmail.com">kiyoliving88@gmail.com</a>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
            {WHATSAPP_NUMBER}
            <span className="sr-only"> on WhatsApp (opens in a new tab)</span>
          </a>
          <a className="footer-column__external" href="https://shopee.com.my/kiyoliving" target="_blank" rel="noreferrer">
            Shopee store <ArrowUpRight aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a className="footer-column__external" href="https://www.tiktok.com/@kiyoliving" target="_blank" rel="noreferrer">
            TikTok Shop <ArrowUpRight aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
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
