import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

/**
 * The one smooth-scroll instance.
 *
 * Lenis keeps the browser's own scroll and only eases it: the page glides
 * toward where the wheel sent it instead of jumping there, which is the feel
 * of the reference sites. Because the scroll stays native, the fixed header,
 * the draggable WhatsApp dock, the native dialogs, the IntersectionObservers
 * and the sticky hero all keep working untouched. (ScrollSmoother, which the
 * same GSAP package carries, would move the page with a transform and need
 * every one of those rewired.)
 *
 * Horizontal gestures are ignored by Lenis by design, so the drifting
 * carousels keep their native horizontal scroll. Touch is left native too:
 * smoothed touch scrolling feels sluggish on a phone.
 *
 * Under `prefers-reduced-motion` no instance is made and every scroll is the
 * browser's own; `scrollToSection` falls back accordingly.
 */

/* How much of the remaining distance is covered each frame. 0.09 settles in
   about 1.2 s at 60 fps, which is the pace of the reference sites. */
const LERP = 0.09;

let instance: Lenis | null = null;
let tick: ((time: number) => void) | null = null;

export function startSmoothScroll(): () => void {
  if (instance || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};

  gsap.registerPlugin(ScrollTrigger);
  const lenis = new Lenis({ lerp: LERP, smoothWheel: true, syncTouch: false, respectReducedMotion: true });

  /* ScrollTrigger reads the scroll position on Lenis's schedule rather than
     the browser's, so scrubbed tweens never lag a frame behind the page. */
  lenis.on("scroll", ScrollTrigger.update);
  tick = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  instance = lenis;

  return () => {
    if (tick) gsap.ticker.remove(tick);
    lenis.destroy();
    instance = null;
    tick = null;
  };
}

/** The instance while the page has one; null under reduced motion or before mount. */
export function getSmoothScroll(): Lenis | null {
  return instance;
}
