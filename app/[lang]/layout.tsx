import type { Metadata, Viewport } from "next";
import { League_Spartan, Urbanist } from "next/font/google";
import { notFound } from "next/navigation";
import { getContent, person, siteUrl } from "@/content";
import { isLocale, locales } from "@/i18n/config";
import { themeColors, themeStorageKey } from "@/theme";
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
  // public/og.jpg is made by scripts/prepare-images.mjs from the title slide.
  const image = { url: "/og.jpg", width: 1200, height: 630, type: "image/jpeg", alt: meta.ogImageAlt };

  return {
    metadataBase: siteUrl,
    title: meta.title,
    description: meta.description,
    applicationName: person.name,
    authors: [{ name: person.name, url: siteUrl }],
    creator: person.name,
    alternates: {
      canonical: `/${lang}`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}`])),
        // "/" sends visitors to their own language.
        "x-default": "/",
      },
    },
    openGraph: {
      type: "website",
      url: `/${lang}`,
      siteName: person.name,
      title: meta.title,
      description: meta.ogDescription,
      locale: meta.ogLocale,
      alternateLocale: locales.filter((l) => l !== lang).map((l) => getContent(l).meta.ogLocale),
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.ogDescription,
      images: [image],
    },
    // Stop iOS from turning numbers in the text into phone links.
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  // ThemeToggle overrides these when a visitor picks a theme themselves.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: themeColors.light },
    { media: "(prefers-color-scheme: dark)", color: themeColors.dark },
  ],
};

// Runs before the page paints, so a saved or system dark theme never flashes light first.
const themeScript = `(function(){try{var s=localStorage.getItem(${JSON.stringify(themeStorageKey)});var d=s?s==="dark":matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.dataset.theme=d?"dark":"light"}catch(e){}})()`;

export default async function RootLayout({ children, params }: Readonly<Params & { children: React.ReactNode }>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    // The theme script sets data-theme before React hydrates, so React shouldn't complain about it.
    <html lang={lang} className={`${leagueSpartan.variable} ${urbanist.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
