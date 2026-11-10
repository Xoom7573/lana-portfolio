// Reads the raw source images in /images and /image-based-portfolio and turns them into
// the buffers the seed uploads. Payload then makes the web sizes (see cms/collections/Media.ts).
import fs from "node:fs";
import path from "node:path";
import sharp, { type Sharp } from "sharp";
import { locales, type Locale } from "../../i18n/config";

export type SourceImage = { name: string; data: Buffer; mimetype: string };

// The raw images are read at runtime from the project folder (copied into the Docker image
// by the Dockerfile), so the build doesn't bundle them.
const root = () => process.env.SEED_SOURCE_DIR ?? process.cwd();
const src = (...p: string[]) => path.join(/*turbopackIgnore: true*/ root(), ...p);
const pad = (n: number) => String(n).padStart(2, "0");

const png = async (name: string, image: Sharp): Promise<SourceImage> => ({
  name: `${name}.png`,
  data: await image.png().toBuffer(),
  mimetype: "image/png",
});

// Lana's cutout, trimmed to the subject so it can be positioned precisely.
export const portrait = () =>
  png("lana-portrait", sharp(src("images/foto_lana_transparent_bg.png")).extract({ left: 170, top: 190, width: 910, height: 1410 }));

// Social preview: the title slide without the Canva frame.
export const ogImage = async (): Promise<SourceImage> => ({
  name: "og-portfolio.jpg",
  data: await sharp(src("image-based-portfolio/slide_01.png"))
    .extract({ left: 10, top: 9, width: 1083, height: 607 })
    .resize(1200, 630, { fit: "cover" })
    .jpeg({ quality: 92 })
    .toBuffer(),
  mimetype: "image/jpeg",
});

// The moodboard photos (images/moodboard_<n>.png, by number), in the slot order the
// collage uses: cherries, sofa, cocktails, mug.
export async function moodboard(): Promise<SourceImage[]> {
  const files = fs
    .readdirSync(src("images"))
    .filter((f) => /^moo?r?dboard_\d+\.(jpe?g|png|webp)$/i.test(f))
    .sort((a, b) => Number(a.match(/\d+/)![0]) - Number(b.match(/\d+/)![0]));
  if (files.length < 4) throw new Error(`Expected 4 moodboard photos in images/, found ${files.length}`);
  const slotOrder = [3, 2, 1, 4];
  return Promise.all(slotOrder.map((n) => png(`moodboard-${n}`, sharp(src("images", files[n - 1])).rotate())));
}

// ---------------------------------------------------------------------------
// Project pages.
//
// High-res exports live in images/my_work/<project>/, named after the page they hold:
// "6.png" or "swapcloset_6.png". A two-page spread is named after both pages
// ("swapcloset_2_3.png") and cut in half, left page first. A project with a translated
// version keeps each language in its own subfolder (likami/en, likami/nl); a page
// missing in one language uses the other language's export.

type PageSource = { file: string; half: "left" | "right" | null };

export const projectSources = {
  swapcloset: { dirs: { all: "swapcloset" }, pages: 8 },
  likami: { dirs: { en: "likami/en", nl: "likami/nl" }, pages: 27 },
} as const;

type ProjectKey = keyof typeof projectSources;

function findHighRes(dir: string | undefined, pages: number): Map<number, PageSource> {
  const sources = new Map<number, PageSource>();
  if (!dir) return sources;
  const folder = src("images/my_work", dir);
  if (!fs.existsSync(folder)) return sources;

  const claim = (page: number, source: PageSource) => {
    if (page < 1 || page > pages || sources.has(page)) {
      console.warn(`  ! ${path.basename(source.file)}: page ${page} is out of range or already taken, skipped`);
      return;
    }
    sources.set(page, source);
  };

  for (const f of fs.readdirSync(folder).sort()) {
    const m = f.match(/(?:^|[_\s-])(\d+)(?:_(\d+))?\.(png|jpe?g|webp)$/i);
    if (!m) continue;
    const file = path.join(folder, f);
    if (m[2]) {
      claim(Number(m[1]), { file, half: "left" });
      claim(Number(m[2]), { file, half: "right" });
    } else {
      claim(Number(m[1]), { file, half: null });
    }
  }
  return sources;
}

async function pageImage({ file, half }: PageSource): Promise<Sharp> {
  const image = sharp(file);
  if (!half) return image;
  const { width = 0, height = 0 } = await image.metadata();
  if (width <= height * 1.2) throw new Error(`${path.basename(file)} is named as a two-page spread but isn't landscape`);
  const leftWidth = Math.floor(width / 2);
  return image.extract(
    half === "left" ? { left: 0, top: 0, width: leftWidth, height } : { left: leftWidth, top: 0, width: width - leftWidth, height },
  );
}

// The pages of one project, per language. A project without language folders returns
// only "en": the CMS then shows those pages in every language.
export async function projectPages(key: ProjectKey): Promise<Partial<Record<Locale, SourceImage[]>>> {
  const project = projectSources[key];
  const byLocale: Partial<Record<Locale | "all", Map<number, PageSource>>> = {};
  for (const [locale, dir] of Object.entries(project.dirs)) byLocale[locale as Locale | "all"] = findHighRes(dir, project.pages);

  // Files are named swapcloset-01.png, or likami-nl-01.png for a translated project.
  const render = async (folder: string, name: string, sourceFor: (n: number) => PageSource | undefined) => {
    const pages: SourceImage[] = [];
    for (let n = 1; n <= project.pages; n++) {
      const source = sourceFor(n);
      if (!source) throw new Error(`${key}: no image for page ${n} in images/my_work/${folder}`);
      pages.push(await png(`${name}-${pad(n)}`, await pageImage(source)));
    }
    return pages;
  };

  if ("all" in project.dirs) return { en: await render(project.dirs.all, key, (n) => byLocale.all!.get(n)) };

  const result: Partial<Record<Locale, SourceImage[]>> = {};
  for (const locale of locales) {
    result[locale] = await render(`${key}/${locale}`, `${key}-${locale}`, (n) => {
      const own = byLocale[locale]?.get(n);
      if (own) return own;
      const other = locales.map((l) => byLocale[l]?.get(n)).find(Boolean);
      if (other) console.warn(`  ! ${key} (${locale}) page ${n}: using the other language's image`);
      return other;
    });
  }
  return result;
}
