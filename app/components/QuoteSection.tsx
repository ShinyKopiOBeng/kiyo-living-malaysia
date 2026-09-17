"use client";

/* The success panel carries the vector mark, served straight from public. */
/* eslint-disable @next/next/no-img-element */

import { useEffect, useId, useState } from "react";
import { ArrowRight, ArrowUpRight, Clock, Mail, MapPin, RotateCcw } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { PROGRAMME_EVENT, PROGRAMME_LABEL, type Programme } from "./programme";
import { EMAIL, WHATSAPP_NUMBER, enquiry, whatsappLink } from "./SiteFooter";

/**
 * Chapter 8: the quotation, and where KIYO is.
 *
 * One form is the whole enquiry now. It used to be assembled across three
 * chapters; a visitor filled in one, pressed forward, and had no way of
 * knowing more fields were waiting. Here everything a salesperson needs to
 * quote sits on one card, and one press sends it two ways:
 *
 * 1. By email, through Web3Forms, a form-to-inbox relay that needs no server
 *    of ours, so the site stays static. The access key was created with the
 *    KIYO inbox; `NEXT_PUBLIC_WEB3FORMS_KEY` overrides it. With no key at all
 *    the fetch is skipped and the form says so, quietly, in the success panel.
 * 2. By WhatsApp, which the browser can only open with the message written
 *    in. It cannot press send for the visitor, so the success panel says
 *    "press send" and repeats the link in case a popup blocker ate the tab.
 *
 * The WhatsApp tab is opened first and synchronously, inside the submit
 * handler, because browsers only allow a new tab from a direct user gesture:
 * opening it after the fetch resolved would be blocked on most of them.
 */

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
/* The access key KIYO created for kiyoliving88@gmail.com. A Web3Forms key is
   made to sit in client-side code: it can only deliver to the inbox it was
   created with. The environment overrides it, so a host can rotate the key
   without a code change. */
const KIYO_WEB3FORMS_KEY = "6137b99b-d8fe-456c-b8a9-0596b1cbb096";
const WEB3FORMS_KEY =
  (typeof process !== "undefined" && process.env ? process.env.NEXT_PUBLIC_WEB3FORMS_KEY : undefined) || KIYO_WEB3FORMS_KEY;

export const MAP_EMBED =
  "https://maps.google.com/maps?q=No.%2016%2C%20Jalan%20SC%201%2C%20Pusat%20Perindustrian%20Sungai%20Chua%2C%2043000%20Kajang%2C%20Selangor&z=15&output=embed";

export const MAP_LINK =
  "https://www.google.com/maps/search/?api=1&query=No.+16,+Jalan+SC+1,+Pusat+Perindustrian+Sungai+Chua,+43000+Kajang,+Selangor";

type Logo = "yes" | "no" | "unsure";
const LOGO_LABEL: Record<Logo, string> = { yes: "Yes", no: "No", unsure: "Not sure" };

type Status = "idle" | "sending" | "sent" | "failed";

type Fields = {
  name: string;
  company: string;
  phone: string;
  email: string;
  quantity: string;
  programme: Programme | "";
  logo: Logo | "";
  message: string;
};

const EMPTY: Fields = { name: "", company: "", phone: "", email: "", quantity: "", programme: "", logo: "", message: "" };

/**
 * One fact per line, so the message reads cleanly inside a WhatsApp bubble.
 * The things a salesperson needs to quote come first, because WhatsApp folds a
 * long first message behind a "Read more".
 */
export function composeBrief(fields: Fields) {
  const lines = [
    "Hi KIYO, I would like a quotation.",
    "",
    `Interested in: ${fields.programme ? PROGRAMME_LABEL[fields.programme] : "To be advised"}`,
    `Estimated quantity: ${fields.quantity.trim() || "To be advised"}`,
    `Custom logo: ${fields.logo ? LOGO_LABEL[fields.logo] : "To be advised"}`,
    "",
    `Name: ${fields.name.trim()}`,
    `Company: ${fields.company.trim() || "To be advised"}`,
    `HP / WhatsApp: ${fields.phone.trim()}`,
  ];
  if (fields.email.trim()) lines.push(`Email: ${fields.email.trim()}`);
  if (fields.message.trim()) lines.push("", `Message: ${fields.message.trim()}`);
  return enquiry(lines.join("\n"), "quotation form");
}

function ChoiceGroup<T extends string>({
  legend,
  name,
  value,
  options,
  onChange,
  required,
  error,
}: {
  legend: string;
  name: string;
  value: T | "";
  options: { id: T; label: string }[];
  onChange: (next: T) => void;
  required?: boolean;
  error?: string;
}) {
  const errorId = useId();
  return (
    <fieldset className={`field field--group${error ? " is-invalid" : ""}`} aria-describedby={error ? errorId : undefined}>
      <legend>{legend}</legend>
      <div className="choices" style={{ "--choices": options.length } as React.CSSProperties}>
        {options.map((option) => (
          <label className={`choice${value === option.id ? " is-on" : ""}`} key={option.id}>
            <input
              type="radio"
              name={name}
              value={option.id}
              checked={value === option.id}
              onChange={() => onChange(option.id)}
              required={required}
            />
            <span className="choice__dot" aria-hidden="true" />
            {option.label}
          </label>
        ))}
      </div>
      {error ? <p className="field__error" id={errorId}>{error}</p> : null}
    </fieldset>
  );
}

export function QuoteSection() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [status, setStatus] = useState<Status>("idle");
  const [programmeError, setProgrammeError] = useState("");
  const [sentLink, setSentLink] = useState("");
  const [sentName, setSentName] = useState("");

  const set = <K extends keyof Fields>(key: K) => (value: Fields[K]) => setFields((current) => ({ ...current, [key]: value }));

  /* The gift chapters announce which programme the visitor came in on, so the
     first question is already answered when they arrive. */
  useEffect(() => {
    const onProgramme = (event: Event) => {
      const next = (event as CustomEvent<Programme>).detail;
      if (next === "corporate" || next === "umrah") {
        setFields((current) => ({ ...current, programme: next }));
        setProgrammeError("");
      }
    };
    window.addEventListener(PROGRAMME_EVENT, onProgramme);
    return () => window.removeEventListener(PROGRAMME_EVENT, onProgramme);
  }, []);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    /* The honeypot. A field no person can see, and one bots fill in. */
    const trap = form.elements.namedItem("botcheck") as HTMLInputElement | null;
    if (trap?.checked) return;

    if (!fields.programme) {
      setProgrammeError("Choose one, so your request reaches the right desk.");
      form.querySelector<HTMLInputElement>("input[name=programme]")?.focus();
      return;
    }

    const brief = composeBrief(fields);
    const link = whatsappLink(brief);
    setSentLink(link);
    setSentName(fields.name.trim().split(/\s+/)[0] ?? "");

    /* First, from the gesture itself. */
    window.open(link, "_blank", "noopener,noreferrer");

    if (!WEB3FORMS_KEY) {
      setStatus("sent");
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `KIYO quotation request: ${fields.name.trim()}${fields.company.trim() ? `, ${fields.company.trim()}` : ""}`,
          from_name: "KIYO website",
          replyto: fields.email.trim() || undefined,
          name: fields.name.trim(),
          company: fields.company.trim(),
          phone: fields.phone.trim(),
          email: fields.email.trim(),
          interested_in: PROGRAMME_LABEL[fields.programme],
          estimated_quantity: fields.quantity.trim(),
          custom_logo: fields.logo ? LOGO_LABEL[fields.logo] : "",
          message: fields.message.trim(),
          brief,
        }),
      });
      const result = (await response.json()) as { success?: boolean };
      setStatus(response.ok && result.success ? "sent" : "failed");
    } catch {
      setStatus("failed");
    }
  };

  const reset = () => {
    setFields(EMPTY);
    setStatus("idle");
    setProgrammeError("");
  };

  const emailed = Boolean(WEB3FORMS_KEY);

  return (
    <section id="quote" className="quote" aria-labelledby="quote-title">
      <div className="quote__where" data-reveal-group>
        <p className="eyebrow">Contact us</p>
        <h2 id="quote-title" className="quote__title">
          Let&apos;s Create Something Thoughtful<span className="quote__stop">.</span>
        </h2>
        <p className="quote__lede">Tell us what you need. We&apos;ll recommend the right set and prepare your quotation.</p>

        <div className="quote__map">
          <iframe
            title="Map showing KIYO Living in Kajang, Selangor"
            src={MAP_EMBED}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <a className="quote__maplink" href={MAP_LINK} target="_blank" rel="noreferrer">
            View on Google Maps <ArrowUpRight aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>

        <ul className="contactrows">
          <li>
            <span className="contactrows__icon"><MapPin aria-hidden="true" /></span>
            <address>No. 16, Jalan SC 1,<br />Pusat Perindustrian Sungai Chua,<br />43000 Kajang, Selangor.</address>
          </li>
          <li>
            <span className="contactrows__icon"><FaWhatsapp aria-hidden="true" /></span>
            <span><strong>WhatsApp</strong><a href={whatsappLink(enquiry("Hi KIYO. I have a question about your gift sets.", "contact details"))} target="_blank" rel="noreferrer">{WHATSAPP_NUMBER}<span className="sr-only"> (opens in a new tab)</span></a></span>
          </li>
          <li>
            <span className="contactrows__icon"><Mail aria-hidden="true" /></span>
            <span><strong>Email</strong><a href={`mailto:${EMAIL}`}>{EMAIL}</a></span>
          </li>
          <li>
            <span className="contactrows__icon"><Clock aria-hidden="true" /></span>
            <span><strong>Monday to Saturday</strong>9:00am to 6:00pm</span>
          </li>
        </ul>
      </div>

      <div className="quote__card" data-reveal="right">
        {status === "sent" || status === "failed" ? (
          <div className="quote__done" role="status">
            <img src="/images/kiyo-mark.svg" alt="" width="75" height="100" />
            <h3>Thanks{sentName ? `, ${sentName}` : ""}. Your request is with KIYO.</h3>
            {status === "failed" ? (
              <p>The email did not go through, but your brief is open in WhatsApp. Press send there and it reaches us the same way.</p>
            ) : emailed ? (
              <p>We have it by email and will reply within one working day. WhatsApp also opened with your brief written in: press send there and we can talk straight away.</p>
            ) : (
              <p>WhatsApp opened with your brief written in. Press send there and it reaches us straight away.</p>
            )}
            <a className="button button--coral" href={sentLink} target="_blank" rel="noreferrer">
              Open WhatsApp <FaWhatsapp aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <button type="button" className="quote__again" onClick={reset}>
              <RotateCcw aria-hidden="true" /> Send another request
            </button>
          </div>
        ) : (
          <form className="quoteform" onSubmit={onSubmit} noValidate={false} aria-label="Request a quotation">
            <p className="eyebrow">Tell us about your gift</p>

            <div className="quoteform__row">
              <label className="field" htmlFor="quote-name">
                <span>Name</span>
                <input id="quote-name" name="name" type="text" autoComplete="name" required value={fields.name} onChange={(e) => set("name")(e.target.value)} />
              </label>
              <label className="field" htmlFor="quote-company">
                <span>Company</span>
                <input id="quote-company" name="company" type="text" autoComplete="organization" value={fields.company} onChange={(e) => set("company")(e.target.value)} />
              </label>
            </div>

            <div className="quoteform__row">
              <label className="field" htmlFor="quote-phone">
                <span>HP / WhatsApp</span>
                <input id="quote-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required placeholder="012-345 6789" value={fields.phone} onChange={(e) => set("phone")(e.target.value)} />
              </label>
              <label className="field" htmlFor="quote-email">
                <span>Email</span>
                <input id="quote-email" name="email" type="email" autoComplete="email" placeholder="name@company.com" value={fields.email} onChange={(e) => set("email")(e.target.value)} />
              </label>
            </div>

            <label className="field" htmlFor="quote-quantity">
              <span>Estimated quantity</span>
              <input id="quote-quantity" name="quantity" type="number" min="1" inputMode="numeric" placeholder="e.g. 100" value={fields.quantity} onChange={(e) => set("quantity")(e.target.value)} />
            </label>

            <ChoiceGroup<Programme>
              legend="I'm interested in"
              name="programme"
              value={fields.programme}
              options={[{ id: "corporate", label: PROGRAMME_LABEL.corporate }, { id: "umrah", label: PROGRAMME_LABEL.umrah }]}
              onChange={(next) => { set("programme")(next); setProgrammeError(""); }}
              required
              error={programmeError}
            />

            <ChoiceGroup<Logo>
              legend="Custom logo?"
              name="logo"
              value={fields.logo}
              options={[{ id: "yes", label: "Yes" }, { id: "no", label: "No" }, { id: "unsure", label: "Not sure" }]}
              onChange={set("logo")}
            />

            <label className="field" htmlFor="quote-message">
              <span>Message <small>(optional)</small></span>
              <textarea id="quote-message" name="message" rows={3} placeholder="Anything else we should know" value={fields.message} onChange={(e) => set("message")(e.target.value)} />
            </label>

            {/* The honeypot. Off screen and out of the tab order rather than
                display:none, which some bots respect. */}
            <label className="quoteform__trap" aria-hidden="true">
              <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" />
              Leave this unticked
            </label>

            <button className="button button--coral quoteform__send" type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Sending..." : "Request a quote"} <ArrowRight aria-hidden="true" />
            </button>
            <p className="quoteform__fine">
              {emailed
                ? "We'll only use your details to respond to your enquiry. This also opens WhatsApp with your brief written in."
                : "We'll only use your details to respond to your enquiry. This opens WhatsApp with your brief written in; press send there."}
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
