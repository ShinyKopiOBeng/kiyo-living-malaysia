import { awardAssets, awardSmallAssets, clientLogoAssets, sectionAssets, type SectionAsset } from "./sectionAssets";

export type ImageSlotStatus = "final" | "temporary" | "placeholder";

export type ImageSlot = {
  id: string;
  status: ImageSlotStatus;
  src?: string;
  mobileSrc?: string;
  aspectRatio: string;
  fit: "cover" | "contain";
  focalPoint?: string;
  safeTextArea?: string;
  alt: string;
  width?: number;
  height?: number;
};

/**
 * Build a slot from a delivered plate.
 *
 * The source of truth for `src`, `width` and `height` is the generated
 * manifest, so a re-encode can never leave the markup describing the wrong
 * box. Everything a machine cannot know - what the picture shows, how it should
 * be cropped, where the subject sits - is authored here.
 */
function plate(
  id: string,
  asset: SectionAsset,
  alt: string,
  options: { aspectRatio?: string; fit?: ImageSlot["fit"]; focalPoint?: string; safeTextArea?: string } = {},
): ImageSlot {
  return {
    id,
    status: "final",
    src: asset.src,
    width: asset.width,
    height: asset.height,
    aspectRatio: options.aspectRatio ?? `${asset.width} / ${asset.height}`,
    fit: options.fit ?? "cover",
    focalPoint: options.focalPoint ?? "center center",
    safeTextArea: options.safeTextArea,
    alt,
  };
}

/* -------------------------------------------------------------------------- */
/* 01  Hero                                                                   */
/* -------------------------------------------------------------------------- */

export const heroSlot = plate(
  "HOME-HERO-01",
  sectionAssets.heroAirport,
  "A traveller at a sunlit airport window with the KIYO luggage set and travel accessories",
  { focalPoint: "72% center", safeTextArea: "left 42%" },
);

/* -------------------------------------------------------------------------- */
/* 02  Warehouse scale                                                        */
/* -------------------------------------------------------------------------- */

export const warehouseBandSlot = plate(
  "WAREHOUSE-BAND",
  sectionAssets.warehouseTruck,
  "KIYO's Kajang warehouse and showroom at dusk with a branded delivery lorry outside",
  { focalPoint: "68% center", safeTextArea: "left 45%" },
);

/* -------------------------------------------------------------------------- */
/* 03  UMRAH gift sets                                                        */
/* -------------------------------------------------------------------------- */

export const umrahLeadSlot = plate(
  "UMRAH-LEAD",
  sectionAssets.umrahBanner,
  "A pilgrim walking a mosque colonnade with a coordinated cream KIYO UMRAH set",
  { focalPoint: "60% center" },
);

/** The four UMRAH sets, in the order the showcase presents them. */
export const umrahSetSlots: ImageSlot[] = [
  plate("UMRAH-SET-01", sectionAssets.umrahSet1, "The Essential Journey Set: three cream cases with a drawstring bag, pouch and bottle"),
  plate("UMRAH-SET-02", sectionAssets.umrahSet2, "The Comfort Travel Set: cream cases with a neck pillow, eye mask, fan and bottle"),
  plate("UMRAH-SET-03", sectionAssets.umrahSet3, "The Complete Jemaah Set: cream cases with a prayer mat, neck pillow, pouch and accessories"),
  plate("UMRAH-SET-04", sectionAssets.umrahSet4, "The Agency Branding Set: cream cases with a branded presentation box, luggage tag and bottle"),
];

/* -------------------------------------------------------------------------- */
/* 04  Corporate gift sets                                                    */
/* -------------------------------------------------------------------------- */

export const corporateLeadSlot = plate(
  "CORPORATE-LEAD",
  sectionAssets.corporateBanner,
  "A branded KIYO corporate gift set arranged for a client handover",
  { focalPoint: "62% center" },
);

/** The four corporate sets, in the order the showcase presents them. */
export const corporateSetSlots: ImageSlot[] = [
  plate("CORP-SET-01", sectionAssets.corporateSet1, "The Branded Travel Set: a compact case with headphones, neck pillow and travel pouch"),
  plate("CORP-SET-02", sectionAssets.corporateSet2, "The Executive Journey Set: a dark cabin case with premium desk and travel pieces"),
  plate("CORP-SET-03", sectionAssets.corporateSet3, "The Team Building Kit: outdoor and team programme items with KIYO branding"),
  plate("CORP-SET-04", sectionAssets.corporateSet4, "The Premium Welcoming Gift: a presentation box with a notebook, pen and thermos"),
];

/* -------------------------------------------------------------------------- */
/* 06  Customise your brand                                                   */
/* -------------------------------------------------------------------------- */

/* A transparent cut-out, so the visitor's own name can be laid over the shell
   without a photographic background fighting it.
   This is the close crop, not the full-length case: the engraving is the one
   moment in the chapter that shows a visitor their own brand, and at full
   length it was a few pixels tall. */
export const brandCaseSlot = plate(
  "BRAND-CASE-ZOOM",
  sectionAssets.brandCaseZoom,
  "The engraved plate on a KIYO case, shown close",
  { fit: "contain" },
);

/**
 * One photograph per customisation option, in the order the options are
 * listed. The order is load-bearing: the chapter zips this array against
 * `CUSTOMISATIONS` in BuildYourSet, so a plate and its label stay together.
 */
export const customisationSlots: ImageSlot[] = [
  plate("BRAND-DETAIL-01", sectionAssets.brandDetail1, "A logo printed onto a KIYO case shell"),
  plate("BRAND-DETAIL-02", sectionAssets.brandDetail2, "A branded luggage tag on a KIYO case"),
  plate("BRAND-DETAIL-03", sectionAssets.brandDetail3, "Branded travel accessories prepared for a corporate order"),
  plate("BRAND-DETAIL-04", sectionAssets.brandDetail4, "Custom packaging for a KIYO gift set"),
];

/* -------------------------------------------------------------------------- */
/* 07  Delivery pipeline                                                      */
/* -------------------------------------------------------------------------- */

/** The six stages, in running order: brief through to warehouse. */
export const pipelineSlots: ImageSlot[] = [
  plate("DELIVERY-01", sectionAssets.pipeline1, "Taking a client brief at the KIYO office"),
  plate("DELIVERY-02", sectionAssets.pipeline2, "Preparing a sample case for approval"),
  plate("DELIVERY-03", sectionAssets.pipeline3, "Signing off the approved sample"),
  plate("DELIVERY-04", sectionAssets.pipeline4, "The branded production run under way"),
  plate("DELIVERY-05", sectionAssets.pipeline5, "Quality control checks before packing"),
  plate("DELIVERY-06", sectionAssets.pipeline6, "Finished stock held in the KIYO warehouse"),
];

/* -------------------------------------------------------------------------- */
/* 08  Clients, reviews and partner stories                                   */
/* -------------------------------------------------------------------------- */

/**
 * The client marks, supplied by KIYO with permission to display them. Each is
 * trimmed to its ink and re-fitted to one box by the asset build, so the wall
 * reads at a single optical weight rather than at twelve different ones.
 */
/* Two of the delivered marks are filed only as a crest, so they are described
   as one rather than guessed at: naming an organisation KIYO has not named
   would invent a client relationship. Fill these in when KIYO confirms them. */
const CLIENT_NAMES: Record<string, string> = {
  clientLogoAia: "AIA",
  clientLogoKoperasiTnb: "Koperasi Tenaga Nasional Berhad",
  clientLogoTabungPendidikan: "Tabung Pendidikan",
  clientLogoIirkaz: "IIRKAZ",
  clientLogoBigBath: "Big Bath",
  clientLogoManipalUniversityCollegeMalaysia: "Manipal University College Malaysia",
  clientLogoBerkatTuahTravelTours: "Berkat Tuah Travel & Tours",
  clientLogoJalen: "Jalen",
  clientLogoBoldMedia: "Bold Media",
  clientLogoUnikl: "Universiti Kuala Lumpur",
};

export const clientLogoSlots: ImageSlot[] = clientLogoAssets.map((asset) => ({
  id: asset.id,
  status: "final" as const,
  src: asset.src,
  width: asset.width,
  height: asset.height,
  aspectRatio: `${asset.width} / ${asset.height}`,
  fit: "contain" as const,
  focalPoint: "center center",
  alt: CLIENT_NAMES[asset.id] ? `${CLIENT_NAMES[asset.id]} logo` : "Client organisation logo",
}));

/* The video still and the three partner photographs used to be slots of their
   own. The chapter now builds its cards from `clientProof.ts`, where each
   picture sits next to the claim it is evidence for. */

/* -------------------------------------------------------------------------- */
/* 09  Samantha and recognition                                               */
/* -------------------------------------------------------------------------- */

/**
 * The chapter is one photograph.
 *
 * Samantha, the room and all fourteen trophies are composited in the source
 * rather than stacked at runtime, so nothing has to be re-registered against a
 * shelf line and nothing slides off a shelf at odd browser zoom. Everything
 * laid over it - the copy, and the fourteen hotspots - is positioned as a
 * percentage of this one box, which is why the band has to keep the plate's
 * 1920x800 ratio. See `.founder` in globals.css.
 */
export const aboutBandSlot = plate(
  "ABOUT-BAND",
  sectionAssets.aboutBand,
  "Samantha Ng in the KIYO showroom, beside shelves holding the company's awards",
);

function cutOut(prefix: string, asset: SectionAsset & { id: string }): [string, ImageSlot] {
  return [
    asset.id,
    {
      id: `${prefix}-${asset.id}`,
      status: "final",
      src: asset.src,
      width: asset.width,
      height: asset.height,
      aspectRatio: `${asset.width} / ${asset.height}`,
      fit: "contain",
      focalPoint: "center center",
      alt: "",
    },
  ];
}

/** The fourteen cut-outs the award dialog enlarges, in shelf order. */
export const awardSlots: Record<string, ImageSlot> = Object.fromEntries(
  awardAssets.map((asset) => cutOut("AWARD", asset)),
);

/** The same fourteen at wall size, laid over the trophies standing in the band. */
export const awardWallSlots: Record<string, ImageSlot> = Object.fromEntries(
  awardSmallAssets.map((asset) => cutOut("AWARD-WALL", asset)),
);
