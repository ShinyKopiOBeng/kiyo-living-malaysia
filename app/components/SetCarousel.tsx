"use client";

/* Placeholder tiles carry the vector mark, served straight from public. */
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Expand } from "lucide-react";
import { ImageSlotVisual } from "./ImagePlaceholder";
import type { GiftSet } from "./giftSets";

/* Pixels a second. Slow enough to read a set name as it passes. */
const DRIFT_SPEED = 28;
/* How long after the last touch or drag before the drift resumes. */
const RESUME_AFTER = 3000;
/* Under this much pointer travel a press is a click, not a drag. */
const DRAG_TOLERANCE = 6;

/**
 * Six sets on a track that drifts left on its own.
 *
 * The track is a native scroll container, so touch, trackpad and keyboard all
 * work without being reimplemented, and the arrows page it by one card. The
 * drift is one `scrollLeft` nudge a frame on top of that. It pauses while a
 * pointer is over the rail, while anything inside it has focus, while a finger
 * or a mouse button is down, and while the rail is off screen; it resumes a
 * few seconds after the last interaction. Under `prefers-reduced-motion` it
 * never starts.
 *
 * The list is rendered twice. Half the track is exactly one run, so wrapping
 * the scroll position by that width lands on identical pixels, which is what
 * makes the loop seamless in both directions. The second run is hidden from
 * assistive tech and its controls are taken out of the tab order, so a
 * screen reader meets six sets rather than twelve.
 */
export function SetCarousel({
  sets,
  ratio,
  onOpen,
  suspended = false,
  label,
}: {
  sets: GiftSet[];
  /** The card's picture ratio, which differs between the two deliveries. */
  ratio: "3 / 2" | "4 / 3";
  onOpen: (index: number) => void;
  /** Held still from outside, while the inspector is open. */
  suspended?: boolean;
  label: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [held, setHeld] = useState(false);
  const [resting, setResting] = useState(false);
  const [visible, setVisible] = useState(false);
  /* Read once, as a subscription rather than a set in an effect body, so the
     server render and the first client render agree. */
  const [reduceMotion, setReduceMotion] = useState(false);
  const restTimer = useRef<number | null>(null);
  const drag = useRef({ pointerId: -1, startX: 0, originLeft: 0, travel: 0 });

  /** One run's width, which is the wrap length. Measured between the two runs
      rather than as half the scroll width, because the track's own padding is
      part of the scroll width and would put the wrap off by half of it. */
  const runWidth = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const runs = track.querySelectorAll<HTMLElement>(".carousel__run");
    return runs.length === 2 ? runs[1].offsetLeft - runs[0].offsetLeft : 0;
  }, []);

  /* Keep the position inside one run. Jumping by exactly a run's width lands on
     the same pixels, so neither wrap is visible. */
  const wrap = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const run = runWidth();
    if (run <= 0) return;
    if (track.scrollLeft >= run) track.scrollLeft -= run;
    else if (track.scrollLeft <= 0) track.scrollLeft += run;
  }, [runWidth]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(query.matches);
    query.addEventListener("change", sync);
    /* The initial value is read through the same subscription path. */
    const initial = window.setTimeout(sync, 0);
    return () => {
      query.removeEventListener("change", sync);
      window.clearTimeout(initial);
    };
  }, []);

  /* Start one card in, so the first wrap backwards has somewhere to go. */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollLeft = 1;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.1 });
    observer.observe(track);
    track.addEventListener("scroll", wrap, { passive: true });
    return () => {
      observer.disconnect();
      track.removeEventListener("scroll", wrap);
    };
  }, [wrap]);

  /* A finger or a drag has just let go: rest, then drift again. */
  const rest = useCallback(() => {
    setResting(true);
    if (restTimer.current !== null) window.clearTimeout(restTimer.current);
    restTimer.current = window.setTimeout(() => setResting(false), RESUME_AFTER);
  }, []);

  useEffect(() => () => { if (restTimer.current !== null) window.clearTimeout(restTimer.current); }, []);

  const drifting = visible && !reduceMotion && !suspended && !hovered && !focused && !held && !resting;

  useEffect(() => {
    if (!drifting) return;
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 64) / 1000;
      last = now;
      track.scrollLeft += DRIFT_SPEED * dt;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [drifting]);

  /** Distance from one card to the next, gap included. */
  const page = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const cards = track.querySelectorAll<HTMLElement>(".setcard");
    const pitch = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth;
    track.scrollBy({ left: direction * pitch, behavior: reduceMotion ? "auto" : "smooth" });
    rest();
  };

  /* A mouse cannot drag a scroll container natively, so a press-and-move on
     the rail moves it by hand. A press that barely moves is left alone, so the
     click underneath still opens the set. */
  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;
    setHeld(true);
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    drag.current = { pointerId: event.pointerId, startX: event.clientX, originLeft: track.scrollLeft, travel: 0 };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track || drag.current.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.current.startX;
    drag.current.travel = Math.max(drag.current.travel, Math.abs(dx));
    if (drag.current.travel > DRAG_TOLERANCE) {
      track.scrollLeft = drag.current.originLeft - dx;
      track.setPointerCapture?.(event.pointerId);
    }
  };

  const endPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    setHeld(false);
    rest();
    if (drag.current.pointerId === event.pointerId) {
      if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
      drag.current.pointerId = -1;
    }
  };

  const onClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (drag.current.travel > DRAG_TOLERANCE) {
      event.preventDefault();
      event.stopPropagation();
      drag.current.travel = 0;
    }
  };

  return (
    <div
      className="carousel"
      onPointerEnter={(event) => { if (event.pointerType === "mouse") setHovered(true); }}
      onPointerLeave={(event) => { if (event.pointerType === "mouse") setHovered(false); }}
      onFocus={() => setFocused(true)}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }}
    >
      <div
        className="carousel__track"
        ref={trackRef}
        aria-label={label}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        onClickCapture={onClickCapture}
      >
        {[0, 1].map((pass) => (
          <ul className="carousel__run" key={pass} aria-hidden={pass === 1 || undefined}>
            {sets.map((set, index) => (
              <li className="setcard" key={`${pass}-${set.id}`} style={{ "--card-ratio": ratio } as React.CSSProperties}>
                <button
                  type="button"
                  className="setcard__open"
                  aria-haspopup="dialog"
                  tabIndex={pass === 1 ? -1 : undefined}
                  onClick={() => onOpen(index)}
                  draggable={false}
                >
                  {set.slot ? (
                    <ImageSlotVisual slot={set.slot} className="setcard__media" />
                  ) : (
                    /* A branded tile while the plate is awaited, so the sixth
                       set holds its place without showing half a picture. */
                    <span className="setcard__pending" aria-hidden="true">
                      <img src="/images/kiyo-logo-white.svg" alt="" width="212" height="86" />
                      <span>Photo coming soon</span>
                    </span>
                  )}
                  <span className="setcard__scrim" aria-hidden="true" />
                  <span className="setcard__cta" aria-hidden="true">View set <Expand /></span>
                  <span className="sr-only">View the {set.title}</span>
                </button>
                <span className="setcard__label">{set.title}</span>
              </li>
            ))}
          </ul>
        ))}
      </div>

      <div className="carousel__controls">
        <p className="carousel__hint">{sets.length} sets. Hover to pause, click a set to see what is in it.</p>
        <div className="carousel__arrows">
          <button type="button" className="carousel__arrow" onClick={() => page(-1)} aria-label={`Previous ${label.toLowerCase()}`}>
            <ArrowLeft aria-hidden="true" />
          </button>
          <button type="button" className="carousel__arrow" onClick={() => page(1)} aria-label={`Next ${label.toLowerCase()}`}>
            <ArrowRight aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
