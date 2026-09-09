"use client";

/* The network map ships as a vector file, not an optimised project bitmap. */
/* eslint-disable @next/next/no-img-element */

import { ArrowRight, ArrowUpRight, Boxes, Package, PackageCheck, Play, Truck } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { ImageSlotVisual } from "./ImagePlaceholder";
import {
  awardRowSlots,
  clientLogoSlots,
  clientVideoSlot,
  founderSlots,
  partnerStorySlots,
} from "./imageSlots";
import { reachMapSvg } from "./sectionAssets";
import { TIKTOK_URL, WHATSAPP_URL } from "./SiteFooter";

/* -------------------------------------------------------------------------- */
/* 08  Clients, reviews and partner stories                                   */
/* -------------------------------------------------------------------------- */

export type CustomerReview = { quote: string; source: string };

/**
 * The two quotes are attributed to a role rather than a person, which is how
 * the approved mockup carries them. Add the client's name to `source` once KIYO
 * supplies a quote it has permission to attribute.
 */
export const customerReviews: CustomerReview[] = [
  { quote: "Reliable quality and seamless coordination from start to finish.", source: "Corporate client" },
  { quote: "Our jemaah love the sets. Everything was handled for us.", source: "UMRAH agency partner" },
];

export function ClientProof() {
  return (
    <section id="clients" className="clients">
      <p className="clients__label" data-reveal>Trusted by leading organisations</p>

      {/* The marks loop rather than wrap, so twelve of them can be shown large
          instead of small. The list is rendered twice and the track is shifted
          by exactly half its width, which is the only offset that wraps without
          a visible jump. The duplicate is hidden from assistive tech. */}
      <div className="logomarquee" aria-label="Client logos">
        <div className="logomarquee__track">
          {[0, 1].map((pass) => (
            <ul className="logomarquee__run" key={pass} aria-hidden={pass === 1 || undefined}>
              {clientLogoSlots.map((slot) => (
                <li key={`${pass}-${slot.id}`}>
                  <ImageSlotVisual slot={slot} className="logowall__mark" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <div className="clients__body">
        <a className="videocard" data-reveal="left" href={TIKTOK_URL} target="_blank" rel="noreferrer">
          <ImageSlotVisual slot={clientVideoSlot} className="videocard__media" />
          <span className="videocard__scrim" aria-hidden="true" />
          <span className="videocard__play" aria-hidden="true"><Play /></span>
          <span className="sr-only">Watch KIYO on TikTok (opens in a new tab)</span>
        </a>

        <ul className="quotes" data-reveal-group>
          {customerReviews.map((review) => (
            <li className="quote" key={review.quote}>
              <span className="quote__mark" aria-hidden="true">&ldquo;</span>
              <blockquote>{review.quote}</blockquote>
              <cite>{review.source}</cite>
            </li>
          ))}
        </ul>

        {/* Third region of the same row, not a band of its own: in the mockup
            the partner stories are a small column of thumbnails beside the
            quotes rather than a second gallery under them. */}
        <div className="stories" data-reveal>
          <a className="stories__head" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
            Partner stories <ArrowRight aria-hidden="true" />
            <span className="sr-only"> (ask us on WhatsApp, opens in a new tab)</span>
          </a>
          <div className="stories__grid" data-reveal-group>
            {partnerStorySlots.map((slot) => (
              <ImageSlotVisual key={slot.id} slot={slot} className="stories__tile" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 09  Samantha and recognition                                               */
/* -------------------------------------------------------------------------- */

export function FounderAndAwards() {
  return (
    <section id="about" className="founder">
      {/* One photographed room: the shelving is the band, not a panel inside
          it, so Samantha stands in the space rather than in a box. */}
      <ImageSlotVisual slot={founderSlots.backdrop} className="founder__backdrop" decorative />
      <span className="founder__wash" aria-hidden="true" />

      <div className="founder__inner">
        <ImageSlotVisual slot={founderSlots.portrait} className="founder__cutout" data-reveal="left" />

        <div className="founder__copy" data-reveal-group>
          <h2>Samantha Ng</h2>
          <p className="founder__role">Founder, KIYO Living</p>
          <figure className="founder__quote">
            <span className="quote__mark" aria-hidden="true">&ldquo;</span>
            <blockquote>Built to help organisations move together.</blockquote>
          </figure>
        </div>
      </div>

      {/* Two rows, each stood on one of the shelves in the photograph. The
          positions are percentages of the backdrop, so this is a child of the
          band rather than of the content column - and the band has to keep the
          plate's aspect ratio. See `.founder` and `.recognition`. */}
      <div className="recognition" data-reveal="right">
        <p className="recognition__label">Recognised in live commerce</p>
        {awardRowSlots.map((slot, row) => (
          <ImageSlotVisual key={slot.id} slot={slot} className={`recognition__row recognition__row--${row + 1}`} />
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 10  Nationwide coordination and the showroom                               */
/* -------------------------------------------------------------------------- */

const REACH = [
  { label: "Stock", icon: Boxes },
  { label: "Pack", icon: Package },
  { label: "Coordinate", icon: PackageCheck },
  { label: "Deliver", icon: Truck },
] as const;

const MAP_EMBED =
  "https://maps.google.com/maps?q=No.%2016%2C%20Jalan%20SC%201%2C%20Pusat%20Perindustrian%20Sungai%20Chua%2C%2043000%20Kajang%2C%20Selangor&z=15&output=embed";

export const MAP_LINK =
  "https://www.google.com/maps/search/?api=1&query=No.+16,+Jalan+SC+1,+Pusat+Perindustrian+Sungai+Chua,+43000+Kajang,+Selangor";

export function VisitKiyo() {
  return (
    <section id="visit" className="visit">
      {/* Copy and the four capabilities on the left, the map beside them - the
          mockup runs them side by side, and stacking the map above the icons
          made this band a screen and a half on its own. */}
      <div className="visit__reach" data-reveal-group>
        <div className="visit__copy">
          <h2>Nationwide<br />coordination.</h2>
          <p>From our warehouse to every destination in Malaysia.</p>

          <ul className="reachrow">
            {REACH.map(({ label, icon: Icon }) => (
              <li key={label}><span><Icon aria-hidden="true" /></span>{label}</li>
            ))}
          </ul>
        </div>

        <div className="visit__map">
          <img
            className="reachmap"
            src={reachMapSvg}
            alt="A map of Malaysia showing KIYO delivering from Kajang to every state"
            width="915"
            height="400"
            loading="lazy"
            decoding="async"
          />
          {/* The base map is CC BY 3.0, which requires the credit to be visible
              rather than buried in the file. */}
          <p className="reachmap__credit">
            Base map by Exiang, <a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noreferrer license">CC BY 3.0</a>.
          </p>
        </div>
      </div>

      <aside className="visitcard" data-reveal="right">
        <p className="visitcard__eyebrow">Visit KIYO</p>
        <h3>Kajang, Selangor</h3>
        <address>
          No. 16, Jalan SC 1, Pusat Perindustrian Sungai Chua,
          <br />
          43000 Kajang, Selangor.
        </address>
        <p className="visitcard__hours">Monday to Saturday, 9:00am to 6:00pm. Visits by appointment.</p>

        <div className="visitcard__map">
          <iframe
            title="Map showing KIYO Living in Kajang, Selangor"
            src={MAP_EMBED}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="visitcard__actions">
          <a className="button button--coral" href={MAP_LINK} target="_blank" rel="noreferrer">
            Get directions <ArrowUpRight aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a className="button button--outline" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
            Arrange a visit <FaWhatsapp aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </aside>
    </section>
  );
}
