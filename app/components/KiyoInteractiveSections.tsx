"use client";

/* Production images are pre-sized in public/images/kiyo for the static runtime. */
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Expand,
  X,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";

type ProductScene = {
  id: string;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  mode: "portrait" | "wide" | "square";
  width: number;
  height: number;
};

const productScenes: ProductScene[] = [
  {
    id: "overview",
    label: "Overview",
    eyebrow: "01 · Signature case",
    title: "The KIYO silhouette",
    description: "A clean front profile of KIYO's signature luggage design.",
    image: "/images/kiyo/product-overview.webp",
    alt: "Front view of KIYO's signature navy luggage case",
    mode: "portrait",
    width: 1000,
    height: 1250,
  },
  {
    id: "colours",
    label: "Colours",
    eyebrow: "02 · Colour choice",
    title: "One silhouette. Six colours.",
    description: "Explore the curated colour choices available in the same luggage design.",
    image: "/images/kiyo/product-colours.webp",
    alt: "Six KIYO luggage colour choices shown side by side",
    mode: "wide",
    width: 1439,
    height: 810,
  },
  {
    id: "handle",
    label: "Handle",
    eyebrow: "03 · Detail",
    title: "Handle & top detail",
    description: "Inspect the telescopic handle, top grip and upper luggage construction.",
    image: "/images/kiyo/product-handle.webp",
    alt: "Close view of the KIYO telescopic handle, top grip and upper case",
    mode: "square",
    width: 1100,
    height: 1100,
  },
  {
    id: "wheels",
    label: "360 Wheels",
    eyebrow: "04 · Detail",
    title: "360° spinner wheels",
    description: "A close-up look at the wheel system designed for smooth directional movement.",
    image: "/images/kiyo/product-wheels.webp",
    alt: "Close view of KIYO 360 degree spinner wheels",
    mode: "square",
    width: 1100,
    height: 1100,
  },
  {
    id: "security",
    label: "Security Lock",
    eyebrow: "05 · Security",
    title: "Integrated travel lock",
    description: "Inspect the integrated lock and zipper-pull security detail.",
    image: "/images/kiyo/product-lock.webp",
    alt: "Close view of the integrated KIYO luggage lock and zipper pulls",
    mode: "square",
    width: 1100,
    height: 1100,
  },
  {
    id: "studio",
    label: "Studio View",
    eyebrow: "06 · Profile",
    title: "Studio profile",
    description: "The same signature case presented as a clean design object.",
    image: "/images/kiyo/product-studio.webp",
    alt: "KIYO luggage case presented on a warm studio pedestal",
    mode: "portrait",
    width: 1000,
    height: 1250,
  },
  {
    id: "travel",
    label: "Travel",
    eyebrow: "07 · In motion",
    title: "Travel ready",
    description: "See the signature case in a bright airport environment.",
    image: "/images/kiyo/product-airport.webp",
    alt: "KIYO luggage case standing in a bright airport terminal",
    mode: "wide",
    width: 1439,
    height: 810,
  },
];

export function ProductInspector({ onShop }: { onShop: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState(productScenes[0].id);
  const activeIndex = productScenes.findIndex((scene) => scene.id === activeId);
  const activeScene = productScenes[activeIndex];

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.killTweensOf(".product-inspector__image.is-active, .product-inspector__caption > *");
      gsap.fromTo(
        ".product-inspector__image.is-active",
        { autoAlpha: 0, scale: 1.025, xPercent: 1.2 },
        { autoAlpha: 1, scale: 1, xPercent: 0, duration: 0.48, ease: "power3.out" },
      );
      gsap.fromTo(
        ".product-inspector__caption > *",
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.38, stagger: 0.045, ease: "power2.out" },
      );
    }, root);
    return () => context.revert();
  }, [activeId]);

  return (
    <div ref={rootRef} className="product-inspector" aria-label="KIYO product inspector">
      <div className="product-inspector__rail">
        <img
          className="product-inspector__rail-image"
          src="/images/kiyo/product-intro.webp"
          alt=""
          aria-hidden="true"
          width="1439"
          height="810"
          loading="lazy"
          decoding="async"
        />
        <div className="product-inspector__rail-wash" aria-hidden="true" />
        <div className="product-inspector__intro">
          <p className="eyebrow eyebrow--teal">Luggage collection</p>
          <h2>One design. A closer look.</h2>
          <p>Explore the silhouette, colour choices and selected travel details of KIYO&apos;s signature case.</p>
        </div>
        <div className="product-inspector__selectors" role="group" aria-label="Choose a product view">
          {productScenes.map((scene) => (
            <button
              key={scene.id}
              type="button"
              className={scene.id === activeId ? "is-active" : ""}
              aria-pressed={scene.id === activeId}
              onClick={() => setActiveId(scene.id)}
            >
              {scene.label}
              <span aria-hidden="true">{scene.id === activeId ? "View selected" : "View"}</span>
            </button>
          ))}
        </div>
        <div className="product-inspector__retail">
          <img
            src="/images/kiyo/product-gift-transition.webp"
            alt="KIYO luggage presented as a gift"
            width="1439"
            height="810"
            loading="lazy"
            decoding="async"
          />
          <div>
            <p>Looking for more KIYO styles?</p>
            <button type="button" onClick={onShop}>Shop KIYO <ArrowUpRight aria-hidden="true" /></button>
          </div>
        </div>
      </div>

      <div className="product-inspector__stage">
        <div className={`product-inspector__media product-inspector__media--${activeScene.mode}`}>
          {productScenes.map((scene) => (
            <img
              key={scene.id}
              className={`product-inspector__image${scene.id === activeId ? " is-active" : ""}`}
              src={scene.image}
              alt={scene.id === activeId ? scene.alt : ""}
              aria-hidden={scene.id !== activeId}
              width={scene.width}
              height={scene.height}
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>
        <div className="product-inspector__caption" aria-live="polite">
          <p>{activeScene.eyebrow}</p>
          <h3>{activeScene.title}</h3>
          <span>{activeScene.description}</span>
        </div>
        <span className="product-inspector__progress" aria-hidden="true">
          {String(activeIndex + 1).padStart(2, "0")} / {String(productScenes.length).padStart(2, "0")}
        </span>
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
  image: string;
  alt: string;
};

const corporateGiftSets: CorporateGiftSet[] = [
  {
    id: "travel-amenities",
    number: "01",
    title: "Branded Luggage + Travel Amenities Set",
    summary: "A coordinated compact luggage and comfort set for clients, teams and travel programmes.",
    bullets: ["Travel essentials set", "Neck pillow, portable fan & headphones", "Custom logo printing available", "MOQ 100 sets", "Lead time 6 to 8 weeks"],
    image: "/images/kiyo/corporate-gift-travel-amenities.webp",
    alt: "Black compact luggage with headphones, neck pillow, portable fan and travel pouch",
  },
  {
    id: "team-building",
    number: "02",
    title: "Team Building Outdoor Kit",
    summary: "Practical outdoor pieces gathered for team programmes, events and shared activities.",
    bullets: ["Handpicked outdoor & team-bonding items", "Practical, activity-ready presentation", "Custom logo printing available", "MOQ 100 sets", "Lead time 6 to 8 weeks"],
    image: "/images/kiyo/corporate-gift-team-building.webp",
    alt: "Corporate outdoor kit with camping chair, tote, umbrella, portable fan and blanket",
  },
  {
    id: "mini-luggage",
    number: "03",
    title: "Mini Luggage Travel Kit",
    summary: "A compact gift set combining mini luggage with useful everyday travel essentials.",
    bullets: ["Compact luggage with everyday travel must-haves", "Organised and easy to present as a set", "Custom logo printing available", "MOQ 100 sets", "Lead time 6 to 8 weeks"],
    image: "/images/kiyo/corporate-gift-mini-luggage.webp",
    alt: "Pink mini luggage with headphones, neck pillow, portable fan and drawstring pouch",
  },
  {
    id: "notebook",
    number: "04",
    title: "A5 Notebook Gift Set",
    summary: "A refined desk and travel set in a premium navy presentation box.",
    bullets: ["A5 notebook, pen & thermos bottle", "Elegant gift-box presentation", "Custom logo printing available", "MOQ 100 sets", "Lead time 6 to 8 weeks"],
    image: "/images/kiyo/corporate-gift-notebook.webp",
    alt: "Premium navy gift box with A5 notebook, pen and thermos bottle",
  },
];

function CorporateGiftDialog({
  index,
  onChange,
  onClose,
  whatsappUrl,
}: {
  index: number | null;
  onChange: (index: number) => void;
  onClose: () => void;
  whatsappUrl: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (index === null || !dialog) return;
    const opener = document.activeElement as HTMLElement | null;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const context = reduceMotion
      ? undefined
      : gsap.context(() => {
          gsap.timeline({ defaults: { ease: "power3.out" } })
            .fromTo(".gift-dialog__backdrop", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 })
            .fromTo(".gift-dialog__image", { autoAlpha: 0, scale: 0.96 }, { autoAlpha: 1, scale: 1, duration: 0.5 }, "<")
            .fromTo(".gift-dialog__details > *", { autoAlpha: 0, x: 18 }, { autoAlpha: 1, x: 0, duration: 0.36, stagger: 0.04 }, "<0.1");
        }, dialog);
    return () => {
      context?.revert();
      document.body.style.overflow = "";
      if (dialog.open) dialog.close();
      opener?.focus();
    };
  }, [index]);

  if (index === null) return null;
  const gift = corporateGiftSets[index];
  const previous = (index - 1 + corporateGiftSets.length) % corporateGiftSets.length;
  const next = (index + 1) % corporateGiftSets.length;

  return (
    <dialog
      ref={dialogRef}
      className="gift-dialog"
      aria-labelledby="gift-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      <div className="gift-dialog__backdrop" aria-hidden="true" />
      <button ref={closeRef} type="button" className="gift-dialog__close" onClick={onClose} aria-label="Close gift inspection">
        <X aria-hidden="true" />
      </button>
      <div className="gift-dialog__image">
        <img src={gift.image} alt={gift.alt} width="1440" height="1080" />
      </div>
      <div className="gift-dialog__details">
        <p>{gift.number} / Corporate gift set</p>
        <h2 id="gift-dialog-title">{gift.title}</h2>
        <span>{gift.summary}</span>
        <ul>{gift.bullets.map((bullet) => <li key={bullet}><Check aria-hidden="true" />{bullet}</li>)}</ul>
        <a className="button button--coral" href={whatsappUrl} target="_blank" rel="noreferrer">
          Enquire on WhatsApp <FaWhatsapp aria-hidden="true" />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        <div className="gift-dialog__navigation">
          <button type="button" onClick={() => onChange(previous)} aria-label="Inspect previous gift set"><ArrowLeft aria-hidden="true" /></button>
          <button type="button" onClick={() => onChange(next)} aria-label="Inspect next gift set"><ArrowRight aria-hidden="true" /></button>
        </div>
      </div>
    </dialog>
  );
}

export function CorporateGiftGallery({ whatsappUrl }: { whatsappUrl: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dialogIndex, setDialogIndex] = useState<number | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.to(".corporate-card.is-active .corporate-card__media", { scale: 1, duration: 0.55, ease: "power3.out" });
      gsap.fromTo(
        ".corporate-card.is-active .corporate-card__detail > *",
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.34, stagger: 0.04, ease: "power2.out" },
      );
    }, root);
    return () => context.revert();
  }, [activeIndex]);

  return (
    <>
      <div ref={rootRef} className="corporate-gallery" role="list" aria-label="Corporate gift solutions">
        {corporateGiftSets.map((gift, index) => {
          const active = index === activeIndex;
          return (
            <article key={gift.id} className={`corporate-card${active ? " is-active" : ""}`} role="listitem">
              <button
                type="button"
                className="corporate-card__selector"
                aria-pressed={active}
                aria-label={`${active ? "Inspect" : "Select"} ${gift.title}`}
                onClick={() => active ? setDialogIndex(index) : setActiveIndex(index)}
              >
                <img className="corporate-card__media" src={gift.image} alt={gift.alt} width="1440" height="1080" loading="lazy" decoding="async" />
                <span className="corporate-card__wash" aria-hidden="true" />
                <span className="corporate-card__number">{gift.number}</span>
                <strong>{gift.title}</strong>
              </button>
              <div className="corporate-card__detail" aria-hidden={!active}>
                <p>{gift.summary}</p>
                <ul>{gift.bullets.slice(0, 3).map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
                <button type="button" onClick={() => setDialogIndex(index)}>Inspect set <Expand aria-hidden="true" /></button>
              </div>
            </article>
          );
        })}
      </div>
      <CorporateGiftDialog index={dialogIndex} onChange={setDialogIndex} onClose={() => setDialogIndex(null)} whatsappUrl={whatsappUrl} />
    </>
  );
}

type UmrahService = {
  number: string;
  label: string;
  title: string;
  description: string;
  image: string;
  alt: string;
};

const umrahServices: UmrahService[] = [
  {
    number: "01",
    label: "Journey Set",
    title: "Coordinated journey set",
    description: "Suitable for agencies preparing a consistent luggage mix for jemaah and group travel.",
    image: "/images/kiyo/umrah-journey.webp",
    alt: "UMRAH traveller with a coordinated cream luggage set at an airport",
  },
  {
    number: "02",
    label: "Included Essentials",
    title: "Optional travel essentials",
    description: "Combine luggage with selected prayer or travel essentials for a more complete presentation.",
    image: "/images/kiyo/umrah-essentials.webp",
    alt: "Cream UMRAH luggage arranged with selected prayer and travel essentials",
  },
  {
    number: "03",
    label: "Custom Agency Branding",
    title: "Custom agency logo",
    description: "Add agency identity, logo application and coordinated presentation for a professional and exclusive programme.",
    image: "/images/kiyo/umrah-custom.webp",
    alt: "Cream UMRAH luggage with custom agency branding presentation",
  },
];

export function UmrahServiceGallery() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const active = umrahServices[activeIndex];

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.fromTo(".umrah-service-gallery__detail > *", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.05, ease: "power2.out" });
      gsap.fromTo(".umrah-service-card.is-active img", { scale: 1.04 }, { scale: 1, duration: 0.5, ease: "power3.out" });
    }, root);
    return () => context.revert();
  }, [activeIndex]);

  return (
    <div ref={rootRef} className="umrah-service-gallery">
      <div className="umrah-service-gallery__cards" role="group" aria-label="UMRAH service components">
        {umrahServices.map((service, index) => (
          <button
            type="button"
            key={service.number}
            className={`umrah-service-card${index === activeIndex ? " is-active" : ""}`}
            aria-pressed={index === activeIndex}
            onClick={() => setActiveIndex(index)}
          >
            <img src={service.image} alt={service.alt} width="900" height="1125" loading="lazy" decoding="async" />
            <span aria-hidden="true" />
            <small>{service.number}</small>
            <strong>{service.label}</strong>
          </button>
        ))}
      </div>
      <div className="umrah-service-gallery__detail" aria-live="polite">
        <p>{active.number} / {active.label}</p>
        <h3>{active.title}</h3>
        <span>{active.description}</span>
      </div>
    </div>
  );
}
