/**
 * The two programmes the site sells, and the one-way channel the gift chapters
 * use to point the quotation form at the right one.
 *
 * A "Build Your UMRAH Set" button scrolls to the form; on the way it announces
 * the programme so the form's "I'm interested in" is already ticked when the
 * visitor arrives. The form listens; nothing else does.
 */
export const PROGRAMME_EVENT = "kiyo:programme";

export type Programme = "corporate" | "umrah";

export const PROGRAMME_LABEL: Record<Programme, string> = {
  corporate: "Corporate Gifts",
  umrah: "UMRAH Sets",
};

export function announceProgramme(programme: Programme) {
  window.dispatchEvent(new CustomEvent<Programme>(PROGRAMME_EVENT, { detail: programme }));
}
