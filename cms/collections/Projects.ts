import type { CollectionConfig } from "payload";
import { defaultLocale } from "../../i18n/config";
import { publishedOrLoggedIn } from "../access";
import { t, text } from "../fields";
import { revalidateDelete, revalidateDoc } from "../hooks/revalidate";

// The work shown on the page, each in its own section. Drag projects in the list view
// to reorder them; the section numbers (01, 02, …) follow that order.
export const Projects: CollectionConfig = {
  slug: "projects",
  labels: { singular: t("Project", "Project"), plural: t("Projects", "Projecten") },
  orderable: true,
  admin: {
    group: t("Content", "Inhoud"),
    useAsTitle: "name",
    defaultColumns: ["name", "discipline", "layout", "_status"],
  },
  access: { read: publishedOrLoggedIn },
  versions: { drafts: { autosave: { interval: 400 } }, maxPerDoc: 30 },
  hooks: { afterChange: [revalidateDoc], afterDelete: [revalidateDelete] },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
          label: t("Name", "Naam"),
          admin: {
            width: "50%",
            description: t("Shown on the project card and in the page viewer.", "Staat op de projectkaart en in de paginaviewer."),
          },
        },
        {
          name: "slug",
          type: "text",
          required: true,
          unique: true,
          index: true,
          label: t("Link name", "Linknaam"),
          validate: (value: unknown) =>
            typeof value === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
              ? true
              : "Use lowercase letters, numbers and dashes only.",
          admin: {
            width: "50%",
            description: t(
              "Lowercase, no spaces. The project card links to #this-name.",
              "Kleine letters, zonder spaties. De projectkaart linkt naar #deze-naam.",
            ),
          },
        },
      ],
    },
    {
      name: "heading",
      type: "textarea",
      required: true,
      localized: true,
      label: t("Heading", "Titel"),
      admin: {
        rows: 2,
        description: t("Each line becomes a line of the big heading.", "Elke regel wordt een regel van de grote titel."),
      },
    },
    text("discipline", t("Discipline", "Discipline"), {
      admin: { description: t("e.g. Editorial Brochure Design", "bv. Editorial brochureontwerp") },
    }),
    { name: "description", type: "textarea", required: true, localized: true, label: t("Description", "Beschrijving"), admin: { rows: 2 } },
    {
      type: "row",
      fields: [
        {
          name: "layout",
          type: "select",
          required: true,
          defaultValue: "sticky",
          label: t("Layout", "Opmaak"),
          options: [
            { value: "sticky", label: t("Intro on the left, large pages (few pages)", "Intro links, grote pagina's (weinig pagina's)") },
            { value: "grid", label: t("Heading on top, wide grid (many pages)", "Titel bovenaan, brede raster (veel pagina's)") },
          ],
          admin: { width: "50%" },
        },
        {
          name: "pageLabel",
          type: "select",
          required: true,
          defaultValue: "page",
          label: t("Page numbers", "Paginanummers"),
          options: [
            { value: "page", label: t('"Page 3"', '"Pagina 3"') },
            { value: "fraction", label: t('"03 / 27"', '"03 / 27"') },
          ],
          admin: { width: "50%" },
        },
      ],
    },
    {
      name: "pages",
      type: "upload",
      relationTo: "media",
      hasMany: true,
      localized: true,
      // Required in English only: other languages may stay empty and then show the English pages.
      validate: (value: unknown, { req }: { req: { locale?: string | null } }) =>
        req.locale && req.locale !== defaultLocale ? true : Array.isArray(value) && value.length > 0 ? true : "Add at least one page.",
      label: t("Pages", "Pagina's"),
      admin: {
        description: t(
          "In reading order; drag to reorder. Leave the Dutch pages empty to show the English ones in both languages.",
          "In leesvolgorde; sleep om de volgorde te wijzigen. Laat de Nederlandse pagina's leeg om in beide talen de Engelse te tonen.",
        ),
      },
    },
    {
      type: "collapsible",
      label: t("Cover", "Cover"),
      admin: { initCollapsed: true },
      fields: [
        {
          name: "cover",
          type: "upload",
          relationTo: "media",
          label: t("Cover image", "Coverbeeld"),
          admin: {
            description: t("Optional. Without one, the first page is used.", "Optioneel. Zonder cover wordt de eerste pagina gebruikt."),
          },
        },
        text("coverAlt", t("Cover description", "Beschrijving van de cover"), {
          admin: { description: t("Read aloud by screen readers.", "Wordt voorgelezen door schermlezers.") },
        }),
      ],
    },
  ],
};
