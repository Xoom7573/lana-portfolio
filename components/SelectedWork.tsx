import Image from "next/image";
import type { ReactNode } from "react";
import Reveal from "./Reveal";
import type { Content } from "@/content";

// The "Portfolio" cover is a miniature of the hero, as on slide 4.
function PortfolioCover({ words }: { words: string[] }) {
  return (
    <div className="relative isolate aspect-[1/1.414] overflow-hidden bg-maroon-soft">
      <span aria-hidden className="headline absolute -left-[46%] top-[42%] z-0 text-[5.6rem] leading-[0.86] text-blush sm:text-[7rem] lg:text-[6.4rem]">
        {words[0]}
      </span>
      <Image
        src="/images/lana-cutout.webp"
        alt=""
        width={910}
        height={1410}
        sizes="(min-width: 1024px) 28vw, 80vw"
        className="absolute bottom-0 left-[12%] z-10 h-[92%] w-auto max-w-none transition-transform duration-700 ease-editorial group-hover:scale-[1.04]"
      />
      <span aria-hidden className="headline absolute -left-[52%] top-[64%] z-20 text-[5.6rem] leading-[0.86] text-blush sm:text-[7rem] lg:text-[6.4rem]">
        {words[1]}
      </span>
    </div>
  );
}

function CoverImage({ src, width, height, alt }: { src: string; width: number; height: number; alt: string }) {
  return (
    <div className="aspect-[1/1.414] overflow-hidden bg-white">
      <Image
        src={src}
        width={width}
        height={height}
        alt={alt}
        sizes="(min-width: 1024px) 28vw, 80vw"
        className="h-full w-full object-cover object-top transition-transform duration-700 ease-editorial group-hover:scale-[1.04]"
      />
    </div>
  );
}

function projectList(t: Content): { href: string; label: string; kind: string; cover: ReactNode }[] {
  return [
    {
      href: "#swapcloset",
      label: t.swapCloset.name,
      kind: t.swapCloset.discipline,
      cover: <CoverImage {...t.swapCloset.cover} alt={t.work.swapClosetCoverAlt} />,
    },
    {
      href: "#likami",
      label: t.likami.name,
      kind: t.likami.discipline,
      cover: <CoverImage {...t.likami.cover} alt={t.work.likamiCoverAlt} />,
    },
    {
      href: "#design",
      label: "Portfolio",
      kind: t.work.portfolioKind,
      cover: <PortfolioCover words={t.work.portfolioCover} />,
    },
  ];
}

export default function SelectedWork({ t }: { t: Content }) {
  const projects = projectList(t);
  return (
    <section id="work" className="px-5 py-28 md:px-12 md:py-40">
      <div className="mx-auto max-w-[1400px]">
        <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="headline text-[clamp(3.2rem,9vw,8.5rem)] text-blush">{t.work.heading}</h2>
          <p className="eyebrow text-white/85 md:pb-4">
            {t.work.eyebrow}
          </p>
        </Reveal>

        <ul className="mt-14 grid gap-14 sm:grid-cols-2 md:mt-20 lg:grid-cols-3 lg:gap-12">
          {projects.map((project, i) => (
            <Reveal as="li" key={project.label} delay={i * 140} className={i === 1 ? "lg:mt-16" : ""}>
              <a href={project.href} className="group block" data-cursor="view">
                <div className="relative border-[6px] border-white transition-[border-color,transform,box-shadow] duration-500 ease-editorial group-hover:-translate-y-2 group-hover:border-blush group-hover:shadow-[0_40px_70px_-30px_rgb(0_0_0/0.7)]">
                  {project.cover}
                  <span className="headline absolute -left-3 -top-5 z-30 bg-blush px-3 pb-1 pt-2 text-2xl text-maroon md:-left-4 md:-top-6 md:text-3xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="mt-6 flex items-baseline justify-between gap-4">
                  <div>
                    <h3 className="eyebrow text-base text-blush">{project.label}</h3>
                    <p className="mt-1 text-sm text-white/60">{project.kind}</p>
                  </div>
                  <span
                    aria-hidden
                    className="headline text-2xl text-blush transition-transform duration-500 ease-editorial group-hover:translate-x-1.5 group-hover:translate-y-1"
                  >
                    ↘
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
