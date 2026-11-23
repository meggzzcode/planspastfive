# Part 1 repository review, 2026-11-23

Reviewed commit: `e5d425e687eebc90dce1b1bff170177af5f2204a` (main, clean working tree, 129 tracked files).

## Scope honesty
Done: automated checks, searches, asset and product-record cross-checks (below).
NOT yet done: a line-by-line read of every source, article, workflow and doc file. Do not describe this review as exhaustive until that read is finished.

## Results
| Check | Result |
|---|---|
| `npm ci` (Node 22.23.5) | OK |
| `npm test` | 103 tests, 103 pass, 0 fail (about 115 s) |
| `npm audit` | 0 vulnerabilities |
| `npm run build` (content check, astro build, dist check) | passes; 15 pages; link check: 14 pages, every link and asset resolves, Amazon links correct |
| TODO/FIXME/placeholder search | only schema examples (`G-XXXXXXXXXX`) and a test asserting no placeholder text; none in shipped copy |
| Hardcoded tracking IDs | only `planspastfive-20` in `settings.json`; no other `-20` IDs in src/scripts |
| Secrets search | none; workflows use `github.token` only |
| Old repo references | only in `docs/STATUS.md` and `docs/REPO-PRIVACY-CHECK.md` (stale local paths `/home/user/plans-past-five`) |

## Findings to fix
1. `docs/STATUS.md` is stale (says one published article, 4 pictures, commit 09a8632, tracking not eligible). Main now has 5 articles, 16 product records, tracking IDs set.
2. `settings.json`: `launchMode` is `preview` and `amazonTrackingEnabled` is `false`. Production simulation not yet run (must be done in an isolated copy).
3. Image `junk-journal-flatlay.jpg` has an AI-illustration rights record with no `approvedOn` date (the status doc lists it as pending).
4. Three images show as not referenced by name in `src` (`clay-ring-dish-painted-blossoms.jpg`, `junk-journal-flatlay.jpg`, `weekend-picnic.jpg`); confirm whether they are really unused (STATUS says `weekend-picnic` is on About) and retire or wire them in.
5. Product records: 12 `verified`, 2 `held` (NMJL standard four-pack, Strathmore tan), 1 `held` (Sculpd), 1 `candidate` (Mont Marte, rejected in the 2026-11-20 link check). Strathmore Tan: Amazon delivery Dec 14-27, no in-stock line (2026-11-20 check). Rifle sticker set is `verified` but the Amazon listing contradicts itself (150 vs 128 stickers): wording must give no count.
6. AI-generated images: transfer-with-site rights unverified (owner terms read for Canva and Lovable; buyer transfer unconfirmed).

## Still to review line by line
Components, layouts, pages, plugins, scripts, workflows, `.pages.yml`, `netlify.toml`, `_headers`, `_redirects`, `robots.txt`, all five articles, legal pages, owner and transfer docs.
