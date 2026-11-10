import type { Metadata, Viewport } from "next";
import { League_Spartan, Urbanist } from "next/font/google";
import { notFound } from "next/navigation";
import { getContent } from "@/content";
import { defaultLocale, isLocale, locales } from "@/i18n/config";
import "../globals.css";

const leagueSpartan = League_Spartan({
  variable: "--font-league-spartan",
  subsets: ["latin", "latin-ext"],
});

// Stand-in for Hero (the Canva body font), which isn't on Google Fonts.
const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin", "latin-ext"],
});

type Params = { params: Promise<{ lang: string }> };

// Prerender /en and /nl; any other language is a 404.
export const dynamicParams = false;
export const generateStaticParams = () => locales.map((lang) => ({ lang }));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { meta } = getContent(lang);

  return {
    // Set NEXT_PUBLIC_SITE_URL to the live domain so social previews resolve.
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `/${lang}`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}`])),
        "x-default": `/${defaultLocale}`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.ogDescription,
      locale: meta.ogLocale,
      images: [{ url: "/og.jpg", width: 1200, height: 630 }],
      type: "website",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#5d0e2a",
};

export default async function RootLayout({ children, params }: Readonly<Params & { children: React.ReactNode }>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html lang={lang} className={`${leagueSpartan.variable} ${urbanist.variable}`}>
      <head>
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
