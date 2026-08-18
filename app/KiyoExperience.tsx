"use client";

/* Images are pre-sized and pre-compressed in public/images for the static Sites runtime. */
/* eslint-disable @next/next/no-img-element */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Mail,
  MapPin,
  Menu,
  Plane,
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
import {
  CorporateGiftGallery,
  ProductInspector,
  UmrahServiceGallery,
} from "./components/KiyoInteractiveSections";

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

const warehouseGallery = [
  {
    image: "/images/kiyo/warehouse-1.webp",
    alt: "The exterior of KIYO's Shah Alam warehouse and showroom",
    label: "01 · Our environment",
    title: "Warehouse & showroom",
    wide: true,
  },
  {
    image: "/images/kiyo/warehouse-2.webp",
    alt: "Organised luggage stock in KIYO's warehouse",
    label: "02 · Prepared",
    title: "Organised stock",
    wide: false,
  },
  {
    image: "/images/kiyo/warehouse-3.webp",
    alt: "KIYO's luggage showroom with product displays",
    label: "03 · Considered",
    title: "Product showroom",
    wide: false,
  },
  {
    image: "/images/kiyo/warehouse-4.webp",
    alt: "A welcoming KIYO office and client discussion space",
    label: "04 · Connected",
    title: "Team & client space",
    wide: false,
  },
  {
    image: "/images/kiyo/warehouse-5.webp",
    alt: "KIYO's warehouse preparation and packing area",
    label: "05 · In motion",
    title: "Packing & dispatch",
    wide: false,
  },
] as const;

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
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const context = reduceMotion
      ? undefined
      : gsap.context(() => {
          gsap.timeline({ defaults: { ease: "power3.out" } })
            .fromTo(".mobile-menu__top", { y: -18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.42 })
            .fromTo(
              ".mobile-menu__links a",
              { x: -28, autoAlpha: 0 },
              { x: 0, autoAlpha: 1, duration: 0.5, stagger: 0.07 },
              "<0.12",
            )
            .fromTo(".mobile-menu__cta", { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.42 }, "<0.1");
        }, dialog);
    firstLink?.focus();
    return () => {
      context?.revert();
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
          className="hero chapter-screen"
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

        <section id="about" className="chapter chapter-screen about about--founder">
          <div className="about-founder">
            <img className="about-founder__background" src="/images/kiyo/samantha-warehouse.webp" alt="" aria-hidden="true" width="1047" height="941" loading="lazy" decoding="async" />
            <div className="about-founder__wash" aria-hidden="true" />
            <div className="about-founder__copy reveal">
              <p className="eyebrow eyebrow--coral">Behind KIYO</p>
              <h2>Building a Malaysian travel & live-commerce brand.</h2>
              <p>From viral TikTok campaigns to nationwide wholesale distribution, premium corporate gifting, and thoughtful UMRAH-ready travel programmes.</p>
            </div>
            <figure className="about-founder__portrait image-reveal">
              <img src="/images/kiyo/samantha-founder.webp" alt="Samantha Ng, founder of KIYO" width="608" height="921" loading="lazy" decoding="async" />
            </figure>
          </div>
        </section>

        <section id="products" className="chapter chapter-screen chapter--ink products products--inspector">
          <ProductInspector onShop={() => setShopOpen(true)} />
        </section>

        <section id="corporate" className="chapter chapter-screen chapter--black corporate corporate--gallery">
          <div className="corporate-intro corporate-intro--v3 reveal">
            <p className="eyebrow eyebrow--gold">Corporate gifting solutions</p>
            <h2>Gift sets that travel further.</h2>
            <p>Useful, brand-ready sets for clients, teams, events, loyalty programmes and executive gifting.</p>
            <a className="button button--outline" href={WHATSAPP_URL} target="_blank" rel="noreferrer">Enquire for corporate gifts <FaWhatsapp aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
          </div>
          <CorporateGiftGallery whatsappUrl={WHATSAPP_URL} />
        </section>

        <section id="services" className="chapter chapter-screen chapter--sand services services--interactive">
          <div className="umrah-grid umrah-grid--v3">
            <div className="umrah-copy reveal">
              <p className="eyebrow eyebrow--gold">UMRAH agency programme</p>
              <h2>A complete travel set for a meaningful journey.</h2>
              <p>Coordinate luggage, thoughtful travel essentials and agency branding for UMRAH groups with a calm, professional presentation.</p>
              <ul>
                <li><Check aria-hidden="true" /> Coordinated luggage sizes</li>
                <li><Check aria-hidden="true" /> Optional prayer and travel essentials</li>
                <li><Check aria-hidden="true" /> Custom agency logo & branding</li>
                <li><Check aria-hidden="true" /> Group-order & warehouse support</li>
              </ul>
              <a className="button button--ink" href={WHATSAPP_URL} target="_blank" rel="noreferrer">Plan an UMRAH set <FaWhatsapp aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
            </div>
            <UmrahServiceGallery />
          </div>
          <div className="agency-process">
            <div className="agency-process__heading">
              <p>Agency customisation</p>
              <h3>Your agency. Their journey.</h3>
            </div>
            <div className="agency-process__steps" aria-label="Agency customisation process">
              {['Select', 'Brand', 'Approve', 'Deliver'].map((step, index) => (
                <span key={step}><small>{String(index + 1).padStart(2, '0')}</small>{step}</span>
              ))}
            </div>
          </div>
        </section>

        <section id="location" ref={locationRef} className="chapter-screen location">
          <div className="location-head">
            <div><p className="eyebrow eyebrow--teal">Shah Alam · Selangor</p><h2>Built to deliver,<br />across Malaysia.</h2></div>
            <p>A working base for stock, quality checks, order preparation, and conversations about your next travel programme.</p>
          </div>
          <div className="location-track" ref={locationTrackRef}>
            {warehouseGallery.map(({ image, alt, label, title, wide }) => (
              <figure className={`location-card${wide ? " location-card--wide" : ""}`} key={image}>
                <img src={image} alt={alt} width="1440" height="864" loading="lazy" decoding="async" />
                <figcaption><span>{label}</span><strong>{title}</strong></figcaption>
              </figure>
            ))}
            <aside className="location-card location-card--address">
              <MapPin aria-hidden="true" />
              <p>Visit by appointment</p>
              <h3>Shah Alam,<br />Selangor,<br />Malaysia.</h3>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">Arrange a conversation <ArrowUpRight aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
            </aside>
          </div>
        </section>

        <section id="contact" className="chapter-screen contact">
          <div className="contact-orbit" aria-hidden="true"><Plane /></div>
          <p className="eyebrow">Your next journey starts here</p>
          <h2>Let&apos;s build your next<br />journey together.</h2>
          <p className="contact-intro">Tell us what you are planning: corporate gifts, an UMRAH set, custom branding, or a retail enquiry.</p>
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
