"use client";

import { useCallback, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BadgeCheck, PackageCheck, Warehouse, Wrench } from "lucide-react";
import { ImageSlotVisual } from "./ImagePlaceholder";
import { warehouseBandSlot } from "./imageSlots";
import { ScrollFloat } from "./ScrollFloat";

/* The four things that happen inside the building, called out under the band. */
const capabilities = [
  { label: "Warehouse", icon: Warehouse },
  { label: "Customisation", icon: Wrench },
  { label: "QC", icon: BadgeCheck },
  { label: "Fulfilment", icon: PackageCheck },
] as const;

/* The three lines of the claim, each with the verb that carries it. */
const claim = [
  ["Designed", "here."],
  ["Prepared", "here."],
  ["Delivered", "from here."],
] as const;

/* Where each line starts on the timeline. A line takes its duration plus its
   character stagger, so the gaps leave each one whole before the next
   begins. The place and the four capabilities follow the last line, and the
   hold at the end keeps everything on screen before the band lets go. */
const LINE_AT = [0, 1.5, 3];
const DETAILS_AT = 4.2;
const HOLD = 0.8;
/* How far the page scrolls while the band holds still, in viewport heights. */
const PIN_LENGTH = 2;

/**
 * The warehouse band: the building at dusk, and the three-line claim.
 *
 * The photograph pins to the screen and the claim arrives one line at a time
 * as the visitor scrolls, each line floating up character by character. The
 * scroll drives a single timeline the three lines join, so a fast scroll
 * scrubs through all three and a slow one reads them in order. The place
 * and the capabilities are on the same timeline, after the last line: while
 * the band is pinned nothing under it moves, so the page's viewport-driven
 * reveals would never reach them. Under `prefers-reduced-motion` nothing
 * pins and the whole band is simply there.
 */
export function WarehouseBand() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  /* The lines add themselves to this before the trigger is made: a child's
     effect runs before its parent's. */
  const timeline = useCallback(() => (timelineRef.current ??= gsap.timeline({ paused: true })), []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const animation = timeline();
    animation
      .fromTo(section.querySelector(".scale__place"), { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out" }, DETAILS_AT)
      .fromTo(section.querySelectorAll(".scale__capabilities li"), { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.12, ease: "power3.out" }, DETAILS_AT + 0.2)
      .to({}, { duration: HOLD });
    const trigger = ScrollTrigger.create({
      trigger: section,
      animation,
      scrub: true,
      pin: true,
      anticipatePin: 1,
      start: "top top",
      end: `+=${PIN_LENGTH * 100}%`,
    });

    return () => {
      trigger.kill();
      animation.kill();
      timelineRef.current = null;
    };
  }, [timeline]);

  return (
    <section ref={sectionRef} id="warehouse" className="scale" style={{ "--band-ratio": warehouseBandSlot.aspectRatio } as React.CSSProperties}>
      <ImageSlotVisual slot={warehouseBandSlot} className="scale__media" decorative />
      <div className="scale__copy">
        <h2 className="scale__headline">
          {claim.map(([verb, rest], index) => (
            <ScrollFloat key={verb} timeline={timeline} at={LINE_AT[index]}>
              <em>{verb}</em>{` ${rest}`}
            </ScrollFloat>
          ))}
        </h2>
        <p className="scale__place">Kajang, Selangor</p>
      </div>
      <ul className="scale__capabilities">
        {capabilities.map(({ label, icon: Icon }) => (
          <li key={label}><Icon aria-hidden="true" />{label}</li>
        ))}
      </ul>
    </section>
  );
}
