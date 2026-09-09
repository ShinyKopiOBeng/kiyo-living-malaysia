"use client";

/* Product shots are pre-sized WebP served straight from public. */
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { carouselProducts, productImage } from "./productCatalogue";
import { useRetail } from "./RetailFlyout";

export type ProductChoice = { slug: string; name: string; colour: string; colourLabel: string };

/**
 * The chooser offers cases and sets only.
 *
 * `productCatalogue.ts` is generated from whatever shots are on disk, so the
 * filter lives here rather than in that file: re-running the asset tool must not
 * quietly put the bags back. The bag photography stays shipped and the
 * catalogue stays complete; this step of the enquiry flow simply does not offer
 * them, because a corporate or UMRAH programme is built around luggage.
 */
const BAGS = new Set(["business-backpack", "flap-commuter-backpack", "slim-laptop-brief", "weekender-duffel"]);
export const chooserProducts = carouselProducts.filter((product) => !BAGS.has(product.slug));

/**
 * Step 1 of the enquiry flow: a paged rail of product cards.
 *
 * The rail is a native scroll container with scroll snapping, so touch drag,
 * trackpad swipe and keyboard all work without any of it being reimplemented.
 * The arrows page it by exactly one card.
 */
export function ProductCarousel({
  selected,
  onSelect,
}: {
  selected: ProductChoice | null;
  onSelect: (choice: ProductChoice) => void;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const { openRetail } = useRetail();

  const [colours, setColours] = useState<Record<string, string>>(() =>
    Object.fromEntries(chooserProducts.map((product) => [product.slug, product.colours[0].id])),
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

  const choose = (product: (typeof chooserProducts)[number], colourId: string) => {
    const option = product.colours.find((entry) => entry.id === colourId) ?? product.colours[0];
    onSelect({ slug: product.slug, name: product.name, colour: option.id, colourLabel: option.label });
  };

  return (
    <div className="chooser">
      <div className="chooser__rail" ref={railRef}>
        {chooserProducts.map((product) => {
          const colour = colours[product.slug] ?? product.colours[0].id;
          const isSelected = selected?.slug === product.slug;

          return (
            <article className={`product-card${isSelected ? " is-selected" : ""}`} key={product.slug}>
              {/* Sits inside the card's own bounds, so no frame can crop it. */}
              <span className="product-card__badge" aria-hidden={!isSelected}>
                <Check aria-hidden="true" />Selected
              </span>

              <div className="product-card__media">
                <img
                  src={productImage(product.slug, colour, "front")}
                  alt={`${product.name} in ${colour}`}
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
                    onClick={() => {
                      setColours((current) => ({ ...current, [product.slug]: option.id }));
                      /* Recolouring a case that is already picked has to update
                         the enquiry too, or the message names a finish the
                         visitor is no longer looking at. */
                      if (isSelected) choose(product, option.id);
                    }}
                  />
                ))}
              </div>

              <div className="product-card__actions">
                <button
                  type="button"
                  className={`product-card__select${isSelected ? " is-selected" : ""}`}
                  aria-pressed={isSelected}
                  onClick={() => choose(product, colour)}
                >
                  Select for bulk
                </button>
                {/* Retail is one panel with both stores behind it, so a single
                    unit never leaves the page through a guessed platform. */}
                <button
                  type="button"
                  data-retail-trigger
                  className="product-card__retail"
                  aria-haspopup="dialog"
                  aria-controls="retail-flyout"
                  onClick={() => openRetail("press")}
                >
                  Buy retail <ArrowUpRight aria-hidden="true" />
                </button>
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
