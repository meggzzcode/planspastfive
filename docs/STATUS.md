# Status (working checklist)

Updated 2026-11-20. "UNVERIFIED" means nobody has confirmed it.

## Finished
- **Foundation:** Astro site, content checks, link checks, tests, CMS configuration, publish and undo workflows, legal pages, demo article, 3 verified products, 4 illustrative pictures. Proven on a computer only (`npm test`).
- **Docs:** costs, risks, transfer, image records, owner operations (browser first), real-test plan, Amazon explainer, repo privacy check.

## Partly finished
- **Stage 2 article, "Junk Journal Supplies for Beginners"** (`/home/user/ppf-wt/_stage2/`: `ARTICLE.md` 1,471 words, `PRODUCTS-SLOTS.md`, `IMAGES.md`, `PIN.md`, `PHOTO-RESEARCH.md/.csv`). It is the only revised draft found and matches the brief, so treat it as the latest. Differences from `src/content/articles/your-first-junk-journal-spread.md` (671 words, demo):
  - Longer, 7 sections (what it is, four-job supply list, three moods, what you already have, first spread, questions, where to start) against the demo's 4 sections (raid the drawer, lay out, stick down, finish with a line).
  - Front matter is in the **old site's format** (`slug`, `metaTitle`, `heroImage`, `format: shopping-edit`, placeholder disclosure line) and must be converted to this site's fields (`description`, `status`, `format`, `hero` with all rights boxes, `picks`).
  - Product id `tombow-mono-permanent-applicator` must become `tombow-mono-permanent` (the id in this repo); one `{{product:...}}` marker and no `{{pick:...}}` card yet.
  - Links to `/hobbies/scrapbooking`, `/hobbies/collage-art` and a companion article that do not exist here: remove or replace.
  - No hero picture is cleared for it yet. Not in the repository; the demo stays published as the only article until it is replaced.
- **Products:** 3 verified (Tombow Mono; NMJL 2026 large-print and standard four-packs). Rifle sticker set **on hold** (contents unconfirmed). **Open slots:** journal (Strathmore sellers not Amazon/maker), pen (Sakura listings were third-party), washi (all mt listings third-party), scissors, decorative extras.
- **Photography:** shortlist of 8 Pexels photos (IDs 1906606, 18277854, 17042499, 1261182, 8534381, 8250948, 36598106, 7014482) in `PHOTO-RESEARCH.md`. Text only was read; a person must open each for logos, readable text and faces, then approve. Pexels licence does not say whether the images pass to a buyer of the site.

## Blocking launch
1. **Repository is public** (owner wants private): owner must make it private (`docs/REPO-PRIVACY-CHECK.md`).
2. **CMS and Netlify real test not done** (`docs/OWNER-REAL-TEST.md`): Pages CMS login, rich-text keeping the markers, branch preview, Publish button, credits (135 left until 2026-12-16).
3. **Amazon account status unverified:** final approval unknown; links may be used after applying, but tracking stays off until the owner confirms eligibility and authorises launch (`docs/AMAZON-ASSOCIATES.md`). The site is not yet public and has one article.
4. **No second article or real photography;** AI-picture rights unverified (`docs/IMAGE-RECORDS.md`).
5. Domain not connected to the live site; legal pages are drafts; name not trademark-searched.

## Old pilot drafts (`/home/user/plans-past-five/docs/editorial-reset/pilot-drafts/`)
All four are long drafts with embedded briefs, written for the old site; none has a verified product. Common blockers: product images uncleared, AI-image caption and rights unverified, no tested claims allowed, byline unresolved, Amazon disclosure and Associates status (now covered by `docs/AMAZON-ASSOCIATES.md`).

| Draft | Carry over | Retired-feature references to remove | Commercial blockers |
|---|---|---|---|
| **A01 Junk journal supplies** (about 2,400 reader words, over target; mostly superseded by the Stage 2 article) | Three moods (Shoebox Post, Garden Press, Sunday Blue; name clashes not cleared), supply logic, caveats on Strathmore "48 pages" | No quiz or directory links found. "Planner" appears only in the Rifle product name (keep out until contents confirmed) | No ASIN verified in the draft (Tombow later verified). mt washi only third-party sellers; Rifle contents (128/130/150) disputed; Strathmore, Sakura sellers unconfirmed; no product images |
| **A03 Air-dry clay** (3 projects, about 3,400 words incl. notes) | Three projects, maker-attributed drying and thickness ranges, "Tonight / +1 to 3 days" timeline idea | The "Tonight" row of the timeline strip (rename "Day 1"); any hobby-page links | All five products unverified, no ASIN/seller/stock; Galeria size conflict; step photos need a real person making the pieces; the "about a week" and "two hours" figures are editorial estimates; sealer wording conflicts between makers |
| **A05 Mahjong night** (about 2,750 words, over target) | Run of show, host guide, American-game card note; NMJL cards are now verified (2026 four-packs) | `/hobbies/mahjong` collection link; "Make Plans" host-a-night preset mentioned in its issues; tone "tonight" is ordinary wording | Sets (Mojave, Sapphire) unverified or backordered; rules need an American-mahjong player's review; 2027 card changes yearly; length needs trimming; League link vs Amazon-first question |
| **A09 Hobbies for busy women** (about 2,400 words, no products) | The three questions (energy, budget, company), the 12 hobby cards, no-claims voice | **Most affected:** "Browse the full hobby directory" and a link to every `/hobbies/<name>` page, "start-up band" data from the directory's equipment table, the "Energy tonight" column, "Tonight:" prompts, filter links. Rewrite as standalone copy linking to journal articles that exist | Links to 12 articles that do not exist here; start-up cost bands are assumptions (may read as prices); Mahjong record had wrong copy; overlaps a planned energy article; no named author |

## Owner actions needed (short list)
Make the repository private and re-check Netlify; run the real test (after 2026-12-16 if credits matter); inspect and approve the Pexels photos; confirm Associates status and say when to launch tracking.
