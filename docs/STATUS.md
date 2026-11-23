# Status

Updated 2026-11-23 against `main`. "Unverified" means nobody has confirmed it. The site is private and in preview mode; nothing is launched.

## What the repository holds today
- 5 published articles (junk journal supplies, your first junk journal spread, air-dry clay, how to host a mahjong night, hobbies for busy women), 15 built pages, 20 product records, 17 rights records and image files (see `docs/IMAGE-RECORDS.md`).
- Settings: marketplace amazon.com, tracking ID `planspastfive-20`, **tracking ON** (owner decision 2026-11-23; set in `main` and `preview` only, the production site was not rebuilt and still has the old build), **launchMode `preview`** (changed only at launch). With tracking on, every shown product must stay `affiliateLinkEligible: yes`; a future `[deploy]` commit puts tagged links on the production site.
- Checks run on a clean clone (`npm ci`, `npm run check`, `npm test`, `npm audit`): build passes with 15 pages and the link check, 134 of 134 tests pass, 0 vulnerabilities. An isolated copy with `launchMode` production and tracking on also passes the content check (0 launch blockers).

## Products (20 records; 14 shown, 6 not shown)
Rule (owner, 2026-11-23): the shop pushes only what the activity needs that most readers would not already own. Scissors and ordinary tape are not sold; washi is an optional extra.

| Product | ASIN | Status | Role and decision |
|---|---|---|---|
| Canson Graduate Mixed Media 5.5 x 8.5 book | B0CN7B82NG | verified | Junk Journal Starter Bundle, Start here |
| Tombow MONO permanent adhesive | B000XAHF7S | verified | Junk Journal Starter Bundle, Start here |
| Staedtler Pigment Liner black 3-pack | B0C4VRJ1XP | verified | Junk Journal Starter Bundle, Start here (new; beginner starter, sold by Amazon) |
| Staedtler Pigment Liner black 8-pack | B0C922C7WT | verified | Choose-one alternative ("Larger set") |
| Scotch Expressions washi, Whimsical 15 rolls | B09HN34X72 | verified | Optional extra. Cowork (batch 3): a warm, busy mix of stripes, leaves, leopard print and foil; florals are a minority, so it is described as playful, not romantic |
| Scotch Expressions washi, Abstract Modern 8 rolls | B09HN2PR9K | verified | Choose-one alternative ("Different style"); listing names no colours |
| Tim Holtz Idea-ology Snippets | B06VTCRXBC | verified | Optional extra for Shoebox Post; SKU TH93564 and 111 pieces confirmed |
| DAS air-hardening clay, white, 2.2 lb | B001GAP4YA | verified | Air-Dry Clay Starter Bundle, Start here; listing gives no drying time or non-toxic wording, so the article does not claim them |
| Winsor & Newton Galeria 20 x 12 ml | B08NJZPZG6 | verified | Air-Dry Clay Starter Bundle, Start here; includes white, pale rose blush, pale lemon, olive green and red |
| Liquitex BASICS 12 x 22 ml | B07VSZM41G | verified | Choose-one alternative ("Mix-your-own"); 12 colours read from the chart (has white, no pink) |
| YMI Sapphire American mahjong set | B09VGX38JV | verified | Host Your First Mahjong Night bundle; listing confirms tiles, 4 racks with pushers, dice, scoring coins and a zippered blue case |
| NMJL 2026 large-print four-pack | B0GRCBQ3Y2 | verified | Host Your First Mahjong Night bundle; 2026 edition, no 2027 edition mentioned; replace each year |
| Fiskars micro-tip scissors | B0DLFLZFGK | held | Removed: people already own scissors |
| Rifle Paper Co. planner stickers | B0BWSHLP2T | held | Removed: bright, playful, many text labels, not vintage-botanical; count contradicts itself |
| Strathmore 400 tan journal | B0767X3D34 | held | No in-stock line, delivery Dec 12-23; replaced by Canson |
| NMJL 2026 standard four-pack | B0GRCCTYJ5 | held | Not shown |
| Sculpd pottery kit | B09HL286VM | held | Not shown |
| Mont Marte clay 500 g | B00Y5EOHRY | candidate | Not shown |
| Faber-Castell Monet Water Lilies paint-by-numbers | B08DGL3R8K | verified | Cozy Paint Night Bundle, Start here: 6 x 8 in canvas, six acrylic pots, one brush, easel, guide |
| JOOZ landscape paint-by-numbers with frame | B0D6VHXD88 | verified | Cozy Paint Night Bundle, "Larger set" choice: 8 x 12 in canvas, wooden frame and easel, acrylic (only the title says oil) |

Floral washi: Whaline 24 rolls (B0GYSNFN78) looks right but is sold by a third party and low stock, so it is not added; no sold-by-Amazon blush floral set was found. DAS: the listing and manual give no drying time or non-toxic wording, so the site makes no such claim.

Checked and rejected in batch 2 (third-party sellers or unclear): the three ephemera packs, Jovi 1.1 lb and 2.2 lb, Dimensions embroidery kits, Strathmore 500 hardcover, Strathmore gray (Hyatt's). On hold: Jovi 4-pack (8.8 lb), Crayola 5 lb. Strathmore 400 white spiral (B0F97VF4HX) is sold by Amazon but its paper weight is not shown, so it is not added.

Cowork batch 2 and 3 results: `docs/cowork/BATCH-2-RESULTS.csv` and `BATCH-2-NOTES.md`, `BATCH-3-RESULTS.csv`, `BATCH-3-NOTES.md` (branches `cowork/batch-2`, `cowork/batch-3`). Everything still needing Cowork is in `docs/cowork/BATCH-4.md` (live preview review, Associates status read, image-terms wording, real CMS and Netlify test, Google Analytics setup, launch-readiness audit and the launch runbook).

## Verified this pass
Production-mode simulation in an isolated copy, canonical URLs and titles present on every page, sitemap and robots present, security headers file present, no secrets, no stray tracking IDs, no Amazon images stored.

## Release queue (optional, added 2026-11-23)
- `src/content/schedule.json` holds an optional release queue. Automatic posting is **OFF** and the queue is **empty**. The five published articles are the whole library; no further drafts are stored (owner decision: finish and approve these five first).
- Buyer guide: `docs/editorial/PUBLISHING-THE-BACKLOG.md`. Logic is tested (`test/release.test.mjs`); the GitHub workflow `release-next.yml` has not run on GitHub yet (Cowork batch 3 Part 4).

## Ready-to-Start Bundles (renamed from shelves, 2026-11-23)
The Shop's main section is **Ready-to-Start Bundles**: our curated collections of individually sold products (not prepackaged boxes). Four are live: Junk Journal Starter Bundle, Air-Dry Clay Starter Bundle, Cozy Paint Night Bundle, Host Your First Mahjong Night. Each shows what is in it, what you probably already own, choose-one alternatives and optional extras. Product names that contain "kit" (a paint-by-numbers kit) are unchanged.
**"Shop the Full Bundle on Amazon" is NOT shown.** A public Amazon List destination and its commission eligibility are unverified: official pages checked on 2026-11-23 neither allow nor forbid a tagged link from our site to a List (`docs/SHOPPING-STRATEGY.md`). The live verification assignment for Cowork is `docs/cowork/AMAZON-BUNDLE-LISTS-LIVE-VERIFICATION.md`.

## Cowork batch 4 results (2026-11-23; full notes on branch `cowork/batch-4`, which contains personal account details, so they are not copied here)
- **Live preview review (Part A): PASS** with minor notes (a few small phone tap targets, since enlarged; legal-page date, now updated). Phone checked at 390 px by frame.
- **Associates (Part B): PASS.** Account active, `planspastfive.com` on the website list, `planspastfive-20` unchanged. A payment-related banner is shown on the Associates home page; the owner should open it.
- **Google Analytics (Part E): set up.** GA4 property "Plans Past Five" with a web stream for `https://planspastfive.com`; **Measurement ID `G-NEQH28N9NG`** (not secret). Google signals OFF, event retention 14 months, Enhanced measurement ON, no data sharing; Google Analytics terms were accepted. **Not on the site yet** (`ga4MeasurementId` is empty): add it at launch only. Google required an industry (Home & Garden), size (small) and objective (understand traffic); the owner can change them in Admin.
- **Launch-readiness audit (Part F): PARTIAL.** Netlify project is private with the domain attached; production deploys show "Canceled" by design (the `[deploy]` rule). The repository is **public** (owner decision). No Search Console property exists yet. Pinterest account verified. **Blocked:** Namecheap DNS, nameservers, expiry and lock (needs the owner to sign in again; Cowork left that tab on a login page); GitHub workflow permissions.
- **Not done:** Part C (image licence wording) needs a retry; Part D (real CMS and Netlify test, costs credits) and Part G (launch) are owner-gated.
- **Amazon Lists (Part H): recommendation is not to use Lists** (below).

## Open items from Cowork's work (reviewed 2026-11-23)
- **Privacy:** `cowork/batch-4` (public) contains the owner's personal Google account email and names of other Analytics accounts in `docs/cowork/BATCH-4-NOTES.md`. It is not in `main`. Owner decision needed: delete that branch (a sanitized summary is already in this file) and consider that GitHub may keep the commit viewable by its address for a while.
- Owner to: delete the private test List in the owner's Amazon account (`PPF test, Junk Journal Starter Bundle`); sign in again to Namecheap (Cowork left that tab on a login page); open the Associates payment banner; confirm the Google Analytics industry, size and objective choices.
- Cowork to retry: Part C (image licence wording) and the blocked Part F items (Namecheap DNS records, GitHub workflow permissions, last Netlify production deploy date).
- Still owner-gated: Part D (real CMS and release-queue test, costs credits), Part G (launch), Bundle Lists steps 9 to 11 (not needed now, since the decision is not to use Lists).

## Blocking launch (owner-gated)
1. Real Pages CMS and Netlify test (`docs/OWNER-REAL-TEST.md`), best after 2026-12-16 because of Netlify credits.
2. Amazon Associates: owner confirms status and says when to switch tracking on; Amazon commission is confirmed only in Associates reports.
3. Image transfer rights: Canva, Lovable and Pexels terms do not clearly say the images pass to a buyer (marked unverified). Replacement steps are in `docs/IMAGE-RECORDS.md`.
4. Domain connection, legal pages reviewed by a lawyer, name not trademark-searched, repository still public by owner decision (see `docs/REPO-PRIVACY-CHECK.md`).
5. No product photos until the Amazon Creators API is approved (owner decision, 2026-11-23): cards stay text-only.

## Owner decisions on record
- Articles and products stay editable until the sale is final (2026-11-23).
- American mahjong rules in the article: owner confirmed they are good; an expert-player review (`docs/MAHJONG-EXPERT-REVIEW-REQUEST.md`) is optional.
- Canva and Lovable terms read by the owner and the images approved on that reading (2026-11-20); transfer-with-site left unverified.
