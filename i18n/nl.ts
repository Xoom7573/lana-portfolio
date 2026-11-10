// Nederlandse labels voor de interface: knoppen, tekst voor schermlezers en andere woorden die bij
// de bediening van de site horen, niet bij de inhoud. De inhoud zelf pas je aan in het CMS (/admin).
// Elke sleutel uit en.ts moet hier ook staan (TypeScript controleert dit).
// {placeholders} worden ingevuld door de componenten.
import type { Dictionary } from "./en";

const nl: Dictionary = {
  meta: { ogLocale: "nl_BE" },

  nav: {
    openMenu: "Menu openen",
    closeMenu: "Menu sluiten",
    language: "Taal",
  },

  hero: {
    scrollLabel: "Scroll naar Over mij",
    scroll: "Scroll",
  },

  projects: {
    pageCount: "{n} pagina's · Klik om te vergroten",
    pageLabel: "Pagina {n}",
  },

  gallery: {
    open: "{title} openen, {page}",
    pageAlt: "{title} — {page}",
    dialog: "Pagina's van {title}",
    close: "Sluiten ✕",
    previous: "Vorige pagina",
    next: "Volgende pagina",
  },

  design: {
    copy: "Kopieer {name} ({hex})",
    copied: "Gekopieerd ✓",
  },

  contact: { backToTop: "Terug naar boven ↑" },

  cursor: { view: "Bekijk", mail: "Zeg hallo" },

  preview: { label: "Voorbeeld van je concept", exit: "Sluiten" },
};

export default nl;
