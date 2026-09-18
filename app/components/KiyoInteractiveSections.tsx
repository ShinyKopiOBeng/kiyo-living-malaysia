"use client";

/* Placeholder tiles carry the vector mark, served straight from public. */
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { ChapterOpener } from "./ChapterOpener";
import { ImageSlotVisual } from "./ImagePlaceholder";
import { SetCarousel } from "./SetCarousel";
import { corporateSets, umrahSets, type GiftSet } from "./giftSets";
import { corporateOpenerSlot, umrahOpenerSlot, type ImageSlot } from "./imageSlots";
import { announceProgramme, type Programme } from "./programme";
import { scrollToSection } from "./scroll";

/* -------------------------------------------------------------------------- */
/* The set inspector                                                          */
/* -------------------------------------------------------------------------- */

function GiftDialog({
  sets,
  index,
  programme,
  onChange,
  onClose,
}: {
  sets: GiftSet[];
  index: number | null;
  programme: Programme;
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

  /* The inspector no longer opens WhatsApp. It closes, points the quotation at
     this programme, and takes the visitor there: one form is where every
     enquiry now goes. The scroll waits a frame so the body can unlock first. */
  const requestQuote = () => {
    announceProgramme(programme);
    onClose();
    requestAnimationFrame(() => scrollToSection("quote"));
  };

  return (
    <dialog
      ref={dialogRef}
      className="giftdialog"
      aria-labelledby="giftdialog-title"
      data-lenis-prevent
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === dialogRef.current) onClose(); }}
    >
      <div className="giftdialog__surface">
        <button ref={closeRef} type="button" className="giftdialog__close" onClick={onClose} aria-label="Close set details">
          <X aria-hidden="true" />
        </button>

        {set.slot ? (
          <ImageSlotVisual slot={set.slot} className="giftdialog__media" />
        ) : (
          <div className="giftdialog__media giftdialog__media--pending" aria-hidden="true">
            <img src="/images/kiyo-logo-white.svg" alt="" width="212" height="86" />
            <span>Photo coming soon</span>
          </div>
        )}

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
            <button type="button" className="button button--coral" onClick={requestQuote}>
              Request a quote <ArrowRight aria-hidden="true" />
            </button>
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

/* -------------------------------------------------------------------------- */
/* The shared chapter shell                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Chapters 3 and 4 are the same chapter twice over: an opener, then the six
 * sets on a drifting carousel, then the inspector. They share this shell so
 * the two can never drift apart, and each passes its own programme so the
 * quotation opens pointed at the right desk.
 */
function GiftChapter({
  id,
  tone,
  label,
  lines,
  body,
  cta,
  programme,
  opener,
  openerVariant,
  openerSide,
  sets,
  ratio,
}: {
  id: string;
  tone: "paper" | "sand";
  label: string;
  lines: [string, string, string];
  body: string;
  cta: string;
  programme: Programme;
  opener: ImageSlot;
  openerVariant: "bleed" | "split";
  openerSide: "left" | "right";
  sets: GiftSet[];
  ratio: "3 / 2" | "4 / 3";
}) {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);

  return (
    <section id={id} className={`gift gift--${tone}`} aria-labelledby={`${id}-title`}>
      <ChapterOpener
        titleId={`${id}-title`}
        label={label}
        lines={lines}
        body={body}
        slot={opener}
        variant={openerVariant}
        side={openerSide}
        action={
          <a className="button button--coral" href="#quote" onClick={() => announceProgramme(programme)}>
            {cta} <ArrowRight aria-hidden="true" />
          </a>
        }
      />

      <SetCarousel sets={sets} ratio={ratio} onOpen={setOpen} suspended={open !== null} label={`${label} sets`} />

      <GiftDialog sets={sets} index={open} programme={programme} onChange={setOpen} onClose={close} />
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 03  UMRAH                                                                  */
/* -------------------------------------------------------------------------- */

export function UmrahGiftSets() {
  return (
    <GiftChapter
      id="umrah"
      tone="paper"
      label="UMRAH programme"
      lines={["Your Jemaah.", "Your Brand.", "One Complete Journey."]}
      body="Thoughtfully coordinated luggage and travel essentials, customised for your agency and prepared for every jemaah."
      cta="Build Your UMRAH Set"
      programme="umrah"
      opener={umrahOpenerSlot}
      openerVariant="bleed"
      openerSide="left"
      sets={umrahSets}
      ratio="3 / 2"
    />
  );
}

/* -------------------------------------------------------------------------- */
/* 04  Corporate                                                              */
/* -------------------------------------------------------------------------- */

export function CorporateGiftSets() {
  return (
    <GiftChapter
      id="corporate"
      tone="sand"
      label="Corporate gifts"
      lines={["Your People.", "Your Brand.", "A Lasting Impression."]}
      body="Thoughtfully curated gifts, customised for clients, employees, partners and every occasion."
      cta="Build Your Corporate Gift Set"
      programme="corporate"
      opener={corporateOpenerSlot}
      openerVariant="split"
      openerSide="right"
      sets={corporateSets}
      ratio="4 / 3"
    />
  );
}
