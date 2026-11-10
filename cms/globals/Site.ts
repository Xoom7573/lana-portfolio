import type { GlobalConfig } from "payload";
import { publishedOrLoggedIn } from "../access";
import { t, text } from "../fields";
import { revalidateGlobal } from "../hooks/revalidate";

// Details used across the whole page: contact info, menu, the scrolling word band and
// what search engines and link previews show.
export const Site: GlobalConfig = {
  slug: "site",
  label: t("Site settings", "Website-instellingen"),
  admin: { group: t("Content", "Inhoud") },
  access: { read: publishedOrLoggedIn },
  versions: { drafts: { autosave: { interval: 400 } }, max: 30 },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: t("Contact", "Contact"),
          fields: [
            { name: "name", type: "text", required: true, label: t("Full name", "Volledige naam") },
            {
              type: "row",
              fields: [
                { name: "email", type: "email", required: true, label: t("Email", "E-mail"), admin: { width: "50%" } },
                {
                  name: "phone",
                  type: "text",
                  required: true,
                  label: t("Phone", "Telefoon"),
                  validate: (value: unknown) =>
                    typeof value === "string" && /^\+\d{8,15}$/.test(value)
                      ? true
                      : "Use the international format without spaces, e.g. +32486153839.",
                  admin: {
                    width: "50%",
                    description: t(
                      "International format, no spaces: +32486153839",
                      "Internationaal formaat, zonder spaties: +32486153839",
                    ),
                  },
                },
              ],
            },
          ],
        },
        {
          name: "nav",
          label: t("Menu", "Menu"),
          fields: [
            {
              name: "links",
              type: "array",
              label: t("Menu links", "Menulinks"),
              labels: { singular: t("Link", "Link"), plural: t("Links", "Links") },
              minRows: 1,
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "target",
                      type: "select",
                      required: true,
                      label: t("Goes to", "Gaat naar"),
                      options: [
                        { value: "about", label: t("About", "Over mij") },
                        { value: "toolkit", label: t("Toolkit", "Toolbox") },
                        { value: "work", label: t("Work", "Werk") },
                        { value: "design", label: t("Design", "Ontwerp") },
                        { value: "contact", label: t("Contact", "Contact") },
                      ],
                      admin: { width: "50%" },
                    },
                    text("label", t("Label", "Tekst"), { admin: { width: "50%" } }),
                  ],
                },
              ],
            },
            text("cta", t("Button", "Knop"), {
              admin: { description: t("The rounded email button in the menu.", "De afgeronde e-mailknop in het menu.") },
            }),
          ],
        },
        {
          label: t("Word band", "Woordenband"),
          fields: [
            {
              name: "marquee",
              type: "array",
              label: t("Words in the scrolling band", "Woorden in de schuivende band"),
              labels: { singular: t("Word", "Woord"), plural: t("Words", "Woorden") },
              minRows: 1,
              fields: [text("word", t("Word", "Woord"))],
            },
          ],
        },
        {
          name: "seo",
          label: t("Search & sharing", "Zoeken & delen"),
          fields: [
            text("title", t("Page title", "Paginatitel"), {
              admin: { description: t("Shown in the browser tab and in Google.", "Staat in het browsertabblad en in Google.") },
            }),
            {
              name: "description",
              type: "textarea",
              required: true,
              localized: true,
              label: t("Description", "Beschrijving"),
              admin: { description: t("Shown under the title in Google.", "Staat onder de titel in Google.") },
            },
            text("ogDescription", t("Link preview text", "Tekst bij een gedeelde link"), {
              admin: {
                description: t(
                  "Shown when the site is shared on social media or in a chat.",
                  "Verschijnt wanneer de site gedeeld wordt op sociale media of in een chat.",
                ),
              },
            }),
            {
              name: "ogImage",
              type: "upload",
              relationTo: "media",
              required: true,
              label: t("Link preview image", "Beeld bij een gedeelde link"),
              admin: { description: t("Cropped to 1200 × 630.", "Wordt bijgesneden tot 1200 × 630.") },
            },
          ],
        },
      ],
    },
  ],
};
