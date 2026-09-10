"use client";

/* The network map ships as a vector file, not an optimised project bitmap. */
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Boxes, Package, PackageCheck, Play, Star, Truck, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { ImageSlotVisual } from "./ImagePlaceholder";
import { AWARDS, type Award } from "./awardWall";
import { PROOF_CARDS, PROOF_LINKS, PROOF_NUMBERS, VOICES, formatProofNumber, type ProofNumber } from "./clientProof";
import { aboutBandSlot, clientLogoSlots } from "./imageSlots";
import { reachMapSvg } from "./sectionAssets";
import { VISIT_MESSAGE, whatsappLink } from "./SiteFooter";

/* -------------------------------------------------------------------------- */
/* 08  Clients, reviews and partner stories                                   */
/* -------------------------------------------------------------------------- */

/**
 * The four figures, counted up once as the row arrives.
 *
 * The markup ships the finished number, so the page is correct before any of
 * this runs and stays correct if it never does. The count is an enhancement
 * written straight to the DOM node rather than held in React state: it changes
 * sixty times a second, and putting that through a re-render would cost the
 * whole subtree every frame for a decorative effect.
 */
function ProofNumbers() {
  const ref = useRef<HTMLDListElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cells = [...root.querySelectorAll<HTMLElement>("[data-count]")];
    let frame = 0;

    const run = () => {
      const started = performance.now();
      const plan = cells.map((cell, index) => ({
        cell,
        target: Number(cell.dataset.count),
        decimals: Number(cell.dataset.decimals),
        suffix: cell.dataset.suffix ?? "",
        delay: index * 90,
      }));

      const tick = (now: number) => {
        let running = false;
        for (const { cell, target, decimals, suffix, delay } of plan) {
          const elapsed = now - started - delay;
          const t = Math.min(Math.max(elapsed / 1100, 0), 1);
          if (t < 1) running = true;
          /* Ease out, so the number settles rather than stopping dead. */
          const eased = 1 - (1 - t) ** 3;
          const at = target * eased;
          cell.textContent = decimals
            ? at.toFixed(decimals) + suffix
            : Math.round(at).toLocaleString("en-MY") + suffix;
        }
        if (running) frame = requestAnimationFrame(tick);
      };

      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        run();
      },
      { threshold: 0.4 },
    );
    observer.observe(root);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <dl className="proofnumbers" ref={ref} data-reveal-group>
      {PROOF_NUMBERS.map((entry) => (
        <div key={entry.label}>
          <dt>
            <span
              className="proofnumbers__value"
              data-count={entry.value}
              data-decimals={entry.decimals}
              data-suffix={entry.suffix ?? ""}
            >
              {formatProofNumber(entry)}
            </span>
            {entry.outOf ? <RatingStars entry={entry} /> : null}
          </dt>
          <dd>{entry.label}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * A rating is conventionally shown as stars, and the two figures that are
 * ratings say so. The fill is clipped to the exact score rather than rounded
 * up, so 4.9 is not drawn as five full stars.
 *
 * The stars restate the number beside them, so they are hidden from assistive
 * tech and the scale is given to it as words instead.
 */
function RatingStars({ entry }: { entry: ProofNumber }) {
  const stars = Array.from({ length: entry.outOf ?? 5 });
  return (
    <>
      <span className="sr-only"> out of {entry.outOf}</span>
      <span className="stars" aria-hidden="true">
        <span className="stars__track">
          {stars.map((_, index) => <Star key={index} />)}
        </span>
        <span className="stars__fill" style={{ width: `${Math.round((entry.value / (entry.outOf ?? 5)) * 1000) / 10}%` }}>
          {stars.map((_, index) => <Star key={index} />)}
        </span>
      </span>
    </>
  );
}

/**
 * The chapter that has to answer "should I trust these people with a 250-unit
 * order", in four movements: who buys from KIYO, how much, what the work looks
 * like, and what buyers say about it.
 *
 * It used to be one row split three ways, where the film was a still that
 * opened TikTok, the quotes had no names, and the partner stories were 100px
 * thumbnails under a heading that opened a chat window.
 */
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

      {/* Every figure carries its own scope. "4.9" on its own invites a reader
          to assume it covers everything KIYO sells, which is a claim KIYO has
          not made. See `PROOF_NUMBERS`. */}
      <ProofNumbers />

      {/* Five claims, each opening the best proof KIYO has for it: two product
          videos, three parts of this site. Every card prints where it goes, so
          the mixture is never a surprise. */}
      <ul className="proofstrip" data-reveal-group aria-label="What KIYO does">
        {PROOF_CARDS.map((card) => (
          <li key={card.caption}>
            <a
              className="proofcard"
              href={card.href}
              target={card.external ? "_blank" : undefined}
              rel={card.external ? "noreferrer" : undefined}
            >
              <ImageSlotVisual slot={card.slot} className="proofcard__media" />
              <span className="proofcard__scrim" aria-hidden="true" />
              {card.external ? <span className="proofcard__play" aria-hidden="true"><Play /></span> : null}
              <span className="proofcard__body">
                <span className="proofcard__caption">{card.caption}</span>
                <span className="proofcard__go">
                  {card.destination}
                  {card.external ? <ArrowUpRight aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
                </span>
              </span>
              {card.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
            </a>
          </li>
        ))}
      </ul>

      {/* One quote is featured with the photograph of that handover beside it;
          the other two sit under it. Three equal cards is the arrangement every
          other site uses for this block. */}
      <ul className="voices" data-reveal-group>
        {VOICES.map((voice, index) => (
          <li className={`voice${index === 0 ? " voice--lead" : ""}`} key={voice.quote}>
            {voice.slot ? <ImageSlotVisual slot={voice.slot} className="voice__media" /> : null}
            <figure>
              <span className="quote__mark" aria-hidden="true">&ldquo;</span>
              <blockquote>{voice.quote}</blockquote>
              {voice.gloss ? <p className="voice__gloss">{voice.gloss}</p> : null}
              <figcaption>
                {voice.href ? (
                  <a href={voice.href} target="_blank" rel="noreferrer">
                    {voice.source} <ArrowUpRight aria-hidden="true" />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : voice.source}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <p className="clients__more" data-reveal>
        <span>See more from KIYO on</span>
        {PROOF_LINKS.map(({ label, href }) => (
          <a key={label} href={href} target="_blank" rel="noreferrer">
            {label} <ArrowUpRight aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ))}
      </p>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 09  Samantha and recognition                                               */
/* -------------------------------------------------------------------------- */

/**
 * Put a hotspot exactly where its trophy stands in the photograph.
 *
 * The hotspot holds that trophy's own transparent cut-out, laid over the trophy
 * baked into the band. At rest the two are the same pixels in the same place,
 * so it is invisible. On hover the cut-out scales from its bottom edge and
 * rises, and because it grows by more than it rises it covers the original.
 *
 * The earlier version painted a rectangle of the band and scaled that, which
 * scaled whatever background was inside the rectangle along with the trophy. On
 * a smooth wall that was invisible; on the first trophy, whose box caught a
 * wall edge at 56.67% and the shelf surface at 34.06%, the background visibly
 * floated up with it. A cut-out has no background, so nothing behind a trophy
 * can move.
 *
 * Positions come from `tools/build-award-wall.mjs`. See `awardWall.ts`.
 */
function hotspot(award: Award): CSSProperties {
  return {
    left: `${award.left}%`,
    top: `${award.top}%`,
    width: `${award.width}%`,
    height: `${award.height}%`,
  };
}

const IDLE_CAPTION = "Recognised in live commerce";

/** Built on the same mechanics as the gift-set inspector, so the two match. */
function AwardDialog({
  index,
  onChange,
  onClose,
}: {
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

    /* The arrow keys walk the shelf the same way the buttons do. */
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") { event.preventDefault(); onChange((index + 1) % AWARDS.length); }
      if (event.key === "ArrowLeft") { event.preventDefault(); onChange((index - 1 + AWARDS.length) % AWARDS.length); }
    };
    dialog.addEventListener("keydown", onKey);

    return () => {
      dialog.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
      opener?.focus();
    };
  }, [index, onChange]);

  if (index === null) return null;
  const award = AWARDS[index];

  return (
    <dialog
      ref={dialogRef}
      className="awarddialog"
      aria-labelledby="awarddialog-title"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === dialogRef.current) onClose(); }}
    >
      <div className="awarddialog__surface">
        <button ref={closeRef} type="button" className="awarddialog__close" onClick={onClose} aria-label="Close award details">
          <X aria-hidden="true" />
        </button>

        <ImageSlotVisual slot={award.slot} className="awarddialog__media" />

        <div className="awarddialog__detail">
          <p className="awarddialog__year">{award.year}</p>
          <h3 id="awarddialog-title">{award.name}</h3>
          <p className="awarddialog__summary">{award.summary}</p>

          <div className="awarddialog__nav">
            <button type="button" onClick={() => onChange((index - 1 + AWARDS.length) % AWARDS.length)} aria-label="Previous award">
              <ArrowLeft aria-hidden="true" />
            </button>
            <span aria-hidden="true">{index + 1} / {AWARDS.length}</span>
            <button type="button" onClick={() => onChange((index + 1) % AWARDS.length)} aria-label="Next award">
              <ArrowRight aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export function FounderAndAwards() {
  const [open, setOpen] = useState<number | null>(null);
  const [caption, setCaption] = useState(IDLE_CAPTION);

  return (
    <section id="about" className="founder">
      {/* One photograph, not three layers. Samantha, the room and all fourteen
          trophies are composited in the plate, so nothing has to be registered
          against a shelf line at runtime and nothing slides off a shelf at odd
          browser zoom. The band has to keep the plate's 1920x800 ratio, because
          everything laid over it is placed as a percentage of that box. */}
      <ImageSlotVisual slot={aboutBandSlot} className="founder__band" />

      {/* The wall between Samantha and the shelving is the brightest, flattest
          part of the picture, which is why the copy needs no wash under it. */}
      <div className="founder__copy" data-reveal-group>
        <h2>Samantha Ng</h2>
        <p className="founder__role">Founder, KIYO Living</p>
        <figure className="founder__quote">
          <span className="quote__mark" aria-hidden="true">&ldquo;</span>
          <blockquote>Built to help organisations move together.</blockquote>
        </figure>
      </div>

      {/* Fourteen controls standing exactly where the trophies stand. Every
          position is a percentage of the same box the plate fills, so they hold
          at any width. The measurements live in `awardWall.ts`. */}
      <div className="recognition">
        <p className="recognition__caption" aria-hidden="true">{caption}</p>
        <p className="recognition__hint" aria-hidden="true">Select a trophy to read it</p>

        <ul className="awardwall">
          {AWARDS.map((award, index) => (
            <li key={award.name}>
              <button
                type="button"
                className="awardwall__spot"
                style={hotspot(award)}
                onMouseEnter={() => setCaption(award.name)}
                onFocus={() => setCaption(award.name)}
                onMouseLeave={() => setCaption(IDLE_CAPTION)}
                onBlur={() => setCaption(IDLE_CAPTION)}
                onClick={() => setOpen(index)}
              >
                <ImageSlotVisual slot={award.wallSlot} className="awardwall__lift" decorative />
                <span className="awardwall__cast" aria-hidden="true" />
                <span className="sr-only">{award.name}, {award.year}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* At phone width the band is about 167px tall, which would leave each
          trophy near 30px. A 30px target with a 30px picture inside it is not a
          control, so below 768px the awards come off the shelf into a row of
          their own. */}
      <ul className="awardrow" aria-label="KIYO awards">
        {AWARDS.map((award, index) => (
          <li key={award.name}>
            <button type="button" className="awardrow__item" onClick={() => setOpen(index)}>
              <ImageSlotVisual slot={award.slot} className="awardrow__media" decorative />
              <span className="awardrow__label">{award.name}</span>
              <span className="awardrow__year">{award.year}</span>
            </button>
          </li>
        ))}
      </ul>

      <AwardDialog index={open} onChange={setOpen} onClose={() => setOpen(null)} />
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
          <a className="button button--outline" href={whatsappLink(VISIT_MESSAGE)} target="_blank" rel="noreferrer">
            Arrange a visit <FaWhatsapp aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </aside>
    </section>
  );
}
