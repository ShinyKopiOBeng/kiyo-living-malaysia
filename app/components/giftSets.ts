import { corporateSetSlots, umrahSetSlots, type ImageSlot } from "./imageSlots";

/**
 * The twelve gift sets, six per programme, in carousel order.
 *
 * Names are KIYO's working names from the delivered files, tidied. Contents
 * are read off the photographs, so they describe what is pictured and stop
 * there; MOQ and lead time are the figures approved for every set. Correct any
 * of it here and nothing else has to change.
 */
export type GiftSet = {
  id: string;
  number: string;
  title: string;
  summary: string;
  contents: string[];
  moq: string;
  leadTime: string;
  /** Null while a plate is awaited; the card renders a branded tile instead. */
  slot: ImageSlot | null;
};

const MOQ = "100 sets";
const LEAD_TIME = "6-8 weeks";

function set(number: number, title: string, summary: string, contents: string[], slot: ImageSlot | null): GiftSet {
  return {
    id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    number: String(number).padStart(2, "0"),
    title,
    summary,
    contents,
    moq: MOQ,
    leadTime: LEAD_TIME,
    slot,
  };
}

export const umrahSets: GiftSet[] = [
  set(1, "Navy Heritage Set", "A two-case set in navy with the ibadah essentials packed alongside.",
    ["Cabin and medium cases in navy", "Sling bag and rolled prayer mat", "Tasbih, insulated bottle, document holder and luggage tag"], umrahSetSlots[0]),
  set(2, "Emerald Telekung Set", "For women: emerald cases with the telekung and prayer mat ready to go.",
    ["Cabin and medium cases in emerald", "Telekung and prayer mat", "Drawstring bag, pouch, bottle and tasbih"], umrahSetSlots[1]),
  set(3, "Desert Terracotta Set", "Warm terracotta cases with the pieces a long day of ibadah calls for.",
    ["Cabin and medium cases in terracotta", "Drawstring bag, two pouches and travel slippers", "Rolled prayer mat, spray bottle and luggage tag"], umrahSetSlots[2]),
  set(4, "Dusty Rose Comfort Set", "The rest-and-travel set: everything for the flight and the stay.",
    ["Cabin and medium cases in dusty rose", "Neck pillow, eye mask and tote bag", "Prayer mat, pouch, bottle and tasbih"], umrahSetSlots[3]),
  set(5, "Charcoal Executive Set", "A darker, fuller set with a presentation box for a senior jemaah.",
    ["Cabin and large cases in charcoal", "Backpack, sling bag and neck pillow", "Portable fan, bottle, pouch and presentation box"], umrahSetSlots[4]),
  set(6, "Sapphire Ihram Set", "For men: sapphire cases with the ihram set and the day-to-day carry.",
    ["Cabin, medium and mini cases in sapphire", "Ihram set and drawstring bag", "Neck pillow, sling bag, bottle, pouch and slippers"], umrahSetSlots[5]),
];

export const corporateSets: GiftSet[] = [
  set(1, "Travel Comfort Set", "A compact travel set for clients, teams and event guests.",
    ["Black mini hard case", "Headphones, neck pillow and portable fan", "Drawstring pouch, all KIYO branded"], corporateSetSlots[0]),
  set(2, "Outdoor Retreat Set", "Practical outdoor pieces chosen for team retreats and family days.",
    ["Folding chair and cooler bag", "Umbrella and lantern", "Picnic blanket, all KIYO branded"], corporateSetSlots[1]),
  set(3, "Executive Desk Set", "A senior gift: leather desk pieces in a navy presentation box.",
    ["Leather notebook and card holder", "Pen, thermos and keychain", "Navy gift box with your logo"], corporateSetSlots[2]),
  set(4, "Tech Productivity Set", "The everyday-carry set for a team that works on the move.",
    ["Laptop backpack", "Speaker, power bank and wireless charger", "Phone stand and cable set"], corporateSetSlots[3]),
  set(5, "Apparel Welcome Set", "An onboarding set that puts the company on every piece.",
    ["Polo shirt and cap", "Tote bag and lanyard", "Socks and pin badge"], corporateSetSlots[4]),
  set(6, "Coffee Wellness Set", "A slow-morning gift in a wooden box: coffee, a press and a plant.",
    ["Wooden gift box", "French press and ground coffee", "Desk plant, all KIYO branded"], corporateSetSlots[5]),
];
