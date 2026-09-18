"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ImageSlotVisual } from "./ImagePlaceholder";
import type { ImageSlot } from "./imageSlots";

/**
 * The chapter opener: one photograph, a label, a three-line headline, one
 * sentence, and at most one button.
 *
 * Six chapters open this way, and they share this one component so none of
 * them can drift. Two variants:
 *
 * - `bleed`: the photograph spans the page and the copy sits in the side of it
 *   that the picture itself fades out. Which side is the picture's decision,
 *   not a layout one: a mirrored photograph would mirror the KIYO plates.
 * - `split`: the copy takes a column and the photograph is contained beside
 *   it, cropped to its subject. Used where the picture's fade would otherwise
 *   put three copy-left openers in a row.
 *
 * The headline is three short sentences on three lines with the last one in
 * coral. That is the only typographic device the page repeats, so it lives
 * here and nowhere else. The headline and the sentence arrive line by line
 * (`data-lines`, see `KiyoExperience`).
 *
 * A bleed photograph opens from a soft inset frame the first time it enters
 * (`data-reveal="clip"`) and then moves a little slower than the page. The
 * parallax is a scrubbed tween, which is safe on a scroll trigger: a stale
 * start only shifts it by a few pixels, and it can never leave the picture
 * hidden. It runs on wide screens only; below the header breakpoint the
 * picture is a static block above the copy and a transform would show its
 * edges.
 */
export function ChapterOpener({
  label,
  step,
  lines,
  body,
  action,
  slot,
  variant = "bleed",
  side = "left",
  titleId,
}: {
  label: string;
  /** "01", "02", "03" on the three how-it-works chapters. */
  step?: string;
  lines: [string, string, string];
  body: string;
  action?: ReactNode;
  slot: ImageSlot;
  variant?: "bleed" | "split";
  side?: "left" | "right";
  titleId: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || variant !== "bleed") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const media = gsap.matchMedia();
    media.add("(min-width: 1024px)", () => {
      gsap.fromTo(
        root.querySelector(".opener__media"),
        { yPercent: -6 },
        { yPercent: 6, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true } },
      );
    });
    return () => media.revert();
  }, [variant]);

  /* The band takes the photograph's own proportions, so the whole picture
     shows and nothing is cropped off its top or bottom at any width. */
  return (
    <div ref={rootRef} className={`opener opener--${variant} opener--${side}`} style={{ "--opener-ratio": slot.aspectRatio } as React.CSSProperties}>
      <div className="opener__visual" data-reveal={variant === "split" ? (side === "left" ? "right" : "left") : "clip"}>
        <ImageSlotVisual slot={slot} className="opener__media" />
        {variant === "bleed" ? <span className="opener__scrim" aria-hidden="true" /> : null}
      </div>

      <div className="opener__copy" data-reveal-group>
        <p className="eyebrow">
          {step ? <span className="eyebrow__step">{`Step ${step}`}</span> : null}
          {label}
        </p>
        <h2 id={titleId} className="opener__title" data-lines>
          <span>{lines[0]}</span>
          <span>{lines[1]}</span>
          <span className="opener__payoff">{lines[2]}</span>
        </h2>
        <p className="opener__body" data-lines>{body}</p>
        {action ? <div className="opener__action">{action}</div> : null}
      </div>
    </div>
  );
}
