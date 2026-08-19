"use client";

/* Images are pre-sized and compressed in public for the static runtime. */
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Mail, MapPin, Menu, X } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp, FaYoutube } from "react-icons/fa6";
import { SiShopee } from "react-icons/si";
import { CorporateGiftGallery, ProductInspector, UmrahServiceGallery } from "./components/KiyoInteractiveSections";
import { ImageSlotVisual } from "./components/ImagePlaceholder";
import { aboutSlots, capabilitySlots, heroSlot, warehouseSlots } from "./components/imageSlots";

const WHATSAPP_URL = "https://wa.me/60132767887?text=Hi%20KIYO%2C%20I%27m%20interested%20in%20your%20products%20or%20services.";

const navigation = [
  ["About", "#about"],
  ["At a Glance", "#glance"],
  ["Products", "#products"],
  ["Corporate", "#corporate"],
  ["UMRAH", "#services"],
  ["Location", "#location"],
] as const;

const mobileNavigation = [["Home", "#home"], ...navigation, ["Contact", "#contact"]] as const;

const capabilities = [
  { number: "01", title: "Live Commerce", description: "Campaigns, livestreams and social-first product discovery.", slot: capabilitySlots[0] },
  { number: "02", title: "Nationwide Wholesale", description: "Retail and distribution support across Malaysia.", slot: capabilitySlots[1] },
  { number: "03", title: "Corporate Gifting", description: "Brand-ready travel sets for teams, clients and programmes.", slot: capabilitySlots[2] },
  { number: "04", title: "UMRAH Programmes", description: "Coordinated luggage and agency-ready travel sets.", slot: capabilitySlots[3] },
] as const;

const warehouseStories = [
  { title: "Warehouse exterior", description: "Our Shah Alam base for stock, showroom visits and operations." },
  { title: "Organised stock", description: "Prepared inventory for retail, programme and corporate requirements." },
  { title: "Product showroom", description: "A focused place to review luggage, finishes and gift-set direction." },
  { title: "Team and client space", description: "A working environment for planning details and approvals together." },
  { title: "Packing and dispatch", description: "Final checks and coordinated preparation before every delivery." },
] as const;

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/kiyoliving_", icon: FaInstagram },
  { label: "Facebook", href: "https://www.facebook.com/kiyoliving", icon: FaFacebookF },
  { label: "TikTok", href: "https://www.tiktok.com/@kiyoliving", icon: FaTiktok },
  { label: "YouTube", href: "https://www.youtube.com/@kiyoliving", icon: FaYoutube },
];

type DialogProps = { open: boolean; onClose: () => void };

function MenuDialog({ open, onClose }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const context = reduceMotion ? undefined : gsap.context(() => {
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .fromTo(".mobile-menu__top", { y: -12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.36 })
        .fromTo(".mobile-menu__links a", { x: -20, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.42, stagger: 0.055 }, "<0.08")
        .fromTo(".mobile-menu__cta", { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.34 }, "<0.08");
    }, dialog);
    dialog.querySelector<HTMLAnchorElement>("a")?.focus();
    return () => {
      context?.revert();
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
    };
  }, [open]);

  return (
    <dialog ref={dialogRef} className="mobile-menu" aria-label="Primary navigation" onCancel={(event) => { event.preventDefault(); onClose(); }}>
      <div className="mobile-menu__top">
        <img src="/images/kiyo-logo.png" alt="KIYO" width="653" height="258" />
        <button className="icon-button" onClick={onClose} aria-label="Close menu"><X aria-hidden="true" /></button>
      </div>
      <nav className="mobile-menu__links">
        {mobileNavigation.map(([label, href]) => <a key={href} href={href} onClick={onClose}>{label}<ArrowUpRight aria-hidden="true" /></a>)}
      </nav>
      <a className="button button--coral mobile-menu__cta" href={WHATSAPP_URL} target="_blank" rel="noreferrer">Discuss a project <FaWhatsapp aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
    </dialog>
  );
}

function ShopDialog({ open, onClose }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;
    dialog.showModal();
    dialog.querySelector<HTMLAnchorElement>("a")?.focus();
    return () => { if (dialog.open) dialog.close(); };
  }, [open]);

  return (
    <dialog ref={dialogRef} className="shop-dialog" aria-labelledby="shop-dialog-title" onClick={(event) => { if (event.target === dialogRef.current) onClose(); }} onCancel={(event) => { event.preventDefault(); onClose(); }}>
      <button className="shop-dialog__close icon-button" onClick={onClose} aria-label="Close shop options"><X aria-hidden="true" /></button>
      <p>Shop KIYO</p>
      <h2 id="shop-dialog-title">Choose your shopping platform.</h2>
      <span>Browse current retail selections on KIYO&apos;s official stores.</span>
      <div className="shop-dialog__links">
        <a href="https://shopee.com.my/kiyoliving" target="_blank" rel="noreferrer"><SiShopee aria-hidden="true" /><span><strong>Shopee</strong><small>KIYO Living official store</small></span><ArrowUpRight aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
        <a href="https://www.tiktok.com/@kiyoliving" target="_blank" rel="noreferrer"><FaTiktok aria-hidden="true" /><span><strong>TikTok Shop</strong><small>Discover KIYO on TikTok</small></span><ArrowUpRight aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
      </div>
    </dialog>
  );
}

function SocialLinks({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`socials${compact ? " socials--compact" : ""}`} aria-label="KIYO social media">
      {socialLinks.map(({ label, href, icon: Icon }) => (
        <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={`${label} (opens in a new tab)`}><Icon aria-hidden="true" />{compact ? null : <span>{label}</span>}</a>
      ))}
    </div>
  );
}

type HeaderMode = "hero" | "solid" | "hidden";

function SmartHeader({ onMenu, onShop, menuOpen }: { onMenu: () => void; onShop: () => void; menuOpen: boolean }) {
  const [mode, setMode] = useState<HeaderMode>("hero");

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const hero = document.querySelector<HTMLElement>("#home");
    let anchor = 0;
    let direction = 1;
    let current: HeaderMode = "hero";
    const updateMode = (next: HeaderMode) => {
      if (next === current) return;
      current = next;
      setMode(next);
    };

    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const y = self.scroll();
        const heroEnd = Math.max(160, (hero?.offsetHeight ?? window.innerHeight) - 72);
        if (y <= heroEnd) {
          anchor = y;
          direction = self.direction;
          updateMode("hero");
          return;
        }
        if (current === "hero") {
          current = "solid";
          setMode("solid");
          anchor = y;
        }
        if (self.direction !== direction) {
          direction = self.direction;
          anchor = y;
        }
        if (direction > 0 && y - anchor >= 96) {
          updateMode("hidden");
          anchor = y;
        } else if (direction < 0 && anchor - y >= 32) {
          updateMode("solid");
          anchor = y;
        }
      },
    });
    ScrollTrigger.refresh();
    return () => trigger.kill();
  }, []);

  return (
    <header className={`site-header site-header--${mode}`} data-header-mode={mode}>
      <a className="brand" href="#home" aria-label="KIYO home"><img src="/images/kiyo-logo.png" alt="KIYO" width="653" height="258" /></a>
      <nav className="desktop-navigation" aria-label="Primary navigation">
        {navigation.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
      </nav>
      <div className="header-actions">
        <button className="shop-trigger" type="button" onClick={onShop} aria-haspopup="dialog" aria-controls="shop-dialog">Shop <ArrowUpRight aria-hidden="true" /></button>
        <button className="menu-trigger" type="button" onClick={onMenu} aria-label="Open menu" aria-haspopup="dialog" aria-controls="primary-menu" aria-expanded={menuOpen}><span>Menu</span><Menu aria-hidden="true" /></button>
      </div>
    </header>
  );
}

export function KiyoExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLElement>(null);
  const locationTrackRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cancelled = false;
    const context = gsap.context(() => {
      if (!reduceMotion) {
        gsap.timeline({ defaults: { ease: "power3.out" } })
          .fromTo(".hero__media", { scale: 1.025, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.05 })
          .fromTo(".hero__copy > *", { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.72, stagger: 0.08 }, "<0.14");

        gsap.fromTo(".about__copy > *", { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.72, stagger: 0.07, ease: "power3.out", scrollTrigger: { trigger: "#about", start: "top 72%", once: true } });
        gsap.fromTo(".about__portrait", { x: 28, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: "#about", start: "top 72%", once: true } });
        gsap.fromTo(".contact__inner > *", { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.62, stagger: 0.065, ease: "power3.out", scrollTrigger: { trigger: "#contact", start: "top 72%", once: true } });
      }
    }, root);

    const media = gsap.matchMedia();
    media.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const section = locationRef.current;
      const track = locationTrackRef.current;
      if (!section || !track) return;
      const distance = () => Math.max(0, track.scrollWidth - section.clientWidth);
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
      return () => { tween.scrollTrigger?.kill(); tween.kill(); };
    });

    document.fonts.ready.then(() => { if (!cancelled) ScrollTrigger.refresh(); });
    return () => { cancelled = true; media.revert(); context.revert(); };
  }, []);

  return (
    <div ref={rootRef} className="site-shell">
      <a className="skip-link" href="#main">Skip to content</a>
      <SmartHeader onMenu={() => setMenuOpen(true)} onShop={() => setShopOpen(true)} menuOpen={menuOpen} />

      <main id="main">
        <section id="home" className="hero chapter-screen">
          <ImageSlotVisual slot={heroSlot} className="hero__media" priority />
          <div className="hero__scrim" aria-hidden="true" />
          <div className="hero__copy">
            <h1>Designed for every journey.<span>Built for business.</span></h1>
            <p>Travel · Corporate Gifting · UMRAH Programmes</p>
            <a className="button button--coral" href="#about">Explore KIYO <ArrowDown aria-hidden="true" /></a>
          </div>
          <a className="hero__scroll-cue" href="#about" aria-label="Continue to About KIYO"><ArrowDown aria-hidden="true" /></a>
        </section>

        <section id="about" className="about chapter-screen">
          <ImageSlotVisual slot={aboutSlots.warehouse} className="about__background" decorative />
          <div className="about__scrim" aria-hidden="true" />
          <div className="about__copy">
            <p className="eyebrow">Behind KIYO</p>
            <h2>Building a Malaysian travel & live-commerce brand.</h2>
            <p>From live-commerce campaigns to nationwide wholesale distribution, corporate gifting and UMRAH-ready travel programmes.</p>
          </div>
          <ImageSlotVisual slot={aboutSlots.samantha} className="about__portrait" />
        </section>

        <section id="glance" className="capabilities chapter">
          <header className="section-heading"><h2>KIYO at a glance.</h2><p>One Malaysian travel brand, built to serve customers, agencies and organisations at different scales.</p></header>
          <div className="capability-grid">
            {capabilities.map(({ number, title, description, slot }) => (
              <article className="capability-panel" key={title}>
                <ImageSlotVisual slot={slot} className="capability-panel__media" />
                <div className="capability-panel__content"><span>{number}</span><h3>{title}</h3><p>{description}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section id="products" className="products chapter"><ProductInspector onShop={() => setShopOpen(true)} /></section>

        <section id="corporate" className="corporate chapter">
          <header className="corporate__intro">
            <p className="eyebrow">Corporate gifting</p>
            <h2>Gift sets that travel further.</h2>
            <p>Useful, brand-ready sets for clients, teams, events and executive gifting.</p>
            <a className="button button--outline" href={WHATSAPP_URL} target="_blank" rel="noreferrer">Enquire for corporate gifts <FaWhatsapp aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
          </header>
          <CorporateGiftGallery whatsappUrl={WHATSAPP_URL} />
        </section>

        <section id="services" className="umrah chapter">
          <div className="umrah__layout">
            <div className="umrah__copy">
              <p className="eyebrow">UMRAH programme</p>
              <h2>A complete travel set for a meaningful journey.</h2>
              <p>Coordinate luggage, thoughtful travel essentials and agency branding for UMRAH groups with a calm, professional presentation.</p>
              <ul>
                <li><Check aria-hidden="true" />Coordinated luggage sizes</li>
                <li><Check aria-hidden="true" />Optional prayer and travel essentials</li>
                <li><Check aria-hidden="true" />Custom agency logo and branding</li>
                <li><Check aria-hidden="true" />Group-order and warehouse support</li>
              </ul>
              <a className="button button--ink" href={WHATSAPP_URL} target="_blank" rel="noreferrer">Plan an UMRAH set <FaWhatsapp aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
            </div>
            <UmrahServiceGallery />
          </div>
          <div className="agency-process" aria-label="Agency customisation process">
            {['Select', 'Brand', 'Approve', 'Deliver'].map((step, index) => <span key={step}>{step}{index < 3 ? <ArrowRight aria-hidden="true" /> : null}</span>)}
          </div>
        </section>

        <section id="location" ref={locationRef} className="location chapter-screen">
          <header className="location__intro"><p>Shah Alam, Selangor</p><h2>Built to deliver across Malaysia.</h2><span>A working base for stock, quality checks, order preparation and client conversations.</span></header>
          <div className="location__viewport">
            <div className="location__track" ref={locationTrackRef}>
              {warehouseSlots.map((slot, index) => (
                <figure className={`location-card${index === 0 ? " location-card--wide" : ""}`} key={slot.id} data-sequence={index + 1}>
                  <ImageSlotVisual slot={slot} className="location-card__media" />
                  <figcaption><h3>{warehouseStories[index].title}</h3><p>{warehouseStories[index].description}</p></figcaption>
                </figure>
              ))}
              <aside className="location-card location-card--address">
                <MapPin aria-hidden="true" />
                <p>Visit by appointment</p>
                <h3>Shah Alam,<br />Selangor,<br />Malaysia.</h3>
                <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">Arrange a conversation <ArrowUpRight aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
              </aside>
            </div>
          </div>
        </section>

        <section id="contact" className="contact chapter-screen">
          <div className="contact__inner">
            <p>Corporate gifts, UMRAH sets, custom branding and retail enquiries.</p>
            <h2>Let&apos;s build your next journey together.</h2>
            <div className="contact__actions">
              <a className="button button--coral" href={WHATSAPP_URL} target="_blank" rel="noreferrer">Start on WhatsApp <FaWhatsapp aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
              <a className="button button--outline" href="mailto:hello@kiyo.com.my">hello@kiyo.com.my <Mail aria-hidden="true" /></a>
            </div>
            <SocialLinks />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand brand--footer" href="#home" aria-label="Back to KIYO home"><img src="/images/kiyo-logo.png" alt="KIYO" width="653" height="258" /></a>
        <p>Practical travel, presented with purpose.</p>
        <div className="footer-links"><a href="#products">Products</a><a href="#corporate">Corporate</a><a href="#services">UMRAH</a><a href="#location">Location</a></div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} KIYO Living. All rights reserved.</span><SocialLinks compact /></div>
      </footer>

      <a className={`whatsapp-float${menuOpen || shopOpen ? " whatsapp-float--hidden" : ""}`} href={WHATSAPP_URL} target="_blank" rel="noreferrer" aria-label="Chat with KIYO on WhatsApp (opens in a new tab)"><FaWhatsapp aria-hidden="true" /></a>
      <MenuDialog open={menuOpen} onClose={() => setMenuOpen(false)} />
      <ShopDialog open={shopOpen} onClose={() => setShopOpen(false)} />
    </div>
  );
}
