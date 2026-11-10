// Reads the site's content from Payload with the Local API (straight from the database, no
// HTTP). Server-only: client components get what they need as props.
import config from "@payload-config";
import { getPayload } from "payload";
import { cache } from "react";
import { defaultLocale, type Locale } from "@/i18n/config";

export const payload = () => getPayload({ config });

// `draft` is true in the admin's live preview: show the latest unpublished changes.
export const getSite = cache(async (locale: Locale, draft: boolean) =>
  (await payload()).findGlobal({ slug: "site", locale, fallbackLocale: defaultLocale, draft, depth: 1 }),
);

export const getHome = cache(async (locale: Locale, draft: boolean) =>
  (await payload()).findGlobal({ slug: "home", locale, fallbackLocale: defaultLocale, draft, depth: 1 }),
);

export const getProjects = cache(async (locale: Locale, draft: boolean) => {
  const { docs } = await (await payload()).find({
    collection: "projects",
    locale,
    fallbackLocale: defaultLocale,
    draft,
    depth: 1,
    sort: "_order",
    limit: 100,
    pagination: false,
    where: draft ? undefined : { _status: { equals: "published" } },
  });
  return docs;
});
