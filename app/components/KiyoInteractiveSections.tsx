"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ArrowLeft, ArrowRight, Check, Expand, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { ImageSlotVisual } from "./ImagePlaceholder";
import { PROGRAMME_EVENT, type Programme } from "./BuildYourSet";
import { WHATSAPP_URL } from "./SiteFooter";
import {
  corporateLeadSlot,
  corporateSetSlots,
  umrahLeadSlot,
  umrahSetSlots,
  type ImageSlot,
} from "./imageSlots";

export type GiftSet = {
  id: string;
  number: string;
  title: string;
  summary: string;
  contents: string[];
  moq: string;
  leadTime: string;
  slot: ImageSlot;
};

/* -------------------------------------------------------------------------- */
/* The set inspector                                                          */
/* -------------------------------------------------------------------------- */

function GiftDialog({
  sets,
  index,
  onChange,
  onClose,
}: {
  sets: GiftSet[];
  index: number | null;
  onChange: (index: number) => void;
  onClose: () => void;
}) {
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
        .fromTo(".giftdialog__surface", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.3 })
        .fromTo(".giftdialog__media", { autoAlpha: 0, scale: 0.97 }, { autoAlpha: 1, scale: 1, duration: 0.45 }, "<")
        .fromTo(".giftdialog__detail > *", { autoAlpha: 0, x: 14 }, { autoAlpha: 1, x: 0, duration: 0.34, stagger: 0.05 }, "<0.08");
    }, dialog);

    /* The arrow keys walk the set the same way the buttons do. */
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") { event.preventDefault(); onChange((index + 1) % sets.length); }
      if (event.key === "ArrowLeft") { event.preventDefault(); onChange((index - 1 + sets.length) % sets.length); }
    };
    dialog.addEventListener("keydown", onKey);

    return () => {
      dialog.removeEventListener("keydown", onKey);
      context?.revert();
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
      opener?.focus();
    };
  }, [index, onChange, sets.length]);

  if (index === null) return null;
  const set = sets[index];

  return (
    <dialog
      ref={dialogRef}
      className="giftdialog"
      aria-labelledby="giftdialog-title"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === dialogRef.current) onClose(); }}
    >
      <div className="giftdialog__surface">
        <button ref={closeRef} type="button" className="giftdialog__close" onClick={onClose} aria-label="Close set details">
          <X aria-hidden="true" />
        </button>

        <ImageSlotVisual slot={set.slot} className="giftdialog__media" />

        <div className="giftdialog__detail">
          <p className="giftdialog__index">Set {set.number}</p>
          <h3 id="giftdialog-title">{set.title}</h3>
          <p className="giftdialog__summary">{set.summary}</p>

          <ul>
            {set.contents.map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}
          </ul>

          <dl className="giftdialog__terms">
            <div><dt>MOQ</dt><dd>{set.moq}</dd></div>
            <div><dt>Lead time</dt><dd>{set.leadTime}</dd></div>
          </dl>

          <div className="giftdialog__actions">
            <a className="button button--coral" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
              Enquire on WhatsApp <FaWhatsapp aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <div className="giftdialog__nav">
              <button type="button" onClick={() => onChange((index - 1 + sets.length) % sets.length)} aria-label="Previous set">
                <ArrowLeft aria-hidden="true" />
              </button>
              <span aria-hidden="true">{index + 1} / {sets.length}</span>
              <button type="button" onClick={() => onChange((index + 1) % sets.length)} aria-label="Next set">
                <ArrowRight aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}

/**
 * The four-up showcase.
 *
 * Hover or keyboard focus highlights one set and dims the rest; the click opens
 * the inspector. The cover itself stays quiet - name and a "View set"
 * affordance - so the row reads as photography rather than as four buttons.
 */
function GiftShowcase({ sets }: { sets: GiftSet[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <ul
        className={`setstrip${active !== null ? " is-focused" : ""}`}
        data-reveal-group
        onMouseLeave={() => setActive(null)}
      >
        {sets.map((set, index) => (
          <li
            className={`setcard${active === index ? " is-active" : ""}`}
            key={set.id}
            onMouseEnter={() => setActive(index)}
          >
            <button
              type="button"
              className="setcard__open"
              aria-haspopup="dialog"
              onFocus={() => setActive(index)}
              onBlur={() => setActive(null)}
              onClick={() => setOpen(index)}
            >
              <ImageSlotVisual slot={set.slot} className="setcard__media" />
              <span className="setcard__scrim" aria-hidden="true" />
              <span className="setcard__cta" aria-hidden="true">View set <Expand /></span>
              <span className="sr-only">View the {set.title}</span>
            </button>
            <span className="setcard__label">{set.title}</span>
          </li>
        ))}
      </ul>

      <GiftDialog sets={sets} index={open} onChange={setOpen} onClose={() => setOpen(null)} />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* The shared chapter shell                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Chapters 3 and 4 are the same chapter twice over: copy on the left, one
 * lifestyle plate on the right, then the showcase underneath. They share this
 * shell so the two can never drift apart, and each passes its own programme so
 * the enquiry flow opens pointed at the right desk.
 */
function GiftChapter({
  id,
  tone,
  eyebrow,
  headline,
  intro,
  cta,
  programme,
  lead,
  sets,
}: {
  id: string;
  tone: "sand" | "paper";
  eyebrow: string;
  headline: React.ReactNode;
  intro: string;
  cta: string;
  programme: Programme;
  lead: ImageSlot;
  sets: GiftSet[];
}) {
  return (
    <section id={id} className={`gift gift--${tone}`}>
      <div className="gift__lead">
        <div className="gift__copy" data-reveal-group>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{headline}</h2>
          <p>{intro}</p>
          <a
            className="button button--coral"
            href="#build"
            onClick={() => window.dispatchEvent(new CustomEvent<Programme>(PROGRAMME_EVENT, { detail: programme }))}
          >
            {cta} <ArrowRight aria-hidden="true" />
          </a>
        </div>

        <div className="gift__visual" data-reveal="right">
          <ImageSlotVisual slot={lead} className="gift__media" />
        </div>
      </div>

      <GiftShowcase sets={sets} />
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 03  UMRAH                                                                  */
/* -------------------------------------------------------------------------- */

const MOQ = "100 sets";
const LEAD_TIME = "6-8 weeks";

const umrahSets: GiftSet[] = [
  {
    id: "essential-journey",
    number: "01",
    title: "Essential Journey Set",
    summary: "The core set every jemaah carries, sized for a full UMRAH departure.",
    contents: ["Cabin, medium and large cases", "Drawstring bag and toiletry pouch", "Insulated travel bottle"],
    moq: MOQ,
    leadTime: LEAD_TIME,
    slot: umrahSetSlots[0],
  },
  {
    id: "comfort-travel",
    number: "02",
    title: "Comfort Travel Set",
    summary: "The essentials plus the pieces that make a long flight easier.",
    contents: ["Coordinated luggage in cream", "Neck pillow, eye mask and portable fan", "Toiletry pouch and travel bottle"],
    moq: MOQ,
    leadTime: LEAD_TIME,
    slot: umrahSetSlots[1],
  },
  {
    id: "complete-jemaah",
    number: "03",
    title: "Complete Jemaah Set",
    summary: "A full programme package, ready to hand over on departure day.",
    contents: ["Full coordinated luggage set", "Prayer mat and ibadah essentials", "Comfort and travel accessories"],
    moq: MOQ,
    leadTime: LEAD_TIME,
    slot: umrahSetSlots[2],
  },
  {
    id: "agency-branding",
    number: "04",
    title: "Agency Branding Set",
    summary: "The complete set carrying your agency's identity throughout.",
    contents: ["Your logo applied across the set", "Branded presentation box and luggage tag", "Coordinated agency colourway"],
    moq: MOQ,
    leadTime: LEAD_TIME,
    slot: umrahSetSlots[3],
  },
];

export function UmrahGiftSets() {
  return (
    <GiftChapter
      id="umrah"
      tone="sand"
      eyebrow="UMRAH programme"
      headline={<>Complete UMRAH<br />sets, made simple.</>}
      intro="Coordinated luggage, travel essentials and agency branding for every jemaah."
      cta="Plan an UMRAH programme"
      programme="umrah"
      lead={umrahLeadSlot}
      sets={umrahSets}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* 04  Corporate                                                              */
/* -------------------------------------------------------------------------- */

const corporateSets: GiftSet[] = [
  {
    id: "branded-travel",
    number: "01",
    title: "Branded Travel Set",
    summary: "A coordinated travel set for clients, teams and group programmes.",
    contents: ["Compact branded case", "Headphones, neck pillow and travel pouch", "Custom logo printing available"],
    moq: MOQ,
    leadTime: LEAD_TIME,
    slot: corporateSetSlots[0],
  },
  {
    id: "executive-journey",
    number: "02",
    title: "Executive Journey Set",
    summary: "A senior gift: darker finishes and a heavier presentation.",
    contents: ["Premium cabin case", "Executive desk and travel pieces", "Custom logo printing available"],
    moq: MOQ,
    leadTime: LEAD_TIME,
    slot: corporateSetSlots[1],
  },
  {
    id: "team-building",
    number: "03",
    title: "Team Building Kit",
    summary: "Practical outdoor pieces chosen for team programmes and events.",
    contents: ["Handpicked outdoor and team items", "Durable, practical and event-ready", "Custom logo printing available"],
    moq: MOQ,
    leadTime: LEAD_TIME,
    slot: corporateSetSlots[2],
  },
  {
    id: "premium-welcoming",
    number: "04",
    title: "Premium Welcoming Gift",
    summary: "A refined desk and travel gift in an elegant presentation box.",
    contents: ["Notebook, pen and thermos bottle", "Elegant gift box packaging", "Custom logo printing available"],
    moq: MOQ,
    leadTime: LEAD_TIME,
    slot: corporateSetSlots[3],
  },
];

export function CorporateGiftSets() {
  return (
    <GiftChapter
      id="corporate"
      tone="paper"
      eyebrow="Corporate gifts"
      headline={<>Corporate gifts<br />that travel further.</>}
      intro="Branded travel sets for clients, employees, partners and events."
      cta="Get a corporate quote"
      programme="corporate"
      lead={corporateLeadSlot}
      sets={corporateSets}
    />
  );
}
