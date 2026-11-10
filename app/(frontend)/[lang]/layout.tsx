import type { Metadata, Viewport } from "next";
import { League_Spartan, Urbanist } from "next/font/google";
import { draftMode } from "next/headers";
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

// /en and /nl are rendered on their first visit and then served from the cache until
// something is published in the CMS (see cms/hooks/revalidate.ts). Nothing is rendered at
// build time, so building doesn't need the database. Any other language is a 404.
export const generateStaticParams = () => [];

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { isEnabled: draft } = await draftMode();
  const { meta } = await getContent(lang, { draft });

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
      images: meta.ogImage
        ? [{ url: meta.ogImage.src, width: meta.ogImage.width, height: meta.ogImage.height, alt: meta.ogImage.alt }]
        : [],
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
