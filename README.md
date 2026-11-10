# Lana Libeert — Creative Portfolio

A one-page portfolio website for Lana Libeert, based on the Canva portfolio slides in [`image-based-portfolio/`](image-based-portfolio/).

It's built with [Next.js](https://nextjs.org) and [Tailwind CSS](https://tailwindcss.com), and uses the [Bun](https://bun.sh) package manager.

## Getting started

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000). The page reloads automatically as you edit.

To build and run the production version:

```bash
bun run build
bun run start
```

## Editing the text

The site is in English and Dutch. Each language has its own text file: [`i18n/en.ts`](i18n/en.ts) and [`i18n/nl.ts`](i18n/nl.ts). Change the text in both. If a key is missing from the Dutch file, `bun run build` fails and names it.

- Wrap a phrase in `**double asterisks**` in the about text to highlight it in pink.
- Text in `{braces}`, such as `{n}` or `{name}`, is filled in by the site. Keep it as it is.
- Contact details, the colour codes and the project numbers are the same in every language. They live in [`content.ts`](content.ts).

## Languages

Each language has its own address: `/en` and `/nl`.

- Someone who visits `/` is sent to the language they last chose with the EN / NL switch in the menu.
- The first time, they are sent to the language their browser asks for. If the browser asks for neither language, they get English.
- [`proxy.ts`](proxy.ts) does this redirect.
- The list of languages is in [`i18n/config.ts`](i18n/config.ts), and is repeated in `scripts/prepare-images.mjs`.

## Adding or replacing images

Raw images go in [`images/`](images/). The script turns them into web-ready files in `public/`:

```bash
bun scripts/prepare-images.mjs
```

Run it again whenever you add or change an image, then restart the dev server.

| What | Where to put it |
| --- | --- |
| Portrait | `images/foto_lana_transparent_bg.png` |
| Moodboard photos | `images/moodboard_1.png`, `moodboard_2.png`, … |
| SwapCloset pages | `images/my_work/swapcloset/swapcloset_<n>.png` |
| Líkami pages | `images/my_work/likami/en/<n>.png` (English) and `images/my_work/likami/nl/<n>.png` (Dutch) |

**Project pages:** name each file after its page number (`6.png` or `swapcloset_6.png`). Name a two-page spread after both of its pages (`swapcloset_2_3.png`); the script cuts it in half, left page first.

**Languages:** a project with a translated version keeps each language in its own folder (`en/`, `nl/`). Each language then shows its own pages. A project with a single set of pages, like SwapCloset, shows the same pages in both languages. To add a translated version to such a project, make language folders for it and update its `dirs` entry in the script.

**Missing pages:** if a page's file is missing, the script uses the same page from the other language. If that's missing too, it uses a lower-quality crop from the overview image (`images/foto_swapcloset.png` or `images/foto_likami.png`). The script's output says when it has done either.

The list of projects and their page counts is at the top of [`scripts/prepare-images.mjs`](scripts/prepare-images.mjs). A new project needs an entry there and its own section on the page.

## Project structure

```
app/[lang]/           page and layout (fonts, metadata), once per language
app/globals.css       global styles
components/           one file per section (Hero, About, Toolkit, …) plus shared pieces
i18n/                 the text in English (en.ts) and Dutch (nl.ts), plus the language list
content.ts            data shared by both languages; combines it with the text
proxy.ts              sends / to /en or /nl
scripts/              image preparation script
generated/            page list written by the image script (commit this)
images/               raw source images
image-based-portfolio/ the original Canva slides, for reference
public/               generated web images (don't edit by hand)
```

## Design

| Colours | Fonts |
| --- | --- |
| Bordeaux `#5d0e2a`, blush `#ffd5e5`, white `#ffffff` | League Spartan for headlines, Urbanist for body text |

Urbanist stands in for Hero, the font from the Canva slides, because Hero isn't on Google Fonts. The colours are defined as Tailwind theme tokens in [`app/globals.css`](app/globals.css).

## Deploying

The pages are prerendered, and the redirect from `/` to a language runs in [`proxy.ts`](proxy.ts). That needs a Next.js host, such as [Vercel](https://vercel.com). A plain static export (`output: "export"`) would serve `/en` and `/nl` but not that redirect. Set the environment variable `NEXT_PUBLIC_SITE_URL` to the live address (for example `https://example.com`) so link previews on social media show the right image.
