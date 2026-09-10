import type { ImageSlot } from "./imageSlots";
import { sectionAssets } from "./sectionAssets";
import { TIKTOK_URL } from "./SiteFooter";

/**
 * Everything chapter 8 uses to answer "should I trust these people with a
 * 250-unit order". Kept out of the component because most of it is claims
 * about the real world, and a claim wants to sit next to where it came from.
 */

/* Four of these predate the section asset build, so they are not in the
   generated manifest. Dimensions read off the shipped files. */
function legacy(id: string, file: string, width: number, height: number, alt: string): ImageSlot {
  return {
    id,
    status: "final",
    src: `/images/kiyo/${file}.webp`,
    width,
    height,
    aspectRatio: `${width} / ${height}`,
    fit: "cover",
    focalPoint: "center center",
    alt,
  };
}

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
/* The capability strip                                                       */
/* -------------------------------------------------------------------------- */

export type ProofCard = {
  caption: string;
  slot: ImageSlot;
  href: string;
  /** What the card opens, printed on it, so the destination is never a surprise. */
  destination: string;
  external: boolean;
  /**
   * A short muted loop, once KIYO cuts one. Set it and the card plays on hover
   * instead of only sitting there. Drop files in `public/media/` and fill this
   * in; nothing else has to change.
   */
  clip?: string;
};

/**
 * Five claims, each with the best proof KIYO actually has for it.
 *
 * Two open a product video; three open the part of this site that demonstrates
 * the claim. The mixture is deliberate and it is labelled on every card, so a
 * visitor always knows where a card goes before pressing it.
 *
 * The two video links were checked against their own listings rather than
 * assigned by guesswork: the SORA listing states "360 Spinner Wheels", and the
 * PC+ABS listing states "USB & Cup Holder". No caption is attached to footage
 * that does not show it.
 */
export const PROOF_CARDS: ProofCard[] = [
  {
    caption: "Smooth 360 degree movement, made for everyday travel.",
    slot: legacy("PROOF-WHEELS", "product-wheels", 1100, 1100, "A close view of the spinner wheels on a KIYO case"),
    href: "https://www.lazada.com.my/videodetail/?video_id=8000006140731",
    destination: "Watch on Lazada",
    external: true,
  },
  {
    caption: "Practical storage designed around real journeys.",
    slot: legacy("PROOF-STORAGE", "umrah-essentials", 900, 1125, "An open KIYO case packed with UMRAH travel essentials"),
    href: "#umrah",
    destination: "UMRAH sets",
    external: false,
  },
  {
    caption: "Thoughtful details where travellers actually need them.",
    slot: legacy("PROOF-DETAILS", "product-lock", 1100, 1100, "The TSA lock and zip pulls on a KIYO case"),
    href: "https://www.lazada.com.my/videodetail/?video_id=8000005574263",
    destination: "Watch on Lazada",
    external: true,
  },
  {
    caption: "Custom-branded for companies, teams and travel programmes.",
    slot: {
      id: "PROOF-BRANDING",
      status: "final",
      src: sectionAssets.brandDetail1.src,
      width: sectionAssets.brandDetail1.width,
      height: sectionAssets.brandDetail1.height,
      aspectRatio: `${sectionAssets.brandDetail1.width} / ${sectionAssets.brandDetail1.height}`,
      fit: "cover",
      focalPoint: "center center",
      alt: "A company logo printed onto a KIYO case shell",
    },
    href: "#customise",
    destination: "Customise",
    external: false,
  },
  {
    caption: "Stocked, checked and fulfilled locally from Kajang.",
    slot: legacy("PROOF-WAREHOUSE", "warehouse-2", 1440, 864, "Racked KIYO stock in the Kajang warehouse"),
    href: "#delivery",
    destination: "How we deliver",
    external: false,
  },
];

/* -------------------------------------------------------------------------- */
/* The voices                                                                 */
/* -------------------------------------------------------------------------- */

export type Voice = {
  quote: string;
  /** English gloss, where the quote is not in English. */
  gloss?: string;
  source: string;
  /** A public post, credited and linked back, which is what makes quoting it fair. */
  href?: string;
  slot?: ImageSlot;
};

/**
 * Two of these are KIYO's own, attributed to a role because KIYO has not yet
 * asked permission to name anyone. A role is not a reference, and getting those
 * two names is the largest single improvement available to this chapter.
 *
 * The third is a public review post. It is quoted in the reviewer's own words,
 * credited by handle, and linked back to the original, which is the whole basis
 * on which quoting it is fair. Remove it if the reviewer objects.
 */
export const VOICES: Voice[] = [
  {
    quote: "Reliable quality and seamless coordination from start to finish.",
    source: "Corporate client",
    slot: {
      id: "VOICE-CORPORATE",
      status: "final",
      src: sectionAssets.partnerCorporate.src,
      width: sectionAssets.partnerCorporate.width,
      height: sectionAssets.partnerCorporate.height,
      aspectRatio: "16 / 9",
      fit: "cover",
      focalPoint: "center center",
      alt: "A corporate gift handover to a client team",
    },
  },
  {
    quote: "Our jemaah love the sets. Everything was handled for us.",
    source: "UMRAH agency partner",
  },
  {
    quote: "Berbaloi beli luggage ni. Cute sgtttt!!",
    gloss: "Worth buying this luggage. So cute.",
    source: "lily_ssi on Lemon8",
    href: "https://www.lemon8-app.com/@lily_ssi/7456806039720083976?region=my",
  },
];

/** Where the rest of KIYO's video lives. */
export const PROOF_LINKS = [
  { label: "TikTok", href: TIKTOK_URL },
  { label: "Facebook", href: "https://www.facebook.com/kiyoliving/videos/1052251547399711/" },
] as const;
