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

export const heroSlot: ImageSlot = {
  id: "HOME-HERO-01",
  status: "final",
  src: "/images/kiyo/home-hero-airport.webp",
  aspectRatio: "1916 / 821",
  fit: "cover",
  focalPoint: "68% center",
  safeTextArea: "left 40%",
  alt: "KIYO luggage and travellers in a bright airport terminal",
  width: 1916,
  height: 821,
};

export const aboutSlots = {
  warehouse: {
    id: "ABOUT-WAREHOUSE",
    status: "final",
    src: "/images/kiyo/samantha-warehouse.webp",
    aspectRatio: "1047 / 941",
    fit: "cover",
    focalPoint: "center center",
    safeTextArea: "left third",
    alt: "KIYO warehouse and showroom in Shah Alam at sunset",
    width: 1047,
    height: 941,
  },
  samantha: {
    id: "ABOUT-SAMANTHA",
    status: "final",
    src: "/images/kiyo/samantha-founder.webp",
    aspectRatio: "2 / 3",
    fit: "contain",
    focalPoint: "center bottom",
    safeTextArea: "signature at lower centre",
    alt: "Samantha Ng, founder of KIYO",
    width: 608,
    height: 921,
  },
} satisfies Record<string, ImageSlot>;

export const productSlots = {
  overview: {
    id: "PRODUCT-OVERVIEW",
    status: "final",
    src: "/images/kiyo/product-overview.webp",
    aspectRatio: "4 / 5",
    fit: "contain",
    focalPoint: "center center",
    alt: "Front view of KIYO's signature navy luggage case",
    width: 1000,
    height: 1250,
  },
  colours: {
    id: "PRODUCT-COLOURS",
    status: "final",
    src: "/images/kiyo/product-colours.webp",
    aspectRatio: "16 / 9",
    fit: "contain",
    focalPoint: "center center",
    alt: "Six KIYO luggage colour choices shown side by side",
    width: 1439,
    height: 810,
  },
  handle: {
    id: "PRODUCT-HANDLE",
    status: "final",
    src: "/images/kiyo/product-handle.webp",
    aspectRatio: "1 / 1",
    fit: "cover",
    focalPoint: "center center",
    alt: "Close view of the KIYO telescopic handle and top grip",
    width: 1100,
    height: 1100,
  },
  wheels: {
    id: "PRODUCT-WHEELS",
    status: "final",
    src: "/images/kiyo/product-wheels.webp",
    aspectRatio: "1 / 1",
    fit: "cover",
    focalPoint: "center center",
    alt: "Close view of KIYO 360 degree spinner wheels",
    width: 1100,
    height: 1100,
  },
  security: {
    id: "PRODUCT-SECURITY",
    status: "final",
    src: "/images/kiyo/product-lock.webp",
    aspectRatio: "1 / 1",
    fit: "cover",
    focalPoint: "center center",
    alt: "Close view of the integrated KIYO luggage lock and zipper pulls",
    width: 1100,
    height: 1100,
  },
  studio: {
    id: "PRODUCT-STUDIO",
    status: "final",
    src: "/images/kiyo/product-studio.webp",
    aspectRatio: "4 / 5",
    fit: "contain",
    focalPoint: "center center",
    alt: "KIYO luggage case presented on a studio pedestal",
    width: 1000,
    height: 1250,
  },
  travel: {
    id: "PRODUCT-TRAVEL",
    status: "final",
    src: "/images/kiyo/product-airport.webp",
    aspectRatio: "16 / 9",
    fit: "cover",
    focalPoint: "center center",
    alt: "KIYO luggage case standing in a bright airport terminal",
    width: 1439,
    height: 810,
  },
} satisfies Record<string, ImageSlot>;

export const productCollectionSlot: ImageSlot = {
  id: "PRODUCT-COLLECTION-HERO",
  status: "final",
  src: "/images/kiyo/product-collection-hero.webp",
  aspectRatio: "1586 / 992",
  fit: "contain",
  focalPoint: "center center",
  alt: "Premium navy KIYO luggage presented in a warm studio setting",
  width: 1586,
  height: 992,
};

export const corporateSlots = [
  ["GIFT-SET-01", "/images/kiyo/corporate-gift-travel-amenities.webp", "Black compact luggage with headphones, neck pillow, portable fan and travel pouch"],
  ["GIFT-SET-02", "/images/kiyo/corporate-gift-team-building.webp", "Corporate outdoor kit with camping chair, tote, umbrella, portable fan and blanket"],
  ["GIFT-SET-03", "/images/kiyo/corporate-gift-mini-luggage.webp", "Pink mini luggage with headphones, neck pillow, portable fan and drawstring pouch"],
  ["GIFT-SET-04", "/images/kiyo/corporate-gift-notebook.webp", "Premium navy gift box with A5 notebook, pen and thermos bottle"],
].map(([id, src, alt]) => ({
  id,
  status: "final" as const,
  src,
  aspectRatio: "4 / 5",
  fit: "cover" as const,
  focalPoint: "center center",
  alt,
  width: 1440,
  height: 1080,
})) satisfies ImageSlot[];

export const umrahSlots = [
  ["UMRAH-JOURNEY", "/images/kiyo/umrah-journey.webp", "UMRAH traveller with a coordinated cream luggage set at an airport"],
  ["UMRAH-ESSENTIALS", "/images/kiyo/umrah-essentials.webp", "Cream UMRAH luggage arranged with selected prayer and travel essentials"],
  ["UMRAH-BRANDING", "/images/kiyo/umrah-custom.webp", "Cream UMRAH luggage with custom agency branding presentation"],
].map(([id, src, alt]) => ({
  id,
  status: "final" as const,
  src,
  aspectRatio: "4 / 5",
  fit: "cover" as const,
  focalPoint: "center center",
  alt,
  width: 900,
  height: 1125,
})) satisfies ImageSlot[];

export const warehouseSlots = Array.from({ length: 5 }, (_, index) => ({
  id: `WAREHOUSE-${index + 1}`,
  status: "final" as const,
  src: `/images/kiyo/warehouse-${index + 1}.webp`,
  aspectRatio: "5 / 3",
  fit: "cover" as const,
  focalPoint: "center center",
  alt: [
    "The exterior of KIYO's Shah Alam warehouse and showroom",
    "Organised luggage stock in KIYO's warehouse",
    "KIYO's luggage showroom with product displays",
    "A KIYO office and client discussion space",
    "KIYO's warehouse preparation and packing area",
  ][index],
  width: 1440,
  height: 864,
})) satisfies ImageSlot[];
