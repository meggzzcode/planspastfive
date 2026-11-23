# Cowork batch 3: everything that needs Cowork, in one place

You are Cowork, working in the owner's logged-in browser. General rules for all parts: read-only unless a part says otherwise; no purchases, no card details, no new accounts, no changes to Amazon Associates settings, Amazon tracking stays OFF (`amazonTrackingEnabled: false`), never copy or save Amazon images, no prices, star ratings or review counts. Write "not shown" instead of guessing. If a page needs a login, captcha or country change, stop that item and say so.

Push results to branch `cowork/batch-3` only (never `main`): `docs/cowork/BATCH-3-RESULTS.csv` (Part 1, columns as in `BATCH-2-RESULTS.csv`), `docs/cowork/BATCH-3-NOTES.md` (all parts; anything not OK first), and evidence screenshots in `docs/cowork/final-check-evidence/`. Then message the owner a one-paragraph summary leading with anything not OK.

## Part 1. Amazon.com product checks (read-only)
For each, run Associates Link Checker on `https://www.amazon.com/dp/<ASIN>?tag=planspastfive-20` and copy the exact result.
1. **B08DGL3R8K** Faber-Castell Monet Water Lilies: canvas size, and exactly which paints, brushes and tools are in the box (use "From the manufacturer" and Q&A if the bullets are silent).
2. **B0D6VHXD88** JOOZ landscape with frame: is the paint acrylic or oil? Which text on the page says what (title and a bullet disagree)?
3. **B07VSZM41G** Liquitex BASICS 12: list the 12 colours if they appear anywhere (images, Q&A, "From the manufacturer"). Is there a white? A pink?
4. **B001GAP4YA** DAS 2.2 lb: any drying time or non-toxic wording in "From the manufacturer" or the brand store.
5. **B09HN34X72** Scotch Whimsical 15: describe, in your own words, the patterns and colours you can see in the listing images, and whether florals dominate. Do not use Amazon's automatic image descriptions.
6. One sold-by-Amazon or brand-sold blush or pastel washi set that is floral or botanical: ASIN, exact title, number of rolls, seller, stock, Link Checker result.

## Part 2. Associates account status (read-only, no changes)
In Associates Central, record exactly what is shown (screenshot the panels, hide payment details): account status wording (approved, under review or other); qualifying sales count and any date or "days remaining" shown; whether SiteStripe is available; whether `planspastfive.com` is listed under your websites; whether `planspastfive-20` is listed under tracking IDs. Do not click anything that edits, applies or submits.

## Part 3. Image licence transfer wording (public pages, read-only)
Read the current public terms and note, with a short quote of 15 words or fewer, anything about (a) commercial use, (b) whether generated or downloaded images can pass to a buyer of a website, (c) attribution: Canva AI Product Terms and Canva Terms of Use, Lovable Terms of Service, Pexels License. Say "not stated" where silent.

## Part 4. Real Pages CMS and Netlify test (ONLY when the owner says "run Part 4")
Follow `docs/OWNER-REAL-TEST.md` step by step, then also test the release queue (`docs/editorial/PUBLISHING-THE-BACKLOG.md`): put one ready draft in `src/content/schedule.json` on the `content-edits` branch, press **Release next article now**, confirm one article goes live and the queue skips an unready draft, then undo it. Do not switch Post automatically on. It costs Netlify credits (15 per production deploy; allowed at most 4 deploys; stop below 40 credits; credits were 118 of 1,000 on 2026-11-20, so read the Usage page first and report it). Best after the 2026-12-16 credit reset. Fill the PASS/FAIL column and the credits table in your notes. Afterwards confirm `settings.json` still has `amazonTrackingEnabled: false` and `launchMode: "preview"`.

## What is NOT for Cowork (owner only)
Applying to or changing the Associates account, paying anything, connecting the domain, a lawyer or trademark review, making the repository private, and the decision to launch or switch tracking on.
