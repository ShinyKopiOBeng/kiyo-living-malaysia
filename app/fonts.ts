import { Montserrat, Work_Sans } from "next/font/google";

/* The brand guide names Work Sans for display and "Gontserrat" for body copy.
   Gontserrat is a Montserrat derivative that is not on Google Fonts, so
   Montserrat carries the body until KIYO supplies the files. Keep the families
   and weights in step with tools/build-fonts.mjs. */
export const headingFont = Work_Sans({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-heading",
  display: "swap",
});

export const bodyFont = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});
