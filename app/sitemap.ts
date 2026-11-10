import type { MetadataRoute } from "next";
import { siteUrl } from "@/content";
import { locales } from "@/i18n/config";

// /sitemap.xml: one entry per language, each listing its translations.
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (lang: string) => new URL(`/${lang}`, siteUrl).href;
  const languages = Object.fromEntries(locales.map((l) => [l, url(l)]));

  return locales.map((lang) => ({
    url: url(lang),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 1,
    alternates: { languages },
  }));
}
