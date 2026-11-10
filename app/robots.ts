import type { MetadataRoute } from "next";
import { siteUrl } from "@/content";

// /robots.txt: everything may be indexed; points crawlers to the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", siteUrl).href,
  };
}
