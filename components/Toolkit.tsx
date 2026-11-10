import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import type { Content } from "@/content";

export default function Toolkit({ t }: { t: Content["toolkit"] }) {
  return (
    <section id="toolkit" className="px-5 py-28 md:px-12 md:py-40">
      <div className="mx-auto max-w-[1400px]">
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {t.groups.map((group, i) => (
            <Reveal as="li" key={group.title.join(" ")} delay={i * 110}>
              <article
                className={`group relative flex aspect-[4/5] flex-col items-center justify-center px-6 text-center text-maroon transition-[transform,box-shadow] duration-500 ease-editorial hover:-translate-y-2 hover:shadow-[0_30px_60px_-25px_rgb(0_0_0/0.6)] sm:aspect-[4/5] ${
                  i % 2 ? "bg-rose hover:rotate-[1.2deg]" : "bg-blush hover:-rotate-[1.2deg]"
                }`}
              >
                <span className="eyebrow absolute left-5 top-5 text-[0.7rem] text-maroon/60">
                  {String(i + 1).padStart(2, "0")} / {String(t.groups.length).padStart(2, "0")}
                </span>
                <h3 className="headline text-[1.75rem] leading-[0.92] md:text-[2rem]">
                  {group.title.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </h3>
                <span className="my-6 block h-px w-10 bg-maroon/40 transition-all duration-500 group-hover:w-20" />
                <ul className="space-y-1 text-lg">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-16 md:mt-20">
          <SectionHeading lines={[t.heading[0], t.heading[1]]} className="text-[clamp(3.2rem,9vw,8.5rem)]" />
        </Reveal>
      </div>
    </section>
  );
}
