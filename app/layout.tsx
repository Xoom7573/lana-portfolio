import type { Metadata, Viewport } from "next";
import { League_Spartan, Urbanist } from "next/font/google";
import "./globals.css";

const leagueSpartan = League_Spartan({
  variable: "--font-league-spartan",
  subsets: ["latin", "latin-ext"],
});

// Stand-in for Hero (the Canva body font), which isn't on Google Fonts.
const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  // Set NEXT_PUBLIC_SITE_URL to the live domain so social previews resolve.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Lana Libeert — Creative Portfolio",
  description:
    "Creative portfolio of Lana Libeert: editorial design, branding, content and a strong eye for fashion and detail.",
  openGraph: {
    title: "Lana Libeert — Creative Portfolio",
    description: "A creative mind, always evolving.",
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#5d0e2a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${leagueSpartan.variable} ${urbanist.variable}`}>
      <head>
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
