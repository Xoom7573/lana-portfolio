// The site's languages. The first one is the fallback when the browser's
// language isn't supported. Keep in sync with `locales` in scripts/prepare-images.mjs.
export const locales = ["en", "nl"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

// Remembers the language a visitor picked with the switcher.
export const localeCookie = "NEXT_LOCALE";

export const isLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value);

// Replace {name} placeholders: fill("{n} pages", { n: 8 }) -> "8 pages".
export const fill = (template: string, vars: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (match, key) => (key in vars ? String(vars[key]) : match));
