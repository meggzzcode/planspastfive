# Cowork batch 5: what is left, plus checks for the new drafts

Replaces the open items in `BATCH-4.md`. Same rules as BATCH-4 (browse Amazon.com and other sites in the owner's logged-in browser; read-only; no purchases, no cart, no payments, no new accounts; never copy or save Amazon images; no prices, ratings or review counts; write "not shown" instead of guessing; ask the owner when a step needs a sign-in or approval and stop that step). **This repository is PUBLIC: never write a personal email address, login name, account or property names belonging to other businesses, phone numbers, payment details, order numbers or credentials into a note, file, screenshot or commit message. Say "the owner's Google account". Redact screenshots before saving.** Tracking is ON in the settings (`planspastfive-20`, owner decision 2026-11-23) and `launchMode` stays `preview`; change neither.

Push to branch `cowork/batch-5` only (never `main`): `docs/cowork/BATCH-5-NOTES.md` (each item PASS, FAIL, BLOCKED or NOT DONE with exact text) and, for Part 3, `docs/cowork/BATCH-5-RESULTS.csv` with the columns of `BATCH-3-RESULTS.csv`. Screenshots go in `docs/cowork/final-check-evidence/`. Message the owner a one-paragraph summary leading with anything not OK.

## Part 1. Retry: image licence wording (public pages, read-only)
The earlier attempt waited on an approval nobody answered. Read the current public terms and note, with a quote of 15 words or fewer, anything about (a) commercial use, (b) whether generated or downloaded images can pass to a buyer of a website, (c) attribution: Canva AI Product Terms and Canva Terms of Use; Lovable Terms of Service; Pexels License. Say "not stated" where silent.

## Part 2. Retry: the launch-readiness items that were blocked
The owner will sign in to Namecheap first; if the tab still shows a login page, stop and say so.
1. Namecheap (read-only): domain status, expiry date, auto-renew, lock, nameservers, and every DNS record (list them; edit nothing). Does the mailbox for `hello@planspastfive.com` exist in the control panel?
2. GitHub (read-only): Settings, Actions, General, Workflow permissions (should be Read and write); the three workflows `Publish content`, `Undo last publish`, `Release next article` listed and enabled.
3. Netlify (read-only): the date and commit of the last production deploy attempt and the last successful one; whether branch deploys for `preview` are enabled; credits left.

## Part 3. Verify the products the new drafts may need (Amazon.com, read-only)
These come from the research briefs in `docs/editorial/briefs/`. For each: find the best match yourself, report ASIN, exact title, variant, contents as listed, sold by, ships from, stock, the Associates Link Checker result for `https://www.amazon.com/dp/<ASIN>?tag=planspastfive-20`, and a verdict (ADD main pick / alternative / REJECT). Apply the shop rule: sold by Amazon.com or the brand, nothing third-party, and only things a typical reader would not already own.
1. **Picnic (insulated bag):** a soft insulated cooler bag for two to four people with a sealed wipe-clean liner, zip closure, handles or shoulder strap. Report the stated capacity as listed. Do not repeat any "keeps cold for N hours" marketing claim; record it only as a quote.
2. **Picnic (ice packs):** a reusable gel ice pack set that fits flat in that bag; note whether the listing states a non-toxic filling.
3. **Picnic (blanket):** a waterproof-backed picnic blanket large enough for three or four adults, machine washable, folds small. Only if sold by Amazon or the brand.
4. **Paint by numbers (a third kit):** one more beginner-friendly adult paint-by-numbers kit in a floral or town scene on a 10 x 8 in or similar canvas that includes an easel or frame, acrylic not oil, with a stated colour count. Sold by Amazon or the brand.
5. **Claim checks on kits already in the catalog**, for statements the paint-by-numbers draft makes from a retailer page: Faber-Castell Monet `B08DGL3R8K`: does the Amazon listing or maker section say the canvas has pre-printed brush strokes, and does it describe wet-on-wet painting or washes? How many paint pots and which colours? JOOZ landscape `B0D6VHXD88`: canvas size as listed, number of paints or colours, brush count, frame and easel contents. Quote each statement exactly; say "not shown" if absent.
(Candidates for the walking-club and other batch 1 drafts will be added when their briefs are final.)

## Part 4. Still owner-gated, do NOT do unless the owner says so in the message that starts this task
Part D of BATCH-4 (real Pages CMS, publish and release-queue test; costs Netlify credits), Part G (launch runbook), Bundle Lists steps 9 to 11. Amazon Lists are not being used (decision 2026-11-23).

## Not for Cowork (owner only)
Deleting the `cowork/batch-4` branch (it holds personal account details; the notes are summarized in `docs/STATUS.md`; GitHub, then Branches, then the bin icon), deleting the private test List in the Amazon account, applying to or changing the Associates account, paying anything, connecting the domain, legal or trademark review, making the repository private, and the decision to launch.
