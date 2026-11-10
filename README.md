# Lana Libeert — Creative Portfolio

A one-page portfolio website for Lana Libeert, based on the Canva portfolio slides in [`image-based-portfolio/`](image-based-portfolio/).

It's built with [Next.js](https://nextjs.org), [Tailwind CSS](https://tailwindcss.com) and [Payload CMS](https://payloadcms.com), which stores the content in a Postgres database. It uses the [Bun](https://bun.sh) package manager.

## Editing the content

All the text and images are edited in the admin panel at **`/admin`** (for example `https://your-domain/admin`), in English and Dutch.

- **Page content** holds the sections of the page, one tab each, top to bottom: intro, about, toolkit, selected work, design and contact.
- **Site settings** holds your name, email and phone number, the menu, the scrolling word band, and what Google and link previews show.
- **Projects** holds the work, one entry per project. Drag the projects in the list to change their order; the numbers on the page (01, 02, …) follow it. Each project picks a layout: *intro on the left* for a few large pages (like SwapCloset) or *wide grid* for many pages (like Líkami).
- **Images** holds every uploaded image. They're resized and converted to WebP on upload, so you can upload Canva exports as they are. Upload a two-page spread as two separate pages.

**Languages:** switch between English and Dutch with the language menu at the top of the editor. Text you leave empty in Dutch shows the English text. A project without Dutch pages shows its English pages in both languages.

**Drafts:** changes are saved as a draft while you type and don't appear on the public site until you click **Publish**. The **Live preview** button shows the page with your draft, next to the editor, on a phone, tablet or desktop.

In the about text, make words **bold** to highlight them in pink.

The admin panel itself can be switched to Dutch under your account (top right).

## Getting started

You need [Node.js](https://nodejs.org) 24.22.1 or newer (see [`.nvmrc`](.nvmrc)), Bun and [Docker](https://www.docker.com).

```bash
cp .env.example .env        # then fill in PAYLOAD_SECRET and POSTGRES_PASSWORD (and the same password in DATABASE_URL)
docker compose up -d postgres
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000). The first time, the server fills the empty database with the site's default content and images, which takes about a minute. Then open [http://localhost:3000/admin](http://localhost:3000/admin) and create your account (or set `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` in `.env` beforehand to have it created for you).

## The default content

The site's starting content lives in [`cms/seed/content.ts`](cms/seed/content.ts) (text, in both languages) and in [`images/`](images/) (the original image exports). Whenever the server starts with an empty database, it loads them by itself, so a new computer or a fresh server never needs content typed in by hand. Once the database has content, this never runs again and edits made in the admin are never overwritten.

```bash
bun run seed            # load the defaults if the database is still empty
bun run seed force      # throw all content away and load the defaults again (accounts are kept)
```

| Default image | Where it comes from |
| --- | --- |
| Portrait | `images/foto_lana_transparent_bg.png`, trimmed to the subject |
| Moodboard photos | `images/moodboard_1.png`, `moordboard_2.png`, `moodboard_3.png`, `moodboard_4.png` |
| SwapCloset pages | `images/my_work/swapcloset/swapcloset_<n>.png`; a spread named after both pages (`swapcloset_2_3.png`) is cut in half |
| Líkami pages | `images/my_work/likami/en/<n>.png` and `images/my_work/likami/nl/<n>.png` |
| Link preview | `image-based-portfolio/slide_01.png`, cropped |

## Interface labels

Words that belong to the site's controls rather than its content (screen-reader labels, "Close ✕", "Previous page", "Back to top ↑") are in [`i18n/en.ts`](i18n/en.ts) and [`i18n/nl.ts`](i18n/nl.ts). If a key is missing from the Dutch file, `bun run build` fails and names it. Text in `{braces}`, such as `{n}`, is filled in by the site.

## Languages

Each language has its own address: `/en` and `/nl`.

- Someone who visits `/` is sent to the language they last chose with the EN / NL switch in the menu.
- The first time, they are sent to the language their browser asks for. If the browser asks for neither language, they get English.
- [`proxy.ts`](proxy.ts) does this redirect.
- The list of languages is in [`i18n/config.ts`](i18n/config.ts). The CMS uses the same list.

## How it fits together

The page is rendered on its first visit and then served from the cache, so it stays fast. Publishing anything in the admin clears that cache for both languages ([`cms/hooks/revalidate.ts`](cms/hooks/revalidate.ts)); drafts don't. The admin's live preview uses Next.js draft mode to show unpublished changes to logged-in editors only.

```
app/(frontend)/       the page and its layout (fonts, metadata), once per language, plus the preview routes
app/(payload)/        the admin panel and its API (generated by Payload, don't edit)
cms/                  the CMS setup: collections, globals, access rules, hooks and the default content
components/           one file per section (Hero, About, Toolkit, …) plus shared pieces
content.ts            reads the CMS and combines it with the interface labels for one language
lib/payload.ts        the database queries
i18n/                 the interface labels in English and Dutch, plus the language list
migrations/           database schema changes, applied when the production server starts
payload.config.ts     the Payload configuration
proxy.ts              sends / to /en or /nl
images/               raw source images for the default content
image-based-portfolio/ the original Canva slides, for reference
scripts/              the seed command and the favicon script
```

### Changing the CMS fields

After adding or changing fields in `cms/`:

```bash
bun run generate:types              # updates payload-types.ts
bun run generate:importmap          # only if you added admin components
bun run migrate:create <a-name>     # writes a migration for the database change; commit it
```

In development the database follows the fields automatically. The live server only changes through migrations, which it applies when it starts.

### Tab icons

The tab icon is drawn in [`app/icon.svg`](app/icon.svg). After changing it, run `bun scripts/make-icons.mjs` to update `favicon.ico` and `apple-icon.png`.

## Design

| Colours | Fonts |
| --- | --- |
| Bordeaux `#5d0e2a`, blush `#ffd5e5`, white `#ffffff` | League Spartan for headlines, Urbanist for body text |

Urbanist stands in for Hero, the font from the Canva slides, because Hero isn't on Google Fonts. The colours are defined as Tailwind theme tokens in [`app/(frontend)/globals.css`](app/(frontend)/globals.css).

## Deploying

The site runs on any server with Docker: [`docker-compose.yml`](docker-compose.yml) starts the app and its Postgres database, and optionally [Caddy](https://caddyserver.com) for HTTPS.

1. Copy the project to the server and create `.env` from `.env.example`. Set `NEXT_PUBLIC_SITE_URL` to the live address (for example `https://example.com`), a new `PAYLOAD_SECRET`, a strong `POSTGRES_PASSWORD`, and `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` for the first account.
2. With HTTPS through Caddy: point the domain's DNS at the server, set `DOMAIN` in `.env`, and run `docker compose --profile https up -d --build`. Without Caddy (behind your own proxy): `docker compose up -d --build`, which serves the site on port 3000.
3. On its first start the app sets up the database and loads the default content. Log in at `/admin`, then remove `SEED_ADMIN_PASSWORD` from `.env`.

To update the site after a code change, run the same `docker compose … up -d --build` command again. Content and images are kept: they live in the `pgdata` and `media` volumes.

If you use your own reverse proxy instead of Caddy, raise its upload limit to at least 25 MB (nginx allows only 1 MB by default: `client_max_body_size 25m;`), or uploading images fails.

### Backups

Back up the database and the uploaded images together:

```bash
docker compose exec -T postgres pg_dump -U portfolio portfolio > backup.sql
docker run --rm -v portfolio-lana_media:/media -v "$PWD":/backup alpine tar czf /backup/media.tar.gz -C /media .
```

To restore, load `backup.sql` with `psql` into an empty database and unpack `media.tar.gz` into the `media` volume.
