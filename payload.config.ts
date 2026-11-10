import path from "node:path";
import { fileURLToPath } from "node:url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { en } from "@payloadcms/translations/languages/en";
import { nl } from "@payloadcms/translations/languages/nl";
import { buildConfig } from "payload";
import sharp from "sharp";
import { Media } from "./cms/collections/Media";
import { Projects } from "./cms/collections/Projects";
import { Users } from "./cms/collections/Users";
import { Home } from "./cms/globals/Home";
import { Site } from "./cms/globals/Site";
import { seedIfEmpty } from "./cms/seed";
import { defaultLocale, locales } from "./i18n/config";
import { migrations } from "./migrations";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Required on the live server; `next build` runs without it.
const building = process.env.NEXT_PHASE === "phase-production-build";
if (!process.env.PAYLOAD_SECRET && process.env.NODE_ENV === "production" && !building) {
  throw new Error("PAYLOAD_SECRET is not set. See .env.example.");
}

const localeLabels = { en: "English", nl: "Nederlands" } as const;

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: dirname },
    meta: { titleSuffix: " — Lana Libeert", icons: [{ rel: "icon", type: "image/svg+xml", url: "/icon.svg" }] },
    components: {
      graphics: {
        Logo: "/components/admin/Logo#Logo",
        Icon: "/components/admin/Logo#Icon",
      },
    },
    livePreview: {
      // The preview route checks the editor is logged in, turns on draft mode and opens the page,
      // scrolled to the project being edited.
      url: ({ locale, data, collectionConfig }) => {
        const anchor = collectionConfig?.slug === Projects.slug && data?.slug ? `#${data.slug}` : "";
        return `/next/preview?path=${encodeURIComponent(`/${locale?.code ?? defaultLocale}${anchor}`)}`;
      },
      openByDefault: true,
      globals: [Home.slug, Site.slug],
      collections: [Projects.slug],
      breakpoints: [
        { name: "mobile", label: "Mobile", width: 390, height: 844 },
        { name: "tablet", label: "Tablet", width: 820, height: 1180 },
        { name: "desktop", label: "Desktop", width: 1440, height: 900 },
      ],
    },
  },
  collections: [Projects, Media, Users],
  globals: [Home, Site],
  editor: lexicalEditor(),
  localization: {
    locales: locales.map((code) => ({ code, label: localeLabels[code] })),
    defaultLocale,
    fallback: true,
  },
  // The admin panel itself in English or Dutch; each editor picks in their account.
  i18n: { supportedLanguages: { en, nl }, fallbackLanguage: "en" },
  secret: process.env.PAYLOAD_SECRET || "dev-only-secret-change-me",
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || "" },
    // Production applies the committed migrations on start; dev pushes schema changes directly.
    prodMigrations: migrations,
  }),
  sharp,
  graphQL: { disable: true },
  cors: [siteUrl],
  csrf: [siteUrl],
  upload: { limits: { fileSize: 25 * 1024 * 1024 } },
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  // A fresh database gets the site's current content, so nothing has to be typed in by hand.
  onInit: async (payload) => {
    if (process.env.SEED_ON_INIT === "false") return;
    // A failed seed mustn't take the site or the admin down; it picks up where it stopped next start.
    try {
      await seedIfEmpty(payload);
    } catch (error) {
      payload.logger.error({ err: error, msg: "Loading the default content failed. Fix the cause and restart, or run `bun run seed`." });
    }
  },
});
