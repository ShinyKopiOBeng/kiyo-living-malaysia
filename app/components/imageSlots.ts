import { clientLogoAssets, sectionAssets, type SectionAsset } from "./sectionAssets";

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
  options: { status?: ImageSlotStatus; aspectRatio?: string; fit?: ImageSlot["fit"]; focalPoint?: string; safeTextArea?: string } = {},
): ImageSlot {
  return {
    id,
    status: options.status ?? "final",
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

/* Temporary: the cases in this plate carry no KIYO plate. The replacement
   goes through tools/build-section-assets.mjs under the same id, so only
   this status line and the alt text change when it lands. */
export const heroSlot = plate(
  "HOME-HERO",
  sectionAssets.heroHome,
  "A traveller at a sunlit airport window with a KIYO luggage set and travel accessories",
  { status: "temporary", focalPoint: "72% center", safeTextArea: "left 42%" },
);

/* -------------------------------------------------------------------------- */
/* 02  Warehouse band                                                         */
/* -------------------------------------------------------------------------- */

export const warehouseBandSlot = plate(
  "WAREHOUSE-BAND",
  sectionAssets.warehouseTruck,
  "KIYO's Kajang warehouse and showroom at dusk with a branded delivery lorry outside",
  { focalPoint: "68% center", safeTextArea: "left 45%" },
);

/* -------------------------------------------------------------------------- */
/* 03  UMRAH                                                                  */
/* -------------------------------------------------------------------------- */

/* The picture fades to cream on its left, which is where the copy sits. */
export const umrahOpenerSlot = plate(
  "UMRAH-OPENER",
  sectionAssets.umrahOpener,
  "A pilgrim in ihram walking towards the mosque with a coordinated cream KIYO luggage set",
  { focalPoint: "78% center", safeTextArea: "left 44%" },
);

/** The six UMRAH sets, in carousel order. */
export const umrahSetSlots: ImageSlot[] = [
  plate("UMRAH-SET-01", sectionAssets.umrahSet1, "The Navy Heritage Set: two navy cases with a sling bag, rolled prayer mat, tasbih, bottle and document holder"),
  plate("UMRAH-SET-02", sectionAssets.umrahSet2, "The Emerald Telekung Set: two emerald cases with a white telekung, prayer mat, drawstring bag, pouch and bottle"),
  plate("UMRAH-SET-03", sectionAssets.umrahSet3, "The Desert Terracotta Set: two terracotta cases with a drawstring bag, pouches, slippers and a rolled prayer mat"),
  plate("UMRAH-SET-04", sectionAssets.umrahSet4, "The Dusty Rose Comfort Set: two rose cases with a neck pillow, eye mask, tote bag, prayer mat and bottle"),
  plate("UMRAH-SET-05", sectionAssets.umrahSet5, "The Charcoal Executive Set: two charcoal cases with a backpack, sling bag, neck pillow, fan, bottle and gift box"),
  plate("UMRAH-SET-06", sectionAssets.umrahSet6, "The Sapphire Ihram Set: three sapphire cases with an ihram set, drawstring bag, neck pillow, sling bag and slippers"),
];

/* -------------------------------------------------------------------------- */
/* 04  Corporate                                                              */
/* -------------------------------------------------------------------------- */

/* Shown contained and cropped to the cases, so the cream fade on the left of
   the file stays out of frame. */
export const corporateOpenerSlot = plate(
  "CORPORATE-OPENER",
  sectionAssets.corporateOpener,
  "A black KIYO corporate gift set: three cases with KIYO plates, headphones, a neck pillow, a fan and a gift box",
  { aspectRatio: "4 / 3", focalPoint: "82% center" },
);

/**
 * The corporate sets, in carousel order. There are five plates for six sets:
 * the Coffee Wellness picture arrived truncated and is awaiting a re-upload.
 * A set with no slot renders as a branded tile until then.
 */
export const corporateSetSlots: (ImageSlot | null)[] = [
  plate("CORP-SET-01", sectionAssets.corporateSet1, "The Travel Comfort Set: a black mini hard case with headphones, a neck pillow, a portable fan and a pouch"),
  plate("CORP-SET-02", sectionAssets.corporateSet2, "The Outdoor Retreat Set: a folding chair, cooler bag, umbrella, lantern and picnic blanket, all KIYO branded"),
  plate("CORP-SET-03", sectionAssets.corporateSet3, "The Executive Desk Set: a leather notebook, card holder, pen, thermos and keychain with a navy gift box"),
  plate("CORP-SET-04", sectionAssets.corporateSet4, "The Tech Productivity Set: a backpack with a speaker, power bank, wireless charger, phone stand and cables"),
  plate("CORP-SET-05", sectionAssets.corporateSet5, "The Apparel Welcome Set: a polo shirt, tote bag, cap, lanyard, socks and pin badge"),
  null,
];

/* -------------------------------------------------------------------------- */
/* 05  Step 01, Choose                                                        */
/* -------------------------------------------------------------------------- */

export const chooseOpenerSlot = plate(
  "CHOOSE-OPENER",
  sectionAssets.chooseOpener,
  "A KIYO consultant and a client at the showroom desk with a cream case, gift sets and colour swatches",
  { focalPoint: "72% center", safeTextArea: "left 44%" },
);

/* -------------------------------------------------------------------------- */
/* 06  Step 02, Personalise                                                   */
/* -------------------------------------------------------------------------- */

/* The fade is on the right of this one, so the copy sits on the right. */
export const personaliseOpenerSlot = plate(
  "PERSONALISE-OPENER",
  sectionAssets.personaliseOpener,
  "A KIYO designer showing a client their logo mocked up on a case on screen",
  { focalPoint: "28% center", safeTextArea: "right 44%" },
);

/**
 * The customisation portfolio, in the order a customisation happens. The first
 * is the large cell of the bento; the other four fill its right-hand column.
 */
export const personaliseSlots: { slot: ImageSlot; caption: string }[] = [
  { slot: plate("BRAND-LOGO", sectionAssets.brandDetail1, "A gloved hand fitting a logo plate to a black KIYO case"), caption: "Logo printing" },
  { slot: plate("BRAND-TAG", sectionAssets.brandDetail2, "A branded leather luggage tag on a black KIYO case"), caption: "Luggage tag" },
  { slot: plate("BRAND-SHELL", sectionAssets.brandDetail3, "Six case shell panels in the available colours"), caption: "Shell colours" },
  { slot: plate("BRAND-ACCESSORIES", sectionAssets.brandDetail4, "Branded travel accessories: a pouch, neck pillow, bottle, fan and tag"), caption: "Branded accessories" },
  { slot: plate("BRAND-MOCKUP", sectionAssets.brandMockup, "A sample case, colour swatches and a gift box laid out for approval"), caption: "Approval mockup" },
];

/* -------------------------------------------------------------------------- */
/* 07  Step 03, Deliver                                                       */
/* -------------------------------------------------------------------------- */

export const deliverOpenerSlot = plate(
  "DELIVER-OPENER",
  sectionAssets.deliverOpener,
  "The KIYO building at dusk, a branded lorry being loaded with cases at the door",
  { focalPoint: "70% center", safeTextArea: "left 44%" },
);

/** One panel per promise in the Deliver headline, in the headline's order. */
export const deliverPanels: { slot: ImageSlot; title: string; line: string }[] = [
  {
    slot: plate("DELIVER-SHIP", sectionAssets.deliverShip, "Rows of cases on pallets at the loading dock with a lorry waiting", { focalPoint: "40% center" }),
    title: "Deliver to You",
    line: "Nationwide, to your office or venue.",
  },
  {
    slot: plate("DELIVER-STORE", sectionAssets.deliverStore, "The main KIYO warehouse hall with teal racking full of cases"),
    title: "Store Here",
    line: "Held in Kajang until you call for it.",
  },
  {
    slot: plate("DELIVER-COLLECT", sectionAssets.deliverCollect, "The KIYO showroom with cases on the shelves and a seating area"),
    title: "Pick Up Anytime",
    line: "Collect from the showroom, Monday to Saturday.",
  },
];

/* -------------------------------------------------------------------------- */
/* 09  Clients                                                                */
/* -------------------------------------------------------------------------- */

export const clientsOpenerSlot = plate(
  "CLIENTS-OPENER",
  sectionAssets.clientsOpener,
  "Three clients opening a KIYO gift box beside a cream case at the showroom",
  { focalPoint: "24% center", safeTextArea: "right 44%" },
);

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

/* -------------------------------------------------------------------------- */
/* 10  Samantha and Awards                                                    */
/* -------------------------------------------------------------------------- */

/**
 * The chapter is one photograph. Samantha, the room and the trophies are
 * composited in the source, and nothing is laid over the trophies any more,
 * so the band only has to keep the plate's 1920x800 ratio for the copy to
 * land on the flat wall beside her. See `.founder` in globals.css.
 */
export const aboutBandSlot = plate(
  "ABOUT-BAND",
  sectionAssets.aboutBand,
  "Samantha Ng in the KIYO showroom, beside shelves holding the company's awards",
);
