import Reveal from "./Reveal";
import { person, type Content } from "@/content";

export default function Contact({ t }: { t: Content["contact"] }) {
  const phoneDisplay = person.phone.replace(/^(\+\d{2})(\d{3})(\d{2})(\d{2})(\d{2})$/, "$1 $2 $3 $4 $5");

  return (
    <section id="contact" className="relative flex min-h-svh flex-col px-5 pt-32 md:px-12">
      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <Reveal>
            <p className="eyebrow mb-8 text-white/60">{t.eyebrow}</p>
          </Reveal>
          <Reveal delay={100}>
            <a href={`mailto:${person.email}`} className="group relative inline-block" data-cursor="mail">
              <h2 className="headline text-[clamp(3.6rem,13.5vw,13rem)] text-blush transition-colors duration-500 group-hover:text-white">
                {t.heading}
              </h2>
              <span className="absolute -bottom-2 left-0 h-[0.35rem] w-full origin-left scale-x-0 bg-blush transition-transform duration-700 ease-editorial group-hover:scale-x-100 md:h-2" />
            </a>
          </Reveal>
        </div>

        <Reveal className="flex flex-col items-center justify-between gap-4 pb-12 pt-16 sm:flex-row md:pb-16">
          <a
            href={`mailto:${person.email}`}
            className="eyebrow text-base text-white transition-colors hover:text-blush md:text-lg"
          >
            {person.email}
          </a>
          <a href={`tel:${person.phone}`} className="eyebrow text-base text-white transition-colors hover:text-blush md:text-lg">
            {phoneDisplay}
          </a>
        </Reveal>
      </div>

      <footer className="mx-auto flex w-full max-w-[1400px] items-center justify-between border-t border-white/15 py-6 text-sm text-white/50">
        <span>© {new Date().getFullYear()} {person.name}</span>
        <a href="#top" className="eyebrow text-[0.7rem] transition-colors hover:text-blush">
          {t.backToTop}
        </a>
      </footer>
    </section>
  );
}
