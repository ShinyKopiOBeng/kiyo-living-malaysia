"use client";

/* Logo previews are local object URLs, not optimised project assets. */
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Check, Upload, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { ImageSlotVisual } from "./ImagePlaceholder";
import { ProductCarousel, type ProductChoice } from "./ProductCarousel";
import { brandCaseSlot, brandDetailSlots, pipelineSlots } from "./imageSlots";
import { whatsappLink } from "./SiteFooter";

/**
 * Sections 5, 6 and 7 of the page, built as one guided flow.
 *
 * This is deliberately not a checkout. Nothing is priced, nothing is stored and
 * no file is uploaded anywhere: the logo stays in the visitor's own browser as
 * an object URL purely so they can see it on the case. The point is to let a
 * buyer feel like they have assembled an order, then hand a complete,
 * pre-filled brief to KIYO sales over WhatsApp, which is the channel that
 * actually closes these deals.
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

const CUSTOMISATIONS = ["Logo printing", "Luggage tag", "Accessories", "Custom packaging"] as const;

const STATES = [
  "Johor", "Kedah", "Kelantan", "Kuala Lumpur", "Labuan", "Melaka", "Negeri Sembilan",
  "Pahang", "Penang", "Perak", "Perlis", "Putrajaya", "Sabah", "Sarawak", "Selangor",
  "Terengganu", "Outside Malaysia",
] as const;

const DELIVERY_STEPS = [
  { number: "01", label: "Brief" },
  { number: "02", label: "Sample" },
  { number: "03", label: "Approve" },
  { number: "04", label: "Production" },
  { number: "05", label: "QC" },
  { number: "06", label: "Warehouse" },
] as const;

const LOGO_MAX_BYTES = 5 * 1024 * 1024;

/** One fact per line, so the message reads cleanly inside a WhatsApp bubble. */
function composeEnquiry(fields: {
  product: ProductChoice | null;
  programme: Programme;
  company: string;
  options: string[];
  quantity: string;
  destination: string;
  requiredBy: string;
  notes: string;
  logoName: string | null;
}) {
  const lines = [
    "Hi KIYO, I would like a quotation for a customised set.",
    "",
    `Product: ${fields.product ? `${fields.product.name} (${fields.product.colourLabel})` : "To be advised"}`,
    `Programme: ${PROGRAMME_LABEL[fields.programme]}`,
    `Company / agency: ${fields.company.trim() || "To be advised"}`,
    `Branding: ${fields.options.length ? fields.options.join(", ") : "To be advised"}`,
    `Quantity: ${fields.quantity.trim() || "To be advised"}`,
    `Delivery: ${fields.destination || "To be confirmed"}`,
  ];

  if (fields.requiredBy) lines.push(`Required by: ${fields.requiredBy}`);
  if (fields.logoName) lines.push(`Logo file: ${fields.logoName} (I will send it in this chat)`);
  if (fields.notes.trim()) lines.push(`Additional request: ${fields.notes.trim()}`);

  lines.push("", "Sent from the KIYO website.");
  return lines.join("\n");
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
  const [logo, setLogo] = useState<{ name: string; url: string } | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [productError, setProductError] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const logoUrl = useRef<string | null>(null);

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

  useEffect(() => () => { if (logoUrl.current) URL.revokeObjectURL(logoUrl.current); }, []);

  const clearLogo = () => {
    if (logoUrl.current) URL.revokeObjectURL(logoUrl.current);
    logoUrl.current = null;
    setLogo(null);
    setLogoError(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const onLogo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      clearLogo();
      return;
    }
    if (!file.type.startsWith("image/")) {
      clearLogo();
      setLogoError("That file is not an image. PNG, JPG or SVG works best.");
      return;
    }
    if (file.size > LOGO_MAX_BYTES) {
      clearLogo();
      setLogoError("That file is over 5MB. Send the full-resolution artwork in the chat instead.");
      return;
    }
    if (logoUrl.current) URL.revokeObjectURL(logoUrl.current);
    logoUrl.current = URL.createObjectURL(file);
    setLogo({ name: file.name, url: logoUrl.current });
    setLogoError(null);
  };

  const toggleOption = (option: string) =>
    setOptions((current) =>
      current.includes(option) ? current.filter((entry) => entry !== option) : [...current, option],
    );

  const message = useMemo(
    () => composeEnquiry({ product, programme, company, options, quantity, destination, requiredBy, notes, logoName: logo?.name ?? null }),
    [product, programme, company, options, quantity, destination, requiredBy, notes, logo],
  );

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!product) {
      /* Native validation cannot reach the card rail, so step 1 is checked by
         hand and the page is sent back to it rather than failing silently. */
      setProductError(true);
      document.getElementById("build")?.scrollIntoView({ block: "start", behavior: "smooth" });
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

          <figure className="brandcase" data-reveal="scale">
            <ImageSlotVisual slot={brandCaseSlot} className="brandcase__media" />
            <figcaption className="brandcase__plate">
              {logo
                ? <img src={logo.url} alt={`Preview of ${logo.name}`} />
                : <span>{company.trim() || "Your logo"}</span>}
            </figcaption>
          </figure>

          <div className="brandform" data-reveal>
            <label className="field">
              <span>Company / agency name</span>
              <input
                type="text"
                name="company"
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                placeholder="Your company or travel agency"
                autoComplete="organization"
                required
              />
            </label>

            <fieldset className="field field--group">
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

            <fieldset className="field field--group">
              <legend>Customisation options</legend>
              <div className="chipset">
                {CUSTOMISATIONS.map((option) => {
                  const on = options.includes(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      className={`chip${on ? " is-on" : ""}`}
                      aria-pressed={on}
                      onClick={() => toggleOption(option)}
                    >
                      {on ? <Check aria-hidden="true" /> : null}
                      {option}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <input
              ref={fileRef}
              id="build-logo"
              className="sr-only"
              type="file"
              name="logo"
              accept="image/*"
              onChange={onLogo}
            />
            <div className="brandform__logo">
              <label className="ghost-button" htmlFor="build-logo">
                <Upload aria-hidden="true" />
                {logo ? "Change logo file" : "Upload your logo"}
              </label>
              <a className="ghost-button" href={whatsappLink("Hi KIYO, I will send my logo artwork for a customised set.")} target="_blank" rel="noreferrer">
                <FaWhatsapp aria-hidden="true" />
                Send logo later on WhatsApp
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>

            {logo ? (
              <p className="brandform__file">
                {logo.name}
                <button type="button" onClick={clearLogo} aria-label={`Remove ${logo.name}`}><X aria-hidden="true" /></button>
              </p>
            ) : null}
            {logoError ? <p className="field__error" role="alert">{logoError}</p> : null}
            <p className="field__note">Your file stays in this browser. Nothing is uploaded to a server.</p>
          </div>

          {/* The third column of the mockup: the detail plates, with the step's
              one forward action closing the column underneath them. */}
          <div className="brandpanel">
            <div className="branddetails" data-reveal-group>
              {brandDetailSlots.map((slotItem) => (
                <ImageSlotVisual key={slotItem.id} slot={slotItem} className="branddetails__tile" />
              ))}
            </div>

            <a className="button button--coral flow__continue" href="#delivery">
              Continue to delivery <ArrowRight aria-hidden="true" />
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

          <ol className="pipeline" data-reveal-group aria-label="How a KIYO order runs">
            {DELIVERY_STEPS.map(({ number, label }, index) => (
              <li className="pipeline__step" key={number}>
                <ImageSlotVisual slot={pipelineSlots[index]} className="pipeline__media" />
                <span className="pipeline__number">{number}</span>
                <span className="pipeline__label">{label}</span>
              </li>
            ))}
          </ol>

          <div className="deliveryform" data-reveal>
            <label className="field">
              <span>Estimated quantity</span>
              <input
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

            <label className="field">
              <span>Delivery city / state</span>
              <select
                name="destination"
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
              >
                <option value="">Select location</option>
                {STATES.map((state) => <option key={state} value={state}>{state}</option>)}
              </select>
            </label>

            <label className="field">
              <span>Required date</span>
              <input
                ref={dateRef}
                type="date"
                name="required-by"
                value={requiredBy}
                onChange={(event) => setRequiredBy(event.target.value)}
              />
            </label>

            <label className="field">
              <span>Additional request</span>
              <input
                type="text"
                name="notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Tell us more (optional)"
              />
            </label>
          </div>

          <aside className="enquiry" data-reveal="right" aria-label="Your KIYO enquiry">
            <h3>Your KIYO enquiry</h3>
            <dl>
              <div><dt>Product</dt><dd>{product ? product.name : "-"}</dd></div>
              <div><dt>Programme</dt><dd>{PROGRAMME_LABEL[programme]}</dd></div>
              <div><dt>Branding</dt><dd>{options.length ? options.join(", ") : "-"}</dd></div>
              <div><dt>Quantity</dt><dd>{quantity.trim() || "-"}</dd></div>
              <div><dt>Delivery</dt><dd>{destination || "-"}</dd></div>
            </dl>
            <button className="button button--coral enquiry__send" type="submit">
              Get my quote on WhatsApp <ArrowUpRight aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </button>
            <p className="enquiry__note">You can send your logo file after WhatsApp opens.</p>
          </aside>
        </div>
      </section>
    </form>
  );
}
