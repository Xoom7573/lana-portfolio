// The site's starting content, loaded into an empty database by cms/seed/index.ts.
// After that, the CMS is the source of truth: edit content in /admin, not here.
// Wrap a phrase in **double asterisks** in the about text to make it bold (shown in pink).
import type { Locale } from "../../i18n/config";

export const person = {
  name: "Lana Libeert",
  email: "lana.libeert@gmail.com",
  phone: "+32486153839",
};

export const navTargets = ["about", "toolkit", "work", "contact"] as const;
export const colourHexes = ["#ffffff", "#ffd5e5", "#5d0e2a"] as const;

type Copy = {
  seo: { title: string; description: string; ogDescription: string; ogImageAlt: string };
  nav: { links: string[]; cta: string };
  marquee: string[];
  hero: { words: [string, string]; portraitAlt: string };
  about: {
    heading: [string, string];
    sticker: string;
    stickerCenter: string;
    greeting: string;
    paragraphs: string[];
  };
  toolkit: { heading: [string, string]; groups: { title: string; items: string[] }[] };
  work: { heading: string; eyebrow: string; portfolio: { label: string; kind: string; cover: [string, string] } };
  projects: {
    swapcloset: { discipline: string; description: string; coverAlt: string };
    likami: { discipline: string; description: string; coverAlt: string };
  };
  design: {
    heading: string;
    paletteLabel: string;
    colours: string[];
    typographyLabel: string;
    headlineFont: string;
    bodyFont: string;
    moodboardLabel: string;
  };
  contact: { eyebrow: string; heading: string };
};

export const copy: Record<Locale, Copy> = {
  en: {
    seo: {
      title: "Lana Libeert — Creative Portfolio",
      description:
        "Creative portfolio of Lana Libeert: editorial design, branding, content and a strong eye for fashion and detail.",
      ogDescription: "A creative mind, always evolving.",
      ogImageAlt: "The cover of Lana Libeert's creative portfolio",
    },
    nav: { links: ["About", "Toolkit", "Work", "Contact"], cta: "Let's talk" },
    marquee: ["Fashion", "Detail", "Creative process", "Graphic design", "Editorial", "Content", "Colour", "Collaboration"],
    hero: { words: ["CREATIVE", "PORTFOLIO"], portraitAlt: "Portrait of Lana Libeert" },
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
        { title: "Design &\nCreativity", items: ["Canva", "Adobe Photoshop", "Adobe InDesign"] },
        { title: "Content &\nVideo", items: ["CapCut", "InShot", "Later"] },
        { title: "Digital &\nMarketing", items: ["WordPress", "Klaviyo"] },
        { title: "Languages", items: ["Dutch", "English", "French", "German"] },
      ],
    },
    work: {
      heading: "Selected work.",
      eyebrow: "Creative projects",
      portfolio: { label: "Portfolio", kind: "Personal Branding", cover: ["Creative", "Portfolio"] },
    },
    projects: {
      swapcloset: {
        discipline: "Editorial Brochure Design",
        description: "A school project for a self-selected fictional brand.",
        coverAlt: "SwapCloset brochure cover",
      },
      likami: {
        discipline: "Sales Training Guide",
        description: "Skin philosophy & retail training guide.",
        coverAlt: "Líkami sales training cover",
      },
    },
    design: {
      heading: "The design behind this portfolio.",
      paletteLabel: "Colour palette",
      colours: ["White", "Blush", "Bordeaux"],
      typographyLabel: "Typography",
      headlineFont: "Headlines — bold, uppercase, confident",
      bodyFont: "Body copy — light, open, friendly",
      moodboardLabel: "Moodboard",
    },
    contact: { eyebrow: "Open to new opportunities", heading: "Contact me." },
  },

  nl: {
    seo: {
      title: "Lana Libeert — Creatief portfolio",
      description:
        "Het creatieve portfolio van Lana Libeert: editorial design, branding, content en een scherp oog voor mode en detail.",
      ogDescription: "Een creatieve geest, altijd in beweging.",
      ogImageAlt: "De cover van het creatieve portfolio van Lana Libeert",
    },
    nav: { links: ["Over mij", "Toolbox", "Werk", "Contact"], cta: "Even kennismaken?" },
    marquee: ["Mode", "Detail", "Creatief proces", "Grafisch ontwerp", "Editorial", "Content", "Kleur", "Samenwerking"],
    hero: { words: ["CREATIEF", "PORTFOLIO"], portraitAlt: "Portret van Lana Libeert" },
    about: {
      heading: ["Een creatieve geest,", "altijd in beweging."],
      sticker: "CREATIEF ✦ NIEUWSGIERIG ✦ OOG VOOR DETAIL ✦ MODE ✦ ",
      stickerCenter: "Hoi!",
      greeting: "Hoi, ik ben Lana!",
      paragraphs: [
        "Ik haal mijn inspiratie uit het onverwachte – en vooral uit **mode**, waar eindeloze combinaties van kleuren, vormen en stijlen samen iets helemaal unieks kunnen vormen.",
        "Ik heb een scherp oog voor **detail** en word blij als ideeën samenkomen in iets wat er echt mooi uitziet. Ik geniet van het **creatieve proces**, maar wat me het meest drijft, is iets maken waar ik oprecht trots op kan zijn.",
        "Ik wil blijven bijleren, me verder verdiepen in **grafisch ontwerp** en mezelf creatief uitdagen. Volgens mij ontstaan de beste ideeën vaak door samen te werken, perspectieven te delen en van elkaar te leren.",
        "Bovenal wil ik groeien in zelfvertrouwen, **mijn eigen creatieve stem** vinden en uitgroeien tot iemand die **echte meerwaarde** biedt voor een team.",
      ],
    },
    toolkit: {
      heading: ["Mijn creatieve", "toolbox."],
      groups: [
        { title: "Design &\nCreativiteit", items: ["Canva", "Adobe Photoshop", "Adobe InDesign"] },
        { title: "Content &\nVideo", items: ["CapCut", "InShot", "Later"] },
        { title: "Digitaal &\nMarketing", items: ["WordPress", "Klaviyo"] },
        { title: "Talen", items: ["Nederlands", "Engels", "Frans", "Duits"] },
      ],
    },
    work: {
      heading: "Uitgelicht werk.",
      eyebrow: "Creatieve projecten",
      portfolio: { label: "Portfolio", kind: "Personal branding", cover: ["Creatief", "Portfolio"] },
    },
    projects: {
      swapcloset: {
        discipline: "Editorial brochureontwerp",
        description: "Schoolproject voor een fictief merk naar keuze.",
        coverAlt: "Cover van de SwapCloset-brochure",
      },
      likami: {
        discipline: "Trainingsgids voor verkoop",
        description: "Huidfilosofie & trainingsgids voor de winkelvloer.",
        coverAlt: "Cover van de Líkami-verkooptraining",
      },
    },
    design: {
      heading: "Het ontwerp achter dit portfolio.",
      paletteLabel: "Kleurenpalet",
      colours: ["Wit", "Poederroze", "Bordeaux"],
      typographyLabel: "Typografie",
      headlineFont: "Headlines — vet, in hoofdletters, zelfverzekerd",
      bodyFont: "Body copy — licht, open, vriendelijk",
      moodboardLabel: "Moodboard",
    },
    contact: { eyebrow: "Klaar voor een nieuwe uitdaging", heading: "Contacteer me." },
  },
};
