"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * A masonry wall: tiles of different heights packed into columns, each new
 * tile landing in the shortest column so far.
 *
 * Adapted from React Bits' Masonry (reactbits.dev/components/masonry). The
 * reflow on resize, the entrance from below with a blur that sharpens, the
 * stagger and the hover scale are theirs. What differs:
 *
 * - The tiles are the caller's markup, measured at their natural height,
 *   rather than pictures given a height: a picture keeps its own proportions
 *   and a caption can be any length.
 * - The served markup is a plain grid, which is also what the wall is with
 *   JavaScript off. The absolute layout takes over in a layout effect, before
 *   the first paint, so nothing jumps.
 * - The entrance plays when the wall scrolls into view, not on mount: the
 *   wall is well below the fold. Under `prefers-reduced-motion` the tiles
 *   are simply placed.
 * - No click-through; these are photographs with captions, not links.
 */
type Direction = "bottom" | "top" | "left" | "right" | "center" | "random";

type MasonryProps<T> = {
  items: T[];
  keyOf: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  className?: string;
  itemClassName?: string;
  label?: string;
  /** Pixels between tiles. */
  gap?: number;
  /** How many columns a wall of this width gets. */
  columnsFor?: (width: number) => number;
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: Direction;
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
};

const defaultColumns = (width: number) => (width >= 1100 ? 4 : width >= 720 ? 3 : 2);

/* How far a tile travels on its way in. */
const TRAVEL = 160;

type Placement = { tile: HTMLElement; x: number; y: number; w: number; h: number };

function startOf(direction: Direction, placement: Placement, wall: HTMLElement) {
  const pick: Direction = direction === "random"
    ? (["top", "bottom", "left", "right"] as const)[Math.floor(Math.random() * 4)]
    : direction;
  switch (pick) {
    case "top": return { x: placement.x, y: placement.y - TRAVEL };
    case "left": return { x: placement.x - TRAVEL, y: placement.y };
    case "right": return { x: placement.x + TRAVEL, y: placement.y };
    case "center": return { x: wall.clientWidth / 2 - placement.w / 2, y: wall.clientHeight / 2 - placement.h / 2 };
    default: return { x: placement.x, y: placement.y + TRAVEL };
  }
}

export function Masonry<T>({
  items,
  keyOf,
  renderItem,
  className = "",
  itemClassName = "",
  label,
  gap = 16,
  columnsFor = defaultColumns,
  ease = "power3.out",
  duration = 0.6,
  stagger = 0.05,
  animateFrom = "bottom",
  scaleOnHover = true,
  hoverScale = 0.96,
  blurToFocus = true,
}: MasonryProps<T>) {
  const wallRef = useRef<HTMLUListElement>(null);
  /* Once the entrance has played (or was skipped), a relayout animates. */
  const settled = useRef(false);

  /**
   * Place every tile. Widths are written first and heights read after, so
   * the browser lays the wall out once, not once per tile.
   */
  const layout = useCallback((animate: boolean): Placement[] => {
    const wall = wallRef.current;
    if (!wall) return [];
    const width = wall.clientWidth;
    if (!width) return [];
    const tiles = Array.from(wall.children) as HTMLElement[];
    const columns = Math.max(1, columnsFor(width));
    const columnWidth = (width - (columns - 1) * gap) / columns;

    wall.classList.add("is-laid");
    for (const tile of tiles) tile.style.width = `${columnWidth}px`;

    const heights = new Array<number>(columns).fill(0);
    const placements = tiles.map((tile) => {
      const column = heights.indexOf(Math.min(...heights));
      const placement = { tile, x: column * (columnWidth + gap), y: heights[column], w: columnWidth, h: tile.offsetHeight };
      heights[column] += placement.h + gap;
      return placement;
    });
    wall.style.height = `${Math.max(0, Math.max(...heights) - gap)}px`;

    for (const { tile, x, y } of placements) {
      if (animate && settled.current) gsap.to(tile, { x, y, duration, ease, overwrite: "auto" });
      else gsap.set(tile, { x, y });
    }
    return placements;
  }, [columnsFor, duration, ease, gap]);

  /* First layout before paint, then the entrance when the wall is seen. */
  useLayoutEffect(() => {
    const wall = wallRef.current;
    if (!wall) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const placements = layout(false);
    requestAnimationFrame(() => ScrollTrigger.refresh());
    if (reduceMotion || !placements.length) {
      settled.current = true;
      return;
    }

    const tiles = placements.map((placement) => placement.tile);
    gsap.set(tiles, { autoAlpha: 0 });
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        /* Re-place first: the wall may have been resized while hidden. */
        layout(false).forEach((placement, index) => {
          const start = startOf(animateFrom, placement, wall);
          gsap.fromTo(
            placement.tile,
            { x: start.x, y: start.y, autoAlpha: 0, ...(blurToFocus ? { filter: "blur(10px)" } : {}) },
            {
              x: placement.x, y: placement.y, autoAlpha: 1, ...(blurToFocus ? { filter: "blur(0px)" } : {}),
              duration: 0.8, ease: "power3.out", delay: index * stagger, overwrite: true,
              onComplete: () => gsap.set(placement.tile, { clearProps: "filter,opacity,visibility" }),
            },
          );
        });
        settled.current = true;
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(wall);
    return () => observer.disconnect();
  }, [layout, animateFrom, blurToFocus, stagger]);

  /* Relayout when the wall changes width, and once the faces have loaded
     (a caption's height depends on them). */
  useEffect(() => {
    const wall = wallRef.current;
    if (!wall) return;
    let width = wall.clientWidth;
    let frame = 0;
    const observer = new ResizeObserver(() => {
      if (wall.clientWidth === width) return;
      width = wall.clientWidth;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => layout(true));
    });
    observer.observe(wall);
    document.fonts.ready.then(() => layout(true));
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [layout]);

  /* A tile eases in a little under the pointer. A finger has no hover. */
  useEffect(() => {
    const wall = wallRef.current;
    if (!wall || !scaleOnHover) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onOver = (event: PointerEvent) => {
      const tile = (event.target as Element).closest<HTMLElement>(".masonry__tile");
      if (tile && !tile.contains(event.relatedTarget as Node | null)) gsap.to(tile, { scale: hoverScale, duration: 0.3, ease: "power2.out" });
    };
    const onOut = (event: PointerEvent) => {
      const tile = (event.target as Element).closest<HTMLElement>(".masonry__tile");
      if (tile && !tile.contains(event.relatedTarget as Node | null)) gsap.to(tile, { scale: 1, duration: 0.3, ease: "power2.out" });
    };
    wall.addEventListener("pointerover", onOver);
    wall.addEventListener("pointerout", onOut);
    return () => {
      wall.removeEventListener("pointerover", onOver);
      wall.removeEventListener("pointerout", onOut);
    };
  }, [hoverScale, scaleOnHover]);

  return (
    <ul ref={wallRef} className={`masonry ${className}`.trim()} aria-label={label}>
      {items.map((item) => (
        <li key={keyOf(item)} className={`${itemClassName} masonry__tile`.trim()}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
}
