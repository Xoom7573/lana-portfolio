import path from "node:path";
import type { CollectionConfig } from "payload";
import { t } from "../fields";
import { revalidateDelete, revalidateDoc } from "../hooks/revalidate";

// Every image the site shows. Uploads are stored on disk in <project>/media (a Docker volume in
// production; MEDIA_DIR overrides it) and resized once on upload, so the page never serves a raw
// Canva export. Relative to the working directory rather than this file, because this file is
// bundled into .next when the site is built.
const mediaDir = path.resolve(/*turbopackIgnore: true*/ process.env.MEDIA_DIR || path.join(process.cwd(), "media"));
export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: t("Image", "Afbeelding"), plural: t("Images", "Afbeeldingen") },
  admin: { group: t("Content", "Inhoud"), useAsTitle: "filename", defaultColumns: ["filename", "alt", "updatedAt"] },
  access: { read: () => true },
  hooks: { afterChange: [revalidateDoc], afterDelete: [revalidateDelete] },
  fields: [
    {
      name: "alt",
      type: "text",
      localized: true,
      label: t("Description", "Beschrijving"),
      admin: {
        description: t(
          "Read aloud by screen readers. Leave empty for purely decorative images.",
          "Wordt voorgelezen door schermlezers. Laat leeg voor puur decoratieve beelden.",
        ),
      },
    },
  ],
  upload: {
    staticDir: mediaDir,
    mimeTypes: ["image/png", "image/jpeg", "image/webp", "image/avif"],
    focalPoint: true,
    adminThumbnail: "thumb",
    // Keep originals sharp but reasonable: a Canva export can be 4000px+ and several MB.
    resizeOptions: { width: 2400, withoutEnlargement: true },
    formatOptions: { format: "webp", options: { quality: 92, alphaQuality: 95 } },
    imageSizes: [
      // Grid thumbnails and covers.
      { name: "thumb", width: 600, withoutEnlargement: false, formatOptions: { format: "webp", options: { quality: 88 } } },
      // The enlarged page in the lightbox; 90 keeps brochure text crisp.
      { name: "full", width: 1600, withoutEnlargement: true, formatOptions: { format: "webp", options: { quality: 90 } } },
      // Social media link previews.
      { name: "og", width: 1200, height: 630, position: "centre", formatOptions: { format: "jpeg", options: { quality: 88 } } },
    ],
  },
};
