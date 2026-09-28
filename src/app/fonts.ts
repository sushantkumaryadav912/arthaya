import localFont from "next/font/local";

/**
 * Self-hosted type system — bundled so the app builds and renders fully offline.
 * Display (Inter Display, optical size for headlines/large numerics) carries the
 * personality; text (Inter) handles body/UI. Data/tickers/timestamps use the
 * mono stack defined in globals.css.
 */

export const displaySans = localFont({
  variable: "--font-display",
  display: "swap",
  src: [
    { path: "./fonts/InterDisplay-Light.ttf", weight: "300", style: "normal" },
    { path: "./fonts/InterDisplay-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/InterDisplay-SemiBold.ttf", weight: "600", style: "normal" },
  ],
});

export const textSans = localFont({
  variable: "--font-text",
  display: "swap",
  src: [
    { path: "./fonts/Inter-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Inter-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/Inter-SemiBold.ttf", weight: "600", style: "normal" },
  ],
});
