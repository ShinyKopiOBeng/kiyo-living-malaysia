"use client";

/* Product shots are pre-sized WebP served straight from public. */
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { carouselProducts, productImage } from "./productCatalogue";

/**
 * The rail shows cases and sets only.
 *
 * `productCatalogue.ts` is generated from whatever shots are on disk, so the
 * filter lives here rather than in that file: re-running the asset tool must not
 * quietly put the bags back. The bag photography stays shipped and the
 * catalogue stays complete; this chapter simply does not show them, because a
 * corporate or UMRAH programme is built around luggage.
 */
const BAGS = new Set(["business-backpack", "flap-commuter-backpack", "slim-laptop-brief", "weekender-duffel"]);
export const railProducts = carouselProducts.filter((product) => !BAGS.has(product.slug));

/**
 * Step 01: the luggage collection on a paged rail.
 *
 * Nothing here is selected any more. The card is the photograph, the name and
 * one swatch per colour, and a swatch swaps the photograph. The rail is a
 * native scroll container with scroll snapping, so touch drag, trackpad swipe
 * and keyboard all work without any of it being reimplemented; the arrows page
 * it by exactly one card.
 */
export function ProductCarousel() {
  const railRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const [colours, setColours] = useState<Record<string, string>>(() =>
    Object.fromEntries(railProducts.map((product) => [product.slug, product.colours[0].id])),
  );

  const syncEdges = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    setAtStart(rail.scrollLeft <= 2);
    setAtEnd(rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    syncEdges();
    rail.addEventListener("scroll", syncEdges, { passive: true });
    const resize = new ResizeObserver(syncEdges);
    resize.observe(rail);
    return () => {
      rail.removeEventListener("scroll", syncEdges);
      resize.disconnect();
    };
  }, [syncEdges]);

  /** Distance from one card to the next, gap included. */
  const page = (direction: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const cards = rail.children;
    const pitch = cards.length > 1
      ? Math.abs((cards[1] as HTMLElement).offsetLeft - (cards[0] as HTMLElement).offsetLeft)
      : rail.clientWidth;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rail.scrollBy({ left: direction * pitch, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <div className="chooser">
      <div className="chooser__rail" ref={railRef} aria-label="The KIYO luggage collection">
        {railProducts.map((product) => {
          const colour = colours[product.slug] ?? product.colours[0].id;
          const colourLabel = product.colours.find((entry) => entry.id === colour)?.label ?? colour;

          return (
            <article className="product-card" key={product.slug}>
              <div className="product-card__media">
                <img
                  src={productImage(product.slug, colour, "front")}
                  alt={`${product.name} in ${colourLabel}`}
                  width="860"
                  height="860"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </div>

              <h4 className="product-card__name">{product.name}</h4>

              <div className="product-card__swatches" role="group" aria-label={`${product.name} colours`}>
                {product.colours.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`product-swatch${option.id === colour ? " is-active" : ""}`}
                    style={{ "--swatch": option.swatch } as React.CSSProperties}
                    aria-pressed={option.id === colour}
                    aria-label={`${product.name} in ${option.label}`}
                    title={option.label}
                    onClick={() => setColours((current) => ({ ...current, [product.slug]: option.id }))}
                  />
                ))}
              </div>
            </article>
          );
        })}
      </div>

      <button
        type="button"
        className="chooser__arrow chooser__arrow--prev"
        onClick={() => page(-1)}
        disabled={atStart}
        aria-label="Previous products"
      >
        <ArrowLeft aria-hidden="true" />
      </button>
      <button
        type="button"
        className="chooser__arrow chooser__arrow--next"
        onClick={() => page(1)}
        disabled={atEnd}
        aria-label="Next products"
      >
        <ArrowRight aria-hidden="true" />
      </button>
    </div>
  );
}
