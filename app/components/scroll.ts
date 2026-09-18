import { getSmoothScroll } from "./smoothScroll";

/**
 * Scroll to a chapter, clearing the fixed header.
 *
 * Every in-page anchor on the site goes through this rather than the router:
 * see the capture-phase click handler in `KiyoExperience` for why. Buttons that
 * are not anchors (the set inspector's "Request a quote") call it directly.
 *
 * When the page has a smooth-scroll instance the travel goes through it, so
 * an anchor jump has the same easing as the wheel; without one (reduced
 * motion, or before mount) the browser scrolls itself.
 */
export function scrollToSection(id: string, { replaceHash = true }: { replaceHash?: boolean } = {}) {
  const target = document.getElementById(id);
  if (!target) return false;

  const header = document.querySelector<HTMLElement>(".site-header");
  const offset = (header?.offsetHeight ?? 0) + 16;
  const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lenis = getSmoothScroll();
  if (lenis) lenis.scrollTo(top, { duration: 1.2, immediate: reduceMotion });
  else window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });

  /* Keep the URL shareable. replaceState does not fire popstate, so the router
     stays out of it. */
  if (replaceHash) {
    try {
      window.history.replaceState(window.history.state, "", `#${id}`);
    } catch {
      /* Some embedded contexts refuse history writes; the scroll still works. */
    }
  }
  return true;
}
