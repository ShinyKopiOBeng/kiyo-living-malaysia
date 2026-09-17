"use client";

/* Images are pre-sized and compressed in public for the static runtime. */
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowUpRight, BadgeCheck, Menu, PackageCheck, Warehouse, Wrench, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { ChooseStep, DeliverStep, PersonaliseStep } from "./components/HowItWorks";
import { CorporateGiftSets, UmrahGiftSets } from "./components/KiyoInteractiveSections";
import { QuoteSection } from "./components/QuoteSection";
import { ClientProof, FounderAndAwards, ProofStrip } from "./components/TrustSections";
import { RetailFlyout, RetailProvider, RetailTrigger } from "./components/RetailFlyout";
import { ImageSlotVisual } from "./components/ImagePlaceholder";
import { heroSlot, warehouseBandSlot } from "./components/imageSlots";
import { scrollToSection } from "./components/scroll";
import { GENERAL_MESSAGE, SHOPEE_URL, SiteFooter, WHATSAPP_URL, whatsappLink } from "./components/SiteFooter";

/* In the order the chapters run. The quotation is not a nav item: it is the
   primary button beside the nav, on every screen. */
const navigation = [
  ["UMRAH", "#umrah"],
  ["Corporate", "#corporate"],
  ["How it works", "#choose"],
  ["Clients", "#clients"],
  ["About", "#about"],
] as const;

/**
 * Which nav item a chapter marks.
 *
 * Three chapters share one item: the steps are `#choose`, `#personalise` and
 * `#deliver`, and without this grouping the marker would go blank for the
 * longest stretch of the page. The hero, the warehouse band and the quotation
 * mark nothing, because none of them is a destination in the nav.
 */
const CHAPTER_NAV: Record<string, string> = {
  umrah: "#umrah",
  corporate: "#corporate",
  choose: "#choose",
  personalise: "#choose",
  deliver: "#choose",
  clients: "#clients",
  about: "#about",
};

/**
 * Mark the chapter the reader is in.
 *
 * The observer ignores the height of the header and the lower half of the
 * viewport, so the chapter that gets marked is the one at reading height rather
 * than the one merely touching the screen, and the topmost intersecting chapter
 * wins. Nothing is marked above the first chapter, which is correct: the hero
 * is not in the nav.
 */
function useCurrentChapter() {
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    const sections = Object.keys(CHAPTER_NAV)
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null);
    if (!sections.length) return;

    const rem = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const headerPx = Math.round(4.5 * rem);
    const visible = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.boundingClientRect.top);
          else visible.delete(entry.target.id);
        }
        if (!visible.size) return;
        const [topmost] = [...visible.entries()].sort((a, b) => a[1] - b[1]);
        setCurrent(CHAPTER_NAV[topmost[0]] ?? null);
      },
      { rootMargin: `-${headerPx}px 0px -55% 0px`, threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return current;
}

/* The four things that happen inside the building, called out under the band. */
const capabilities = [
  { label: "Warehouse", icon: Warehouse },
  { label: "Customisation", icon: Wrench },
  { label: "QC", icon: BadgeCheck },
  { label: "Fulfilment", icon: PackageCheck },
] as const;

type DialogProps = { open: boolean; onClose: () => void };

function MenuDialog({ open, onClose, current }: DialogProps & { current: string | null }) {
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
    <dialog ref={dialogRef} id="primary-menu" className="mobile-menu" aria-label="Primary navigation" onCancel={(event) => { event.preventDefault(); onClose(); }}>
      <div className="mobile-menu__top">
        <img src="/images/kiyo-logo.svg" alt="KIYO" width="212" height="86" />
        <button className="icon-button" onClick={onClose} aria-label="Close menu"><X aria-hidden="true" /></button>
      </div>
      <nav className="mobile-menu__links">
        {navigation.map(([label, href]) => (
          <a key={href} href={href} onClick={onClose} aria-current={href === current ? "true" : undefined}>
            {label}<ArrowUpRight aria-hidden="true" />
          </a>
        ))}
        <a href={SHOPEE_URL} target="_blank" rel="noreferrer" onClick={onClose}>Retail stores<ArrowUpRight aria-hidden="true" /></a>
      </nav>
      <a className="button button--coral mobile-menu__cta" href="#quote" onClick={onClose}>
        Request a quote <ArrowRight aria-hidden="true" />
      </a>
    </dialog>
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

function SmartHeader({ onMenu, menuOpen, current }: { onMenu: () => void; menuOpen: boolean; current: string | null }) {
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
      <a className="brand" href="#home" aria-label="KIYO home"><img src="/images/kiyo-logo.svg" alt="KIYO" width="212" height="86" /></a>
      <nav className="desktop-navigation" aria-label="Primary navigation">
        {navigation.map(([label, href]) => (
          <a key={href} href={href} aria-current={href === current ? "true" : undefined}>{label}</a>
        ))}
      </nav>
      <div className="header-actions">
        <RetailTrigger />
        <a className="button button--coral header-cta" href="#quote">
          Request a quote
        </a>
        <button className="menu-trigger" type="button" onClick={onMenu} aria-label="Open menu" aria-haspopup="dialog" aria-controls="primary-menu" aria-expanded={menuOpen}><span>Menu</span><Menu aria-hidden="true" /></button>
      </div>
    </header>
  );
}

export function KiyoExperience() {
  const currentChapter = useCurrentChapter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  /**
   * Own every in-page anchor click.
   *
   * These links are same-document fragments on a one-page site, but the router
   * treats them as navigations and asks the server for an RSC payload. A static
   * host has no RSC endpoint, so the request 404s and the router's error path
   * assigns `window.location.href`, which fires popstate, which navigates
   * again: an endless loop. Every iteration calls `scrollIntoView` on the
   * fragment target, so the page yanks itself back to the anchor and the user
   * cannot scroll away from it.
   *
   * Measured on the deployed site: one nav click produced 195 popstate events
   * and 193 scrollIntoView calls and still climbing. Locally the 404 returns
   * instantly, so the loop burns out before it is noticeable, which is why this
   * only looked like a production bug.
   *
   * Handling the scroll here in the capture phase means the router never sees
   * the click, and it also lets the fixed header be accounted for properly.
   */
  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as Element | null)?.closest?.("a");
      const href = anchor?.getAttribute("href");
      if (!anchor || !href || !href.startsWith("#") || href.length < 2) return;
      if (anchor.hasAttribute("target") || anchor.hasAttribute("download")) return;

      const id = decodeURIComponent(href.slice(1));
      if (!document.getElementById(id)) return;

      event.preventDefault();
      scrollToSection(id);
    };

    document.addEventListener("click", onDocumentClick, { capture: true });
    return () => document.removeEventListener("click", onDocumentClick, { capture: true });
  }, []);

  /**
   * The scroll-reveal system.
   *
   * This used to be driven by batched scroll triggers, which measure every
   * start position against the page height at the moment the trigger is made. Photographs
   * below the fold have no intrinsic box until they load, so the page grew
   * underneath the triggers and whichever chapters happened to sit past the
   * stale measurement never reached their start and stayed at `autoAlpha: 0`
   * for good. It was a race, so it stranded a different set of sections on
   * every load: the builder one run, the clients, founder and visit chapters
   * the next.
   *
   * An IntersectionObserver has no precomputed geometry to go stale. The
   * browser re-evaluates it as layout changes, and an element that is already
   * on screen when it is observed fires immediately, so nothing can be left
   * invisible.
   */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const FROM = {
      up: { y: 24, autoAlpha: 0 },
      left: { x: -28, autoAlpha: 0 },
      right: { x: 28, autoAlpha: 0 },
      scale: { scale: 1.04, autoAlpha: 0 },
    } as const;

    type Variant = keyof typeof FROM;

    /* React renders a valueless `data-reveal-group` as `="true"`, so the
       attribute can never be trusted as a variant name on its own. */
    const variantOf = (value: string | undefined): Variant =>
      value && value in FROM ? (value as Variant) : "up";

    const targets = new Map<Element, { variant: Variant; delay: number }>();
    const claim = (element: Element, variant: Variant, delay: number) => {
      if (!targets.has(element)) targets.set(element, { variant, delay });
    };

    for (const variant of Object.keys(FROM) as Variant[]) {
      const selector = variant === "up"
        ? "[data-reveal=''], [data-reveal]:not([data-reveal='left']):not([data-reveal='right']):not([data-reveal='scale'])"
        : `[data-reveal='${variant}']`;
      for (const element of root.querySelectorAll(selector)) claim(element, variant, 0);
    }

    /* Groups stagger their own children, so a row of cards arrives as a
       sequence rather than all at once. */
    for (const group of root.querySelectorAll<HTMLElement>("[data-reveal-group]")) {
      const variant = variantOf(group.dataset.revealGroup);
      Array.from(group.children).forEach((child, index) => claim(child, variant, index * 0.08));
    }

    for (const [element, { variant }] of targets) gsap.set(element, FROM[variant]);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const meta = targets.get(entry.target);
          observer.unobserve(entry.target);
          targets.delete(entry.target);
          gsap.to(entry.target, {
            x: 0, y: 0, scale: 1, autoAlpha: 1,
            duration: 0.7, ease: "power3.out", delay: meta?.delay ?? 0,
            overwrite: true,
            /* Hand the element back to the stylesheet once it has arrived. The
               tween finishes by writing `opacity: 1` and a transform inline,
               and an inline style outranks any rule, so every CSS hover state
               on a revealed element was silently dead: the gift showcase could
               not dim its unhovered cards. Clearing the props it set restores
               that without changing the resting appearance. */
            onComplete: () => gsap.set(entry.target, { clearProps: "opacity,visibility,transform" }),
          });
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    for (const element of targets.keys()) observer.observe(element);

    return () => {
      observer.disconnect();
      for (const element of targets.keys()) gsap.set(element, { clearProps: "all" });
    };
  }, []);

  /* The hero is above the fold on every viewport, so it plays on mount rather
     than waiting to be scrolled into view. */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .fromTo(".hero__media", { scale: 1.025, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.05 })
        .fromTo(".hero__copy > *", { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.72, stagger: 0.08 }, "<0.14");
    }, rootRef);
    return () => context.revert();
  }, []);

  return (
    <RetailProvider>
    <div ref={rootRef} className="site-shell">
      <a className="skip-link" href="#main">Skip to content</a>
      <SmartHeader onMenu={() => setMenuOpen(true)} menuOpen={menuOpen} current={currentChapter} />

      <main id="main">
        {/* 01 -------------------------------------------------------------- */}
        <section id="home" className="hero">
          <div className="hero__media-frame"><ImageSlotVisual slot={heroSlot} className="hero__media" priority /></div>
          <div className="hero__scrim" aria-hidden="true" />
          <div className="hero__copy">
            <h1><span>Designed for</span><span className="hero__payoff">your journey.</span></h1>
            <p>Premium luggage, corporate gift sets and UMRAH programmes, customised and delivered from Kajang.</p>
            <div className="hero__actions">
              <a className="button button--coral" href="#quote">
                Request a quote <ArrowRight aria-hidden="true" />
              </a>
              <a className="button button--ghost" href="#umrah">
                See the gift sets <ArrowRight aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        {/* 02 -------------------------------------------------------------- */}
        <section id="warehouse" className="scale">
          <ImageSlotVisual slot={warehouseBandSlot} className="scale__media" decorative />
          <div className="scale__scrim" aria-hidden="true" />
          <div className="scale__copy" data-reveal-group>
            <h2 className="scale__headline">
              <span><em>Designed</em> here.</span>
              <span><em>Prepared</em> here.</span>
              <span><em>Delivered</em> from here.</span>
            </h2>
            <p>Kajang, Selangor</p>
          </div>
          <ul className="scale__capabilities">
            {capabilities.map(({ label, icon: Icon }) => (
              <li key={label}><Icon aria-hidden="true" />{label}</li>
            ))}
          </ul>
        </section>

        {/* The four numbers, between the band and the first chapter. */}
        <ProofStrip />

        {/* 03 -------------------------------------------------------------- */}
        <UmrahGiftSets />

        {/* 04 -------------------------------------------------------------- */}
        <CorporateGiftSets />

        {/* 05, 06, 07 ------------------------------------------------------ */}
        <ChooseStep />
        <PersonaliseStep />
        <DeliverStep />

        {/* 08 -------------------------------------------------------------- */}
        <QuoteSection />

        {/* 09 -------------------------------------------------------------- */}
        <ClientProof />

        {/* 10 -------------------------------------------------------------- */}
        <FounderAndAwards />

        <section id="contact" className="closer">
          <div className="closer__copy" data-reveal-group>
            <h2>Ready to start?</h2>
            <p>Tell us your programme. We&apos;ll handle the rest.</p>
          </div>
          <div className="closer__actions" data-reveal>
            <a className="button button--coral" href="#quote">Request a quote <ArrowRight aria-hidden="true" /></a>
            <a className="button button--outline" href={whatsappLink(GENERAL_MESSAGE)} target="_blank" rel="noreferrer">
              WhatsApp <FaWhatsapp aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </section>
      </main>

      {/* 11 --------------------------------------------------------------- */}
      <SiteFooter />

      <WhatsAppDock hidden={menuOpen} />
      <MenuDialog open={menuOpen} onClose={() => setMenuOpen(false)} current={currentChapter} />
      <RetailFlyout />
    </div>
    </RetailProvider>
  );
}
