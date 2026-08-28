"use client";

/* Images are pre-sized and compressed in public for the static runtime. */
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowUpRight, BadgeCheck, Check, Clock, Gift, Handshake, Mail, MapPin, Menu, ShieldCheck, ShoppingCart, Smartphone, TrendingUp, Trophy, Truck, Video, Warehouse, X } from "lucide-react";
import { FaTiktok, FaWhatsapp } from "react-icons/fa6";
import { SiShopee } from "react-icons/si";
import { CorporateGiftGallery, ProductCollectionOverview, UmrahServiceGallery } from "./components/KiyoInteractiveSections";
import { ImageSlotVisual } from "./components/ImagePlaceholder";
import { aboutSlots, heroSlot, warehouseSlots } from "./components/imageSlots";
import { SiteFooter, SocialLinks, WHATSAPP_URL } from "./components/SiteFooter";
import { UmrahProcessFlow } from "./components/UmrahProcessFlow";

const navigation = [
  ["About", "#about"],
  ["At a Glance", "#glance"],
  ["Products", "#products"],
  ["Corporate", "#corporate"],
  ["UMRAH", "#services"],
  ["Location", "#location"],
] as const;

const mobileNavigation = [["Home", "#home"], ...navigation, ["Contact", "#contact"]] as const;

/* Every tile here has to be checkable. Two claims from the live-commerce deck
   were left out on purpose because nothing substantiates them yet. */
const heroProofs = [
  { title: "TOP 3", lines: ["TikTok Luggage", "Live Selling Brand"], icon: Trophy },
  { title: "TSP OFFICIAL", lines: ["TikTok Shop", "Partner"], icon: BadgeCheck },
  { title: "EST. 2022", lines: ["SSM 202201026207", "Kajang, Selangor"], icon: ShieldCheck },
  { title: "NATIONWIDE", lines: ["Wholesale", "Distribution"], icon: Truck },
] as const;

const businessPillars = [
  { number: "01", title: "Viral TikTok Campaigns", description: "Powering brand growth through content, live engagement, and community.", icon: Smartphone },
  { number: "02", title: "Nationwide Wholesale Distribution", description: "Strong supply chain and warehouse capacity across Malaysia for seamless delivery.", icon: Truck },
  { number: "03", title: "Premium Corporate Gifting Solutions", description: "Customised premium gifts for businesses, events, and institutions.", icon: Gift },
  { number: "04", title: "Live-Commerce Ecosystem", description: "Empowering hosts, affiliates and creators to grow together through live commerce.", icon: TrendingUp },
  { number: "05", title: "Strategic Partnerships", description: "Collaborating with brands and organisations for long-term success and shared growth.", icon: Handshake },
] as const;

/* Operations detail for the location chapter, from KIYO's own wholesale and
   partnership material. */
const operationsCapabilities = [
  { title: "Warehouse Inventory", description: "Ready stock with structured warehouse capacity.", icon: Warehouse },
  { title: "Nationwide Fulfilment", description: "Efficient distribution network across Malaysia.", icon: Truck },
  { title: "Product Sourcing", description: "Curated products, competitive pricing, trusted quality.", icon: ShoppingCart },
  { title: "Live-Commerce Support", description: "Built for TikTok Shop and live-commerce operations.", icon: Video },
] as const;


const warehouseStories = [
  { title: "Warehouse exterior", description: "Our Kajang base for stock, showroom visits and operations." },
  { title: "Organised stock", description: "Prepared inventory for retail, programme and corporate requirements." },
  { title: "Product showroom", description: "A focused place to review luggage, finishes and gift-set direction." },
  { title: "Team and client space", description: "A working environment for planning details and approvals together." },
  { title: "Packing and dispatch", description: "Final checks and coordinated preparation before every delivery." },
] as const;

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

/* "hover" opens transiently and closes when the pointer leaves; "press" pins the
   panel open until it is dismissed, which is the only mode touch devices use. */
type ShopMode = "hover" | "press";

function ShopFlyout({ open, mode, onClose, onHoverEnter, onHoverLeave }: { open: boolean; mode: ShopMode | null; onClose: () => void; onHoverEnter: () => void; onHoverLeave: () => void }) {
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKeyDown);
    /* A tapped panel behaves like a sheet, so hold the page still behind it.
       A hovered one is transient and must not disturb the scroll position. */
    const lockScroll = mode === "press" && window.matchMedia("(max-width: 1023px)").matches;
    const previousOverflow = document.body.style.overflow;
    if (lockScroll) document.body.style.overflow = "hidden";
    if (mode === "press") panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();

    /* A pinned panel is dismissed by clicking away from it. On wide screens
       there is no scrim to catch that click, so listen for it directly. */
    const onOutsidePointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (target?.closest(".shop-flyout") || target?.closest(".shop-trigger")) return;
      onClose();
    };
    if (mode === "press") document.addEventListener("pointerdown", onOutsidePointerDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onOutsidePointerDown);
      if (lockScroll) document.body.style.overflow = previousOverflow;
    };
  }, [open, mode, onClose]);

  return (
    <>
      <div className={`shop-scrim${open ? " is-open" : ""}${mode === "press" ? " is-dismissible" : ""}`} onClick={onClose} aria-hidden="true" />
      <aside
        ref={panelRef}
        id="shop-flyout"
        className={`shop-flyout${open ? " is-open" : ""}`}
        data-shop-mode={mode ?? "closed"}
        aria-label="Shop KIYO"
        aria-hidden={!open}
        onPointerEnter={(event) => { if (event.pointerType === "mouse") onHoverEnter(); }}
        onPointerLeave={(event) => { if (event.pointerType === "mouse") onHoverLeave(); }}
      >
        <button className="shop-flyout__close icon-button" type="button" onClick={onClose} aria-label="Close shop menu"><X aria-hidden="true" /></button>
        <p>Shop KIYO</p>
        <h2>Choose your shopping platform.</h2>
        <span>Browse current retail selections on KIYO&apos;s official stores.</span>
        <div className="shop-flyout__links">
          <a href="https://shopee.com.my/kiyoliving" target="_blank" rel="noreferrer"><SiShopee aria-hidden="true" /><span><strong>Shopee</strong><small>KIYO Living official store</small></span><ArrowUpRight aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
          <a href="https://www.tiktok.com/@kiyoliving" target="_blank" rel="noreferrer"><FaTiktok aria-hidden="true" /><span><strong>TikTok Shop</strong><small>Discover KIYO on TikTok</small></span><ArrowUpRight aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
        </div>
      </aside>
    </>
  );
}

/* The float is draggable, so a tap has to be told apart from a drag. Anything
   under this many pixels of travel counts as a tap and opens the chat. */
const DOCK_TAP_TOLERANCE = 6;
const DOCK_INSET = 12;
const DOCK_STORAGE_KEY = "kiyo:wa-dock";

type DockPosition = { x: number; y: number };

function clampToViewport(x: number, y: number, element: HTMLElement): DockPosition {
  const { width, height } = element.getBoundingClientRect();
  const maxX = Math.max(DOCK_INSET, window.innerWidth - width - DOCK_INSET);
  const maxY = Math.max(DOCK_INSET, window.innerHeight - height - DOCK_INSET);
  return { x: Math.min(Math.max(x, DOCK_INSET), maxX), y: Math.min(Math.max(y, DOCK_INSET), maxY) };
}

function WhatsAppDock({ hidden }: { hidden: boolean }) {
  const dockRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ pointerId: -1, startX: 0, startY: 0, originX: 0, originY: 0, travel: 0 });
  const [position, setPosition] = useState<DockPosition | null>(null);
  const [dragging, setDragging] = useState(false);

  /* Restore the last resting place, and keep it on-screen when the viewport
     changes size under it. */
  useEffect(() => {
    const dock = dockRef.current;
    if (!dock) return;
    let stored: DockPosition | null = null;
    try {
      const raw = window.localStorage.getItem(DOCK_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      if (parsed && typeof parsed.x === "number" && typeof parsed.y === "number") stored = parsed;
    } catch {
      stored = null;
    }
    if (stored) setPosition(clampToViewport(stored.x, stored.y, dock));

    const onResize = () => {
      const element = dockRef.current;
      if (!element) return;
      setPosition((current) => (current ? clampToViewport(current.x, current.y, element) : current));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* The pointer is captured on the anchor rather than the wrapper. Capturing on
     an ancestor would retarget the follow-up `click` to that ancestor, and a
     plain tap would stop opening the chat. */
  const onPointerDown = (event: React.PointerEvent<HTMLAnchorElement>) => {
    const dock = dockRef.current;
    if (!dock || (event.pointerType === "mouse" && event.button !== 0)) return;
    const rect = dock.getBoundingClientRect();
    drag.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, originX: rect.left, originY: rect.top, travel: 0 };
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* Without capture the drag still works while the pointer stays on the button. */
    }
    setDragging(true);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLAnchorElement>) => {
    const dock = dockRef.current;
    if (!dock || drag.current.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.current.startX;
    const dy = event.clientY - drag.current.startY;
    drag.current.travel = Math.max(drag.current.travel, Math.hypot(dx, dy));
    setPosition(clampToViewport(drag.current.originX + dx, drag.current.originY + dy, dock));
  };

  const endDrag = (event: React.PointerEvent<HTMLAnchorElement>) => {
    const dock = dockRef.current;
    if (!dock || drag.current.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    drag.current.pointerId = -1;
    setDragging(false);
    if (drag.current.travel <= DOCK_TAP_TOLERANCE) return;
    const rect = dock.getBoundingClientRect();
    try {
      window.localStorage.setItem(DOCK_STORAGE_KEY, JSON.stringify({ x: rect.left, y: rect.top }));
    } catch {
      /* Private browsing modes throw on write; the float still works. */
    }
  };

  return (
    <div
      ref={dockRef}
      className={`whatsapp-dock${hidden ? " whatsapp-dock--hidden" : ""}${dragging ? " is-dragging" : ""}`}
      style={position ? { left: `${position.x}px`, top: `${position.y}px`, right: "auto", bottom: "auto" } : undefined}
    >
      <a
        className="whatsapp-float"
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with KIYO on WhatsApp (opens in a new tab). Drag to reposition."
        draggable={false}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClick={(event) => { if (drag.current.travel > DOCK_TAP_TOLERANCE) event.preventDefault(); }}
      >
        <FaWhatsapp aria-hidden="true" />
      </a>
    </div>
  );
}

type HeaderMode = "hero" | "solid" | "hidden";

type ShopControls = {
  shopOpen: boolean;
  shopMode: ShopMode | null;
  onShopOpen: (mode: ShopMode) => void;
  onShopClose: () => void;
  onShopHoverLeave: () => void;
};

function SmartHeader({ onMenu, menuOpen, shopOpen, shopMode, onShopOpen, onShopClose, onShopHoverLeave }: ShopControls & { onMenu: () => void; menuOpen: boolean }) {
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
        <button
          className={`shop-trigger${shopOpen ? " is-open" : ""}`}
          type="button"
          aria-haspopup="dialog"
          aria-controls="shop-flyout"
          aria-expanded={shopOpen}
          onClick={() => (shopOpen && shopMode === "press" ? onShopClose() : onShopOpen("press"))}
          onPointerEnter={(event) => { if (event.pointerType === "mouse") onShopOpen("hover"); }}
          onPointerLeave={(event) => { if (event.pointerType === "mouse") onShopHoverLeave(); }}
        >
          Shop <ArrowUpRight aria-hidden="true" />
        </button>
        <button className="menu-trigger" type="button" onClick={onMenu} aria-label="Open menu" aria-haspopup="dialog" aria-controls="primary-menu" aria-expanded={menuOpen}><span>Menu</span><Menu aria-hidden="true" /></button>
      </div>
    </header>
  );
}

export function KiyoExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [shopMode, setShopMode] = useState<ShopMode | null>(null);
  const shopCloseTimer = useRef<number | null>(null);

  const clearShopTimer = () => {
    if (shopCloseTimer.current === null) return;
    window.clearTimeout(shopCloseTimer.current);
    shopCloseTimer.current = null;
  };
  const openShop = (nextMode: ShopMode) => {
    clearShopTimer();
    setShopMode(nextMode);
    setShopOpen(true);
  };
  const closeShop = () => {
    clearShopTimer();
    setShopOpen(false);
    setShopMode(null);
  };
  /* A short grace period so the pointer can cross the gap from the trigger to
     the panel without the panel snapping shut underneath it. A pinned panel
     ignores hover entirely. */
  const scheduleShopClose = () => {
    if (shopMode === "press") return;
    clearShopTimer();
    shopCloseTimer.current = window.setTimeout(() => {
      setShopOpen(false);
      setShopMode(null);
    }, 220);
  };

  useEffect(() => clearShopTimer, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const context = gsap.context(() => {
      if (!reduceMotion) {
        gsap.timeline({ defaults: { ease: "power3.out" } })
          .fromTo(".hero__media", { scale: 1.025, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.05 })
          .fromTo(".hero__copy > *", { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.72, stagger: 0.08 }, "<0.14")
          .fromTo(".hero-proof", { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.52, stagger: 0.08 }, "<0.16");

        /* One declarative reveal system for everything below the fold. Marking
           up `data-reveal` beats adding a bespoke gsap call per section, which
           is how the carousel ended up with no entrance at all: its old
           animation targeted `.product-collection__layout`, which V9 set to
           `display: none`. */
        const FROM = {
          up: { y: 24, autoAlpha: 0 },
          left: { x: -28, autoAlpha: 0 },
          right: { x: 28, autoAlpha: 0 },
          scale: { scale: 1.04, autoAlpha: 0 },
        } as const;

        /* React renders a valueless `data-reveal-group` as `="true"`, so the
           attribute can never be trusted as a variant name on its own. */
        const variantOf = (value: string | undefined): keyof typeof FROM =>
          value && value in FROM ? (value as keyof typeof FROM) : "up";

        const reveal = (targets: Element[], variant: keyof typeof FROM, stagger: number) => {
          if (!targets.length) return;
          gsap.set(targets, FROM[variant]);
          ScrollTrigger.batch(targets, {
            start: "top 82%",
            once: true,
            onEnter: (batch) => gsap.to(batch, {
              x: 0, y: 0, scale: 1, autoAlpha: 1,
              duration: 0.7, ease: "power3.out", stagger,
              overwrite: true,
            }),
          });
        };

        for (const variant of Object.keys(FROM) as (keyof typeof FROM)[]) {
          const selector = variant === "up" ? "[data-reveal=''], [data-reveal]:not([data-reveal='left']):not([data-reveal='right']):not([data-reveal='scale'])" : `[data-reveal='${variant}']`;
          reveal(gsap.utils.toArray<Element>(selector), variant, 0);
        }

        /* Groups stagger their own children, so a row of cards arrives as a
           sequence rather than all at once. */
        for (const group of gsap.utils.toArray<HTMLElement>("[data-reveal-group]")) {
          const children = Array.from(group.children);
          reveal(children, variantOf(group.dataset.revealGroup), 0.08);
        }
      }
    }, root);
    document.fonts.ready.then(() => ScrollTrigger.refresh());
    return () => context.revert();
  }, []);

  return (
    <div ref={rootRef} className="site-shell">
      <a className="skip-link" href="#main">Skip to content</a>
      <SmartHeader
        onMenu={() => { closeShop(); setMenuOpen(true); }}
        menuOpen={menuOpen}
        shopOpen={shopOpen}
        shopMode={shopMode}
        onShopOpen={openShop}
        onShopClose={closeShop}
        onShopHoverLeave={scheduleShopClose}
      />

      <main id="main">
        <section id="home" className="hero chapter-screen">
          <div className="hero__media-frame"><ImageSlotVisual slot={heroSlot} className="hero__media" priority /></div>
          <div className="hero__scrim" aria-hidden="true" />
          <div className="hero__copy">
            <p className="eyebrow">Malaysian travel, thoughtfully made</p>
            <h1><span>Designed for</span><em>Your journey</em></h1>
            <p>KIYO is a Malaysia-based premium brand specialising in travel, live-commerce, wholesale distribution, and corporate gifting solutions. We deliver quality, innovation, and reliability for every journey.</p>
            <div className="hero__actions">
              <a className="button button--coral" href="#about">Discover KIYO <ArrowRight aria-hidden="true" /></a>
              <a className="hero__story-link" href="#corporate">Corporate gifting <ArrowRight aria-hidden="true" /></a>
            </div>
          </div>
          <div className="hero__proofs" aria-label="KIYO business highlights">
            {heroProofs.map(({ title, lines, icon: Icon }) => (
              <article className="hero-proof" key={title}>
                <span className="hero-proof__icon"><Icon aria-hidden="true" /></span>
                <div><strong>{title}</strong><p>{lines[0]}<br />{lines[1]}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="about chapter-screen">
          <ImageSlotVisual slot={aboutSlots.warehouse} className="about__background" decorative />
          <div className="about__scrim" aria-hidden="true" />
          <div className="about__copy" data-reveal-group>
            <p className="eyebrow">Who we are</p>
            <h2><span>A Malaysian travel</span> <em>and live-commerce brand</em></h2>
            <p>KIYO Living Sdn. Bhd. is a Malaysia-based travel and live-commerce brand, founded in 2022 and operating from our own warehouse and showroom in Kajang, Selangor.</p>
            <p>We design, manufacture and wholesale premium luggage, bags and travel accessories, and we add custom logo branding for businesses, travel agencies and corporations. From retail and wholesale distribution to corporate gifting and UMRAH programmes, we help customers, agencies and partners move forward together.</p>
            <figure className="about__quote">
              <blockquote>To empower journeys, elevate brands and create lasting impact through innovation and trust.</blockquote>
              <figcaption><strong>Samantha Ng</strong><span>Founder, KIYO Living</span></figcaption>
            </figure>
          </div>
          <ImageSlotVisual slot={aboutSlots.samantha} className="about__portrait" data-reveal="right" />
        </section>

        <section id="glance" className="business-pillars chapter">
          <header className="business-pillars__intro" data-reveal-group>
            <p className="eyebrow">Our core</p>
            <h2><span>Business</span> <em>pillars</em></h2>
            <p>Five pillars. One mission. Delivering excellence at every touchpoint.</p>
            <a href="#products">Explore our solutions <ArrowRight aria-hidden="true" /></a>
          </header>
          <div className="business-pillars__grid" data-reveal-group>
            {businessPillars.map(({ number, title, description, icon: Icon }) => (
              <article className="business-pillar" key={title}>
                <span className="business-pillar__number">{number}</span>
                <Icon aria-hidden="true" />
                <h3>{title}</h3>
                <span className="business-pillar__rule" aria-hidden="true" />
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="products" className="products chapter"><ProductCollectionOverview onShop={() => openShop("press")} /></section>

        <section id="corporate" className="corporate chapter">
          <header className="corporate__intro" data-reveal-group>
            <h2><span>Corporate</span> <em>gifting</em></h2>
            <p>Custom logo printing, thoughtful event gifting, and premium brand experiences designed to leave a lasting impression.</p>
            <a className="button button--outline" href={WHATSAPP_URL} target="_blank" rel="noreferrer">Enquire for corporate gifts <FaWhatsapp aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
          </header>
          <CorporateGiftGallery whatsappUrl={WHATSAPP_URL} />
        </section>

        <section id="services" className="umrah chapter">
          <div className="umrah__layout">
            <div className="umrah__copy" data-reveal-group>
              <p className="eyebrow">UMRAH programme</p>
              <h2><span>The complete</span> <em>UMRAH set</em></h2>
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

          <UmrahProcessFlow />
        </section>

        <section id="location" className="location chapter">
          <header className="location__intro" data-reveal-group><p>Operations, warehouse and distribution</p><h2><span>Built for scale</span> <em>across Malaysia</em></h2><span>KIYO&apos;s end-to-end operations ensure ready stock, efficient fulfilment and reliable delivery, so you can scale with confidence. From warehouse to doorstep, we power businesses nationwide.</span></header>
          <div className="operations-grid" data-reveal-group>
            {operationsCapabilities.map(({ title, description, icon: Icon }) => (
              <article className="operations-card" key={title}>
                <span className="operations-card__icon"><Icon aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>

          <div className="location__body">
            <div className="location__mosaic" data-reveal-group>
              {warehouseSlots.map((slot, index) => (
                <figure className={`location-card location-card--${index + 1}`} key={slot.id} data-sequence={index + 1}>
                  <ImageSlotVisual slot={slot} className="location-card__media" />
                  <figcaption><h3>{warehouseStories[index].title}</h3></figcaption>
                </figure>
              ))}
            </div>
            <aside className="location__details" data-reveal="right">
              <MapPin aria-hidden="true" />
              <p>Warehouse and showroom</p>
              <h3>Kajang,<br />Selangor.</h3>
              <address>
                No. 16, Jalan SC 1,<br />
                Pusat Perindustrian Sungai Chua,<br />
                43000 Kajang, Selangor.
              </address>
              <span><Clock aria-hidden="true" />Monday to Saturday, 9:00am to 6:00pm. Visits by appointment.</span>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">Arrange a visit <ArrowUpRight aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
            </aside>
          </div>
        </section>

        <section id="contact" className="contact chapter">
          <div className="contact__inner">
            <div className="contact__copy" data-reveal-group>
              <h2><span>Start your</span> <em>next journey</em></h2>
              <span>Corporate gifts, UMRAH sets, custom branding and retail enquiries.</span>
              <div className="contact__actions">
                <a className="button button--coral" href={WHATSAPP_URL} target="_blank" rel="noreferrer">Start on WhatsApp <FaWhatsapp aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
                <a className="button button--outline" href="mailto:kiyoliving88@gmail.com">kiyoliving88@gmail.com <Mail aria-hidden="true" /></a>
              </div>
              <SocialLinks />
            </div>
            <div className="contact__visual" data-reveal="scale">
              <ImageSlotVisual slot={warehouseSlots[3]} className="contact__media" />
              <div><MapPin aria-hidden="true" /><span>KIYO Living</span><strong>Kajang, Selangor</strong></div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />

      <WhatsAppDock hidden={menuOpen || shopOpen} />
      <MenuDialog open={menuOpen} onClose={() => setMenuOpen(false)} />
      <ShopFlyout
        open={shopOpen}
        mode={shopMode}
        onClose={closeShop}
        onHoverEnter={clearShopTimer}
        onHoverLeave={scheduleShopClose}
      />
    </div>
  );
}
