"use client";

/* Images are pre-sized and pre-compressed in public/images for the static Sites runtime. */
/* eslint-disable @next/next/no-img-element */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import useEmblaCarousel from "embla-carousel-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Box,
  Check,
  ChevronRight,
  CircleGauge,
  CupSoda,
  LockKeyhole,
  Mail,
  MapPin,
  Menu,
  PackageCheck,
  Palette,
  Plane,
  ShieldCheck,
  Sparkles,
  Usb,
  X,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa6";
import { SiShopee } from "react-icons/si";

const WHATSAPP_URL =
  "https://wa.me/60132767887?text=Hi%20KIYO%2C%20I%27m%20interested%20in%20your%20products%20or%20services.";

const navigation = [
  ["Home", "#home"],
  ["About", "#about"],
  ["Products", "#products"],
  ["Corporate", "#corporate"],
  ["Services", "#services"],
  ["Location", "#location"],
  ["Contact", "#contact"],
] as const;

const corporateSolutions = [
  {
    number: "01",
    title: "Branded luggage sets",
    copy: "A coordinated travel set shaped around your campaign, team, or customer programme.",
    position: "76% center",
  },
  {
    number: "02",
    title: "Executive travel kits",
    copy: "Polished essentials for leadership retreats, client appreciation, and loyalty rewards.",
    position: "58% center",
  },
  {
    number: "03",
    title: "Event & team gifts",
    copy: "Useful travel pieces prepared for launches, annual dinners, roadshows, and staff milestones.",
    position: "42% center",
  },
  {
    number: "04",
    title: "Custom presentation",
    copy: "Colour matching, logo placement, packaging, and a clear approval path before production.",
    position: "88% center",
  },
];

const customSteps = [
  {
    title: "Select",
    copy: "Choose the luggage format, size mix, colour direction, and practical accessories.",
    icon: Box,
  },
  {
    title: "Brand",
    copy: "Apply your identity through print, embossing, colour matching, or curated packaging.",
    icon: Palette,
  },
  {
    title: "Approve",
    copy: "Review the proposed treatment and confirm the details before production begins.",
    icon: Check,
  },
  {
    title: "Deliver",
    copy: "Receive a coordinated order prepared for your event, programme, team, or travellers.",
    icon: PackageCheck,
  },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/kiyoliving_",
    icon: FaInstagram,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/kiyoliving",
    icon: FaFacebookF,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@kiyoliving",
    icon: FaTiktok,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@kiyoliving",
    icon: FaYoutube,
  },
];

type DialogProps = {
  open: boolean;
  onClose: () => void;
};

function MenuDialog({ open, onClose }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;
    dialog.showModal();
    const firstLink = dialog.querySelector<HTMLAnchorElement>("a");
    firstLink?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
    };
  }, [open]);

  return (
    <dialog
      id="primary-menu"
      ref={dialogRef}
      className="mobile-menu"
      aria-label="Primary navigation"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className="mobile-menu__top">
        <img src="/images/kiyo-logo.png" alt="KIYO" width="653" height="258" />
        <button className="icon-button icon-button--dark" onClick={onClose} aria-label="Close menu">
          <X aria-hidden="true" />
        </button>
      </div>
      <nav className="mobile-menu__links">
        {navigation.map(([label, href], index) => (
          <a key={href} href={href} onClick={onClose}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            {label}
            <ArrowUpRight aria-hidden="true" />
          </a>
        ))}
      </nav>
      <a className="button button--coral mobile-menu__cta" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
        Discuss a project
        <FaWhatsapp aria-hidden="true" />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
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
    return () => {
      if (dialog.open) dialog.close();
    };
  }, [open]);

  return (
    <dialog
      id="shop-dialog"
      ref={dialogRef}
      className="shop-dialog"
      aria-labelledby="shop-dialog-title"
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <button className="shop-dialog__close icon-button" onClick={onClose} aria-label="Close shop options">
        <X aria-hidden="true" />
      </button>
      <p className="eyebrow eyebrow--coral">Shop KIYO</p>
      <h2 id="shop-dialog-title">Choose your shopping platform.</h2>
      <p>Browse current retail selections and complete your purchase on KIYO&apos;s official stores.</p>
      <div className="shop-dialog__links">
        <a href="https://shopee.com.my/kiyoliving" target="_blank" rel="noreferrer">
          <span className="shop-dialog__icon shop-dialog__icon--shopee"><SiShopee aria-hidden="true" /></span>
          <span><strong>Shopee</strong><small>KIYO Living official store</small></span>
          <ArrowUpRight aria-hidden="true" />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        <a href="https://www.tiktok.com/@kiyoliving" target="_blank" rel="noreferrer">
          <span className="shop-dialog__icon shop-dialog__icon--tiktok"><FaTiktok aria-hidden="true" /></span>
          <span><strong>TikTok Shop</strong><small>Discover KIYO on TikTok</small></span>
          <ArrowUpRight aria-hidden="true" />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </dialog>
  );
}

function ProductCarousel() {
  const [viewportRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const update = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    update();
    emblaApi.on("select", update);
    emblaApi.on("reInit", update);
    return () => {
      emblaApi.off("select", update);
      emblaApi.off("reInit", update);
    };
  }, [emblaApi]);

  const slides = [
    { name: "Cabin", note: "Compact, quick-moving, overhead-ready", position: "37% center" },
    { name: "Check-in", note: "More room for longer journeys", position: "61% center" },
    { name: "Travel set", note: "A coordinated family of practical sizes", position: "82% center" },
  ];

  return (
    <div className="lineup" role="region" aria-label="KIYO luggage formats">
      <div className="lineup__toolbar">
        <p>Explore the lineup</p>
        <div className="lineup__controls">
          <button onClick={() => emblaApi?.scrollPrev()} aria-label="Previous luggage format"><ArrowLeft aria-hidden="true" /></button>
          <span aria-live="polite">{String(selectedIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span>
          <button onClick={() => emblaApi?.scrollNext()} aria-label="Next luggage format"><ArrowRight aria-hidden="true" /></button>
        </div>
      </div>
      <div className="lineup__viewport" ref={viewportRef}>
        <div className="lineup__track">
          {slides.map((slide, index) => (
            <article className="lineup__slide" key={slide.name} aria-label={`${index + 1} of ${slides.length}: ${slide.name}`}>
              <div className="lineup__image">
                <img
                  src="/images/product-lineup.webp"
                  alt="A studio lineup of modern hard-shell luggage in KIYO colours"
                  width="1536"
                  height="1024"
                  style={{ objectPosition: slide.position }}
                />
              </div>
              <div className="lineup__copy">
                <h3>{slide.name}</h3>
                <p>{slide.note}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function SocialLinks({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "socials socials--compact" : "socials"} aria-label="KIYO social media">
      {socialLinks.map(({ label, href, icon: Icon }) => (
        <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={`${label} (opens in a new tab)`}>
          <Icon aria-hidden="true" />
          {!compact && <span>{label}</span>}
        </a>
      ))}
    </div>
  );
}

export function KiyoExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const torchFrame = useRef<number | null>(null);
  const torchPoint = useRef({ x: 68, y: 38 });
  const locationRef = useRef<HTMLElement>(null);
  const locationTrackRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [headerCompact, setHeaderCompact] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  const updateTorch = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    const hero = heroRef.current;
    if (!hero) return;
    const bounds = hero.getBoundingClientRect();
    torchPoint.current = {
      x: ((event.clientX - bounds.left) / bounds.width) * 100,
      y: ((event.clientY - bounds.top) / bounds.height) * 100,
    };
    if (torchFrame.current !== null) return;
    torchFrame.current = window.requestAnimationFrame(() => {
      hero.style.setProperty("--torch-x", `${torchPoint.current.x}%`);
      hero.style.setProperty("--torch-y", `${torchPoint.current.y}%`);
      hero.style.setProperty("--torch-opacity", "1");
      torchFrame.current = null;
    });
  }, []);

  useEffect(() => {
    let frame: number | null = null;
    const handleScroll = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(() => {
        setHeaderCompact(window.scrollY > 72);
        frame = null;
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cancelled = false;

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((element) => {
        gsap.fromTo(
          element,
          { y: reduceMotion ? 0 : 46, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: reduceMotion ? 0.01 : 1.05,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 86%", once: true },
          },
        );
      });

      const words = gsap.utils.toArray<HTMLElement>(".manifesto-word");
      if (words.length) {
        gsap.fromTo(
          words,
          { opacity: reduceMotion ? 1 : 0.13 },
          {
            opacity: 1,
            stagger: 0.045,
            ease: "none",
            scrollTrigger: reduceMotion
              ? undefined
              : { trigger: ".manifesto", start: "top 74%", end: "bottom 48%", scrub: 0.6 },
          },
        );
      }

      gsap.utils.toArray<HTMLElement>(".image-reveal").forEach((element) => {
        gsap.fromTo(
          element,
          { scale: reduceMotion ? 1 : 0.88, opacity: reduceMotion ? 1 : 0.55 },
          {
            scale: 1,
            opacity: 1,
            ease: "none",
            scrollTrigger: reduceMotion
              ? undefined
              : { trigger: element, start: "top 90%", end: "center 52%", scrub: 0.7 },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".custom-card").forEach((card, index) => {
        if (reduceMotion) return;
        gsap.fromTo(
          card,
          { y: 72, scale: 0.96 },
          {
            y: 0,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top 92%",
              end: "top 48%",
              scrub: 0.6,
            },
          },
        );
        if (index < customSteps.length - 1) {
          gsap.to(card, {
            scale: 0.975,
            opacity: 0.72,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "bottom 35%",
              end: "bottom 10%",
              scrub: true,
            },
          });
        }
      });
    }, root);

    const media = gsap.matchMedia();
    media.add(
      "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      () => {
        const lenis = new Lenis({ duration: 1.08, smoothWheel: true, syncTouch: false });
        const updateScroll = () => ScrollTrigger.update();
        const tick = (time: number) => lenis.raf(time * 1000);
        lenis.on("scroll", updateScroll);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        const section = locationRef.current;
        const track = locationTrackRef.current;
        let horizontalTween: gsap.core.Tween | undefined;
        if (section && track) {
          const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
          horizontalTween = gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${distance() + window.innerHeight * 0.55}`,
              scrub: 0.8,
              pin: true,
              invalidateOnRefresh: true,
            },
          });
        }

        return () => {
          horizontalTween?.scrollTrigger?.kill();
          horizontalTween?.kill();
          gsap.ticker.remove(tick);
          lenis.off("scroll", updateScroll);
          lenis.destroy();
        };
      },
    );

    document.fonts.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      if (torchFrame.current !== null) window.cancelAnimationFrame(torchFrame.current);
      media.revert();
      context.revert();
    };
  }, []);

  const manifesto =
    "More than luggage. A travel partner for brands, teams, and meaningful journeys.";

  return (
    <div ref={rootRef} className="site-shell">
      <a className="skip-link" href="#main">Skip to content</a>

      <header className={`site-header${headerCompact ? " site-header--compact" : ""}`}>
        <a className="brand" href="#home" aria-label="KIYO home">
          <img src="/images/kiyo-logo.png" alt="KIYO" width="653" height="258" />
        </a>
        <div className="header-actions">
          <button
            className="text-button"
            onClick={() => setShopOpen(true)}
            aria-haspopup="dialog"
            aria-controls="shop-dialog"
          >
            Shop KIYO <ArrowUpRight aria-hidden="true" />
          </button>
          <button
            className="menu-trigger"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-controls="primary-menu"
            aria-expanded={menuOpen}
          >
            <span>Menu</span>
            <Menu aria-hidden="true" />
          </button>
        </div>
      </header>

      <main id="main">
        <section
          id="home"
          ref={heroRef}
          className="hero"
          onPointerMove={updateTorch}
          onPointerDown={updateTorch}
          onPointerLeave={() => heroRef.current?.style.setProperty("--torch-opacity", "0.16")}
        >
          <div className="hero-media" aria-hidden="true">
            <img className="hero-image hero-image--dark" src="/images/hero-dark.webp" alt="" width="1448" height="1086" />
            <img className="hero-image hero-image--light" src="/images/hero-light.webp" alt="" width="1448" height="1086" />
            <div className="hero-vignette" />
            <div className="hero-grid" />
          </div>
          <div className="hero-content">
            <p className="eyebrow">KIYO · MALAYSIA</p>
            <h1>Designed for every journey.<span>Built for business.</span></h1>
            <p className="hero-intro">Luggage, corporate gifts, and travel sets shaped with practical thinking and a polished point of view.</p>
            <div className="hero-actions">
              <a className="button button--coral" href="#corporate">Explore corporate solutions <ArrowDown aria-hidden="true" /></a>
              <button
                className="button button--ghost"
                onClick={() => setShopOpen(true)}
                aria-haspopup="dialog"
                aria-controls="shop-dialog"
              >
                Shop KIYO <ArrowUpRight aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="torch-hint" aria-hidden="true"><span /> Move to reveal</div>
          <a className="hero-scroll" href="#about" aria-label="Scroll to about KIYO"><span>Scroll</span><ArrowDown aria-hidden="true" /></a>
        </section>

        <div className="audience-marquee" aria-label="KIYO serves banks, travel agencies, corporate teams and everyday travellers">
          <div className="audience-marquee__track">
            {["Banks", "Corporate teams", "Travel agencies", "UMRAH groups", "Loyalty programmes", "Everyday travellers"].map((item) => (
              <span key={item}>{item}<i /></span>
            ))}
            {["Banks", "Corporate teams", "Travel agencies", "UMRAH groups", "Loyalty programmes", "Everyday travellers"].map((item) => (
              <span key={`copy-${item}`} aria-hidden="true">{item}<i /></span>
            ))}
          </div>
        </div>

        <section id="about" className="chapter chapter--light about">
          <div className="section-heading reveal">
            <p className="eyebrow eyebrow--coral">Malaysia-born. Journey-minded.</p>
            <h2>We make travel feel considered—from the first impression to the final mile.</h2>
          </div>
          <div className="about-grid">
            <p className="manifesto">
              {manifesto.split(" ").map((word, index) => (
                <span className="manifesto-word" key={`${word}-${index}`}>{word}{" "}</span>
              ))}
            </p>
            <div className="about-note reveal">
              <p>KIYO brings together retail luggage, bulk gifting, custom branding, and UMRAH-ready sets in one focused Malaysian travel brand.</p>
              <div className="proof-list" aria-label="KIYO capabilities">
                <span><ShieldCheck aria-hidden="true" /> Practical product thinking</span>
                <span><Sparkles aria-hidden="true" /> Brand-ready presentation</span>
                <span><MapPin aria-hidden="true" /> Shah Alam, Selangor</span>
              </div>
            </div>
          </div>
        </section>

        <section id="products" className="chapter chapter--ink products">
          <div className="section-heading section-heading--split reveal">
            <div>
              <p className="eyebrow eyebrow--teal">Luggage collection</p>
              <h2>Engineered for the journey ahead.</h2>
            </div>
            <p>Durable shells, smooth movement, and useful details—presented as a focused collection rather than an endless catalogue.</p>
          </div>

          <div className="product-bento">
            <article className="product-bento__visual image-reveal">
              <img src="/images/product-lineup.webp" alt="Four modern hard-shell luggage cases in navy, silver, coral and pale aqua" width="1536" height="1024" />
              <div className="product-bento__caption"><span>KIYO colour story</span><strong>Travel, coordinated.</strong></div>
            </article>
            <article className="feature-card feature-card--aqua reveal"><ShieldCheck aria-hidden="true" /><span>Shell</span><h3>PC + ABS</h3><p>Balanced for everyday durability and practical handling.</p></article>
            <article className="feature-card feature-card--navy reveal"><CircleGauge aria-hidden="true" /><span>Movement</span><h3>360° wheels</h3><p>Made to glide through terminals, lobbies, and city streets.</p></article>
            <article className="feature-card feature-card--coral reveal"><LockKeyhole aria-hidden="true" /><span>Security</span><h3>TSA lock</h3><p>A familiar travel-ready locking format for added confidence.</p></article>
            <article className="feature-card feature-card--gold reveal"><div className="feature-card__icons"><Usb aria-hidden="true" /><CupSoda aria-hidden="true" /></div><span>Convenience</span><h3>Useful details</h3><p>Selected models include USB access and an integrated cup holder.</p></article>
          </div>

          <ProductCarousel />

          <div className="section-cta reveal">
            <p>Ready to browse the current collection?</p>
            <button
              className="button button--light"
              onClick={() => setShopOpen(true)}
              aria-haspopup="dialog"
              aria-controls="shop-dialog"
            >
              Shop KIYO <ArrowUpRight aria-hidden="true" />
            </button>
          </div>
        </section>

        <section id="corporate" className="chapter chapter--black corporate">
          <div className="corporate-intro reveal">
            <div>
              <p className="eyebrow eyebrow--gold">Corporate & bulk orders</p>
              <h2>Corporate gifts that travel further.</h2>
            </div>
            <div>
              <p>Give clients, teams, and travellers something useful—made more memorable with your brand.</p>
              <a className="button button--outline" href={WHATSAPP_URL} target="_blank" rel="noreferrer">Discuss on WhatsApp <FaWhatsapp aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
            </div>
          </div>
          <div className="corporate-panels" role="list" aria-label="Corporate gift solutions">
            {corporateSolutions.map((solution) => (
              <article className="corporate-panel" key={solution.number} role="listitem" tabIndex={0}>
                <img src="/images/product-lineup.webp" alt="" aria-hidden="true" width="1536" height="1024" style={{ objectPosition: solution.position }} />
                <div className="corporate-panel__wash" />
                <span className="corporate-panel__number">{solution.number}</span>
                <div className="corporate-panel__copy"><h3>{solution.title}</h3><p>{solution.copy}</p><ChevronRight aria-hidden="true" /></div>
              </article>
            ))}
          </div>
        </section>

        <section id="services" className="chapter chapter--sand services">
          <div className="umrah-grid">
            <div className="umrah-copy reveal">
              <p className="eyebrow eyebrow--gold">UMRAH travel sets</p>
              <h2>A complete travel set for a meaningful journey.</h2>
              <p>Coordinate luggage and thoughtful travel essentials for UMRAH groups, agencies, and gifting programmes—with a calm, respectful presentation.</p>
              <ul>
                <li><Check aria-hidden="true" /> Coordinated luggage sizes</li>
                <li><Check aria-hidden="true" /> Optional prayer and travel essentials</li>
                <li><Check aria-hidden="true" /> Agency and group branding</li>
              </ul>
              <a className="button button--ink" href={WHATSAPP_URL} target="_blank" rel="noreferrer">Plan an UMRAH set <FaWhatsapp aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
            </div>
            <div className="umrah-gallery">
              <figure className="image-reveal umrah-gallery__travel">
                <img src="/images/umrah-travel.webp" alt="An UMRAH traveller at an airport with two KIYO luggage cases" width="1088" height="1360" />
                <figcaption><span>01</span><strong>Journey set</strong></figcaption>
              </figure>
              <figure className="image-reveal umrah-gallery__gift">
                <img src="/images/umrah-gifts.webp" alt="A KIYO UMRAH luggage set arranged with prayer and travel essentials" width="1088" height="1360" />
                <figcaption><span>02</span><strong>Included essentials</strong></figcaption>
              </figure>
            </div>
          </div>

          <div className="custom-service">
            <div className="custom-service__heading reveal">
              <p className="eyebrow eyebrow--teal">Custom logo service</p>
              <h2>Your logo.<br /><em>Their journey.</em></h2>
              <p>One clear path from product selection to a finished, brand-ready order.</p>
            </div>
            <div className="custom-stack">
              {customSteps.map(({ title, copy, icon: Icon }, index) => (
                <article className="custom-card" key={title} style={{ "--card-offset": `${index}rem` } as CSSProperties}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <Icon aria-hidden="true" />
                  <div><h3>{title}</h3><p>{copy}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="location" ref={locationRef} className="location">
          <div className="location-head">
            <div><p className="eyebrow eyebrow--teal">Shah Alam · Selangor</p><h2>Built to deliver,<br />across Malaysia.</h2></div>
            <p>A working base for stock, quality checks, order preparation, and conversations about your next travel programme.</p>
          </div>
          <div className="location-track" ref={locationTrackRef}>
            <figure className="location-card location-card--wide">
              <img src="/images/facility.webp" alt="A modern KIYO luggage warehouse and showroom in Shah Alam" width="1536" height="1024" />
              <figcaption><span>Our environment</span><strong>Showroom & operations</strong></figcaption>
            </figure>
            <figure className="location-card">
              <img src="/images/facility-stock.webp" alt="Organised shelves of luggage prepared for customer and corporate orders" width="845" height="1024" />
              <figcaption><span>Prepared</span><strong>Organised stock</strong></figcaption>
            </figure>
            <figure className="location-card">
              <img src="/images/facility-quality.webp" alt="A clean luggage quality-control and packing workspace" width="1106" height="870" />
              <figcaption><span>Considered</span><strong>Quality & packing</strong></figcaption>
            </figure>
            <aside className="location-card location-card--address">
              <MapPin aria-hidden="true" />
              <p>Visit by appointment</p>
              <h3>Shah Alam,<br />Selangor,<br />Malaysia.</h3>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">Arrange a conversation <ArrowUpRight aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
            </aside>
          </div>
        </section>

        <section id="contact" className="contact">
          <div className="contact-orbit" aria-hidden="true"><Plane /></div>
          <p className="eyebrow">Your next journey starts here</p>
          <h2>Let&apos;s build your next<br />journey together.</h2>
          <p className="contact-intro">Tell us what you are planning—corporate gifts, an UMRAH set, custom branding, or a retail enquiry.</p>
          <div className="contact-actions">
            <a className="button button--ink" href={WHATSAPP_URL} target="_blank" rel="noreferrer">Start on WhatsApp <FaWhatsapp aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
            <a className="button button--ghost-dark" href="mailto:hello@kiyo.com.my">hello@kiyo.com.my <Mail aria-hidden="true" /></a>
          </div>
          <SocialLinks />
        </section>
      </main>

      <footer ref={footerRef} className="site-footer">
        <a className="brand brand--footer" href="#home" aria-label="Back to KIYO home"><img src="/images/kiyo-logo.png" alt="KIYO" width="653" height="258" /></a>
        <p>Practical travel, presented with purpose.</p>
        <div className="footer-links">
          <a href="#products">Products</a><a href="#corporate">Corporate</a><a href="#services">Services</a><a href="#location">Location</a>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} KIYO Living. All rights reserved.</span><SocialLinks compact /></div>
      </footer>

      <a
        className={`whatsapp-float${footerVisible ? " whatsapp-float--raised" : ""}${menuOpen || shopOpen ? " whatsapp-float--hidden" : ""}`}
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with KIYO on WhatsApp (opens in a new tab)"
      >
        <span className="whatsapp-float__tooltip" aria-hidden="true">Chat with KIYO</span><FaWhatsapp aria-hidden="true" />
      </a>

      <MenuDialog open={menuOpen} onClose={() => setMenuOpen(false)} />
      <ShopDialog open={shopOpen} onClose={() => setShopOpen(false)} />
    </div>
  );
}
