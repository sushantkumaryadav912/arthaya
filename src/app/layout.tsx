import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arthaya — Multi-Agent Stock Intelligence",
  description:
    "Arthaya: a research-grade multi-agent AI stock analysis and predictive intelligence platform. Demo data — not investment advice.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
