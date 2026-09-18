"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/**
 * Text that floats up into place character by character as the page scrolls.
 *
 * Adapted from React Bits' ScrollFloat (reactbits.dev/text-animations/
 * scroll-float). The motion is theirs: each character starts below the line,
 * stretched tall and narrow, and settles with a `back.inOut` overshoot,
 * scrubbed by the scroll position. Three things differ:
 *
 * - The characters are split on the client by SplitText after hydration, so
 *   the served markup keeps its words, its `<em>` and its line, and a crawler
 *   reads a sentence rather than forty spans.
 * - The element is the caller's (`as`, `className`), so it sits in the
 *   existing type system instead of carrying its own size.
 * - A float can join a timeline the parent owns (`timeline`, `at`) instead
 *   of making its own trigger, which is how the warehouse band reveals one
 *   line at a time while its photograph stays pinned.
 *
 * Under `prefers-reduced-motion` the text is simply there.
 */
type ScrollFloatProps = {
  children: ReactNode;
  as?: "span" | "p" | "h2" | "h3";
  className?: string;
  animationDuration?: number;
  ease?: string;
  stagger?: number;
  /** With its own trigger: scrub from this position of the element... */
  scrollStart?: string;
  /** ...to this one. */
  scrollEnd?: string;
  /** Join this timeline at `at` instead of making a trigger. */
  timeline?: () => gsap.core.Timeline;
  at?: number | string;
};

export function ScrollFloat({
  children,
  as: Tag = "span",
  className,
  animationDuration = 1,
  ease = "back.inOut(2)",
  stagger = 0.03,
  scrollStart = "center bottom+=50%",
  scrollEnd = "bottom bottom-=40%",
  timeline,
  at = 0,
}: ScrollFloatProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger, SplitText);

    const split = SplitText.create(element, { type: "chars", charsClass: "scrollfloat__char", tag: "span" });
    const from = { opacity: 0, yPercent: 120, scaleY: 2.3, scaleX: 0.7, transformOrigin: "50% 0%", willChange: "opacity, transform" };
    const to = { opacity: 1, yPercent: 0, scaleY: 1, scaleX: 1, duration: animationDuration, ease, stagger };

    let tween: gsap.core.Tween;
    if (timeline) {
      /* The from state renders at once; the tween moves into the parent's
         timeline before the next tick, so it never plays on its own. */
      tween = gsap.fromTo(split.chars, from, to);
      timeline().add(tween, at);
    } else {
      tween = gsap.fromTo(split.chars, from, {
        ...to,
        scrollTrigger: { trigger: element, start: scrollStart, end: scrollEnd, scrub: true },
      });
    }

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      split.revert();
    };
  }, [animationDuration, ease, stagger, scrollStart, scrollEnd, timeline, at]);

  /* Typed as a span so one ref serves every tag; the element rendered is
     whichever `as` names. */
  const Element = Tag as "span";
  return (
    <Element ref={ref as React.RefObject<HTMLSpanElement>} className={className}>
      {children}
    </Element>
  );
}
