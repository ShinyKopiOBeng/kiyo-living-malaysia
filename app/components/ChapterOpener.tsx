import type { ReactNode } from "react";
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
 * here and nowhere else.
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
  /* The band takes the photograph's own proportions, so the whole picture
     shows and nothing is cropped off its top or bottom at any width. */
  return (
    <div className={`opener opener--${variant} opener--${side}`} style={{ "--opener-ratio": slot.aspectRatio } as React.CSSProperties}>
      <div className="opener__visual" data-reveal={variant === "split" ? (side === "left" ? "right" : "left") : undefined}>
        <ImageSlotVisual slot={slot} className="opener__media" />
        {variant === "bleed" ? <span className="opener__scrim" aria-hidden="true" /> : null}
      </div>

      <div className="opener__copy" data-reveal-group>
        <p className="eyebrow">
          {step ? <span className="eyebrow__step">{`Step ${step}`}</span> : null}
          {label}
        </p>
        <h2 id={titleId} className="opener__title">
          <span>{lines[0]}</span>
          <span>{lines[1]}</span>
          <span className="opener__payoff">{lines[2]}</span>
        </h2>
        <p className="opener__body">{body}</p>
        {action ? <div className="opener__action">{action}</div> : null}
      </div>
    </div>
  );
}
