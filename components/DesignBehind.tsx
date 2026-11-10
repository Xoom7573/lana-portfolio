import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import Reveal from "./Reveal";
import Swatches from "./Swatches";

// Collage slots measured from slide 7, listed bottom layer first.
const slots = [
  "left-[14.5%] top-[55.5%] h-[44%] w-[45%] rotate-[-1.5deg]", // cherries
  "left-[55%] top-[29.5%] h-[57.5%] w-[44%] rotate-[1.5deg]", // sofa
  "left-[37%] top-0 h-[55%] w-[41%] rotate-[1deg]", // cocktails
  "left-0 top-[13.5%] h-[56%] w-[40%] rotate-[-2.5deg]", // mug
];
// Which moodboard photo (by number) goes in each slot.
const slotOrder = [3, 2, 1, 4];

function moodboardImages() {
  const dir = path.join(process.cwd(), "public", "moodboard");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".webp"))
    .sort();
}

function Moodboard() {
  const files = moodboardImages();
  const photos = files.filter((f) => f.startsWith("mood-"));

  if (photos.length >= slots.length) {
    return (
      <div className="relative mx-auto aspect-[420/398] w-full max-w-[560px]">
        {slots.map((slot, i) => (
          <div
            key={slot}
            className={`absolute overflow-hidden shadow-[0_25px_50px_-20px_rgb(0_0_0/0.75)] transition-transform duration-500 ease-editorial hover:z-10 hover:scale-[1.06] hover:rotate-0 ${slot}`}
          >
            <Image
              src={`/moodboard/mood-${slotOrder[i]}.webp`}
              alt=""
              fill
              sizes="(min-width: 1024px) 230px, 40vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    );
  }

  if (files.includes("collage.webp")) {
    return (
      <Image
        src="/moodboard/collage.webp"
        alt=""
        width={840}
        height={796}
        sizes="(min-width: 1024px) 560px, 90vw"
        className="mx-auto h-auto w-full max-w-[560px]"
      />
    );
  }
  return null;
}

export default function DesignBehind() {
  return (
    <section id="design" className="overflow-hidden px-5 py-24 md:px-12 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <h2 className="headline flex flex-col gap-x-[0.5em] text-[clamp(3rem,7vw,6.25rem)] text-blush sm:flex-row">
            <span>03</span>
            <span>The design behind this portfolio.</span>
          </h2>
        </Reveal>

        <div className="mt-16 grid items-center gap-20 md:mt-20 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-16 lg:pl-[7%]">
            <Reveal>
              <p className="eyebrow mb-6 text-white/60">Colour palette</p>
              <Swatches />
            </Reveal>

            <Reveal delay={120}>
              <p className="eyebrow mb-6 text-white/60">Typography</p>
              <dl className="space-y-5">
                <div className="flex items-center gap-10 border-b border-white/15 pb-5">
                  <dt className="headline w-24 text-6xl text-blush">AA</dt>
                  <dd>
                    <span className="headline block text-2xl text-blush md:text-3xl">League Spartan</span>
                    <span className="text-sm text-white/60">Headlines — bold, uppercase, confident</span>
                  </dd>
                </div>
                <div className="flex items-center gap-10">
                  <dt className="w-24 text-6xl font-normal">Aa</dt>
                  <dd>
                    <span className="block text-2xl md:text-3xl">Hero</span>
                    <span className="text-sm text-white/60">Body copy — light, open, friendly</span>
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>

          <Reveal delay={200}>
            <div className="mx-auto max-w-[560px]">
              <p className="eyebrow mb-8 text-white/60">Moodboard</p>
              <Moodboard />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
