// All copy and image lists for the site live here so they're easy to edit.

export const person = {
  name: "Lana Libeert",
  email: "lana.libeert@gmail.com",
  phone: "+32486153839",
};

export const navLinks = [
  { href: "#about", label: "About" },
  { href: "#toolkit", label: "Toolkit" },
  { href: "#work", label: "Work" },
  { href: "#contact", label: "Contact" },
];

export const marqueeWords = [
  "Fashion",
  "Detail",
  "Creative process",
  "Graphic design",
  "Editorial",
  "Content",
  "Colour",
  "Collaboration",
];

// Wrap a phrase in **double asterisks** to highlight it in pink.
export const about = {
  greeting: "Hi, I'm Lana!",
  paragraphs: [
    "I'm someone who finds inspiration in the unexpected – especially in **fashion**, where endless combinations of colours, shapes and styles can create something completely unique.",
    "I have a strong eye for **detail** and love seeing ideas come together into something visually beautiful. I enjoy the **creative process**, but what motivates me most is creating something I can genuinely be proud of.",
    "I'm eager to keep learning, explore **graphic design** and challenge myself creatively. I believe the best ideas often grow through collaboration, sharing perspectives and learning from others.",
    "Above all, I'm looking forward to growing in confidence, developing **my own creative voice** and becoming someone who brings **real value** to a team.",
  ],
};

export const toolkit = [
  { title: ["Design &", "Creativity"], items: ["Canva", "Adobe Photoshop", "Adobe InDesign"] },
  { title: ["Content &", "Video"], items: ["CapCut", "InShot", "Later"] },
  { title: ["Digital &", "Marketing"], items: ["WordPress", "Klaviyo"] },
  { title: ["Languages"], items: ["Dutch", "English", "French", "German"] },
];

export type Page = { src: string; width: number; height: number; label: string };

export const swapCloset = {
  number: "01",
  title: ["Swap", "Closet."],
  discipline: "Editorial Brochure Design",
  description: "A school project for a self-selected fictional brand.",
  cover: { src: "/work/swapcloset/page-1.webp", width: 566, height: 796 },
  pages: Array.from({ length: 8 }, (_, i): Page => ({
    src: `/work/swapcloset/page-${i + 1}.webp`,
    width: 566,
    height: 796,
    label: `Pagina ${i + 1}`,
  })),
};

export const likami = {
  number: "02",
  title: "Líkami.",
  discipline: "Sales Training Guide",
  description: "Skin philosophy & retail training guide.",
  cover: { src: "/work/likami/cover.webp", width: 456, height: 604 },
  pages: Array.from({ length: 27 }, (_, i): Page => ({
    src: `/work/likami/page-${String(i + 1).padStart(2, "0")}.webp`,
    width: 400,
    height: 555,
    label: `${String(i + 1).padStart(2, "0")} / 27`,
  })),
};

export const palette = [
  { hex: "#ffffff", name: "White" },
  { hex: "#ffd5e5", name: "Blush" },
  { hex: "#5d0e2a", name: "Bordeaux" },
];
