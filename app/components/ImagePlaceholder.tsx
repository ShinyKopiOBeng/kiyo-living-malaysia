/* eslint-disable @next/next/no-img-element */

import type { CSSProperties } from "react";
import type { ImageSlot } from "./imageSlots";

type SlotStyle = CSSProperties & {
  "--slot-ratio": string;
  "--slot-fit": ImageSlot["fit"];
  "--slot-position": string;
};

type ImageSlotVisualProps = {
  slot: ImageSlot;
  className?: string;
  loading?: "eager" | "lazy";
  priority?: boolean;
  decorative?: boolean;
};

function slotStyle(slot: ImageSlot): SlotStyle {
  return {
    "--slot-ratio": slot.aspectRatio,
    "--slot-fit": slot.fit,
    "--slot-position": slot.focalPoint ?? "center center",
  };
}

export function ImagePlaceholder({ slot, className = "" }: Pick<ImageSlotVisualProps, "slot" | "className">) {
  const showDeveloperNotes = process.env.NODE_ENV !== "production";

  return (
    <div
      className={`image-slot image-placeholder ${className}`.trim()}
      style={slotStyle(slot)}
      data-image-slot={slot.id}
      data-image-status={slot.status}
      role="img"
      aria-label={slot.alt}
    >
      <img src="/images/kiyo-mark.png" alt="" aria-hidden="true" width="96" height="96" />
      {showDeveloperNotes ? (
        <span className="image-placeholder__notes">
          <strong>{slot.id}</strong>
          <small>{slot.aspectRatio} / {slot.fit}</small>
        </span>
      ) : null}
    </div>
  );
}

export function ImageSlotVisual({
  slot,
  className = "",
  loading = "lazy",
  priority = false,
  decorative = false,
}: ImageSlotVisualProps) {
  if (slot.status === "placeholder" || !slot.src) {
    return <ImagePlaceholder slot={slot} className={className} />;
  }

  return (
    <picture
      className={`image-slot ${className}`.trim()}
      style={slotStyle(slot)}
      data-image-slot={slot.id}
      data-image-status={slot.status}
    >
      {slot.mobileSrc ? <source media="(max-width: 767px)" srcSet={slot.mobileSrc} /> : null}
      <img
        src={slot.src}
        alt={decorative ? "" : slot.alt}
        aria-hidden={decorative || undefined}
        width={slot.width}
        height={slot.height}
        loading={priority ? "eager" : loading}
        fetchPriority={priority ? "high" : "auto"}
        decoding={priority ? "sync" : "async"}
      />
    </picture>
  );
}
