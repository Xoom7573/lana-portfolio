import Gallery from "./Gallery";
import Reveal from "./Reveal";
import { likami, swapCloset } from "@/content";

// Slide 5: sticky project intro on the left, brochure spreads on paper to the right.
export function SwapClosetProject() {
  return (
    <section id="swapcloset" className="px-5 py-24 md:px-12 md:py-36">
      <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,9fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <p className="headline text-[clamp(4rem,9vw,7.5rem)] text-blush">{swapCloset.number}</p>
            <h2 className="headline mt-6 text-[clamp(3.6rem,8vw,6.75rem)] text-blush">
              {swapCloset.title.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <p className="mt-8 text-xl font-bold md:text-2xl">{swapCloset.discipline}</p>
            <p className="mt-10 max-w-xs text-xl leading-snug text-white/90 md:text-2xl lg:mt-24">
              {swapCloset.description}
            </p>
            <p className="eyebrow mt-8 text-blush/80">
              {swapCloset.pages.length} pages · Click a page to enlarge
            </p>
          </Reveal>
        </div>

        <Reveal delay={150}>
          <div className="bg-paper p-4 shadow-[0_50px_90px_-40px_rgb(0_0_0/0.7)] sm:p-6 md:p-8">
            <Gallery
              pages={swapCloset.pages}
              title="SwapCloset"
              gridClassName="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4 md:gap-x-5 md:gap-y-7"
              sizes="(min-width: 1024px) 15vw, (min-width: 640px) 22vw, 45vw"
              maxViewWidth={600}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// Slide 6: the full Líkami training guide, all 27 pages.
export function LikamiProject() {
  return (
    <section id="likami" className="px-5 py-24 md:px-12 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="headline flex flex-wrap items-baseline gap-x-[0.45em] text-[clamp(3.6rem,8vw,6.75rem)] text-blush">
            <span>{likami.number}</span>
            <span>{likami.title}</span>
          </h2>
          <div className="lg:pb-3 lg:text-right">
            <p className="text-xl font-bold md:text-2xl">{likami.discipline}</p>
            <p className="mt-1 text-lg text-white/75">{likami.description}</p>
            <p className="eyebrow mt-4 text-blush/80">{likami.pages.length} pages · Click a page to enlarge</p>
          </div>
        </Reveal>

        <Reveal delay={150} className="mt-12 md:mt-16">
          <div className="bg-paper p-3 shadow-[0_50px_90px_-40px_rgb(0_0_0/0.7)] sm:p-5 md:p-6">
            <Gallery
              pages={likami.pages}
              title="Líkami"
              gridClassName="grid grid-cols-3 gap-x-2.5 gap-y-4 sm:grid-cols-5 md:grid-cols-7 md:gap-x-3 lg:grid-cols-9"
              sizes="(min-width: 1024px) 11vw, (min-width: 768px) 14vw, (min-width: 640px) 19vw, 31vw"
              maxViewWidth={460}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
