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

/* The picture fades to cream on its left, which is where the copy sits; the
   three cases carry the gold KIYO plate. */
export const heroSlot = plate(
  "HOME-HERO",
  sectionAssets.heroHome,
  "A traveller at a sunlit airport window beside three black KIYO cases, a neck pillow and a drawstring bag",
  { focalPoint: "74% center", safeTextArea: "left 42%" },
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
 * The corporate sets, in carousel order. A set may have no slot while its
 * plate is awaited, in which case the card renders a branded tile.
 */
export const corporateSetSlots: (ImageSlot | null)[] = [
  plate("CORP-SET-01", sectionAssets.corporateSet1, "The Travel Comfort Set: a black mini hard case with headphones, a neck pillow, a portable fan and a pouch"),
  plate("CORP-SET-02", sectionAssets.corporateSet2, "The Outdoor Retreat Set: a folding chair, cooler bag, umbrella, lantern and picnic blanket, all KIYO branded"),
  plate("CORP-SET-03", sectionAssets.corporateSet3, "The Executive Desk Set: a leather notebook, card holder, pen, thermos and keychain with a navy gift box"),
  plate("CORP-SET-04", sectionAssets.corporateSet4, "The Tech Productivity Set: a backpack with a speaker, power bank, wireless charger, phone stand and cables"),
  plate("CORP-SET-05", sectionAssets.corporateSet5, "The Apparel Welcome Set: a polo shirt, tote bag, cap, lanyard, socks and pin badge"),
  /* Square in the file; the card crops it to 4:3, so the crop holds the
     middle where the press, the mug and the candle sit. */
  plate("CORP-SET-06", sectionAssets.corporateSet6, "The Coffee Wellness Set: a wooden KIYO box with a French press, coffee, a mug, a candle, an eye mask and a blanket", { focalPoint: "center 55%" }),
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
 * Six handovers out of KIYO's own client archive, phone photographs taken on
 * the day. A client is named only where the picture itself carries the name
 * (a backdrop, a branded case) or KIYO filed the photograph under it.
 * `tall` marks the two portrait frames, which the wall stands across two rows.
 */
export const clientPhotoSlots: { slot: ImageSlot; caption: string; tall?: boolean }[] = [
  {
    slot: plate("CLIENT-HEJIRA", sectionAssets.clientHejira, "A family with their pink KIYO cases at the airport check-in before departing for UMRAH", { focalPoint: "center 40%" }),
    caption: "Hejira Travel jemaah, departing with their sets",
  },
  {
    slot: plate("CLIENT-PTPTN", sectionAssets.clientPtptn, "A handover photograph in front of the Perbadanan Tabung Pendidikan Tinggi Nasional sign"),
    caption: "Handover at Menara PTPTN, Tabung Pendidikan",
    tall: true,
  },
  {
    slot: plate("CLIENT-IRKAZ", sectionAssets.clientIrkaz, "A group of jemaah at KLIA with their silver IIRKAZ-branded cases", { focalPoint: "center 45%" }),
    caption: "IIRKAZ jemaah at KLIA with their branded cases",
  },
  {
    slot: plate("CLIENT-KOPERASI-TNB", sectionAssets.clientKoperasiTnb, "Three women from Koperasi TNB with their new KIYO cases", { focalPoint: "center 42%" }),
    caption: "Koperasi TNB, collecting their cases",
    tall: true,
  },
  {
    slot: plate("CLIENT-MANAZEL", sectionAssets.clientManazel, "The Manazel Mashaer Travel team beside their wrapped stock of green cases", { focalPoint: "center 45%" }),
    caption: "Manazel Mashaer Travel, stock delivered to their office",
  },
  {
    slot: plate("CLIENT-BULK", sectionAssets.clientBulkOrder, "Rows of purple cases printed with a travel agency's smile logo, ready to ship", { focalPoint: "center 50%" }),
    caption: "A branded agency order, printed and ready to ship",
  },
];

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
