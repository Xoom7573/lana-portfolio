// Nederlandse teksten. Elke sleutel uit en.ts moet hier ook staan (TypeScript controleert dit).
// Zet een woordgroep tussen **dubbele sterretjes** in de over-mij-tekst om ze roze te markeren.
// {placeholders} worden ingevuld door de componenten.
import type { Dictionary } from "./en";

const nl: Dictionary = {
  meta: {
    title: "Lana Libeert — Creatief portfolio",
    description:
      "Het creatieve portfolio van Lana Libeert: editorial design, branding, content en een scherp oog voor mode en detail.",
    ogDescription: "Een creatieve geest, altijd in beweging.",
    ogLocale: "nl_BE",
  },

  nav: {
    links: [
      { href: "#about", label: "Over mij" },
      { href: "#toolkit", label: "Toolbox" },
      { href: "#work", label: "Werk" },
      { href: "#contact", label: "Contact" },
    ],
    cta: "Even kennismaken?",
    openMenu: "Menu openen",
    closeMenu: "Menu sluiten",
    language: "Taal",
  },

  hero: {
    title: "Creatief portfolio",
    words: ["CREATIEF", "PORTFOLIO"],
    portraitAlt: "Portret van {name}",
    scrollLabel: "Scroll naar Over mij",
    scroll: "Scroll",
  },

  marquee: [
    "Mode",
    "Detail",
    "Creatief proces",
    "Grafisch ontwerp",
    "Editorial",
    "Content",
    "Kleur",
    "Samenwerking",
  ],

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
      {
        title: ["Design &", "Creativiteit"],
        items: ["Canva", "Adobe Photoshop", "Adobe InDesign"],
      },
      { title: ["Content &", "Video"], items: ["CapCut", "InShot", "Later"] },
      { title: ["Digitaal &", "Marketing"], items: ["WordPress", "Klaviyo"] },
      { title: ["Talen"], items: ["Nederlands", "Engels", "Frans", "Duits"] },
    ],
  },

  work: {
    heading: "Uitgelicht werk.",
    eyebrow: "01-03 / Creatieve projecten",
    portfolioKind: "Personal branding",
    portfolioCover: ["Creatief", "Portfolio"],
    swapClosetCoverAlt: "Cover van de SwapCloset-brochure",
    likamiCoverAlt: "Cover van de Líkami-verkooptraining",
  },

  projects: {
    pageCount: "{n} pagina's · Klik om te vergroten",
    swapCloset: {
      discipline: "Editorial brochureontwerp",
      description: "Schoolproject voor een fictief merk naar keuze.",
      pageLabel: "Pagina {n}",
    },
    likami: {
      discipline: "Trainingsgids voor verkoop",
      description: "Huidfilosofie & trainingsgids voor de winkelvloer.",
    },
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
    heading: "Het ontwerp achter dit portfolio.",
    palette: "Kleurenpalet",
    typography: "Typografie",
    headlineFont: "Headlines — vet, in hoofdletters, zelfverzekerd",
    bodyFont: "Body copy — licht, open, vriendelijk",
    moodboard: "Moodboard",
    colours: {
      "#ffffff": "Wit",
      "#ffd5e5": "Poederroze",
      "#5d0e2a": "Bordeaux",
    },
    copy: "Kopieer {name} ({hex})",
    copied: "Gekopieerd ✓",
  },

  contact: {
    eyebrow: "Klaar voor een nieuwe uitdaging",
    heading: "Contacteer me.",
    backToTop: "Terug naar boven ↑",
  },

  cursor: { view: "Bekijk", mail: "Zeg hallo" },
};

export default nl;
