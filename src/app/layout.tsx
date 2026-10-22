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
      className={`${displaySans.variable} ${textSans.variable} light antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('arthaya:theme');
                if (theme === 'dark') {
                  document.documentElement.classList.remove('light');
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.add('light');
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

