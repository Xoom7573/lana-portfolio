import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import type { Content } from "@/content";

function Highlighted({ text }: { text: string }) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 ? (
      <strong key={i} className="font-bold text-blush">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

function Sticker({ ring, center }: { ring: string; center: string }) {
  return (
    <span aria-hidden className="relative block h-32 w-32 md:h-40 md:w-40">
      <svg viewBox="0 0 200 200" className="spin-slow absolute inset-0 h-full w-full">
        <defs>
          <path id="sticker-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <circle cx="100" cy="100" r="98" className="fill-blush" />
        <text className="fill-maroon font-[family-name:var(--font-display)] text-[16px] font-bold">
          {/* 2π × 78 ≈ 490: stretch the text to exactly one full turn. */}
          <textPath href="#sticker-circle" textLength="488" lengthAdjust="spacing">
            {ring}
          </textPath>
        </text>
      </svg>
      <span className="headline absolute inset-0 flex items-center justify-center text-3xl text-maroon md:text-4xl">
        {center}
      </span>
    </span>
  );
}

export default function About({ t }: { t: Content["about"] }) {
  return (
    <section id="about" className="relative px-5 py-32 md:px-12 md:py-44">
      <div className="mx-auto max-w-[1400px]">
        <div className="mx-auto max-w-6xl text-center">
          <Reveal>
            <SectionHeading
              lines={[
                // On large screens the sticker is pinned to the end of the first line, so it
                // only catches the corner of the last word, whatever the language or width.
                // Smaller screens show it centred above the heading.
                <span key="first" className="relative block lg:inline-block">
                  <Reveal
                    as="span"
                    delay={300}
                    className="mb-10 flex justify-center lg:absolute lg:right-0 lg:top-0 lg:mb-0 lg:translate-x-[50%] xl:translate-x-[65%] lg:-translate-y-[62%] lg:rotate-12"
                  >
                    <Sticker ring={t.sticker} center={t.stickerCenter} />
                  </Reveal>
                  {t.heading[0]}
                </span>,
                t.heading[1],
              ]}
              className="text-[clamp(2.4rem,7.2vw,6.25rem)]"
            />
          </Reveal>
        </div>

        <div className="mx-auto mt-16 max-w-3xl space-y-7 text-center text-lg leading-relaxed text-white/90 md:mt-20 md:text-xl md:leading-relaxed">
          <Reveal>
            <p className="headline text-2xl text-blush md:text-3xl">{t.greeting}</p>
          </Reveal>
          {t.paragraphs.map((p, i) => (
            <Reveal key={i} delay={i * 60}>
              <p>
                <Highlighted text={p} />
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
