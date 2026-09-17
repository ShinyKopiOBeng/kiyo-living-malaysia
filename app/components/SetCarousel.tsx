"use client";

/* Placeholder tiles carry the vector mark, served straight from public. */
/* eslint-disable @next/next/no-img-element */

import { Expand } from "lucide-react";
import { DriftCarousel } from "./DriftCarousel";
import { ImageSlotVisual } from "./ImagePlaceholder";
import type { GiftSet } from "./giftSets";

/**
 * The six gift sets of a programme on the drifting carousel.
 *
 * A card is the photograph, the set name, and a "View set" affordance on
 * hover; the click opens the chapter's inspector. A set whose plate is still
 * awaited renders a branded tile in the photograph's place.
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
  return (
    <div style={{ "--card-ratio": ratio } as React.CSSProperties}>
      <DriftCarousel
        items={sets}
        keyOf={(set) => set.id}
        itemClassName="setcard"
        label={label}
        hint={`${sets.length} sets. Hover to pause, click a set to see what is in it.`}
        suspended={suspended}
        renderItem={(set, index, clone) => (
          <>
            <button
              type="button"
              className="setcard__open"
              aria-haspopup="dialog"
              tabIndex={clone ? -1 : undefined}
              onClick={() => onOpen(index)}
              draggable={false}
            >
              {set.slot ? (
                <ImageSlotVisual slot={set.slot} className="setcard__media" />
              ) : (
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
          </>
        )}
      />
    </div>
  );
}
