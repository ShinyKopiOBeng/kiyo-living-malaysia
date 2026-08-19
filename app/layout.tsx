import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kiyo.com.my";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "KIYO Living | Luggage, Corporate Gifts & UMRAH Travel Sets",
  description:
    "KIYO Living creates practical luggage, branded corporate gifts, custom travel sets, and UMRAH solutions from Shah Alam, Malaysia.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "KIYO Living | Designed for every journey. Built for business.",
    description: "Luggage, corporate gifts, custom branding, and UMRAH travel sets by KIYO Malaysia.",
    url: "/",
    siteName: "KIYO Living",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "KIYO Living luggage collection" }],
    locale: "en_MY",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KIYO Living",
    description: "Designed for every journey. Built for business.",
    images: ["/og.png"],
  },
  icons: { icon: "/favicon.png", shortcut: "/favicon.png", apple: "/favicon.png" },
};

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "KIYO Living",
  url: siteUrl,
  email: "hello@kiyo.com.my",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Shah Alam",
    addressRegion: "Selangor",
    addressCountry: "MY",
  },
  sameAs: [
    "https://shopee.com.my/kiyoliving",
    "https://www.tiktok.com/@kiyoliving",
    "https://www.instagram.com/kiyoliving_",
    "https://www.facebook.com/kiyoliving",
    "https://www.youtube.com/@kiyoliving",
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-MY">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
