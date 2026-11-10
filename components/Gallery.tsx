"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Page } from "@/content";

type Props = {
  pages: Page[];
  title: string;
  gridClassName: string;
  sizes: string;
  /** Upper bound for the enlarged page, so low-res exports aren't blown up. */
  maxViewWidth: number;
};

// A grid of brochure pages that opens into a keyboard/swipe lightbox.
export default function Gallery({ pages, title, gridClassName, sizes, maxViewWidth }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);

  const open = (i: number) => {
    setIndex(i);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();
  const step = useCallback(
    (dir: number) => setIndex((i) => (i === null ? i : (i + dir + pages.length) % pages.length)),
    [pages.length],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, step]);

  const page = index === null ? null : pages[index];

  return (
    <>
      <ul className={gridClassName}>
        {pages.map((p, i) => (
          <li key={p.src}>
            <button
              type="button"
              onClick={() => open(i)}
              className="group block w-full text-left"
              aria-label={`Open ${title}, ${p.label}`}
            >
              <span className="block overflow-hidden bg-white shadow-[0_1px_2px_rgb(93_14_42/0.08)] transition-[transform,box-shadow] duration-500 ease-editorial group-hover:-translate-y-1.5 group-hover:shadow-[0_18px_40px_-12px_rgb(93_14_42/0.45)]">
                <Image
                  src={p.src}
                  width={p.width}
                  height={p.height}
                  alt={`${title} — ${p.label}`}
                  sizes={sizes}
                  className="h-auto w-full transition-transform duration-700 ease-editorial group-hover:scale-[1.03]"
                />
              </span>
              <span className="mt-2 block text-[0.72rem] tracking-wide text-maroon/70 transition-colors group-hover:text-maroon">
                {p.label}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        onClose={() => setIndex(null)}
        onClick={(e) => e.target === e.currentTarget && close()}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
        aria-label={`${title} pages`}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 text-white backdrop:bg-transparent"
      >
        {page && (
          <div className="pointer-events-none flex h-full flex-col items-center justify-center gap-5 px-4 py-16">
            <div className="pointer-events-auto relative" style={{ width: `min(${maxViewWidth}px, 88vw, calc((100dvh - 10rem) * ${page.width / page.height}))` }}>
              <Image
                key={page.src}
                src={page.src}
                width={page.width}
                height={page.height}
                alt={`${title} — ${page.label}`}
                sizes={`${maxViewWidth}px`}
                className="fade-in h-auto w-full bg-white shadow-2xl"
                style={{ "--delay": "0ms" } as React.CSSProperties}
              />
            </div>
            <p className="eyebrow pointer-events-auto text-blush">
              {title} · {String(index! + 1).padStart(2, "0")} / {String(pages.length).padStart(2, "0")}
            </p>

            <button
              type="button"
              onClick={close}
              autoFocus
              className="eyebrow pointer-events-auto absolute right-5 top-5 rounded-full border border-blush/50 px-4 py-2 text-blush transition-colors hover:bg-blush hover:text-maroon"
            >
              Close ✕
            </button>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous page"
              className="headline pointer-events-auto absolute left-3 top-1/2 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-blush text-2xl text-maroon transition-transform hover:scale-110 sm:flex md:left-8"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next page"
              className="headline pointer-events-auto absolute right-3 top-1/2 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-blush text-2xl text-maroon transition-transform hover:scale-110 sm:flex md:right-8"
            >
              →
            </button>
          </div>
        )}
      </dialog>
    </>
  );
}
