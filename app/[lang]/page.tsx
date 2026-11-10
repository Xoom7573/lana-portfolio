import { notFound } from "next/navigation";
import About from "@/components/About";
import Contact from "@/components/Contact";
import CursorLabel from "@/components/CursorLabel";
import DesignBehind from "@/components/DesignBehind";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Nav from "@/components/Nav";
import { LikamiProject, SwapClosetProject } from "@/components/Projects";
import SelectedWork from "@/components/SelectedWork";
import Toolkit from "@/components/Toolkit";
import { getContent, person, siteUrl } from "@/content";
import { isLocale } from "@/i18n/config";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getContent(lang);
  const pageUrl = new URL(`/${lang}`, siteUrl).href;

  // Structured data so search engines know who the site is about.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteUrl.origin}/#person`,
        name: person.name,
        url: pageUrl,
        image: new URL("/images/lana.webp", siteUrl).href,
        email: `mailto:${person.email}`,
        telephone: person.phone,
        description: t.meta.description,
        knowsAbout: t.marquee,
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl.origin}/#website`,
        url: siteUrl.origin,
        name: person.name,
        inLanguage: lang,
        author: { "@id": `${siteUrl.origin}/#person` },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Escape "<" so the text can't close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Nav t={t.nav} locale={lang} />
      <main className="overflow-x-clip">
        <Hero t={t.hero} />
        <Marquee words={t.marquee} />
        <About t={t.about} />
        <Toolkit t={t.toolkit} />
        <SelectedWork t={t} />
        <SwapClosetProject t={t} />
        <LikamiProject t={t} />
        <DesignBehind t={t.design} />
        <Contact t={t.contact} />
      </main>
      <CursorLabel labels={t.cursor} />
    </>
  );
}
