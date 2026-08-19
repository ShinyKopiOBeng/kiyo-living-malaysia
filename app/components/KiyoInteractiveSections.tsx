"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Expand, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { ImageSlotVisual } from "./ImagePlaceholder";
import { corporateSlots, productSlots, umrahSlots, type ImageSlot } from "./imageSlots";

type ProductScene = {
  id: keyof typeof productSlots;
  label: string;
  title: string;
  description: string;
  slot: ImageSlot;
};

const productScenes: ProductScene[] = [
  { id: "overview", label: "Overview", title: "The KIYO silhouette", description: "A clean front profile with balanced proportions and a polished, travel-ready finish.", slot: productSlots.overview },
  { id: "colours", label: "Colours", title: "One silhouette. Six colours.", description: "A considered palette for personal travel, teams and coordinated programmes.", slot: productSlots.colours },
  { id: "handle", label: "Handle", title: "Handle and top detail", description: "A closer view of the telescopic handle, top grip and upper case construction.", slot: productSlots.handle },
  { id: "wheels", label: "360 Wheels", title: "Smooth directional movement", description: "The spinner wheel system is designed to move easily through busy travel environments.", slot: productSlots.wheels },
  { id: "security", label: "Security Lock", title: "Integrated travel security", description: "A close view of the lock and zipper-pull detail built into the case.", slot: productSlots.security },
  { id: "studio", label: "Studio", title: "A clean studio profile", description: "The signature case presented as a focused design object without visual distraction.", slot: productSlots.studio },
  { id: "travel", label: "Travel", title: "Ready for the journey", description: "The same KIYO case shown in the environment it was designed to move through.", slot: productSlots.travel },
];

export function ProductInspector({ onShop }: { onShop: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<ProductScene["id"]>("overview");
  const activeScene = productScenes.find((scene) => scene.id === activeId) ?? productScenes[0];

  const selectScene = (nextId: ProductScene["id"]) => {
    if (nextId === activeId) return;
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActiveId(nextId);
      return;
    }
    const current = root.querySelector<HTMLElement>(".product-stage__visual.is-active");
    gsap.killTweensOf(current);
    gsap.to(current, {
      autoAlpha: 0,
      scale: 1.015,
      duration: 0.18,
      ease: "power2.in",
      onComplete: () => setActiveId(nextId),
    });
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.fromTo(".product-stage__visual.is-active", { autoAlpha: 0, scale: 0.985 }, { autoAlpha: 1, scale: 1, duration: 0.42, ease: "power3.out" });
      gsap.fromTo(".product-inspector__detail > *", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.36, stagger: 0.04, ease: "power2.out" });
    }, root);
    return () => context.revert();
  }, [activeId]);

  return (
    <div ref={rootRef} className="product-inspector" aria-label="KIYO product inspector">
      <header className="product-inspector__intro">
        <p>KIYO signature luggage</p>
        <h2>One design. Every detail considered.</h2>
      </header>

      <div className="product-stage" data-product-view={activeId}>
        {productScenes.map((scene) => (
          <ImageSlotVisual key={scene.id} slot={scene.slot} className={`product-stage__visual product-stage__visual--${scene.id}${scene.id === activeId ? " is-active" : ""}`} />
        ))}
      </div>

      <div className="product-inspector__selectors" role="tablist" aria-label="Choose a product view">
        {productScenes.map((scene) => (
          <button key={scene.id} type="button" role="tab" aria-selected={scene.id === activeId} className={scene.id === activeId ? "is-active" : ""} onClick={() => selectScene(scene.id)}>
            {scene.label}
          </button>
        ))}
      </div>

      <div className="product-inspector__detail" aria-live="polite">
        <div><h3>{activeScene.title}</h3><p>{activeScene.description}</p></div>
        <button className="text-link" type="button" onClick={onShop}>Shop KIYO <ArrowUpRight aria-hidden="true" /></button>
      </div>
    </div>
  );
}

type CorporateGiftSet = {
  id: string;
  number: string;
  title: string;
  summary: string;
  bullets: string[];
  slot: ImageSlot;
};

const corporateGiftSets: CorporateGiftSet[] = [
  { id: "travel-amenities", number: "01", title: "Branded Luggage + Travel Amenities Set", summary: "A coordinated compact luggage and comfort set for clients, teams and travel programmes.", bullets: ["Travel essentials set", "Neck pillow, portable fan and headphones", "Custom logo printing available"], slot: corporateSlots[0] },
  { id: "team-building", number: "02", title: "Team Building Outdoor Kit", summary: "Practical outdoor pieces for team programmes, events and shared activities.", bullets: ["Activity-ready presentation", "Selected outdoor essentials", "Custom logo printing available"], slot: corporateSlots[1] },
  { id: "mini-luggage", number: "03", title: "Mini Luggage Travel Kit", summary: "A compact set combining mini luggage with useful everyday travel essentials.", bullets: ["Compact luggage format", "Everyday travel essentials", "Custom logo printing available"], slot: corporateSlots[2] },
  { id: "notebook", number: "04", title: "A5 Notebook Gift Set", summary: "A refined desk and travel set in a premium navy presentation box.", bullets: ["A5 notebook, pen and bottle", "Gift-box presentation", "Custom logo printing available"], slot: corporateSlots[3] },
];

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
  const [dialogIndex, setDialogIndex] = useState<number | null>(null);

  return (
    <>
      <div className="corporate-accordion" role="list" aria-label="Corporate gift solutions">
        {corporateGiftSets.map((gift, index) => (
            <article key={gift.id} className="corporate-panel" role="listitem">
              <button type="button" className="corporate-panel__activate" aria-label={`View details for ${gift.title}`} onClick={() => setDialogIndex(index)}>
                <ImageSlotVisual slot={gift.slot} className="corporate-panel__media" />
                <span className="corporate-panel__scrim" aria-hidden="true" />
                <span className="corporate-panel__content">
                  <span>{gift.number}</span>
                  <strong>{gift.title}</strong>
                  <span className="corporate-panel__link">View details <Expand aria-hidden="true" /></span>
                </span>
              </button>
            </article>
        ))}
      </div>
      <CorporateGiftDialog index={dialogIndex} onChange={setDialogIndex} onClose={() => setDialogIndex(null)} whatsappUrl={whatsappUrl} />
    </>
  );
}

type UmrahService = { label: string; title: string; description: string; slot: ImageSlot };

const umrahServices: UmrahService[] = [
  { label: "Journey Set", title: "Coordinated journey set", description: "Coordinated luggage for jemaah and group travel.", slot: umrahSlots[0] },
  { label: "Included Essentials", title: "Optional travel essentials", description: "Optional prayer and travel essentials for a more complete package.", slot: umrahSlots[1] },
  { label: "Custom Agency Branding", title: "Custom agency identity", description: "Custom agency logo and coordinated identity for a more professional programme.", slot: umrahSlots[2] },
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
    <div ref={rootRef} className="umrah-gallery">
      <div className="umrah-gallery__cards" role="group" aria-label="UMRAH programme components">
        {umrahServices.map((service, index) => (
          <button type="button" key={service.slot.id} className={`umrah-card${index === activeIndex ? " is-active" : ""}`} aria-pressed={index === activeIndex} onClick={() => setActiveIndex(index)}>
            <ImageSlotVisual slot={service.slot} className="umrah-card__media" />
            <span className="umrah-card__scrim" aria-hidden="true" />
            <strong>{service.label}</strong>
          </button>
        ))}
      </div>
      <div className="umrah-gallery__detail" aria-live="polite"><h3>{active.title}</h3><p>{active.description}</p></div>
    </div>
  );
}
