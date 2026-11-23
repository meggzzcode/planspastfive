# Plans Past Five

*Plans Past Five. Making a life, not just a living.*

A small, static lifestyle magazine with a short, curated Amazon shop. Built with Astro (static output), plain CSS and no client-side JavaScript (except an optional analytics snippet). Content is edited in the browser with [Pages CMS](https://pagescms.org) and published through GitHub to Netlify.

**Milestone 1 status:** the site, checks, CMS configuration, publish workflows and a local end-to-end demonstration are done. A Netlify branch deploy of the `preview` branch has built, but the real CMS login, the Publish and Undo workflows (no GitHub Actions run has happened yet) and a production deploy have **not** been tested; they need the owner's accounts (`docs/OWNER-REAL-TEST.md`, `docs/cowork/BATCH-4.md`).

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
| Site settings, **the only place the Amazon tag lives**, and `launchMode` | `src/content/settings.json` |
| One rights record per picture (articles, home, about, products); not editable in the CMS form | `src/content/images.json`, `public/images/`, `docs/IMAGE-RECORDS.md` |
| Amazon link builder (single module) | `src/lib/affiliate.mjs` |
| `{{product:id}}` / `{{pick:id}}` article markers | `plugins/remark-product.mjs` |
| Content and link checks | `scripts/check-content.mjs`, `scripts/check-dist.mjs` |
| CMS forms | `.pages.yml` |
| Publish / undo | `.github/workflows/*.yml`, `scripts/publish.sh`, `scripts/undo-publish.sh` |
| Hosting | `netlify.toml`, `public/_redirects`, `public/_headers` |

## Site shape
Header: Home, The Journal, The Shop, About. Footer: Journal, Shop, About, Contact, Privacy, Terms, Affiliate Disclosure. Home sections (each is omitted when it would be empty): hero, Featured experiences, Latest from the Journal, A little shopping inspiration, Our story. Journal category pages are generated only for categories with a published story. The shop shows only collections with a verified product. Optional GA4 (off unless an ID is set in settings) sends one Amazon-click event with product, article/page and placement.

## Product rules (enforced by the checks)

A product shows only when its `editorialDecision` is `approve` and its status is `verified` (all evidence recorded: listing check, specs evidence, suitability) or `provisional` while `launchMode` is `preview`. Candidate, held and discontinued products never show. A published article that mentions a product that cannot be shown fails the build, unless the product has a `replacedBy` chain that ends at a shown product. No product prices, ratings, Amazon pictures or testing claims, no stored tags or Amazon addresses in content; budget estimates are allowed in article prose, but not in a paragraph that names a product.

`launchMode` in `src/content/settings.json`: `preview` (default) prints a LAUNCH WARNING for unfinished picture rights and provisional products and still builds; `production` fails the build on them. Switch to `production` only when ready; nothing yet ties the Netlify production deploy to it. Details in `docs/OWNER-OPERATIONS.md`.

**Optional release queue (manual or automatic posting):** `docs/editorial/PUBLISHING-THE-BACKLOG.md`.

## What the Milestone 1 demonstration proves

`npm test` copies a fixture set (`test/fixtures/`) into a temporary folder, not the shipped content, and, in the copy, simulates the owner's CMS edits: publish/unpublish an article, change a hero picture, add and replace products, change or break the tracking tag, and run the publish and undo logic in scratch git repositories. See `test/demo.test.mjs` and `test/workflows.test.mjs`. Screenshots: `docs/milestone-1/screenshots/` (regenerate with `node scripts/screenshots.mjs`; needs Playwright, which is not an npm dependency).

## Amazon Associates
Links may be used after applying; final approval follows three qualifying sales within 180 days. Tracking is switched on in `main` (owner decision 2026-11-23); the production site only changes with a `[deploy]` commit. See `docs/AMAZON-ASSOCIATES.md`.

## Docs

`docs/STATUS.md` (where things stand), `docs/OWNER-OPERATIONS.md` (day to day), `docs/OWNER-REAL-TEST.md` (the real-account test), `docs/AMAZON-ASSOCIATES.md`, `docs/REPO-PRIVACY-CHECK.md`, `docs/COSTS.md`, `docs/RISKS.md`, `docs/TRANSFER.md`, `docs/IMAGE-RECORDS.md`.
