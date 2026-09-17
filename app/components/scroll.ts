/**
 * Scroll to a chapter, clearing the fixed header.
 *
 * Every in-page anchor on the site goes through this rather than the router:
 * see the capture-phase click handler in `KiyoExperience` for why. Buttons that
 * are not anchors (the set inspector's "Request a quote") call it directly.
 */
export function scrollToSection(id: string, { replaceHash = true }: { replaceHash?: boolean } = {}) {
  const target = document.getElementById(id);
  if (!target) return false;

  const header = document.querySelector<HTMLElement>(".site-header");
  const offset = (header?.offsetHeight ?? 0) + 16;
  const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });

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
