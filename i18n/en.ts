// English interface labels: buttons, screen-reader text and other words that belong to the
// site's controls rather than its content. The content itself is edited in the CMS (/admin).
// Every key here must also exist in nl.ts (TypeScript checks this).
// {placeholders} are filled in by the components.

const en = {
  meta: { ogLocale: "en_GB" },

  nav: {
    openMenu: "Open menu",
    closeMenu: "Close menu",
    language: "Language",
  },

  hero: {
    scrollLabel: "Scroll to about",
    scroll: "Scroll",
  },

  projects: {
    pageCount: "{n} pages · Click a page to enlarge",
    pageLabel: "Page {n}",
  },

  gallery: {
    open: "Open {title}, {page}",
    pageAlt: "{title} — {page}",
    dialog: "{title} pages",
    close: "Close ✕",
    previous: "Previous page",
    next: "Next page",
  },

  design: {
    copy: "Copy {name} {hex}",
    copied: "Copied ✓",
  },

  contact: { backToTop: "Back to top ↑" },

  cursor: { view: "View", mail: "Say hi" },

  preview: { label: "Draft preview", exit: "Exit" },
};

export default en;
export type Dictionary = typeof en;
