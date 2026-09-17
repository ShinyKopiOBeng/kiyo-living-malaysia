import { TIKTOK_URL } from "./SiteFooter";

/**
 * The claims the page makes about KIYO's standing, kept out of the components
 * because most of them are claims about the real world, and a claim wants to
 * sit next to where it came from.
 */

/* -------------------------------------------------------------------------- */
/* The numbers                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Supplied by KIYO, and every one of them carries its own scope.
 *
 * The scope is not decoration. "4.9" on its own invites a reader to assume it
 * covers everything KIYO sells, and "2,000+" invites them to assume it is the
 * company's total. Both would be claims KIYO has not made. Re-check these with
 * KIYO before each release: a rating that has moved is worse than no rating.
 *
 * `value` is the number rather than the printed string, because the row counts
 * up to it. `outOf` marks the two that are ratings, which is what earns them a
 * row of stars.
 */
export type ProofNumber = {
  value: number;
  decimals: number;
  suffix?: string;
  outOf?: number;
  label: string;
};

export const PROOF_NUMBERS: ProofNumber[] = [
  { value: 4.9, decimals: 1, outOf: 5, label: "Shopee store rating" },
  { value: 2000, decimals: 0, suffix: "+", label: "sold on one luggage listing" },
  { value: 5.0, decimals: 1, outOf: 5, label: "Google rating, from 183 reviews" },
  { value: 14, decimals: 0, label: "awards since 2022" },
];

/** The printed form. Also what the markup ships, so the page reads at rest. */
export function formatProofNumber({ value, decimals, suffix }: ProofNumber) {
  const digits = decimals ? value.toFixed(decimals) : Math.round(value).toLocaleString("en-MY");
  return `${digits}${suffix ?? ""}`;
}

/* -------------------------------------------------------------------------- */
/* The videos                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Three client videos under the logo wall. KIYO is supplying the clips; until
 * a card has a `src` it renders as a branded placeholder rather than a frame
 * with nothing in it.
 *
 * `src` is an MP4 in `public/media/` (drop the file in and point at it) and
 * `poster` is its first frame as a WebP. A card with `embed` set instead
 * opens that link in a new tab, for a clip that only exists on TikTok. The
 * caption says what the clip shows and is written when the clip exists; no
 * view counts or likes, because KIYO has not supplied any.
 */
export type ClientVideo = {
  id: string;
  caption: string;
  src?: string;
  poster?: string;
  embed?: string;
};

export const CLIENT_VIDEOS: ClientVideo[] = [
  { id: "video-1", caption: "Client video 1" },
  { id: "video-2", caption: "Client video 2" },
  { id: "video-3", caption: "Client video 3" },
];

/** Where the rest of KIYO's video lives. */
export const PROOF_LINKS = [
  { label: "TikTok", href: TIKTOK_URL },
  { label: "Facebook", href: "https://www.facebook.com/kiyoliving/videos/1052251547399711/" },
] as const;
