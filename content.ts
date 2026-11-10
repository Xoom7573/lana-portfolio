// Everything one language of the page shows: the content from the CMS (lib/payload.ts)
// combined with the interface labels in i18n/en.ts and i18n/nl.ts. Server-only.
import { defaultLocale, fill, type Locale } from "./i18n/config";
import en from "./i18n/en";
import nl from "./i18n/nl";
import { getHome, getProjects, getSite } from "./lib/payload";
import type { Media, Project } from "./payload-types";

const dictionaries = { en, nl };

type ImageSize = { src: string; width: number; height: number };
export type Picture = ImageSize & { alt: string };
export type Page = ImageSize & { full: ImageSize; label: string; alt: string };
// A run of text in the about paragraphs; bold runs are highlighted.
export type Segment = { text: string; bold: boolean } | { br: true };

const pad = (n: number) => String(n).padStart(2, "0");

// An upload field holds the image document, or just its id if it couldn't be loaded.
const isMedia = (value: unknown): value is Media =>
  typeof value === "object" && value !== null && typeof (value as Media).url === "string";
const mediaList = (values: unknown): Media[] => (Array.isArray(values) ? values.filter(isMedia) : []);

// One of the sizes made on upload, or the original if that size wasn't made (small images).
function size(media: Media, name?: keyof NonNullable<Media["sizes"]>): ImageSize {
  const s = name ? media.sizes?.[name] : undefined;
  if (s?.url && s.width && s.height) return { src: s.url, width: s.width, height: s.height };
  return { src: media.url!, width: media.width ?? 1, height: media.height ?? 1 };
}

const picture = (media: unknown, name?: "thumb" | "full" | "og"): Picture | null =>
  isMedia(media) ? { ...size(media, name), alt: media.alt ?? "" } : null;

const lines = (text: string | null | undefined) => (text ?? "").split(/\r?\n/).filter((line) => line.trim());

// The about text is rich text with only paragraphs and bold.
type LexicalNode = { type: string; text?: string; format?: number | string; children?: LexicalNode[] };
function paragraphs(body: { root?: { children?: LexicalNode[] } } | null | undefined): Segment[][] {
  const segments = (nodes: LexicalNode[] = []): Segment[] =>
    nodes.flatMap((node): Segment[] => {
      if (node.type === "text") return [{ text: node.text ?? "", bold: (Number(node.format) & 1) === 1 }];
      if (node.type === "linebreak") return [{ br: true }];
      return segments(node.children);
    });
  return (body?.root?.children ?? []).map((p) => segments(p.children)).filter((p) => p.length);
}

const sectionHref = { about: "#about", toolkit: "#toolkit", work: "#work", design: "#design", contact: "#contact" };

export async function getContent(locale: Locale, { draft = false } = {}) {
  const t = dictionaries[locale];
  const [site, home, projects] = await Promise.all([
    getSite(locale, draft),
    getHome(locale, draft),
    getProjects(locale, draft),
  ]);

  // A project without pages in this language shows the default language's pages.
  const fallbackPages = new Map<Project["id"], Media[]>();
  if (locale !== defaultLocale && projects.some((p) => !mediaList(p.pages).length)) {
    for (const p of await getProjects(defaultLocale, draft)) fallbackPages.set(p.id, mediaList(p.pages));
  }

  const projectList = projects.map((project, i) => {
    const media = mediaList(project.pages).length ? mediaList(project.pages) : (fallbackPages.get(project.id) ?? []);
    const pages: Page[] = media.map((m, n) => ({
      ...size(m, "thumb"),
      full: size(m, "full"),
      alt: m.alt ?? "",
      label: project.pageLabel === "fraction" ? `${pad(n + 1)} / ${media.length}` : fill(t.projects.pageLabel, { n: n + 1 }),
    }));
    const cover = picture(project.cover, "thumb") ?? (pages[0] ? { ...pages[0], alt: "" } : null);
    return {
      id: project.id,
      slug: project.slug,
      number: pad(i + 1),
      name: project.name,
      title: lines(project.heading),
      discipline: project.discipline,
      description: project.description,
      layout: project.layout,
      cover: cover && { src: cover.src, width: cover.width, height: cover.height, alt: project.coverAlt ?? "" },
      pages,
    };
  });

  // The portfolio card comes after the projects, and the design section shares its number.
  const portfolioNumber = pad(projectList.length + 1);
  const words = [home.hero?.words?.line1 ?? "", home.hero?.words?.line2 ?? ""] as [string, string];
  const portrait = picture(home.hero?.portrait);

  return {
    locale,
    person: { name: site.name ?? "", email: site.email ?? "", phone: site.phone ?? "" },
    meta: {
      title: site.seo?.title ?? "",
      description: site.seo?.description ?? "",
      ogDescription: site.seo?.ogDescription ?? "",
      ogLocale: t.meta.ogLocale,
      ogImage: picture(site.seo?.ogImage, "og"),
    },
    nav: {
      ...t.nav,
      links: (site.nav?.links ?? []).map((link) => ({ href: sectionHref[link.target], label: link.label })),
      cta: site.nav?.cta ?? "",
    },
    marquee: (site.marquee ?? []).map((m) => m.word),
    hero: {
      ...t.hero,
      words,
      // Screen readers get "Creative portfolio" rather than the all-caps letters.
      title: words.join(" ").toLowerCase().replace(/^\p{L}/u, (c) => c.toUpperCase()),
      portrait,
    },
    about: {
      heading: [home.about?.heading?.line1 ?? "", home.about?.heading?.line2 ?? ""] as [string, string],
      sticker: home.about?.sticker ?? "",
      stickerCenter: home.about?.stickerCenter ?? "",
      greeting: home.about?.greeting ?? "",
      paragraphs: paragraphs(home.about?.body as Parameters<typeof paragraphs>[0]),
    },
    toolkit: {
      heading: [home.toolkit?.heading?.line1 ?? "", home.toolkit?.heading?.line2 ?? ""] as [string, string],
      groups: (home.toolkit?.groups ?? []).map((group) => ({
        title: lines(group.title),
        items: (group.items ?? []).map((item) => item.label),
      })),
    },
    work: {
      heading: home.work?.heading ?? "",
      eyebrow: `01-${portfolioNumber} / ${home.work?.eyebrow ?? ""}`,
      portfolio: {
        number: portfolioNumber,
        label: home.work?.portfolio?.label ?? "",
        kind: home.work?.portfolio?.kind ?? "",
        cover: [home.work?.portfolio?.cover?.line1 ?? "", home.work?.portfolio?.cover?.line2 ?? ""] as [string, string],
        portrait,
      },
    },
    projects: projectList,
    projectLabels: t.projects,
    gallery: t.gallery,
    design: {
      ...t.design,
      number: portfolioNumber,
      heading: home.design?.heading ?? "",
      palette: home.design?.paletteLabel ?? "",
      colours: (home.design?.colours ?? []).map((c) => ({ hex: c.hex, name: c.name })),
      typography: home.design?.typographyLabel ?? "",
      headlineFont: home.design?.headlineFont ?? "",
      bodyFont: home.design?.bodyFont ?? "",
      moodboard: home.design?.moodboardLabel ?? "",
      photos: mediaList(home.design?.moodboard).map((m) => ({ ...size(m, "full"), alt: m.alt ?? "" })),
    },
    contact: {
      ...t.contact,
      eyebrow: home.contact?.eyebrow ?? "",
      heading: home.contact?.heading ?? "",
    },
    cursor: t.cursor,
    preview: t.preview,
  };
}

export type Content = Awaited<ReturnType<typeof getContent>>;
export type ProjectContent = Content["projects"][number];
export type Person = Content["person"];
