"use client";

/* Placeholder tiles carry the vector mark, served straight from public. */
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Play, Star } from "lucide-react";
import { ChapterOpener } from "./ChapterOpener";
import { ImageSlotVisual } from "./ImagePlaceholder";
import { CLIENT_VIDEOS, PROOF_LINKS, PROOF_NUMBERS, formatProofNumber, type ClientVideo, type ProofNumber } from "./clientProof";
import { aboutBandSlot, clientLogoSlots, clientsOpenerSlot } from "./imageSlots";

/* -------------------------------------------------------------------------- */
/* The proof strip, under the hero                                            */
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
export function ProofStrip() {
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
    <section className="proof" aria-label="KIYO in numbers">
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
    </section>
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

/* -------------------------------------------------------------------------- */
/* 09  Clients                                                                */
/* -------------------------------------------------------------------------- */

/**
 * A video card in one of three states: a clip that plays in place, a link to
 * a clip that lives elsewhere, or the branded tile that holds the slot until
 * KIYO's clip arrives. The tile is honest about being a placeholder.
 */
function VideoCard({ video }: { video: ClientVideo }) {
  const [playing, setPlaying] = useState(false);

  if (video.src) {
    return (
      <li className="videocard">
        {playing ? (
          <video className="videocard__player" src={video.src} poster={video.poster} controls autoPlay playsInline>
            <track kind="captions" />
          </video>
        ) : (
          <button type="button" className="videocard__poster" onClick={() => setPlaying(true)}>
            {video.poster ? <img src={video.poster} alt="" width="720" height="1280" loading="lazy" decoding="async" /> : null}
            <span className="videocard__play" aria-hidden="true"><Play /></span>
            <span className="sr-only">Play: {video.caption}</span>
          </button>
        )}
        <p className="videocard__caption">{video.caption}</p>
      </li>
    );
  }

  if (video.embed) {
    return (
      <li className="videocard">
        <a className="videocard__poster" href={video.embed} target="_blank" rel="noreferrer">
          {video.poster ? <img src={video.poster} alt="" width="720" height="1280" loading="lazy" decoding="async" /> : null}
          <span className="videocard__play" aria-hidden="true"><Play /></span>
          <span className="sr-only">Watch: {video.caption} (opens in a new tab)</span>
        </a>
        <p className="videocard__caption">{video.caption}</p>
      </li>
    );
  }

  return (
    <li className="videocard">
      <div className="videocard__poster videocard__poster--pending">
        <img src="/images/kiyo-logo-white.svg" alt="" width="212" height="86" />
        <span className="videocard__play" aria-hidden="true"><Play /></span>
        <span className="videocard__soon">Video coming soon</span>
      </div>
      <p className="videocard__caption">{video.caption}</p>
    </li>
  );
}

/**
 * The chapter that has to answer "should I trust these people with a 250-unit
 * order": who buys from KIYO, then what those buyers say on camera.
 */
export function ClientProof() {
  return (
    <section id="clients" className="clients" aria-labelledby="clients-title">
      <ChapterOpener
        titleId="clients-title"
        label="Our clients' testimonials"
        lines={["Real Clients.", "Real Experiences.", "Lasting Trust."]}
        body="Hear from the businesses and agencies who trusted KIYO with their gifts, programmes and deliveries."
        slot={clientsOpenerSlot}
        variant="bleed"
        side="right"
      />

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

      {/* Three portrait cards, because KIYO's video is TikTok video and a
          landscape frame around a portrait clip is two black bars. */}
      <ul className="videos" data-reveal-group aria-label="Client videos">
        {CLIENT_VIDEOS.map((video) => <VideoCard video={video} key={video.id} />)}
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
/* 10  Samantha and Awards                                                    */
/* -------------------------------------------------------------------------- */

/**
 * One photograph, and a name on the wall beside her. The trophies are in the
 * picture and nothing on the page claims anything about them: the hotspots,
 * the award dialog and the list of award names all went with V15.
 */
export function FounderAndAwards() {
  return (
    <section id="about" className="founder" aria-labelledby="about-title">
      <ImageSlotVisual slot={aboutBandSlot} className="founder__band" />

      {/* The wall between Samantha and the shelving is the brightest, flattest
          part of the picture, which is why the copy needs no wash under it. */}
      <div className="founder__copy" data-reveal-group>
        <p className="eyebrow">Samantha and Awards</p>
        <h2 id="about-title">Samantha Ng</h2>
        <p className="founder__role">Founder, KIYO Living</p>
        <figure className="founder__quote">
          <blockquote>Built to help organisations move together.</blockquote>
        </figure>
      </div>
    </section>
  );
}
