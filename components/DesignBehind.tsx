import Image from "next/image";
import Reveal from "./Reveal";
import Swatches from "./Swatches";
import type { Content } from "@/content";

// Collage slots measured from slide 7, listed bottom layer first. The CMS's moodboard
// photos fill them in order (its field description names each slot).
const slots = [
  "left-[14.5%] top-[55.5%] h-[44%] w-[45%] rotate-[-1.5deg]", // bottom left (cherries)
  "left-[55%] top-[29.5%] h-[57.5%] w-[44%] rotate-[1.5deg]", // right (sofa)
  "left-[37%] top-0 h-[55%] w-[41%] rotate-[1deg]", // top middle (cocktails)
  "left-0 top-[13.5%] h-[56%] w-[40%] rotate-[-2.5deg]", // left, on top (mug)
];

function Moodboard({ photos }: { photos: Content["design"]["photos"] }) {
  if (photos.length < slots.length) return null;
  return (
    <div className="relative mx-auto aspect-[420/398] w-full max-w-[560px]">
      {slots.map((slot, i) => (
        <div
          key={slot}
          className={`absolute overflow-hidden shadow-[0_25px_50px_-20px_rgb(0_0_0/0.75)] transition-transform duration-500 ease-editorial hover:z-10 hover:scale-[1.06] hover:rotate-0 ${slot}`}
        >
          <Image src={photos[i].src} alt={photos[i].alt} fill sizes="(min-width: 1024px) 230px, 40vw" className="object-cover" />
        </div>
      ))}
    </div>
  );
}

export default function DesignBehind({ t }: { t: Content["design"] }) {
  return (
    <section id="design" className="overflow-hidden px-5 py-24 md:px-12 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <h2 className="headline flex flex-col gap-x-[0.5em] text-[clamp(3rem,7vw,6.25rem)] text-blush sm:flex-row">
            <span>{t.number}</span>
            <span>{t.heading}</span>
          </h2>
        </Reveal>

        <div className="mt-16 grid items-center gap-20 md:mt-20 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-16 lg:pl-[7%]">
            <Reveal>
              <p className="eyebrow mb-6 text-white/60">{t.palette}</p>
              <Swatches colours={t.colours} copyLabel={t.copy} copiedLabel={t.copied} />
            </Reveal>

            <Reveal delay={120}>
              <p className="eyebrow mb-6 text-white/60">{t.typography}</p>
              <dl className="space-y-5">
                <div className="flex items-center gap-10 border-b border-white/15 pb-5">
                  <dt className="headline w-24 text-6xl text-blush">AA</dt>
                  <dd>
                    <span className="headline block text-2xl text-blush md:text-3xl">League Spartan</span>
                    <span className="text-sm text-white/60">{t.headlineFont}</span>
                  </dd>
                </div>
                <div className="flex items-center gap-10">
                  <dt className="w-24 text-6xl font-normal">Aa</dt>
                  <dd>
                    <span className="block text-2xl md:text-3xl">Hero</span>
                    <span className="text-sm text-white/60">{t.bodyFont}</span>
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>

          <Reveal delay={200}>
            <div className="mx-auto max-w-[560px]">
              <p className="eyebrow mb-8 text-white/60">{t.moodboard}</p>
              <Moodboard photos={t.photos} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
