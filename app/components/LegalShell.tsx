/* Chrome shared by the standalone legal document pages. */
/* eslint-disable @next/next/no-img-element */

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteFooter } from "./SiteFooter";

export const LEGAL_UPDATED = "26 August 2026";

export function LegalShell({ eyebrow, title, lede, children }: { eyebrow: string; title: string; lede: string; children: ReactNode }) {
  return (
    <div className="legal-shell">
      <header className="legal-header">
        <Link className="brand" href="/" aria-label="KIYO home">
          <img src="/images/kiyo-logo.png" alt="KIYO" width="653" height="258" />
        </Link>
        <Link className="legal-header__back" href="/">
          <ArrowLeft aria-hidden="true" /> Back to site
        </Link>
      </header>

      <main className="legal-page">
        <p className="legal-page__eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="legal-page__updated">Last updated {LEGAL_UPDATED}</p>
        <p className="legal-page__lede">{lede}</p>
        {children}
        <p className="legal-page__note">
          Questions about this document? Write to <a href="mailto:kiyoliving88@gmail.com">kiyoliving88@gmail.com</a> and we will
          come back to you.
        </p>
      </main>

      <SiteFooter standalone />
    </div>
  );
}
