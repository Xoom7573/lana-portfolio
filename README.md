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

All the text on the site lives in [`content.ts`](content.ts): the about text, toolkit, project titles, contact details and colour palette. Wrap a phrase in `**double asterisks**` in the about text to highlight it in pink.

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
| Líkami pages | `images/my_work/likami/en/<n>.png` |

**Project pages:** number the files in order (`1.png`, `2.png`, … or `name_1.png`, `name_2.png`, …). A landscape file is treated as a two-page spread and split in half. If a page's file is missing, the script uses a lower-quality crop from the overview image (`images/foto_swapcloset.png` or `images/foto_likami.png`) and says so in its output.

The list of projects, page counts and spreads is at the top of [`scripts/prepare-images.mjs`](scripts/prepare-images.mjs). A new project needs an entry there and its own section on the page.

## Project structure

```
app/                  page, layout (fonts, metadata) and global styles
components/           one file per section (Hero, About, Toolkit, …) plus shared pieces
content.ts            all site text and project lists
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

The site is fully static and can be hosted on any Next.js host, such as [Vercel](https://vercel.com). Set the environment variable `NEXT_PUBLIC_SITE_URL` to the live address (for example `https://example.com`) so link previews on social media show the right image.
