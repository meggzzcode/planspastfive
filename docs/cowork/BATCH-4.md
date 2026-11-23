# Cowork batch 4: everything still needing live access

Batch 3 Part 1 (Amazon product checks) is done; its results are in `BATCH-3-RESULTS.csv` and `BATCH-3-NOTES.md`. This file is the **only** remaining Cowork list. Nothing here needs more writing from Claude Code.

You are Cowork, in the owner's logged-in browser. General rules: read-only unless a part says otherwise; no purchases, no adding to cart, no card details, no new accounts, no changes to Amazon Associates settings; tracking stays OFF (`amazonTrackingEnabled: false`) and `launchMode` stays `preview`; never copy or save Amazon images; no prices, ratings or review counts. Write "not shown" instead of guessing. If something needs a login, captcha or country change, stop that item and say so.

Push to branch `cowork/batch-4` only (never `main`): `docs/cowork/BATCH-4-NOTES.md` (all parts, anything not OK first, each item marked PASS, FAIL or NOT DONE with the exact text or screenshot name) and screenshots in `docs/cowork/final-check-evidence/`. Then message the owner a one-paragraph summary leading with anything not OK.

## Part A. Live look at the preview site (read-only; no credits)
Open the Netlify branch preview `https://preview--plans-past-five.netlify.app` (sign in with the owner's Netlify login if asked). First confirm it is current: open Netlify > Deploys > Branch deploys and note the commit shown for `preview` (it should match `main` on GitHub; record both short SHAs).
At **desktop width (about 1280)** and **phone width (about 390; use the browser's device mode)**, scroll top to bottom on: Home, The Journal, each of the five articles (Junk Journal Supplies, Your First Junk Journal Spread, Air-Dry Clay, How to Host a Mahjong Night, Hobbies for Busy Women), The Shop, About, Affiliate Disclosure, Privacy, Terms. For each page report:
1. Do all images load (no empty boxes)? Any text overlapping, cut off, or too small to read? Any sideways scrolling on the phone?
2. Is the disclosure sentence present before the first product link, and does the footer say links are ordinary and earn nothing yet (tracking is off)?
3. On the Shop: do the three shelves (Paper, Creative, Hosting) and the Cozy shelf read clearly? Is the main pick obviously the main pick, and do the "choose one" alternatives look secondary? Does each card show its label, "In the box" line and "Worth knowing" line? Anything confusing?
4. On each article: does "See the whole kit in our Shop" go to the right shelf (the page scrolls to it)? Do the "Our picks from this story" cards match what the article recommended?
5. Click every **See It on Amazon** button once (it opens a new tab; do NOT add to cart or buy). Record for each: the product name on our card, the Amazon page title you land on, and whether the address is plain `amazon.com/dp/<ASIN>` with **no** `tag=` (expected while tracking is off). Report any mismatch or "currently unavailable" page.
6. Take one phone screenshot each of Home, the junk journal article's closing section, and the Shop's paper shelf.
Also give an honest reader's impression in three sentences: would a woman looking for an after-work hobby stay, and would she click a product?

## Part B. Associates account status (read-only)
In Associates Central record exactly what is shown (screenshot the panels; hide payment details): account status wording (approved, under review or other); qualifying sales count and any date or days remaining; whether SiteStripe is available; whether `planspastfive.com` is listed under websites; whether `planspastfive-20` is listed under tracking IDs. Do not click anything that edits, applies or submits.

## Part C. Image licence transfer wording (public pages, read-only)
Read the current public terms and note, with a quote of 15 words or fewer, anything about (a) commercial use, (b) whether generated or downloaded images can pass to a buyer of a website, (c) attribution: Canva AI Product Terms and Canva Terms of Use; Lovable Terms of Service; Pexels License. Say "not stated" where silent.

## Part D. Real Pages CMS, publish and release-queue test (ONLY when the owner says "run Part D"; costs Netlify credits)
Follow `docs/OWNER-REAL-TEST.md` step by step (read the Usage page first and report credits; at most 4 production deploys; stop below 40 credits; best after the 2026-12-16 reset). Fill its PASS/FAIL column and credits table in your notes. Then also test the release queue (`docs/editorial/PUBLISHING-THE-BACKLOG.md`): confirm the **Release next article now** button and the **Release queue** form appear in Pages CMS; confirm the "Release next article" workflow is listed under GitHub Actions; on the `content-edits` branch only, check that pressing the button with an empty queue reports nothing to release and changes nothing. Do not switch **Post automatically** on. Afterwards confirm `settings.json` still has `amazonTrackingEnabled: false` and `launchMode: "preview"`, and `schedule.json` has `enabled: false`.

## Not for Cowork (owner only)
Applying to or changing the Associates account, paying anything, connecting the domain, a lawyer or trademark review, making the repository private, and the decision to launch or switch tracking on.
