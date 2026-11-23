# Status

Updated 2026-11-23 against `main`. "Unverified" means nobody has confirmed it. The site is private and in preview mode; nothing is launched.

## What the repository holds today
- 5 published articles (junk journal supplies, your first junk journal spread, air-dry clay, how to host a mahjong night, hobbies for busy women), 15 built pages, 16 product records, 16 rights records and image files (see `docs/IMAGE-RECORDS.md`).
- Settings: marketplace amazon.com, tracking ID `planspastfive-20`, **tracking OFF**, **launchMode `preview`**. Neither is changed without the owner's go-ahead.
- Checks run on a clean clone (`npm ci`, `npm run check`, `npm test`, `npm audit`): build passes with 15 pages and the link check, 104 of 104 tests pass, 0 vulnerabilities. An isolated copy with `launchMode` production and tracking on also passes the content check (0 launch blockers).

## Products (16 records; 12 shown, 4 not shown)
| Product | ASIN | Status | Decision |
|---|---|---|---|
| Canson Graduate Mixed Media 5.5 x 8.5 book | B0CN7B82NG | verified | Keep (journal book, Cowork 2026-11-20) |
| Tombow MONO permanent adhesive | B000XAHF7S | verified | Keep |
| Staedtler Pigment Liner black 8-pack | B0C922C7WT | verified | Keep; smaller-set comparison pending |
| Scotch Expressions washi, abstract modern | B09HN2PR9K | verified | Keep; colour fit pending (modern, not vintage; article says so) |
| Fiskars micro-tip scissors | B0DLFLZFGK | verified | Keep (optional) |
| Tim Holtz Idea-ology Snippets | B06VTCRXBC | verified | Keep for Shoebox Post; SKU and piece-count match pending |
| Rifle Paper Co. planner stickers | B0BWSHLP2T | verified | Keep as optional accent; no count stated (listing contradicts itself) |
| DAS air-hardening clay, white, 1 kg | B001GAP4YA | verified | Keep; quantity wording is a labelled estimate |
| Winsor & Newton Galeria acrylic set | B08NJZPZG6 | verified | Keep; smaller-set comparison pending |
| Liquitex BASICS acrylic 12 | B07VSZM41G | verified | Keep (inline alternative) |
| YMI Sapphire American mahjong set | B09VGX38JV | verified | Keep; contents and stock re-check pending |
| NMJL 2026 large-print four-pack | B0GRCBQ3Y2 | verified | Keep; 2027 card replacement due (see owner guide) |
| NMJL 2026 standard four-pack | B0GRCCTYJ5 | held | Not shown |
| Strathmore 400 toned tan journal | B0767X3D34 | held | Replaced by Canson (delivery Dec 14-27) |
| Sculpd pottery kit | B09HL286VM | held | Not shown |
| Mont Marte air-hardening clay 500 g | B00Y5EOHRY | candidate | Not shown (failed link check, hold) |

The "pending" items are one Cowork batch of ASIN checks on Amazon (this project never fetches Amazon). Until it returns, nothing above is changed on a guess.

## Verified this pass
Production-mode simulation in an isolated copy, canonical URLs and titles present on every page, sitemap and robots present, security headers file present, no secrets, no stray tracking IDs, no Amazon images stored.

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
