"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * The four stages of an agency UMRAH order, each told as a small animated
 * scene rather than a static icon.
 *
 * Scenes are inline SVG so they inherit the brand tokens, weigh a few KB and
 * need no new dependency. Each card owns a paused GSAP timeline that plays once
 * when it scrolls into view and replays on hover or keyboard focus. Continuous
 * looping was considered and rejected: four looping scenes beside the drifting
 * product carousel is too much movement at once.
 *
 * Under `prefers-reduced-motion` no timeline is built at all and every scene
 * renders in its finished state, so the meaning survives without the motion.
 */

const STEPS = [
  {
    step: "01",
    title: "Consult",
    description: "We size the programme, confirm quantities and agree the pieces.",
  },
  {
    step: "02",
    title: "Brand",
    description: "Your agency logo and identity applied across the coordinated set.",
  },
  {
    step: "03",
    title: "Approve",
    description: "A physical sample signed off before the full run begins.",
  },
  {
    step: "04",
    title: "Deliver",
    description: "Packed, checked and delivered to your office or departure point.",
  },
] as const;

/* 01 — a conversation: agency asks, KIYO answers. */
function ConsultScene() {
  return (
    <svg viewBox="0 0 120 90" role="img" aria-label="A conversation between an agency and KIYO">
      <g className="scene-in" data-scene-part="bubble-a">
        <rect x="6" y="14" width="62" height="24" rx="8" className="scene-fill-soft" />
        <rect x="16" y="22" width="34" height="3" rx="1.5" className="scene-line" />
        <rect x="16" y="29" width="24" height="3" rx="1.5" className="scene-line" />
      </g>

      <g data-scene-part="dots">
        <circle cx="80" cy="52" r="3" className="scene-dot" />
        <circle cx="90" cy="52" r="3" className="scene-dot" />
        <circle cx="100" cy="52" r="3" className="scene-dot" />
      </g>

      <g className="scene-in" data-scene-part="bubble-b">
        <rect x="48" y="44" width="66" height="26" rx="8" className="scene-fill-strong" />
        <rect x="58" y="53" width="32" height="3" rx="1.5" className="scene-line-invert" />
        <rect x="58" y="60" width="20" height="3" rx="1.5" className="scene-line-invert" />
        <path d="M99 58.5l3.5 3.5 6-6.5" className="scene-tick-invert" data-scene-part="tick" />
      </g>
    </svg>
  );
}

/* 02 — the case outline draws, a colour is chosen, the shell takes it. */
function BrandScene() {
  return (
    <svg viewBox="0 0 120 90" role="img" aria-label="Agency branding applied to a luggage set">
      <rect x="38" y="10" width="44" height="54" rx="7" className="scene-shell" data-scene-part="shell" />
      <rect x="38" y="10" width="44" height="54" rx="7" className="scene-outline" data-scene-part="outline" />
      <path d="M56 10V4h8v6" className="scene-outline" data-scene-part="handle" />
      <rect x="50" y="28" width="20" height="14" rx="3" className="scene-mark" data-scene-part="mark" />

      <g data-scene-part="chips">
        <circle cx="42" cy="78" r="6" className="scene-chip scene-chip--a" />
        <circle cx="60" cy="78" r="6" className="scene-chip scene-chip--b" />
        <circle cx="78" cy="78" r="6" className="scene-chip scene-chip--c" />
      </g>
      <circle cx="60" cy="78" r="9.5" className="scene-ring" data-scene-part="ring" />
    </svg>
  );
}

/* 03 — the sample checklist is ticked off and stamped. */
function ApproveScene() {
  return (
    <svg viewBox="0 0 120 90" role="img" aria-label="A sample checklist being approved">
      <rect x="26" y="8" width="60" height="74" rx="7" className="scene-fill-soft" />
      <rect x="26" y="8" width="60" height="74" rx="7" className="scene-outline" data-scene-part="board" />
      <rect x="48" y="3" width="16" height="9" rx="3" className="scene-outline" />

      {[26, 44, 62].map((y, index) => (
        <g key={y} data-scene-part="row" data-row={index}>
          <rect x="36" y={y} width="11" height="11" rx="3" className="scene-outline" />
          <path d={`M38.5 ${y + 5.5}l2.5 2.5 5-5.5`} className="scene-tick" data-scene-part="tick" />
          <rect x="53" y={y + 3} width={index === 1 ? 20 : 26} height="3" rx="1.5" className="scene-line" />
        </g>
      ))}

      <g data-scene-part="seal">
        <circle cx="88" cy="66" r="15" className="scene-seal" />
        <path d="M81 66l5 5 9-10" className="scene-tick-invert" />
      </g>
    </svg>
  );
}

/* 04 — the lorry loads the order and pulls away. */
function DeliverScene() {
  return (
    <svg viewBox="0 0 120 90" role="img" aria-label="A delivery lorry loading and departing">
      <g data-scene-part="lines">
        <rect x="2" y="34" width="18" height="2.5" rx="1.25" className="scene-line" />
        <rect x="0" y="46" width="12" height="2.5" rx="1.25" className="scene-line" />
      </g>

      <g data-scene-part="parcel">
        <rect x="40" y="18" width="18" height="16" rx="2" className="scene-fill-strong" />
        <path d="M49 18v16M40 26h18" className="scene-line-invert" />
      </g>

      <g data-scene-part="lorry">
        <rect x="30" y="38" width="40" height="26" rx="4" className="scene-shell" />
        <rect x="30" y="38" width="40" height="26" rx="4" className="scene-outline" />
        <path d="M70 46h14l8 10v8H70z" className="scene-shell" />
        <path d="M70 46h14l8 10v8H70z" className="scene-outline" />
        <rect x="73" y="49" width="12" height="7" rx="2" className="scene-fill-soft" />
        <g data-scene-part="wheels">
          <circle cx="44" cy="68" r="6.5" className="scene-wheel" />
          <circle cx="80" cy="68" r="6.5" className="scene-wheel" />
        </g>
      </g>

      <rect x="0" y="76" width="120" height="2.5" rx="1.25" className="scene-road" />
    </svg>
  );
}

const SCENES = [ConsultScene, BrandScene, ApproveScene, DeliverScene] as const;

/** Build the timeline for one card. Returns a paused timeline. */
function buildTimeline(card: HTMLElement, index: number) {
  const q = gsap.utils.selector(card);
  const timeline = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });

  if (index === 0) {
    timeline
      .fromTo(q('[data-scene-part="bubble-a"]'), { x: -14, autoAlpha: 0, scale: 0.9 }, { x: 0, autoAlpha: 1, scale: 1, duration: 0.42, transformOrigin: "left center" })
      .fromTo(q('[data-scene-part="dots"] circle'), { autoAlpha: 0, y: 3 }, { autoAlpha: 1, y: -3, duration: 0.24, stagger: 0.09, repeat: 3, yoyo: true }, ">-0.05")
      .to(q('[data-scene-part="dots"]'), { autoAlpha: 0, duration: 0.18 })
      .fromTo(q('[data-scene-part="bubble-b"]'), { x: 16, autoAlpha: 0, scale: 0.9 }, { x: 0, autoAlpha: 1, scale: 1, duration: 0.44, ease: "back.out(1.6)", transformOrigin: "right center" }, "<")
      /* Stroke reveals use stroke-dashoffset rather than DrawSVGPlugin, which
         is a paid GSAP plugin this project does not license. */
      .fromTo(q('[data-scene-part="tick"]'), { strokeDashoffset: 20, autoAlpha: 0 }, { strokeDashoffset: 0, autoAlpha: 1, duration: 0.34 }, ">-0.1");
    return timeline;
  }

  if (index === 1) {
    timeline
      .fromTo(q('[data-scene-part="outline"], [data-scene-part="handle"]'), { strokeDashoffset: 260, autoAlpha: 1 }, { strokeDashoffset: 0, duration: 0.75, stagger: 0.08 })
      .fromTo(q('[data-scene-part="chips"] circle'), { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.34, stagger: 0.08 }, "-=0.3")
      .fromTo(q('[data-scene-part="ring"]'), { scale: 0.4, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.34, ease: "back.out(2)", transformOrigin: "center" })
      .to(q('[data-scene-part="shell"]'), { fill: "var(--teal)", duration: 0.44 }, "<")
      .fromTo(q('[data-scene-part="mark"]'), { scale: 0.5, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.36, ease: "back.out(2)", transformOrigin: "center" }, "<0.12");
    return timeline;
  }

  if (index === 2) {
    timeline
      .fromTo(q('[data-scene-part="board"]'), { strokeDashoffset: 300 }, { strokeDashoffset: 0, duration: 0.6 })
      .fromTo(q('[data-scene-part="row"]'), { x: -8, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.3, stagger: 0.12 }, "-=0.25")
      .fromTo(q('[data-scene-part="row"] [data-scene-part="tick"]'), { strokeDashoffset: 18 }, { strokeDashoffset: 0, duration: 0.26, stagger: 0.14 }, "-=0.2")
      .fromTo(q('[data-scene-part="seal"]'), { scale: 0.3, rotate: -22, autoAlpha: 0 }, { scale: 1, rotate: -10, autoAlpha: 1, duration: 0.5, ease: "back.out(2.2)", transformOrigin: "center" }, "-=0.1");
    return timeline;
  }

  timeline
    .fromTo(q('[data-scene-part="lorry"]'), { x: -70, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.7, ease: "power2.out" })
    .fromTo(q('[data-scene-part="wheels"] circle'), { rotate: 0 }, { rotate: 360, duration: 0.7, ease: "none", transformOrigin: "center" }, "<")
    .fromTo(q('[data-scene-part="parcel"]'), { y: -26, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, ease: "bounce.out" }, "-=0.15")
    .to(q('[data-scene-part="parcel"]'), { y: 14, scale: 0.7, autoAlpha: 0, duration: 0.32, ease: "power2.in" }, ">0.1")
    .fromTo(q('[data-scene-part="lines"] rect'), { scaleX: 0, autoAlpha: 0, transformOrigin: "right center" }, { scaleX: 1, autoAlpha: 1, duration: 0.24, stagger: 0.07 }, ">-0.1")
    .to(q('[data-scene-part="lorry"]'), { x: 96, autoAlpha: 0, duration: 0.7, ease: "power2.in" }, "<")
    .to(q('[data-scene-part="wheels"] circle'), { rotate: 720, duration: 0.7, ease: "none", transformOrigin: "center" }, "<")
    .to(q('[data-scene-part="lines"] rect'), { autoAlpha: 0, duration: 0.2 }, "<0.3")
    /* Drive off, then return to a parked lorry. Without this the card's resting
       state is an empty road, which reads as a broken illustration rather than
       a finished delivery. */
    .set(q('[data-scene-part="lorry"]'), { x: 0, autoAlpha: 1 })
    .fromTo(q('[data-scene-part="lorry"]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 });

  return timeline;
}

export function UmrahProcessFlow() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-process-card]");

      cards.forEach((card, index) => {
        const timeline = buildTimeline(card, index);

        ScrollTrigger.create({
          trigger: card,
          start: "top 82%",
          once: true,
          /* Left to right, so the row reads as a sequence rather than four
             things firing at once. */
          onEnter: () => gsap.delayedCall(index * 0.25, () => timeline.play(0)),
        });

        const replay = () => {
          if (timeline.isActive()) return;
          timeline.play(0);
        };
        card.addEventListener("pointerenter", replay);
        card.addEventListener("focusin", replay);
      });
    }, root);

    return () => context.revert();
  }, []);

  return (
    <div className="umrah__process" ref={rootRef}>
      <h3>How an agency order runs</h3>
      <ol>
        {STEPS.map(({ step, title, description }, index) => {
          const Scene = SCENES[index];
          return (
            <li key={step} data-process-card tabIndex={0}>
              <span className="umrah__process-step">{step}</span>
              <div className="umrah__process-scene" aria-hidden="true"><Scene /></div>
              <strong>{title}</strong>
              <p>{description}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
