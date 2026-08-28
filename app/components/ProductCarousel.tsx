"use client";

/* Product shots are pre-sized WebP served straight from public. */
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { carouselProducts, productImage } from "./productCatalogue";

/** Slow enough to read as ambient drift rather than a slideshow. */
const DRIFT_SPEED = 26;
const ARROW_TWEEN_MS = 520;
/** After an arrow is used, the drift waits this long once the pointer leaves. */
const RESUME_DELAY_MS = 3000;
const DRAG_TAP_TOLERANCE = 6;

type Tween = { from: number; to: number; start: number };

export function ProductCarousel({ onShop }: { onShop: () => void }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const offset = useRef(0);
  const setWidth = useRef(0);
  const paused = useRef(false);
  const visible = useRef(true);
  const resumeAt = useRef(0);
  const arrowUsed = useRef(false);
  const tween = useRef<Tween | null>(null);
  const drag = useRef({ pointerId: -1, startX: 0, startOffset: 0, travel: 0 });

  const [colours, setColours] = useState<Record<string, string>>(() =>
    Object.fromEntries(carouselProducts.map((product) => [product.slug, product.colours[0].id])),
  );

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    /* The track renders the catalogue twice, so one set is exactly half of it.
       Wrapping by that width puts an identical slide under the seam. */
    const measure = () => {
      setWidth.current = track.scrollWidth / 2;
    };
    measure();

    const resize = new ResizeObserver(measure);
    resize.observe(track);

    /* No point animating a section nobody is looking at. */
    const intersection = new IntersectionObserver(
      ([entry]) => { visible.current = entry.isIntersecting; },
      { rootMargin: "200px" },
    );
    intersection.observe(viewport);

    let frame = 0;
    let previous = 0;

    const step = (now: number) => {
      frame = requestAnimationFrame(step);
      const delta = previous ? Math.min(64, now - previous) / 1000 : 0;
      previous = now;

      const width = setWidth.current;
      if (!width) return;

      const active = tween.current;
      if (active) {
        const progress = Math.min(1, (now - active.start) / ARROW_TWEEN_MS);
        const eased = 1 - (1 - progress) ** 3;
        offset.current = active.from + (active.to - active.from) * eased;
        if (progress >= 1) tween.current = null;
      } else if (
        !paused.current &&
        !reduceMotion.matches &&
        visible.current &&
        now >= resumeAt.current
      ) {
        offset.current += DRIFT_SPEED * delta;
      }

      let next = offset.current;
      if (next >= width) next -= width;
      else if (next < 0) next += width;
      offset.current = next;
      track.style.transform = `translate3d(${-next}px, 0, 0)`;
    };

    frame = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      intersection.disconnect();
    };
  }, []);

  /** Distance from one slide to the next, gap included. */
  const slidePitch = () => {
    const track = trackRef.current;
    if (!track || track.children.length < 2) return 320;
    const first = track.children[0] as HTMLElement;
    const second = track.children[1] as HTMLElement;
    return Math.abs(second.offsetLeft - first.offsetLeft) || first.offsetWidth;
  };

  const nudge = useCallback((direction: 1 | -1) => {
    arrowUsed.current = true;
    const from = tween.current ? tween.current.to : offset.current;
    tween.current = { from: offset.current, to: from + direction * slidePitch(), start: performance.now() };
  }, []);

  const onPointerEnter = () => { paused.current = true; };

  const onPointerLeave = () => {
    paused.current = false;
    /* Plain hovering resumes at once. Only an arrow press earns the wait. */
    if (arrowUsed.current) {
      resumeAt.current = performance.now() + RESUME_DELAY_MS;
      arrowUsed.current = false;
    }
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    drag.current = { pointerId: event.pointerId, startX: event.clientX, startOffset: offset.current, travel: 0 };
    paused.current = true;
    tween.current = null;
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (drag.current.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.current.startX;
    drag.current.travel = Math.max(drag.current.travel, Math.abs(dx));
    if (drag.current.travel <= DRAG_TAP_TOLERANCE) return;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    offset.current = drag.current.startOffset - dx;
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (drag.current.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    drag.current.pointerId = -1;
    /* Touch never fires pointerleave, so a flick has to resume on its own. */
    if (event.pointerType !== "mouse") {
      paused.current = false;
      if (drag.current.travel > DRAG_TAP_TOLERANCE) resumeAt.current = performance.now() + RESUME_DELAY_MS;
    }
  };

  const wasDragged = () => drag.current.travel > DRAG_TAP_TOLERANCE;

  const renderSlide = (product: (typeof carouselProducts)[number], copy: number) => {
    const colour = colours[product.slug] ?? product.colours[0].id;
    const duplicate = copy > 0;
    return (
      <article
        className="product-slide"
        key={`${product.slug}-${copy}`}
        aria-hidden={duplicate || undefined}
      >
        <button
          type="button"
          className="product-slide__media"
          tabIndex={duplicate ? -1 : undefined}
          onClick={() => { if (!wasDragged()) onShop(); }}
          aria-label={`${product.name}, view on the KIYO stores`}
        >
          <img
            className="product-slide__view product-slide__view--front"
            src={productImage(product.slug, colour, "front")}
            alt={duplicate ? "" : `${product.name} in ${colour}`}
            width="860"
            height="860"
            loading="lazy"
            decoding="async"
            draggable={false}
          />
          <img
            className="product-slide__view product-slide__view--angle"
            src={productImage(product.slug, colour, "angle")}
            alt=""
            aria-hidden="true"
            width="860"
            height="860"
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </button>

        <div className="product-slide__meta">
          <h3>{product.name}</h3>
          <p>{product.blurb}</p>
          <div className="product-slide__swatches" role="group" aria-label={`${product.name} colours`}>
            {product.colours.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`product-swatch${option.id === colour ? " is-active" : ""}`}
                style={{ "--swatch": option.swatch } as React.CSSProperties}
                tabIndex={duplicate ? -1 : undefined}
                aria-pressed={option.id === colour}
                aria-label={`${product.name} in ${option.label}`}
                title={option.label}
                onClick={() => {
                  if (wasDragged()) return;
                  setColours((current) => ({ ...current, [product.slug]: option.id }));
                }}
              />
            ))}
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="product-carousel" data-reveal="scale">
      <div
        ref={viewportRef}
        className="product-carousel__viewport"
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      >
        <div
          ref={trackRef}
          className="product-carousel__track"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {carouselProducts.map((product) => renderSlide(product, 0))}
          {carouselProducts.map((product) => renderSlide(product, 1))}
        </div>

        <button
          type="button"
          className="product-carousel__arrow product-carousel__arrow--prev"
          onClick={() => nudge(-1)}
          aria-label="Previous products"
        >
          <ArrowLeft aria-hidden="true" />
        </button>
        <button
          type="button"
          className="product-carousel__arrow product-carousel__arrow--next"
          onClick={() => nudge(1)}
          aria-label="Next products"
        >
          <ArrowRight aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
