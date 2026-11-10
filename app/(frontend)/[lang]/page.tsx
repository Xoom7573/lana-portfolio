import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import About from "@/components/About";
import Contact from "@/components/Contact";
import CursorLabel from "@/components/CursorLabel";
import DesignBehind from "@/components/DesignBehind";
import Hero from "@/components/Hero";
import LivePreview from "@/components/LivePreview";
import Marquee from "@/components/Marquee";
import Nav from "@/components/Nav";
import ProjectSection from "@/components/Projects";
import SelectedWork from "@/components/SelectedWork";
import Toolkit from "@/components/Toolkit";
import { getContent } from "@/content";
import { isLocale } from "@/i18n/config";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { isEnabled: draft } = await draftMode();
  const t = await getContent(lang, { draft });

  return (
    <>
      <Nav t={t.nav} locale={lang} person={t.person} />
      <main className="overflow-x-clip">
        <Hero t={t.hero} />
        <Marquee words={t.marquee} />
        <About t={t.about} />
        <Toolkit t={t.toolkit} />
        <SelectedWork t={t} />
        {t.projects.map((project) => (
          <ProjectSection key={project.id} project={project} t={t} />
        ))}
        <DesignBehind t={t.design} />
        <Contact t={t.contact} person={t.person} />
      </main>
      <CursorLabel labels={t.cursor} />
      {draft && <LivePreview locale={lang} labels={t.preview} />}
    </>
  );
}
