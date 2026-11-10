import Image from "next/image";
import HeroDepth from "./HeroDepth";
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

// Position and size shared by the headline and its outline copy, so they line up exactly.
const wordsClass =
  "depth [--depth:-10] headline absolute bottom-[7%] left-3 text-[clamp(4.1rem,16.5vw,15.5rem)] text-blush md:bottom-[9%] md:left-[6%] lg:left-[8%]";

// The two headline lines. Both copies use the same letter delays, so they rise in sync.
function HeroWords({ words, outline = false }: { words: string[]; outline?: boolean }) {
  return (
    <>
      <span aria-hidden className={`block pl-[0.35em] ${outline ? "text-outline hero-outline" : ""}`}>
        <Letters word={words[0]} base={150} />
      </span>
      <span aria-hidden className="block">
        <Letters word={words[1]} base={450} />
      </span>
    </>
  );
}

// Slide 1: "CREATIVE" sits behind the portrait, "PORTFOLIO" in front of it.
// From md up there are two copies of the headline: the solid one behind the photo, and
// one in front with "CREATIVE" as an outline and a solid "PORTFOLIO". The outline only
// fades in while the photo or the headline is hovered, revealing the hidden letters.
// On narrow screens the photo would hide all of "CREATIVE", so the solid headline
// simply sits in front.
export default function Hero({ t }: { t: Content["hero"] }) {
  return (
    <HeroDepth id="top" className="relative isolate h-svh min-h-155 overflow-hidden">
      <div
        aria-hidden
        className="depth [--depth:-28] absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_60%_at_68%_45%,var(--color-ground-glow)_0%,transparent_70%)]"
      />

      <div className="hero-stage relative mx-auto h-full max-w-[1400px] px-5 md:px-12">
        <Parallax
          speed={0.12}
          className="hero-hover absolute bottom-0 right-[-14%] z-10 h-[64%] w-auto sm:right-[2%] sm:h-[72%] md:h-[86%] lg:right-[10%]"
        >
          <div className="mask-reveal h-full" style={{ "--delay": "350ms" } as React.CSSProperties}>
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

        <h1 className={`${wordsClass} hero-hover z-20 md:z-0`}>
          <span className="sr-only">{t.title}</span>
          <HeroWords words={t.words} />
        </h1>
        <div aria-hidden className={`${wordsClass} pointer-events-none z-20 hidden md:block`}>
          <HeroWords words={t.words} outline />
        </div>

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
    </HeroDepth>
  );
}
