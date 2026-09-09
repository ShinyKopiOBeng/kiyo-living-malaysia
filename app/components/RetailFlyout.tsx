"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { FaTiktok } from "react-icons/fa6";
import { SiShopee } from "react-icons/si";
import { SHOPEE_URL, TIKTOK_URL } from "./SiteFooter";

/**
 * The retail slider.
 *
 * Retail is a side door on a B2B page: everything else drives towards a
 * WhatsApp enquiry, so the two shop links live behind one panel instead of
 * competing for space in the header. Two openers share it - the header link and
 * every "Buy retail" button in the chooser - which is why the open state is a
 * context rather than local state in one component.
 *
 * A mouse opens it on hover and a tap or click pins it. The distinction matters:
 * a hovered panel is transient and must never swallow the pointer, or leaving
 * the trigger would be impossible; a pinned one behaves like a sheet and is
 * dismissed by Escape or by clicking away.
 */

export type RetailMode = "hover" | "press";

type RetailControls = {
  open: boolean;
  mode: RetailMode | null;
  openRetail: (mode: RetailMode) => void;
  closeRetail: () => void;
  cancelClose: () => void;
  scheduleClose: () => void;
};

const RetailContext = createContext<RetailControls | null>(null);

export function useRetail() {
  const value = useContext(RetailContext);
  if (!value) throw new Error("useRetail must be used inside RetailProvider");
  return value;
}

export function RetailProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<RetailMode | null>(null);
  const timer = useRef<number | null>(null);

  const cancelClose = useCallback(() => {
    if (timer.current === null) return;
    window.clearTimeout(timer.current);
    timer.current = null;
  }, []);

  const openRetail = useCallback((next: RetailMode) => {
    cancelClose();
    setMode(next);
    setOpen(true);
  }, [cancelClose]);

  const closeRetail = useCallback(() => {
    cancelClose();
    setOpen(false);
    setMode(null);
  }, [cancelClose]);

  /* A grace period so the pointer can cross the gap from the trigger to the
     panel without it snapping shut underneath. A pinned panel ignores hover. */
  const scheduleClose = useCallback(() => {
    setMode((current) => {
      if (current === "press") return current;
      cancelClose();
      timer.current = window.setTimeout(() => { setOpen(false); setMode(null); }, 240);
      return current;
    });
  }, [cancelClose]);

  useEffect(() => cancelClose, [cancelClose]);

  return (
    <RetailContext.Provider value={{ open, mode, openRetail, closeRetail, cancelClose, scheduleClose }}>
      {children}
    </RetailContext.Provider>
  );
}

export function RetailFlyout() {
  const { open, mode, closeRetail, cancelClose, scheduleClose } = useRetail();
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") closeRetail(); };
    document.addEventListener("keydown", onKeyDown);

    /* A tapped panel behaves like a sheet, so hold the page still behind it.
       A hovered one is transient and must not disturb the scroll position. */
    const lockScroll = mode === "press" && window.matchMedia("(max-width: 1023px)").matches;
    const previousOverflow = document.body.style.overflow;
    if (lockScroll) document.body.style.overflow = "hidden";
    if (mode === "press") panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();

    /* A pinned panel is dismissed by clicking away from it. On wide screens
       there is no scrim to catch that click, so listen for it directly. */
    const onOutsidePointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (target?.closest(".retail-flyout") || target?.closest("[data-retail-trigger]")) return;
      closeRetail();
    };
    if (mode === "press") document.addEventListener("pointerdown", onOutsidePointerDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onOutsidePointerDown);
      if (lockScroll) document.body.style.overflow = previousOverflow;
    };
  }, [open, mode, closeRetail]);

  return (
    <>
      <div
        className={`retail-scrim${open ? " is-open" : ""}${mode === "press" ? " is-dismissible" : ""}`}
        onClick={closeRetail}
        aria-hidden="true"
      />
      <aside
        ref={panelRef}
        id="retail-flyout"
        className={`retail-flyout${open ? " is-open" : ""}`}
        data-retail-mode={mode ?? "closed"}
        aria-label="Shop KIYO"
        aria-hidden={!open}
        onPointerEnter={(event) => { if (event.pointerType === "mouse") cancelClose(); }}
        onPointerLeave={(event) => { if (event.pointerType === "mouse") scheduleClose(); }}
      >
        <button className="retail-flyout__close icon-button" type="button" onClick={closeRetail} aria-label="Close retail menu">
          <X aria-hidden="true" />
        </button>
        <p>Shop KIYO</p>
        <h2>Choose your shopping platform.</h2>
        <span>Browse current retail selections on KIYO&apos;s official stores.</span>
        <div className="retail-flyout__links">
          <a href={SHOPEE_URL} target="_blank" rel="noreferrer">
            <SiShopee aria-hidden="true" />
            <span><strong>Shopee</strong><small>KIYO Living official store</small></span>
            <ArrowUpRight aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a href={TIKTOK_URL} target="_blank" rel="noreferrer">
            <FaTiktok aria-hidden="true" />
            <span><strong>TikTok Shop</strong><small>Discover KIYO on TikTok</small></span>
            <ArrowUpRight aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </aside>
    </>
  );
}

/** The header opener: hover to peek, click to pin. */
export function RetailTrigger() {
  const { open, mode, openRetail, closeRetail, scheduleClose } = useRetail();

  return (
    <button
      type="button"
      data-retail-trigger
      className={`retail-trigger${open ? " is-open" : ""}`}
      aria-haspopup="dialog"
      aria-controls="retail-flyout"
      aria-expanded={open}
      onClick={() => (open && mode === "press" ? closeRetail() : openRetail("press"))}
      onPointerEnter={(event) => { if (event.pointerType === "mouse") openRetail("hover"); }}
      onPointerLeave={(event) => { if (event.pointerType === "mouse") scheduleClose(); }}
    >
      Retail stores <ArrowUpRight aria-hidden="true" />
    </button>
  );
}
