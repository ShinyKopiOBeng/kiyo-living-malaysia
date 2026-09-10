"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Check, Mail } from "lucide-react";
import { ImageSlotVisual } from "./ImagePlaceholder";
import { ProductCarousel, type ProductChoice } from "./ProductCarousel";
import { brandCaseSlot, customisationSlots, pipelineSlots } from "./imageSlots";
import { EMAIL, enquiry, whatsappLink } from "./SiteFooter";

/**
 * Sections 5, 6 and 7 of the page, built as one guided flow.
 *
 * This is deliberately not a checkout. Nothing is priced and nothing is stored:
 * the point is to let a buyer feel like they have assembled an order, then hand
 * a complete, pre-filled brief to KIYO sales over WhatsApp, which is the
 * channel that actually closes these deals.
 *
 * Every field the enquiry needs is collected in step 2. Splitting the form
 * across steps 2 and 3 was reported as the reason briefs arrived half-written:
 * a visitor filled in the customise chapter, pressed the forward action, and
 * had no way of knowing four more fields were waiting. Step 3 now reviews and
 * sends, and the summary names anything still blank.
 */

/** The UMRAH and corporate chapters preselect the programme through this. */
export const PROGRAMME_EVENT = "kiyo:programme";
export type Programme = "corporate" | "umrah";
export const PROGRAMME_LABEL: Record<Programme, string> = {
  corporate: "Corporate Gifts",
  umrah: "UMRAH Programme",
};

const STEPS = [
  { id: "build", label: "Choose" },
  { id: "customise", label: "Customise" },
  { id: "delivery", label: "Delivery" },
] as const;

/* In the same order as `customisationSlots`, so each option keeps its own
   photograph. Changing one without the other mislabels a picture. */
const CUSTOMISATIONS = ["Logo printing", "Luggage tag", "Accessories", "Custom packaging"] as const;

const STATES = [
  "Johor", "Kedah", "Kelantan", "Kuala Lumpur", "Labuan", "Melaka", "Negeri Sembilan",
  "Pahang", "Penang", "Perak", "Perlis", "Putrajaya", "Sabah", "Sarawak", "Selangor",
  "Terengganu", "Outside Malaysia",
] as const;

/* One line each, because six photographs with only a one-word label under them
   told a visitor nothing about what actually happens between them. */
const DELIVERY_STEPS = [
  { number: "01", label: "Brief", line: "We take your brief and specs" },
  { number: "02", label: "Sample", line: "A physical sample is made" },
  { number: "03", label: "Approve", line: "You sign off the sample" },
  { number: "04", label: "Production", line: "The branded run begins" },
  { number: "05", label: "QC", line: "Every unit is checked" },
  { number: "06", label: "Warehouse", line: "Held and shipped from Kajang" },
] as const;

/**
 * One fact per line, so the message reads cleanly inside a WhatsApp bubble.
 *
 * Product, quantity and date lead, because those three are what a salesperson
 * needs before they can quote anything, and WhatsApp folds a long first message
 * behind a "Read more". They used to sit at positions one, five and eight.
 */
function composeEnquiry(fields: {
  product: ProductChoice | null;
  programme: Programme;
  company: string;
  options: string[];
  quantity: string;
  destination: string;
  requiredBy: string;
  notes: string;
}) {
  const lines = [
    "Hi KIYO, I would like a quotation for a customised set.",
    "",
    `Product: ${fields.product ? `${fields.product.name} (${fields.product.colourLabel})` : "To be advised"}`,
    `Quantity: ${fields.quantity.trim() || "To be advised"}`,
    `Required by: ${fields.requiredBy || "To be confirmed"}`,
    `Delivery: ${fields.destination || "To be confirmed"}`,
    "",
    `Programme: ${PROGRAMME_LABEL[fields.programme]}`,
    `Company / agency: ${fields.company.trim() || "To be advised"}`,
    `Branding: ${fields.options.length ? fields.options.join(", ") : "To be advised"}`,
  ];

  if (fields.notes.trim()) lines.push(`Additional request: ${fields.notes.trim()}`);

  return enquiry(lines.join("\n"), "build your set");
}

function StepRail({ active }: { active: 0 | 1 | 2 }) {
  return (
    <ol className="steprail" aria-label="Enquiry steps">
      {STEPS.map(({ id, label }, index) => (
        <li key={id} className={index === active ? "is-active" : undefined}>
          <a href={`#${id}`}>
            <span className="steprail__number">{String(index + 1).padStart(2, "0")}</span>
            <span className="steprail__label">{label}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}

export function BuildYourSet() {
  const [product, setProduct] = useState<ProductChoice | null>(null);
  const [programme, setProgramme] = useState<Programme>("corporate");
  const [company, setCompany] = useState("");
  const [options, setOptions] = useState<string[]>([CUSTOMISATIONS[0]]);
  const [quantity, setQuantity] = useState("");
  const [destination, setDestination] = useState("");
  const [requiredBy, setRequiredBy] = useState("");
  const [notes, setNotes] = useState("");
  const [productError, setProductError] = useState(false);

  const dateRef = useRef<HTMLInputElement>(null);

  /* Rendering today's date on the server would disagree with the visitor's
     clock and trip hydration, so the floor for the picker is written straight
     to the DOM after mount rather than held in React state. */
  useEffect(() => {
    if (dateRef.current) dateRef.current.min = new Date().toISOString().slice(0, 10);
  }, []);

  /* The UMRAH and corporate chapters each have a CTA that jumps here. They
     announce which programme the visitor came in on so the enquiry is already
     pointed at the right desk. */
  useEffect(() => {
    const onProgramme = (event: Event) => {
      const next = (event as CustomEvent<Programme>).detail;
      if (next === "corporate" || next === "umrah") setProgramme(next);
    };
    window.addEventListener(PROGRAMME_EVENT, onProgramme);
    return () => window.removeEventListener(PROGRAMME_EVENT, onProgramme);
  }, []);

  const toggleOption = (option: string) =>
    setOptions((current) =>
      current.includes(option) ? current.filter((entry) => entry !== option) : [...current, option],
    );

  /* Step 1 lives in a card rail that native validation cannot reach, so a
     missing product is sent back to it by hand rather than failing silently. */
  const sendToProduct = () => {
    setProductError(true);
    document.getElementById("build")?.scrollIntoView({ block: "start", behavior: "smooth" });
  };

  /* The review summary lists anything still blank as a control rather than as
     a dash, so a visitor who missed a field is taken to it instead of being
     told that they missed it. */
  const focusField = (id: string) => {
    if (id === "build") {
      sendToProduct();
      return;
    }
    const field = document.getElementById(id);
    if (!field) return;
    field.scrollIntoView({ block: "center", behavior: "smooth" });
    field.focus({ preventScroll: true });
  };

  /* The first thing still standing between the visitor and a complete brief.
     Announced live under the forward action, which is where they are looking
     when they decide whether this step is finished. */
  const outstanding = !product
    ? { note: "Pick a model in step 1 to start.", target: "build" }
    : !company.trim()
      ? { note: "Add your company name.", target: "field-company" }
      : !options.length
        ? { note: "Choose at least one customisation.", target: "field-options" }
        : !quantity.trim()
          ? { note: "Add an estimated quantity.", target: "field-quantity" }
          : null;

  const message = useMemo(
    () => composeEnquiry({ product, programme, company, options, quantity, destination, requiredBy, notes }),
    [product, programme, company, options, quantity, destination, requiredBy, notes],
  );

  /* The escape hatch.
     On a desktop without WhatsApp the wa.me link lands on an "Open app or
     continue to WhatsApp Web" interstitial, and a visitor who has neither is
     left holding a finished brief they cannot send. This carries the same
     brief by mail instead. */
  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(
    `KIYO enquiry${company.trim() ? `, ${company.trim()}` : ""}`,
  )}&body=${encodeURIComponent(message)}`;

  const summary: { term: string; value: string; field: string; required: boolean }[] = [
    { term: "Product", value: product ? `${product.name}, ${product.colourLabel}` : "", field: "build", required: true },
    { term: "Programme", value: PROGRAMME_LABEL[programme], field: "field-programme", required: true },
    { term: "Company", value: company.trim(), field: "field-company", required: true },
    { term: "Branding", value: options.join(", "), field: "field-options", required: true },
    { term: "Quantity", value: quantity.trim(), field: "field-quantity", required: true },
    { term: "Delivery to", value: destination, field: "field-destination", required: false },
    { term: "Required by", value: requiredBy, field: "field-required-by", required: false },
    { term: "Additional request", value: notes.trim(), field: "field-notes", required: false },
  ];

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!product) {
      sendToProduct();
      return;
    }
    setProductError(false);
    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
  };

  return (
    <form className="flow" onSubmit={onSubmit} aria-label="Build your KIYO set and request a quotation">
      {/* ---------------------------------------------------------------- */}
      {/* 05  Choose your luggage                                           */}
      {/* ---------------------------------------------------------------- */}
      <section className="chapter flow__step flow__step--choose" id="build" aria-labelledby="build-title">
        <StepRail active={0} />
        <div className="flow__body">
          <header className="flow__intro" data-reveal-group>
            <h2 id="build-title">Choose<br />your luggage.</h2>
            <p>Branded designs for every journey.</p>
            <p className={`flow__pick${product ? " is-set" : ""}${productError ? " is-invalid" : ""}`} aria-live="polite">
              {product
                ? `Selected: ${product.name} in ${product.colourLabel}`
                : "Pick a model to start your set."}
            </p>
          </header>

          <ProductCarousel
            selected={product}
            onSelect={(choice) => { setProduct(choice); setProductError(false); }}
          />
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* 06  Customise your brand                                          */}
      {/* ---------------------------------------------------------------- */}
      <section className="chapter flow__step flow__step--customise" id="customise" aria-labelledby="customise-title">
        <StepRail active={1} />
        <div className="flow__body flow__body--customise">
          <header className="flow__intro" data-reveal-group>
            <h2 id="customise-title">Customise<br />your brand.</h2>
            <p>Make it uniquely yours.</p>
          </header>

          {/* The engraving and the field that drives it are one object: the
              input sits directly under the plate, on its centre axis, so a
              visitor can see what they are typing land on the case. */}
          <div className="brandstudio">
            <figure className="brandcase" data-reveal="scale">
              <ImageSlotVisual slot={brandCaseSlot} className="brandcase__media" />
              <figcaption className="brandcase__plate">
                <span>{company.trim() || "Your name here"}</span>
              </figcaption>
            </figure>

            <span className="brandcase__tie" aria-hidden="true" />

            <label className="field field--name" htmlFor="field-company">
              <span>Company / agency name</span>
              <input
                id="field-company"
                type="text"
                name="company"
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                placeholder="Your company or travel agency"
                autoComplete="organization"
                required
              />
            </label>

            <p className="field__note">
              We print this name. Send your logo artwork on WhatsApp once your enquiry opens.
            </p>
          </div>

          <div className="brandform" data-reveal>
            <fieldset className="field field--group" id="field-programme">
              <legend>Programme</legend>
              <div className="chipset chipset--programme">
                {(Object.keys(PROGRAMME_LABEL) as Programme[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    className={`chip${programme === key ? " is-on" : ""}`}
                    aria-pressed={programme === key}
                    onClick={() => setProgramme(key)}
                  >
                    {programme === key ? <Check aria-hidden="true" /> : null}
                    {PROGRAMME_LABEL[key]}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* The four photographs used to sit in a tile grid beside the form,
                illustrating options the visitor was choosing blind. They are
                the controls now, so a buyer can see what custom packaging
                actually means before ticking it. */}
            <fieldset className="field field--group" id="field-options">
              <legend>What to customise</legend>
              <div className="optionset">
                {CUSTOMISATIONS.map((option, index) => {
                  const on = options.includes(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      className={`optioncard${on ? " is-on" : ""}`}
                      aria-pressed={on}
                      onClick={() => toggleOption(option)}
                    >
                      <ImageSlotVisual slot={customisationSlots[index]} className="optioncard__media" />
                      <span className="optioncard__label">
                        <span className="optioncard__tick" aria-hidden="true"><Check /></span>
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="field field--group field--order">
              <legend>Order details</legend>
              <div className="orderfields">
                <label className="field" htmlFor="field-quantity">
                  <span>Estimated quantity</span>
                  <input
                    id="field-quantity"
                    type="number"
                    name="quantity"
                    min="1"
                    inputMode="numeric"
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                    placeholder="e.g. 100"
                    required
                  />
                </label>

                <label className="field" htmlFor="field-destination">
                  <span>Delivery city / state</span>
                  <select
                    id="field-destination"
                    name="destination"
                    value={destination}
                    onChange={(event) => setDestination(event.target.value)}
                  >
                    <option value="">Select location</option>
                    {STATES.map((state) => <option key={state} value={state}>{state}</option>)}
                  </select>
                </label>

                <label className="field" htmlFor="field-required-by">
                  <span>Required date</span>
                  <input
                    ref={dateRef}
                    id="field-required-by"
                    type="date"
                    name="required-by"
                    value={requiredBy}
                    onChange={(event) => setRequiredBy(event.target.value)}
                  />
                </label>

                <label className="field" htmlFor="field-notes">
                  <span>Additional request</span>
                  <input
                    id="field-notes"
                    type="text"
                    name="notes"
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="Tell us more (optional)"
                  />
                </label>
              </div>
            </fieldset>

            <p className={`flow__status${outstanding ? "" : " is-ready"}`} aria-live="polite">
              {outstanding ? outstanding.note : "Ready. Review your enquiry."}
            </p>

            <a className="button button--coral flow__continue" href="#delivery">
              Review my enquiry <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* 07  Delivery and quotation                                        */}
      {/* ---------------------------------------------------------------- */}
      <section className="chapter flow__step flow__step--delivery" id="delivery" aria-labelledby="delivery-title">
        <StepRail active={2} />
        <div className="flow__body flow__body--delivery">
          <header className="flow__intro" data-reveal-group>
            <h2 id="delivery-title">Delivery<br />made simple.</h2>
            <p>From idea to arrival.</p>
          </header>

          {/* Six stages across the full shell rather than inside a column, so
              the only evidence on the page that KIYO runs its own production
              and QC is big enough to read. */}
          <ol className="pipeline" data-reveal-group aria-label="How a KIYO order runs">
            {DELIVERY_STEPS.map(({ number, label, line }, index) => (
              <li className="pipeline__step" key={number}>
                <ImageSlotVisual slot={pipelineSlots[index]} className="pipeline__media" />
                <span className="pipeline__number">{number}</span>
                <span className="pipeline__label">{label}</span>
                <span className="pipeline__line">{line}</span>
              </li>
            ))}
          </ol>

          <aside className="enquiry" data-reveal aria-label="Your KIYO enquiry">
            <h3>Your KIYO enquiry</h3>
            <dl>
              {summary.map(({ term, value, field, required }) => (
                <div key={term}>
                  <dt>{term}</dt>
                  <dd>
                    {value ? value : (
                      <button
                        type="button"
                        className={`enquiry__add${required ? " is-required" : ""}`}
                        onClick={() => focusField(field)}
                      >
                        Add this<span className="sr-only"> {term.toLowerCase()}</span>
                      </button>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            <button className="button button--coral enquiry__send" type="submit">
              Get my quote on WhatsApp <ArrowUpRight aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </button>

            {/* The link opens WhatsApp with the message written but NOT sent,
                which visitors miss: they close the tab believing they have
                enquired. */}
            <p className="enquiry__note">
              Press send once WhatsApp opens. You can attach your logo file there.
            </p>

            <button
              type="button"
              className="enquiry__mail"
              onClick={() => {
                if (!product) {
                  sendToProduct();
                  return;
                }
                window.location.href = mailto;
              }}
            >
              <Mail aria-hidden="true" /> Email it instead
            </button>
          </aside>
        </div>
      </section>
    </form>
  );
}
