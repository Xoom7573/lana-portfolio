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
import { getContent } from "@/content";
import { isLocale } from "@/i18n/config";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getContent(lang);

  return (
    <>
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
