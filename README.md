# Plans Past Five

*Plans Past Five. Making a life, not just a living.*

A small, static lifestyle magazine with a short, curated Amazon shop. Built with Astro (static output), plain CSS and no client-side JavaScript (except an optional analytics snippet). Content is edited in the browser with [Pages CMS](https://pagescms.org) and published through GitHub to Netlify.

**Milestone 1 status:** the site, checks, CMS configuration, publish workflows and a local end-to-end demonstration are done. The real CMS login, a real Netlify deploy and a real GitHub Actions run have **not** been tested; they need the owner's accounts (`docs/OWNER-REAL-TEST.md`).

## Setup

Needs Node 20.3 or newer (22 recommended; `.nvmrc`).

```
npm ci
npm run build      # content check -> build into dist/ -> link check on the built site
npm run preview    # serves dist/ at http://127.0.0.1:4321/
npm test           # all tests, including the Milestone 1 demonstration
npm run dev        # live development server
```

`npm run check` is the same as `npm run build`: one command that checks the content, builds, and validates every link. It fails with plain-English messages that name the file and the field.

## Where things are

| What | Where |
|---|---|
| Articles (Markdown) | `src/content/articles/*.md` |
| Products (one file each) | `src/content/products/<id>.json` |
| Site settings, **the only place the Amazon tag lives** | `src/content/settings.json` |
| Pictures used on home/about (with records) | `src/content/images.json`, `public/images/`, `docs/IMAGE-RECORDS.md` |
| Amazon link builder (single module) | `src/lib/affiliate.mjs` |
| `{{product:id}}` / `{{pick:id}}` article markers | `plugins/remark-product.mjs` |
| Content and link checks | `scripts/check-content.mjs`, `scripts/check-dist.mjs` |
| CMS forms | `.pages.yml` |
| Publish / undo | `.github/workflows/*.yml`, `scripts/publish.sh`, `scripts/undo-publish.sh` |
| Hosting | `netlify.toml`, `public/_redirects`, `public/_headers` |

## Product rules (enforced by the checks)

Only products whose status is `verified` (with a verification date and source) can appear. A published article that mentions a candidate, held, discontinued or unknown product fails the build, unless the product has a `replacedBy` chain that ends at a verified product. No prices, no ratings, no Amazon pictures, no testing claims, no stored tags or Amazon addresses in content.

## What the Milestone 1 demonstration proves

`npm test` copies the repository into a temporary folder and, in the copy, simulates the owner's CMS edits: publish/unpublish an article, change a hero picture, add and replace products, change or break the tracking tag, and run the publish and undo logic in scratch git repositories. See `test/demo.test.mjs` and `test/workflows.test.mjs`. Screenshots: `docs/milestone-1/screenshots/` (regenerate with `node scripts/screenshots.mjs`; needs Playwright, which is not an npm dependency).

## Docs

`docs/OWNER-OPERATIONS.md` (day to day), `docs/OWNER-REAL-TEST.md` (the real-account test), `docs/COSTS.md`, `docs/RISKS.md`, `docs/TRANSFER.md`, `docs/IMAGE-RECORDS.md`.
