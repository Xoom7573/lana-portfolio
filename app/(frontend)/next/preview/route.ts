import config from "@payload-config";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { getPayload } from "payload";

// Opened by the admin's live preview: turns on draft mode for a logged-in editor, then shows
// the page with their unpublished changes.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const path = url.searchParams.get("path") ?? "/";
  // Only paths on this site, never another domain.
  if (!path.startsWith("/") || path.startsWith("//")) return new Response("Invalid path", { status: 400 });

  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: request.headers });
  if (!user) return new Response("Log in to the admin panel to preview drafts.", { status: 403 });

  (await draftMode()).enable();
  redirect(path);
}
