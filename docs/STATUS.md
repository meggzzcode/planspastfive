# Status (working checklist)

Updated 2026-11-20. "UNVERIFIED" means nobody has confirmed it.

## Finished (in `main` 09a8632)
- **Foundation:** Astro site, content checks, link checks, tests, CMS configuration, publish and undo workflows, legal pages, 4 illustrative pictures. Proven on a computer only (`npm test`).
- **WP1 code corrections:** `launchMode` (preview or production); product statuses candidate, provisional, verified, held, discontinued with explicit evidence fields and an editorial decision and order; one rights record per picture in `src/content/images.json`; captions chosen by picture kind; the price rule (budget estimates allowed in article prose, no product prices, no sale/discount/coupon/deal wording); the shopping note placed before the first product link and worded by tracking state.
- **Test isolation:** tests run against fixtures under `test/fixtures/`, not the shipped content, so changing real products or pictures does not break them.
- **Stage 2 article added as a draft:** `src/content/articles/junk-journal-supplies-for-beginners.md` ("Junk Journal Supplies for Beginners", `status: draft`, so it is not on the site). Its hero is the interim AI picture and must be replaced before publishing.
- **Demo article refocused:** `your-first-junk-journal-spread.md` is now a "three layouts" starter guide; the supplies advice lives in the Stage 2 article. It is the only published article.
- **Legacy hero lines removed:** the old `credit`, `source`, `licence` and `rights: cleared` lines were deleted from both articles. Rights now live only in `images.json`.
- **Docs:** costs, risks, transfer, image records, owner operations (browser first; now covers launch mode, product evidence, picture records, price rule, disclosure), real-test plan, Amazon explainer, repo privacy check.

## Partly finished
- **Stage 2 article** (the draft above; working notes remain in `/home/user/ppf-wt/_stage2/`: `PRODUCTS-SLOTS.md`, `IMAGES.md`, `PIN.md`, `PHOTO-RESEARCH.md/.csv`). Still to do before it can publish: a hero picture with an approved record (not the interim AI picture), and a check that its product slots and links are right. It has one product pick (`tombow-mono-permanent`) and links to the demo article.
- **Products:** 3 are `provisional` (Tombow Mono; NMJL 2026 large-print and standard four-packs). They are checked but lack `affiliateLinkEligible` = yes, `specsEvidence` and `suitability`, so they show only in preview mode. Rifle sticker set **on hold** (contents unconfirmed). **Open slots:** journal (Strathmore sellers not Amazon/maker), pen (Sakura listings were third-party), washi (all mt listings third-party), scissors, decorative extras.
- **Photography:** shortlist of 8 Pexels photos (IDs 1906606, 18277854, 17042499, 1261182, 8534381, 8250948, 36598106, 7014482) in `PHOTO-RESEARCH.md`. Text only was read; a person must open each for logos, readable text and faces, then approve. Pexels licence does not say whether the images pass to a buyer of the site.

## Production blockers right now (`launchMode` is `preview`)
Rule (WP-TEC): in production, unused provisional/candidate products are left out silently (info line only); a provisional product used by a published article blocks. Verified on the real content: production now fails only on the 4 pending pictures (the one published article uses Tombow, which is verified).
The build log prints these as a LAUNCH WARNING. In `production` mode each would fail the build.
- **Provisional products:** none block (11 unused research products are ignored in production, including the two NMJL 2026 packs).
- **4 pending pictures:** `girls-night-crafts` and `cozy-corner` (home), `weekend-picnic` (about), `junk-journal-flatlay` (demo article). All AI-generated; commercial use unverified; most lack source address, licence and approval date.
- Owner step when ready: switch `launchMode` to `production` (`docs/OWNER-OPERATIONS.md`). Nothing yet ties the Netlify production deploy to this setting, so it is a manual step.

## Blocking launch
1. **Repository is public** (owner wants private): owner must make it private (`docs/REPO-PRIVACY-CHECK.md`).
2. **CMS and Netlify real test not done** (`docs/OWNER-REAL-TEST.md`): Pages CMS login, rich-text keeping the markers, branch preview, Publish button, credits (135 left until 2026-12-16).
3. **Amazon account status unverified:** final approval unknown; links may be used after applying, but tracking stays off until the owner confirms eligibility and authorises launch (`docs/AMAZON-ASSOCIATES.md`). The site is not yet public and has one article.
4. **Only one published article and no real photography;** AI-picture rights unverified (`docs/IMAGE-RECORDS.md`); the second article is still a draft.
5. Domain not connected to the live site; legal pages are drafts; name not trademark-searched.

## Old pilot drafts (`/home/user/plans-past-five/docs/editorial-reset/pilot-drafts/`)
All four are long drafts with embedded briefs, written for the old site; none has a verified product. Common blockers: product images uncleared, AI-image caption and rights unverified, no tested claims allowed, byline unresolved, Amazon disclosure and Associates status (now covered by `docs/AMAZON-ASSOCIATES.md`).

| Draft | Carry over | Retired-feature references to remove | Commercial blockers |
|---|---|---|---|
| **A01 Junk journal supplies** (about 2,400 reader words, over target; mostly superseded by the Stage 2 article) | Three moods (Shoebox Post, Garden Press, Sunday Blue; name clashes not cleared), supply logic, caveats on Strathmore "48 pages" | No quiz or directory links found. "Planner" appears only in the Rifle product name (keep out until contents confirmed) | No ASIN verified in the draft (Tombow later checked, now provisional). mt washi only third-party sellers; Rifle contents (128/130/150) disputed; Strathmore, Sakura sellers unconfirmed; no product images |
| **A03 Air-dry clay** (3 projects, about 3,400 words incl. notes) | Three projects, maker-attributed drying and thickness ranges, "Tonight / +1 to 3 days" timeline idea | The "Tonight" row of the timeline strip (rename "Day 1"); any hobby-page links | All five products unverified, no ASIN/seller/stock; Galeria size conflict; step photos need a real person making the pieces; the "about a week" and "two hours" figures are editorial estimates; sealer wording conflicts between makers |
| **A05 Mahjong night** (about 2,750 words, over target) | Run of show, host guide, American-game card note; NMJL cards are now verified (2026 four-packs) | `/hobbies/mahjong` collection link; "Make Plans" host-a-night preset mentioned in its issues; tone "tonight" is ordinary wording | Sets (Mojave, Sapphire) unverified or backordered; rules need an American-mahjong player's review; 2027 card changes yearly; length needs trimming; League link vs Amazon-first question |
| **A09 Hobbies for busy women** (about 2,400 words, no products) | The three questions (energy, budget, company), the 12 hobby cards, no-claims voice | **Most affected:** "Browse the full hobby directory" and a link to every `/hobbies/<name>` page, "start-up band" data from the directory's equipment table, the "Energy tonight" column, "Tonight:" prompts, filter links. Rewrite as standalone copy linking to journal articles that exist | Links to 12 articles that do not exist here; start-up cost bands are assumptions (may read as prices); Mahjong record had wrong copy; overlaps a planned energy article; no named author |

## Owner actions needed (short list)
Make the repository private and re-check Netlify; run the real test (after 2026-12-16 if credits matter); inspect and approve the Pexels photos; confirm Associates status and say when to launch tracking.
