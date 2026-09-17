"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { ChapterOpener } from "./ChapterOpener";
import { ImageSlotVisual } from "./ImagePlaceholder";
import { ProductCarousel } from "./ProductCarousel";
import { useRetail } from "./RetailFlyout";
import { chooseOpenerSlot, deliverOpenerSlot, deliverPanels, personaliseOpenerSlot, personaliseSlots } from "./imageSlots";

/**
 * Chapters 5, 6 and 7: how a KIYO order works, in three steps.
 *
 * These used to be one form that assembled an enquiry across three screens.
 * The enquiry is now one form of its own (`QuoteSection`), so each step here
 * is a chapter that shows rather than asks: the luggage collection, the
 * customisation portfolio, and the three ways an order can end up with you.
 */

/* -------------------------------------------------------------------------- */
/* 05  Step 01, Choose                                                        */
/* -------------------------------------------------------------------------- */

export function ChooseStep() {
  const { openRetail } = useRetail();

  return (
    <section id="choose" className="chapter step step--choose" aria-labelledby="choose-title">
      <ChapterOpener
        titleId="choose-title"
        step="01"
        label="Choose"
        lines={["Your Idea.", "Your Budget.", "Our Recommendation."]}
        body="Choose from our collections, share your idea or simply tell us your budget. We'll curate the right gift set for you."
        slot={chooseOpenerSlot}
        variant="bleed"
        side="left"
      />

      <div className="step__body">
        <div className="railhead" data-reveal>
          <h3>The luggage collection</h3>
          {/* Retail is one panel with both stores behind it, so a single unit
              never leaves the page through a guessed platform. */}
          <button
            type="button"
            data-retail-trigger
            className="button button--ghost railhead__shop"
            aria-haspopup="dialog"
            aria-controls="retail-flyout"
            onClick={() => openRetail("press")}
          >
            Shop more <ArrowUpRight aria-hidden="true" />
          </button>
        </div>

        <ProductCarousel />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 06  Step 02, Personalise                                                   */
/* -------------------------------------------------------------------------- */

/* The promise in the chapter's own sentence, as the three things that happen. */
const PERSONALISE_STEPS = [
  "Share your logo",
  "We send a free design mockup",
  "Approve it, then we print",
] as const;

export function PersonaliseStep() {
  return (
    <section id="personalise" className="chapter step step--personalise" aria-labelledby="personalise-title">
      <ChapterOpener
        titleId="personalise-title"
        step="02"
        label="Personalise"
        lines={["Your Brand.", "Your Gift.", "Your Way."]}
        body="Share your logo. We'll create a FREE custom design for your approval."
        slot={personaliseOpenerSlot}
        variant="bleed"
        side="right"
      />

      <div className="step__body">
        {/* Five pictures in the order a customisation happens: the logo plate
            large, then the tag, the shell colours, the accessories and the
            approval mockup. Captions sit under the pictures, not on them. */}
        <ul className="bento" data-reveal-group aria-label="What KIYO can customise">
          {personaliseSlots.map(({ slot, caption }) => (
            <li className="bento__cell" key={slot.id}>
              <figure>
                <ImageSlotVisual slot={slot} className="bento__media" />
                <figcaption>{caption}</figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <ol className="personalise-steps" data-reveal-group aria-label="How personalisation works">
          {PERSONALISE_STEPS.map((line, index) => (
            <li key={line}>
              <span className="personalise-steps__number" aria-hidden="true">{index + 1}</span>
              {line}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 07  Step 03, Deliver                                                       */
/* -------------------------------------------------------------------------- */

export function DeliverStep() {
  const [open, setOpen] = useState(0);

  return (
    <section id="deliver" className="chapter step step--deliver" aria-labelledby="deliver-title">
      <ChapterOpener
        titleId="deliver-title"
        step="03"
        label="Deliver"
        lines={["Deliver to You.", "Store Here.", "Pick Up Anytime."]}
        body="Delivered to your doorstep, stored securely at our warehouse, or picked up whenever you're ready."
        slot={deliverOpenerSlot}
        variant="bleed"
        side="left"
      />

      <div className="step__body">
        {/* The headline makes three promises, so this is three panels, one per
            promise. The one under the pointer, or the one tapped, opens out and
            shows its line; the other two stay as strips. Every panel is a real
            button so the keyboard walks them too. */}
        <ul className="accordion" data-reveal aria-label="Three ways to receive your order">
          {deliverPanels.map(({ slot, title, line }, index) => (
            <li className={`accordion__panel${open === index ? " is-open" : ""}`} key={slot.id}>
              <button
                type="button"
                className="accordion__open"
                aria-expanded={open === index}
                onMouseEnter={() => setOpen(index)}
                onFocus={() => setOpen(index)}
                onClick={() => setOpen(index)}
              >
                <ImageSlotVisual slot={slot} className="accordion__media" />
                <span className="accordion__caption">
                  <strong>{title}</strong>
                  <span>{line}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
