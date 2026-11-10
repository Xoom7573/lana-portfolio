// Loads the site's default content into the CMS. Run with `bun run seed`.
//   bun run seed           load the defaults if the database is still empty (never overwrites edits)
//   bun run seed force     replace all content with the defaults again (editor accounts are kept)
// The server does the first run by itself when it starts with an empty database.
// (`payload run` exits once this module has loaded, hence the top-level await, and it only
// passes plain words through to the script, hence "force" rather than "--force".)
import { getPayload } from "payload";
import config from "../payload.config";
import { seed, seedIfEmpty } from "../cms/seed";

process.env.SEED_ON_INIT = "false";
const force = process.argv.slice(2).some((arg) => arg === "force" || arg === "--force");

try {
  const payload = await getPayload({ config });
  await (force ? seed(payload, { force }) : seedIfEmpty(payload));
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
