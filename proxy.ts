import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, localeCookie, locales, type Locale } from "@/i18n/config";

// The visitor's preferred supported language, from an Accept-Language header
// like "nl-BE,nl;q=0.9,en;q=0.8".
function fromAcceptLanguage(header: string | null): Locale | undefined {
  if (!header) return undefined;
  return header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { lang: tag.toLowerCase().split("-")[0], q: q ? Number(q.trim().slice(2)) : 1 };
    })
    .filter(({ q }) => q > 0)
    .sort((a, b) => b.q - a.q)
    .map(({ lang }) => lang)
    .find(isLocale);
}

// Send every page without a language prefix to /en/… or /nl/…: the language
// picked with the switcher first, then the browser's language, then English.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];
  if (locales.includes(first as Locale)) return NextResponse.next();

  const cookie = request.cookies.get(localeCookie)?.value ?? "";
  const locale = isLocale(cookie) ? cookie : (fromAcceptLanguage(request.headers.get("accept-language")) ?? defaultLocale);

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next.js internals, the CMS (/admin, /api), the preview routes (/next/…) and anything
  // that looks like a file (favicon.ico, icon.svg).
  matcher: ["/((?!_next|admin|api|next/|.*\\..*).*)"],
};
