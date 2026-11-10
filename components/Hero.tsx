import Image from "next/image";
import Parallax from "./Parallax";
import { person, type Content } from "@/content";
import { fill } from "@/i18n/config";

function Letters({ word, base }: { word: string; base: number }) {
  return word.split("").map((char, i) => (
    <span
      key={i}
      className="letter"
      style={{ "--i": i, "--base": `${base}ms` } as React.CSSProperties}
    >
      {char}
    </span>
  ));
}

// Slide 1: "CREATIVE" sits behind the portrait, "PORTFOLIO" in front of it.
export default function Hero({ t }: { t: Content["hero"] }) {
  return (
    <section id="top" className="relative isolate h-svh min-h-155 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_60%_at_68%_45%,#7a1c40_0%,transparent_70%)]"
      />

      <div className="relative mx-auto h-full max-w-[1400px] px-5 md:px-12">
        <Parallax
          speed={0.12}
          className="absolute bottom-0 right-[-14%] z-10 h-[64%] w-auto sm:right-[2%] sm:h-[72%] md:h-[86%] lg:right-[10%]"
        >
          <div className="fade-in h-full" style={{ "--delay": "350ms" } as React.CSSProperties}>
            <Image
              src="/images/lana-cutout.webp"
              alt={fill(t.portraitAlt, { name: person.name })}
              width={910}
              height={1410}
              priority
              sizes="(min-width: 768px) 45vw, 90vw"
              className="h-full w-auto max-w-none object-contain object-bottom"
            />
          </div>
        </Parallax>

        <h1 className="headline absolute bottom-[7%] left-3 text-[clamp(4.1rem,16.5vw,15.5rem)] text-blush md:bottom-[9%] md:left-[6%] lg:left-[8%]">
          <span className="sr-only">{t.title}</span>
          {/* On narrow screens the photo would hide all of "CREATIVE", so it stays in front. */}
          <span aria-hidden className="relative z-20 block pl-[0.35em] md:z-0">
            <Letters word={t.words[0]} base={150} />
          </span>
          <span aria-hidden className="relative z-20 block">
            <Letters word={t.words[1]} base={450} />
          </span>
        </h1>

        <a
          href="#about"
          aria-label={t.scrollLabel}
          // The soft shadow keeps it readable where it overlaps the light photo.
          className="fade-in absolute bottom-6 left-1/2 z-30 hidden -translate-x-1/2 flex-col items-center gap-2 text-white drop-shadow-[0_1px_4px_rgb(0_0_0/0.55)] transition-colors hover:text-blush md:flex"
          style={{ "--delay": "1500ms" } as React.CSSProperties}
        >
          <span className="eyebrow text-[0.65rem]">{t.scroll}</span>
          <span className="block h-10 w-px origin-top animate-pulse bg-current" />
        </a>
      </div>
    </section>
  );
}
