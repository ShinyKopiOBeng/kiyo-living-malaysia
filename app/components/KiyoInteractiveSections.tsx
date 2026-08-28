"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ArrowLeft, ArrowRight, ArrowUpRight, Backpack, Check, Expand, Luggage, ShieldCheck, ShoppingBag, Tag, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { ImageSlotVisual } from "./ImagePlaceholder";
import { ProductCarousel } from "./ProductCarousel";
import { corporateSlots, umrahSlots, type ImageSlot } from "./imageSlots";

/* The catalogue is luggage, bags and accessories, so the section says so
   rather than leading on luggage alone. Copy is KIYO's own. */
const productCategories = [
  { title: "Cabin & Check-in Luggage", description: "Stylish, lightweight, and engineered for smooth travel anywhere.", icon: Luggage },
  { title: "Bags & Backpacks", description: "Business, commuter and weekender styles built for daily carry.", icon: Backpack },
  { title: "Travel Accessories", description: "Smart, functional essentials that keep you organised on the go.", icon: Tag },
  { title: "Durable Everyday Travel", description: "Built with premium materials for long-lasting performance you can trust.", icon: ShieldCheck },
] as const;

export function ProductCollectionOverview({ onShop }: { onShop: () => void }) {
  return (
    <div className="product-collection" aria-label="KIYO travel and lifestyle collection">
      <header className="product-collection__intro" data-reveal-group>
        <h2><span>Travel &amp; lifestyle</span> <em>collection</em></h2>
        <p>Luggage, bags and travel accessories, curated for style, durability, and every journey.</p>
      </header>

      <ProductCarousel onShop={onShop} />

      <div className="product-categories" data-reveal-group>
        {productCategories.map(({ title, description, icon: Icon }) => (
          <article className="product-category" key={title}>
            <span className="product-category__icon"><Icon aria-hidden="true" /></span>
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </div>

      <aside className="product-collection__proof" data-reveal>
        <div className="product-collection__proof-copy">
          <ShoppingBag aria-hidden="true" />
          <h3>Retail &amp; wholesale ready</h3>
          <p>From individual travellers to global partners, KIYO delivers premium quality, reliable supply, and exceptional value. We manufacture, design and wholesale our own range, and add custom logo branding for businesses, travel agencies and corporations.</p>
        </div>
        <button className="button button--ink" type="button" onClick={onShop}>Explore products <ArrowUpRight aria-hidden="true" /></button>
      </aside>
    </div>
  );
}

type CorporateGiftSet = {
  id: string;
  number: string;
  title: string;
  summary: string;
  bullets: string[];
  moq: string;
  leadTime: string;
  slot: ImageSlot;
};

const corporateGiftSets: CorporateGiftSet[] = [
  {
    id: "travel-amenities",
    number: "01",
    title: "Branded Luggage + Travel Amenities Set",
    summary: "A coordinated premium travel set for clients, teams and group programmes.",
    bullets: ["Premium mini luggage with travel essentials", "Neck pillow, wireless fan & headphones", "Custom logo printing available"],
    moq: "100 sets",
    leadTime: "6-8 weeks",
    slot: corporateSlots[0],
  },
  {
    id: "team-building",
    number: "02",
    title: "Team Building Outdoor Kit",
    summary: "Practical outdoor pieces selected for team programmes, events and shared activities.",
    bullets: ["Handpicked outdoor & team bonding items", "Durable, practical & adventure-ready", "Custom logo printing available"],
    moq: "100 sets",
    leadTime: "6-8 weeks",
    slot: corporateSlots[1],
  },
  {
    id: "mini-luggage",
    number: "03",
    title: "Mini Luggage Travel Kit",
    summary: "A compact luggage set with useful everyday travel essentials.",
    bullets: ["Compact luggage with everyday travel must-haves", "Organized, lightweight & easy to carry", "Custom logo printing available"],
    moq: "100 sets",
    leadTime: "6-8 weeks",
    slot: corporateSlots[2],
  },
  {
    id: "notebook",
    number: "04",
    title: "A5 Notebook Gift Set",
    summary: "A refined desk and travel gift set in an elegant presentation box.",
    bullets: ["A5 notebook, pen & thermos bottle (300ml)", "Elegant gift box packaging", "Custom logo printing available"],
    moq: "100 sets",
    leadTime: "6-8 weeks",
    slot: corporateSlots[3],
  },
];

function GiftCommercialDetails({ gift }: { gift: CorporateGiftSet }) {
  return (
    <dl className="gift-commercial">
      <div><dt>MOQ</dt><dd>{gift.moq}</dd></div>
      <div><dt>Lead time</dt><dd>{gift.leadTime}</dd></div>
    </dl>
  );
}

function CorporateGiftDialog({ index, onChange, onClose, whatsappUrl }: { index: number | null; onChange: (index: number) => void; onClose: () => void; whatsappUrl: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (index === null || !dialog) return;
    const opener = document.activeElement as HTMLElement | null;
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const context = reduceMotion ? undefined : gsap.context(() => {
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .fromTo(".gift-dialog__surface", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.24 })
        .fromTo(".gift-dialog__media", { autoAlpha: 0, scale: 0.96 }, { autoAlpha: 1, scale: 1, duration: 0.46 }, "<")
        .fromTo(".gift-dialog__details > *", { autoAlpha: 0, x: 16 }, { autoAlpha: 1, x: 0, duration: 0.34, stagger: 0.04 }, "<0.08");
    }, dialog);
    return () => {
      context?.revert();
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
      opener?.focus();
    };
  }, [index]);

  if (index === null) return null;
  const gift = corporateGiftSets[index];
  const previous = (index - 1 + corporateGiftSets.length) % corporateGiftSets.length;
  const next = (index + 1) % corporateGiftSets.length;

  return (
    <dialog ref={dialogRef} className="gift-dialog" aria-labelledby="gift-dialog-title" onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.target === dialogRef.current) onClose(); }}>
      <div className="gift-dialog__surface">
        <button ref={closeRef} type="button" className="gift-dialog__close" onClick={onClose} aria-label="Close gift inspection"><X aria-hidden="true" /></button>
        <ImageSlotVisual slot={gift.slot} className="gift-dialog__media" />
        <div className="gift-dialog__details">
          <p>Corporate gift set {gift.number}</p>
          <h2 id="gift-dialog-title">{gift.title}</h2>
          <span>{gift.summary}</span>
          <ul>{gift.bullets.map((bullet) => <li key={bullet}><Check aria-hidden="true" />{bullet}</li>)}</ul>
          <GiftCommercialDetails gift={gift} />
          <div className="gift-dialog__footer">
            <a className="button button--coral" href={whatsappUrl} target="_blank" rel="noreferrer">Enquire on WhatsApp <FaWhatsapp aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
            <div className="gift-dialog__navigation">
              <button type="button" onClick={() => onChange(previous)} aria-label="Inspect previous gift set"><ArrowLeft aria-hidden="true" /></button>
              <button type="button" onClick={() => onChange(next)} aria-label="Inspect next gift set"><ArrowRight aria-hidden="true" /></button>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export function CorporateGiftGallery({ whatsappUrl }: { whatsappUrl: string }) {
  /* Hover (or keyboard focus) widens a panel; the click opens the dialog.
     The cover itself stays clean: set name and a "See details" affordance. */
  const [activeIndex, setActiveIndex] = useState(0);
  const [dialogIndex, setDialogIndex] = useState<number | null>(null);

  return (
    <>
      <div className="corporate-accordion" role="list" aria-label="Corporate gift solutions" data-reveal-group>
        {corporateGiftSets.map((gift, index) => (
          <article
            key={gift.id}
            className={`corporate-panel${index === activeIndex ? " is-active" : ""}`}
            role="listitem"
            onMouseEnter={() => setActiveIndex(index)}
          >
            <button
              type="button"
              className="corporate-panel__activate"
              aria-haspopup="dialog"
              onFocus={() => setActiveIndex(index)}
              onClick={() => setDialogIndex(index)}
            >
              <ImageSlotVisual slot={gift.slot} className="corporate-panel__media" />
              <span className="corporate-panel__scrim" aria-hidden="true" />
              <span className="corporate-panel__heading">
                <strong>{gift.title}</strong>
                <span className="corporate-panel__cta">See details <Expand aria-hidden="true" /></span>
              </span>
            </button>
          </article>
        ))}
      </div>
      <CorporateGiftDialog index={dialogIndex} onChange={setDialogIndex} onClose={() => setDialogIndex(null)} whatsappUrl={whatsappUrl} />
    </>
  );
}

type UmrahService = { label: string; description: string; slot: ImageSlot };

const umrahServices: UmrahService[] = [
  { label: "Journey set", description: "Coordinated luggage sizes for jemaah and group travel.", slot: umrahSlots[0] },
  { label: "Essentials", description: "Optional prayer and travel essentials for a more complete package.", slot: umrahSlots[1] },
  { label: "Agency branding", description: "Custom agency logo and coordinated identity for a more professional programme.", slot: umrahSlots[2] },
];

export function UmrahServiceGallery() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const active = umrahServices[activeIndex];

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.fromTo(".umrah-gallery__detail > *", { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.34, stagger: 0.045, ease: "power2.out" });
      gsap.fromTo(".umrah-card.is-active .image-slot", { scale: 1.025 }, { scale: 1, duration: 0.45, ease: "power3.out" });
    }, root);
    return () => context.revert();
  }, [activeIndex]);

  return (
    <div ref={rootRef} className="umrah-gallery" data-reveal="right">
      <div className="umrah-gallery__cards" role="group" aria-label="UMRAH programme components">
        {umrahServices.map((service, index) => (
          <button type="button" key={service.slot.id} className={`umrah-card${index === activeIndex ? " is-active" : ""}`} aria-pressed={index === activeIndex} onClick={() => setActiveIndex(index)}>
            <ImageSlotVisual slot={service.slot} className="umrah-card__media" />
            <span className="umrah-card__scrim" aria-hidden="true" />
            <strong>{service.label}</strong>
          </button>
        ))}
      </div>
      <div className="umrah-gallery__detail" aria-live="polite"><p>{active.description}</p></div>
    </div>
  );
}
