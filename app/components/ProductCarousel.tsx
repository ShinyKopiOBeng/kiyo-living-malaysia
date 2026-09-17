"use client";

/* Product shots are pre-sized WebP served straight from public. */
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { DriftCarousel } from "./DriftCarousel";
import { carouselProducts, productImage } from "./productCatalogue";

/**
 * Step 01: the whole collection on the drifting carousel, cases and bags.
 *
 * A card is the product, its name and one swatch per colour; a swatch swaps
 * the photograph. Every colour ships as two shots, a front view and a
 * three-quarter view, and the card holds both: the front at rest, the
 * three-quarter fading in over it while the pointer is on the card, so the
 * case turns towards the visitor without any 3D being faked.
 *
 * Nothing here is selected any more; the quotation is the one form.
 */
export function ProductCarousel() {
  const [colours, setColours] = useState<Record<string, string>>(() =>
    Object.fromEntries(carouselProducts.map((product) => [product.slug, product.colours[0].id])),
  );

  return (
    <DriftCarousel
      items={carouselProducts}
      keyOf={(product) => product.slug}
      itemClassName="product-card"
      label="The KIYO luggage collection"
      hint={`${carouselProducts.length} products. Hover to pause and turn a case; pick a colour to see it.`}
      renderItem={(product, _index, clone) => {
        const colour = colours[product.slug] ?? product.colours[0].id;
        const colourLabel = product.colours.find((entry) => entry.id === colour)?.label ?? colour;

        return (
          <>
            <div className="product-card__media">
              <img
                className="product-card__front"
                src={productImage(product.slug, colour, "front")}
                alt={`${product.name} in ${colourLabel}`}
                width="860"
                height="860"
                loading="lazy"
                decoding="async"
                draggable={false}
              />
              <img
                className="product-card__angle"
                src={productImage(product.slug, colour, "angle")}
                alt=""
                aria-hidden="true"
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
                  tabIndex={clone ? -1 : undefined}
                  onClick={() => setColours((current) => ({ ...current, [product.slug]: option.id }))}
                />
              ))}
            </div>
          </>
        );
      }}
    />
  );
}
