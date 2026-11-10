// Fills the CMS with the site's starting content (cms/seed/content.ts) and images (cms/seed/images.ts).
//
// - Runs on its own when the server starts with an empty database (see onInit in payload.config.ts),
//   so a fresh setup or a first deploy needs no manual steps.
// - `bun run seed` does the same from the command line; `bun run seed force` throws the current
//   projects and images away and loads the defaults again (editor accounts are kept).
//
// Every step can be resumed: images are found again by file name and projects by link name, and
// the Site settings are written last, as the sign that seeding finished.
import type { Payload, RequestContext } from "payload";
import type { Locale } from "../../i18n/config";
import { colourHexes, copy, navTargets, person } from "./content";
import * as images from "./images";
import type { SourceImage } from "./images";

const context: RequestContext = { disableRevalidate: true };
type Ids = { portrait: number; og: number; moodboard: number[] };
type Rows = { id?: string | null }[] | null | undefined;

// The id of row i in an array the default language already saved, so the Dutch text lands
// on the same rows instead of replacing them.
const rowId = (rows: Rows, i: number) => rows?.[i]?.id ?? undefined;

// "a **b** c" -> a Lexical paragraph with "b" in bold.
function richText(paragraphs: string[]) {
  const node = { format: "" as const, indent: 0, version: 1, direction: "ltr" as const };
  return {
    root: {
      ...node,
      type: "root",
      children: paragraphs.map((p) => ({
        ...node,
        type: "paragraph",
        textFormat: 0,
        textStyle: "",
        children: p
          .split(/\*\*(.+?)\*\*/g)
          .map((text, i) => ({ type: "text", text, format: i % 2 ? 1 : 0, detail: 0, mode: "normal", style: "", version: 1 }))
          .filter((n) => n.text),
      })),
    },
  };
}

async function upload(payload: Payload, image: SourceImage, alt?: Record<Locale, string>): Promise<number> {
  // Uploads are converted to WebP, so "x.png" is stored as "x.webp".
  const filename = image.name.replace(/\.\w+$/, ".webp");
  const existing = await payload.find({ collection: "media", where: { filename: { equals: filename } }, limit: 1, depth: 0, context });
  if (existing.docs[0]) return existing.docs[0].id as number;

  const doc = await payload.create({
    collection: "media",
    locale: "en",
    data: { alt: alt?.en ?? "" },
    file: { data: image.data, mimetype: image.mimetype, name: image.name, size: image.data.length },
    context,
  });
  if (alt) await payload.update({ collection: "media", id: doc.id, locale: "nl", data: { alt: alt.nl }, context });
  return doc.id as number;
}

async function seedProjects(payload: Payload) {
  const projects = [
    { slug: "swapcloset", name: "SwapCloset", heading: "Swap\nCloset.", layout: "sticky", pageLabel: "page" },
    { slug: "likami", name: "Líkami", heading: "Líkami.", layout: "grid", pageLabel: "fraction" },
  ] as const;

  for (const project of projects) {
    payload.logger.info(`Seed: uploading the ${project.name} pages…`);
    const sources = await images.projectPages(project.slug);
    const pages: Partial<Record<Locale, number[]>> = {};
    for (const [locale, list] of Object.entries(sources)) {
      pages[locale as Locale] = [];
      for (const page of list) pages[locale as Locale]!.push(await upload(payload, page));
    }

    // Create the project, or finish one an interrupted seed left half done.
    const text = (locale: Locale) => ({ ...copy[locale].projects[project.slug], heading: project.heading });
    const en = { ...project, ...text("en"), pages: pages.en!, _status: "published" as const };
    const existing = await payload.find({ collection: "projects", where: { slug: { equals: project.slug } }, limit: 1, depth: 0, draft: true, context });
    const doc = existing.docs[0]
      ? await payload.update({ collection: "projects", id: existing.docs[0].id, locale: "en", draft: false, data: en, context })
      : await payload.create({ collection: "projects", locale: "en", draft: false, data: en, context });
    // Projects without Dutch pages show the English ones (see content.ts in the app).
    await payload.update({
      collection: "projects",
      id: doc.id,
      locale: "nl",
      draft: false,
      data: { ...text("nl"), ...(pages.nl ? { pages: pages.nl } : {}), _status: "published" },
      context,
    });
  }
}

type HomeDoc = Awaited<ReturnType<Payload["findGlobal"]>> & Record<string, any>;

function homeData(locale: Locale, ids: Ids, saved?: HomeDoc) {
  const c = copy[locale];
  const pair = ([line1, line2]: [string, string]) => ({ line1, line2 });
  return {
    hero: { words: pair(c.hero.words), portrait: ids.portrait },
    about: {
      heading: pair(c.about.heading),
      sticker: c.about.sticker,
      stickerCenter: c.about.stickerCenter,
      greeting: c.about.greeting,
      body: richText(c.about.paragraphs),
    },
    toolkit: {
      heading: pair(c.toolkit.heading),
      groups: c.toolkit.groups.map((group, i) => ({
        id: rowId(saved?.toolkit?.groups, i),
        title: group.title,
        items: group.items.map((label, j) => ({ id: rowId(saved?.toolkit?.groups?.[i]?.items, j), label })),
      })),
    },
    work: {
      heading: c.work.heading,
      eyebrow: c.work.eyebrow,
      portfolio: { label: c.work.portfolio.label, kind: c.work.portfolio.kind, cover: pair(c.work.portfolio.cover) },
    },
    design: {
      heading: c.design.heading,
      paletteLabel: c.design.paletteLabel,
      colours: colourHexes.map((hex, i) => ({ id: rowId(saved?.design?.colours, i), hex, name: c.design.colours[i] })),
      typographyLabel: c.design.typographyLabel,
      headlineFont: c.design.headlineFont,
      bodyFont: c.design.bodyFont,
      moodboardLabel: c.design.moodboardLabel,
      moodboard: ids.moodboard,
    },
    contact: c.contact,
    _status: "published" as const,
  };
}

function siteData(locale: Locale, ids: Ids, saved?: HomeDoc) {
  const c = copy[locale];
  return {
    ...person,
    nav: {
      links: navTargets.map((target, i) => ({ id: rowId(saved?.nav?.links, i), target, label: c.nav.links[i] })),
      cta: c.nav.cta,
    },
    marquee: c.marquee.map((word, i) => ({ id: rowId(saved?.marquee, i), word })),
    seo: { title: c.seo.title, description: c.seo.description, ogDescription: c.seo.ogDescription, ogImage: ids.og },
    _status: "published" as const,
  };
}

async function seedAdmin(payload: Payload) {
  const { SEED_ADMIN_EMAIL: email, SEED_ADMIN_PASSWORD: password } = process.env;
  if (!email || !password) return;
  const { totalDocs } = await payload.count({ collection: "users" });
  if (totalDocs) return;
  await payload.create({ collection: "users", data: { email, password }, context });
  payload.logger.info(`Seed: created the editor account ${email}`);
}

export async function seed(payload: Payload, { force = false } = {}) {
  const started = Date.now();
  await seedAdmin(payload);

  if (force) {
    payload.logger.info("Seed: removing the current projects and images…");
    await payload.delete({ collection: "projects", where: { id: { exists: true } }, context });
    await payload.delete({ collection: "media", where: { id: { exists: true } }, context });
  }

  payload.logger.info("Seed: uploading the portrait, link preview and moodboard…");
  const ids: Ids = {
    portrait: await upload(payload, await images.portrait(), { en: copy.en.hero.portraitAlt, nl: copy.nl.hero.portraitAlt }),
    og: await upload(payload, await images.ogImage(), { en: copy.en.seo.ogImageAlt, nl: copy.nl.seo.ogImageAlt }),
    moodboard: [],
  };
  for (const photo of await images.moodboard()) ids.moodboard.push(await upload(payload, photo));

  await seedProjects(payload);

  payload.logger.info("Seed: writing the page text…");
  const home = await payload.updateGlobal({ slug: "home", locale: "en", draft: false, data: homeData("en", ids), context });
  await payload.updateGlobal({ slug: "home", locale: "nl", draft: false, data: homeData("nl", ids, home), context });

  const site = await payload.updateGlobal({ slug: "site", locale: "en", draft: false, data: siteData("en", ids), context });
  await payload.updateGlobal({ slug: "site", locale: "nl", draft: false, data: siteData("nl", ids, site), context });

  payload.logger.info(`Seed: done in ${Math.round((Date.now() - started) / 1000)}s.`);
}

// Seeds only when the Site settings have never been filled in, so it never overwrites edits.
export async function seedIfEmpty(payload: Payload) {
  await seedAdmin(payload);
  const site = await payload.findGlobal({ slug: "site", draft: true, depth: 0, context });
  if ((site as { name?: string | null }).name) return;
  payload.logger.info("The database is empty: loading the site's default content. This takes a minute, once.");
  await seed(payload);
}
