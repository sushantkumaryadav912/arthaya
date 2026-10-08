import type { Metadata } from "next";
import { displaySans, textSans } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arthaya: Multi-Agent Stock Intelligence",
  description:
    "Arthaya: a research-grade multi-agent AI stock analysis and predictive intelligence platform. Demo data — not investment advice.",
  icons: {
    icon: [{ url: "/arthaya_logo.png", type: "image/png" }],
    shortcut: "/arthaya_logo.png",
    apple: "/arthaya_logo.png",
  },  
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${displaySans.variable} ${textSans.variable} antialiased`}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}

