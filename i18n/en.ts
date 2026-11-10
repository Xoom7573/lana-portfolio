// English copy. Every key here must also exist in nl.ts (TypeScript checks this).
// Wrap a phrase in **double asterisks** in the about text to highlight it in pink.
// {placeholders} are filled in by the components.

const en = {
  meta: {
    title: "Lana Libeert — Creative Portfolio",
    description:
      "Creative portfolio of Lana Libeert: editorial design, branding, content and a strong eye for fashion and detail.",
    ogDescription: "A creative mind, always evolving.",
    ogLocale: "en_GB",
  },

  nav: {
    links: [
      { href: "#about", label: "About" },
      { href: "#toolkit", label: "Toolkit" },
      { href: "#work", label: "Work" },
      { href: "#contact", label: "Contact" },
    ],
    cta: "Let's talk",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    language: "Language",
  },

  hero: {
    title: "Creative Portfolio",
    words: ["CREATIVE", "PORTFOLIO"],
    portraitAlt: "Portrait of {name}",
    scrollLabel: "Scroll to about",
    scroll: "Scroll",
  },

  marquee: [
    "Fashion",
    "Detail",
    "Creative process",
    "Graphic design",
    "Editorial",
    "Content",
    "Colour",
    "Collaboration",
  ],

  about: {
    heading: ["A creative mind,", "always evolving."],
    sticker: "CREATIVE ✦ CURIOUS ✦ DETAIL-DRIVEN ✦ FASHION ✦ ",
    stickerCenter: "Hi!",
    greeting: "Hi, I'm Lana!",
    paragraphs: [
      "I'm someone who finds inspiration in the unexpected – especially in **fashion**, where endless combinations of colours, shapes and styles can create something completely unique.",
      "I have a strong eye for **detail** and love seeing ideas come together into something visually beautiful. I enjoy the **creative process**, but what motivates me most is creating something I can genuinely be proud of.",
      "I'm eager to keep learning, explore **graphic design** and challenge myself creatively. I believe the best ideas often grow through collaboration, sharing perspectives and learning from others.",
      "Above all, I'm looking forward to growing in confidence, developing **my own creative voice** and becoming someone who brings **real value** to a team.",
    ],
  },

  toolkit: {
    heading: ["My creative", "toolkit."],
    groups: [
      {
        title: ["Design &", "Creativity"],
        items: ["Canva", "Adobe Photoshop", "Adobe InDesign"],
      },
      { title: ["Content &", "Video"], items: ["CapCut", "InShot", "Later"] },
      { title: ["Digital &", "Marketing"], items: ["WordPress", "Craft CMS", "Klaviyo"] },
      { title: ["Languages"], items: ["Dutch", "English", "French", "German"] },
    ],
  },

  work: {
    heading: "Selected work.",
    eyebrow: "01-03 / Creative projects",
    portfolioKind: "Personal Branding",
    portfolioCover: ["Creative", "Portfolio"],
    swapClosetCoverAlt: "SwapCloset brochure cover",
    likamiCoverAlt: "Líkami sales training cover",
  },

  projects: {
    pageCount: "{n} pages · Click a page to enlarge",
    swapCloset: {
      discipline: "Editorial Brochure Design",
      description: "A school project for a self-selected fictional brand.",
      pageLabel: "Page {n}",
    },
    likami: {
      discipline: "Sales Training Guide",
      description: "Skin philosophy & retail training guide.",
    },
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
    heading: "The design behind this portfolio.",
    palette: "Colour palette",
    typography: "Typography",
    headlineFont: "Headlines — bold, uppercase, confident",
    bodyFont: "Body copy — light, open, friendly",
    moodboard: "Moodboard",
    colours: { "#ffffff": "White", "#ffd5e5": "Blush", "#5d0e2a": "Bordeaux" },
    copy: "Copy {name} {hex}",
    copied: "Copied ✓",
  },

  contact: {
    eyebrow: "Open to new opportunities",
    heading: "Contact me.",
    backToTop: "Back to top ↑",
  },

  cursor: { view: "View", mail: "Say hi" },
};

export default en;
export type Dictionary = typeof en;
