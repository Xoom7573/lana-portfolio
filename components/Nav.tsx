"use client";

import { useEffect, useState } from "react";
import { navLinks, person } from "@/content";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,padding] duration-500 ${
        scrolled && !open ? "bg-maroon/80 py-3 backdrop-blur-md" : "py-5 md:py-7"
      }`}
    >
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-5 md:px-12">
        <a
          href="#top"
          className={`headline relative z-50 text-lg tracking-tight transition-colors md:text-xl ${
            open ? "text-maroon" : "text-blush"
          }`}
        >
          {person.name}
          <span className="text-white">.</span>
        </a>

        <ul className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="eyebrow group relative py-2 text-white/85 transition-colors hover:text-blush">
                {link.label}
                <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-blush transition-transform duration-500 ease-editorial group-hover:scale-x-100" />
              </a>
            </li>
          ))}
          <li>
            <a
              href={`mailto:${person.email}`}
              className="eyebrow rounded-full border border-blush/60 px-5 py-2.5 text-blush transition-colors hover:bg-blush hover:text-maroon"
            >
              Let&apos;s talk
            </a>
          </li>
        </ul>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={`h-0.5 w-7 transition-all duration-300 ${open ? "translate-y-1 rotate-45 bg-maroon" : "bg-blush"}`}
          />
          <span
            className={`h-0.5 w-7 transition-all duration-300 ${open ? "-translate-y-1 -rotate-45 bg-maroon" : "bg-blush"}`}
          />
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 flex flex-col justify-between bg-blush px-5 pb-10 pt-28 transition-[clip-path] duration-700 ease-editorial md:hidden ${
          open ? "[clip-path:circle(150%_at_100%_0)]" : "pointer-events-none [clip-path:circle(0%_at_100%_0)]"
        }`}
        inert={!open}
      >
        <ul className="space-y-2">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={() => setOpen(false)} className="headline block text-6xl text-maroon">
                {link.label}.
              </a>
            </li>
          ))}
        </ul>
        <div className="space-y-1 text-maroon">
          <a href={`mailto:${person.email}`} className="eyebrow block">
            {person.email}
          </a>
          <a href={`tel:${person.phone}`} className="eyebrow block">
            {person.phone}
          </a>
        </div>
      </div>
    </header>
  );
}
