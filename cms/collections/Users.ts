import type { CollectionConfig } from "payload";
import { t } from "../fields";

export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: t("Editor", "Redacteur"), plural: t("Editors", "Redacteurs") },
  auth: true,
  admin: { useAsTitle: "email", group: t("Settings", "Instellingen") },
  fields: [],
};
