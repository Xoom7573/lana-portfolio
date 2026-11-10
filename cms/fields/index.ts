import type { Field, GroupField } from "payload";

// An admin label or description in both admin languages.
export const t = (en: string, nl: string) => ({ en, nl });

// A localized text field.
export const text = (name: string, label: ReturnType<typeof t>, extra: Partial<Field> = {}): Field =>
  ({ name, type: "text", label, localized: true, required: true, ...extra }) as Field;

// The slides' two-tone heading: the first line is white, the second blush.
export const twoLines = (name: string, label: ReturnType<typeof t>, extra: Partial<GroupField> = {}): GroupField => ({
  name,
  type: "group",
  label,
  admin: { hideGutter: true },
  ...extra,
  fields: [
    {
      type: "row",
      fields: [
        text("line1", t("Line 1", "Regel 1"), { admin: { width: "50%" } }),
        text("line2", t("Line 2", "Regel 2"), { admin: { width: "50%" } }),
      ],
    },
  ],
});
