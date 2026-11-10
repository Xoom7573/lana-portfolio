import { BoldFeature, lexicalEditor, ParagraphFeature } from "@payloadcms/richtext-lexical";
import type { GlobalConfig } from "payload";
import { publishedOrLoggedIn } from "../access";
import { t, text, twoLines } from "../fields";
import { revalidateGlobal } from "../hooks/revalidate";

// The text and images of the page, one tab per section, top to bottom.
// The projects themselves are in the Projects collection.
export const Home: GlobalConfig = {
  slug: "home",
  label: t("Page content", "Pagina-inhoud"),
  admin: { group: t("Content", "Inhoud") },
  access: { read: publishedOrLoggedIn },
  versions: { drafts: { autosave: { interval: 400 } }, max: 30 },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          name: "hero",
          label: t("Hero", "Intro"),
          description: t(
            "The first screen: the big two-line headline and the portrait.",
            "Het eerste scherm: de grote titel van twee regels en het portret.",
          ),
          fields: [
            twoLines("words", t("Headline", "Titel"), {
              admin: {
                hideGutter: true,
                description: t(
                  "Short words work best: each line runs across the whole screen.",
                  "Korte woorden werken het best: elke regel loopt over het hele scherm.",
                ),
              },
            }),
            {
              name: "portrait",
              type: "upload",
              relationTo: "media",
              required: true,
              label: t("Portrait", "Portret"),
              admin: {
                description: t(
                  "A cut-out with a transparent background, cropped close to the body.",
                  "Een uitgeknipte foto met transparante achtergrond, nauw rond het lichaam bijgesneden.",
                ),
              },
            },
          ],
        },
        {
          name: "about",
          label: t("About", "Over mij"),
          fields: [
            twoLines("heading", t("Heading", "Titel")),
            {
              type: "row",
              fields: [
                text("sticker", t("Sticker ring text", "Tekst rond de sticker"), {
                  admin: {
                    width: "66%",
                    description: t(
                      "Runs once around the circle; end with a separator.",
                      "Loopt één keer rond de cirkel; eindig met een scheidingsteken.",
                    ),
                  },
                }),
                text("stickerCenter", t("Sticker centre", "Midden van de sticker"), { admin: { width: "34%" } }),
              ],
            },
            text("greeting", t("Greeting", "Begroeting")),
            {
              name: "body",
              type: "richText",
              required: true,
              localized: true,
              label: t("Text", "Tekst"),
              admin: {
                description: t("Make words bold to highlight them in pink.", "Zet woorden in het vet om ze roze te markeren."),
              },
              editor: lexicalEditor({ features: () => [ParagraphFeature(), BoldFeature()] }),
            },
          ],
        },
        {
          name: "toolkit",
          label: t("Toolkit", "Toolbox"),
          fields: [
            {
              name: "groups",
              type: "array",
              label: t("Cards", "Kaarten"),
              labels: { singular: t("Card", "Kaart"), plural: t("Cards", "Kaarten") },
              minRows: 1,
              fields: [
                {
                  name: "title",
                  type: "textarea",
                  required: true,
                  localized: true,
                  label: t("Title", "Titel"),
                  admin: {
                    rows: 2,
                    description: t("Each line becomes a line of the title.", "Elke regel wordt een regel van de titel."),
                  },
                },
                {
                  name: "items",
                  type: "array",
                  label: t("Tools", "Tools"),
                  labels: { singular: t("Tool", "Tool"), plural: t("Tools", "Tools") },
                  minRows: 1,
                  fields: [text("label", t("Name", "Naam"))],
                },
              ],
            },
            twoLines("heading", t("Heading below the cards", "Titel onder de kaarten")),
          ],
        },
        {
          name: "work",
          label: t("Selected work", "Uitgelicht werk"),
          description: t(
            "The overview of project cards. The projects themselves are under Projects.",
            "Het overzicht met projectkaarten. De projecten zelf staan onder Projecten.",
          ),
          fields: [
            text("heading", t("Heading", "Titel")),
            text("eyebrow", t("Small text next to the heading", "Kleine tekst naast de titel"), {
              admin: {
                description: t(
                  "The numbers in front (01-03 /) are added automatically.",
                  "De nummers ervoor (01-03 /) worden automatisch toegevoegd.",
                ),
              },
            }),
            {
              name: "portfolio",
              type: "group",
              label: t("Last card: this portfolio", "Laatste kaart: dit portfolio"),
              admin: { description: t("Links to the design section.", "Linkt naar het ontwerpgedeelte.") },
              fields: [
                {
                  type: "row",
                  fields: [
                    text("label", t("Name", "Naam"), { admin: { width: "50%" } }),
                    text("kind", t("Discipline", "Discipline"), { admin: { width: "50%" } }),
                  ],
                },
                twoLines("cover", t("Words on the cover", "Woorden op de cover")),
              ],
            },
          ],
        },
        {
          name: "design",
          label: t("Design", "Ontwerp"),
          fields: [
            text("heading", t("Heading", "Titel")),
            text("paletteLabel", t("Palette label", "Label boven het palet")),
            {
              name: "colours",
              type: "array",
              label: t("Colours", "Kleuren"),
              labels: { singular: t("Colour", "Kleur"), plural: t("Colours", "Kleuren") },
              minRows: 1,
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "hex",
                      type: "text",
                      required: true,
                      label: t("Colour code", "Kleurcode"),
                      validate: (value: unknown) =>
                        typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value) ? true : "Use a colour code like #5d0e2a.",
                      admin: { width: "50%" },
                    },
                    text("name", t("Name", "Naam"), { admin: { width: "50%" } }),
                  ],
                },
              ],
            },
            text("typographyLabel", t("Typography label", "Label boven de typografie")),
            {
              type: "row",
              fields: [
                text("headlineFont", t("About the headline font", "Over het titellettertype"), { admin: { width: "50%" } }),
                text("bodyFont", t("About the body font", "Over het tekstlettertype"), { admin: { width: "50%" } }),
              ],
            },
            text("moodboardLabel", t("Moodboard label", "Label boven het moodboard")),
            {
              name: "moodboard",
              type: "upload",
              relationTo: "media",
              hasMany: true,
              required: true,
              minRows: 4,
              maxRows: 4,
              label: t("Moodboard photos", "Moodboardfoto's"),
              admin: {
                description: t(
                  "Exactly 4, in this order: 1 bottom left, 2 right, 3 top middle, 4 left (on top).",
                  "Precies 4, in deze volgorde: 1 linksonder, 2 rechts, 3 middenboven, 4 links (bovenop).",
                ),
              },
            },
          ],
        },
        {
          name: "contact",
          label: t("Contact", "Contact"),
          description: t(
            "Your email and phone number are under Site settings.",
            "Je e-mailadres en telefoonnummer staan onder Website-instellingen.",
          ),
          fields: [text("eyebrow", t("Small text above", "Kleine tekst erboven")), text("heading", t("Heading", "Titel"))],
        },
      ],
    },
  ],
};
