import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  PayloadRequest,
  RequestContext,
} from "payload";
import { revalidatePath } from "next/cache";
import { locales } from "../../i18n/config";

type Status = { _status?: "draft" | "published" | null } | undefined;

// The whole site is one page per language, so any published change refreshes both.
function refresh(req: PayloadRequest, context: RequestContext, reason: string) {
  // The seed script and scripts run outside Next.js, where there's no cache to refresh.
  if (context.disableRevalidate) return;
  try {
    for (const locale of locales) revalidatePath(`/${locale}`);
    req.payload.logger.info(`Revalidated the site (${reason})`);
  } catch (error) {
    req.payload.logger.warn({ err: error, msg: `Couldn't revalidate the site (${reason})` });
  }
}

// Publishing or unpublishing refreshes the public site; autosaved drafts don't. (The first draft
// saved after a publish also refreshes once, because its previous version was the published one;
// that's what catches unpublishing, and it re-renders the same published content.)
const affectsPublicSite = (doc: Status, previousDoc: Status) =>
  doc?._status === undefined || doc._status === "published" || previousDoc?._status === "published";

export const revalidateGlobal: GlobalAfterChangeHook = ({ doc, previousDoc, req, context, global }) => {
  if (affectsPublicSite(doc, previousDoc)) refresh(req, context, `global ${global.slug}`);
  return doc;
};

export const revalidateDoc: CollectionAfterChangeHook = ({ doc, previousDoc, req, context, collection }) => {
  if (affectsPublicSite(doc, previousDoc)) refresh(req, context, `${collection.slug} ${doc.id}`);
  return doc;
};

export const revalidateDelete: CollectionAfterDeleteHook = ({ doc, req, context, collection }) => {
  refresh(req, context, `deleted ${collection.slug} ${doc.id}`);
  return doc;
};
