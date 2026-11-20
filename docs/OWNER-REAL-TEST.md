# Real-account test (browser only, one page)

**Purpose:** `npm test` cannot prove the real Pages CMS login and forms, how the rich-text editor treats `{{product:id}}` and `{{pick:id}}` markers, how a `content-edits` preview behaves, the Publish button, or what non-production builds cost. This test settles them. Repository: private (`docs/REPO-PRIVACY-CHECK.md`). Do **not** change the domain, switch Amazon tracking on, or touch the old site.

**Netlify facts (verified by Cowork 2026-11-20 in the owner's account):** the Netlify project builds from this repository (linked 2026-11-20; the link triggered one production build of `main` 4ab3cc4, 15 credits). Credits now **118 of 1,000 until 2026-12-16**; a production deploy costs 15. Cost of a skipped build, a preview and a branch deploy is **NOT measured**. The live site is still private (401); the domain is unchanged.

## Accounts needed
GitHub (owner of the repository), Pages CMS (app.pagescms.org, signed in with GitHub), Netlify (Personal team). Nothing else.

## One-time setup
1. Pages CMS: install the Pages CMS GitHub App on this repository.
2. GitHub > Settings > Actions > General > Workflow permissions = **Read and write**. No branch protection on `main`.
3. Create branch `content-edits` from `main` (GitHub branch menu).
4. Netlify **Branch deploys stay OFF** until step 6 has measured what a skipped build costs.
5. Write down credits left (Netlify > Usage) before step 1.

## Budget
Target **2 production deploys** (30 credits: steps 7 and 8). Allowed up to **4** (60 credits, leaving about 58). Stop and report if credits fall below 40. Everything marked "No" below should cost nothing but is unmeasured, so check Usage before and after each step marked "measure".

## Steps
| # | Step (browser only) | Deploy? | Expected result | Unverified | PASS/FAIL | Record |
|---|---|---|---|---|---|---|
| 1 | Pages CMS > repository > choose branch `content-edits`. Do Articles, Products, Site settings open? | No | All three load | **Branch picker** | | how the branch was chosen; any `.pages.yml` error text |
| 2 | Open the demo article; add a sentence in the rich-text editor; Save. On GitHub (branch `content-edits`) open the file and read the `{{product:...}}` and `{{pick:...}}` markers. | No (branch deploys off) | One commit on `content-edits`; `main` unchanged; **markers unchanged** | **Rich text editor preserving markers** | | exact marker text after saving; if altered, does source view avoid it |
| 3 | Change a Top picture to an upload (picture and description). | No | File in `public/images/` | | | stored `hero.image` value |
| 4 | Add a Candidate product; set one product to Discontinued with Replaced by. | No | Valid product file | | | any error |
| 5 | **Measure skipped build:** on GitHub edit README on `main` with a message without `[deploy]`. Credits before/after. | Skipped | Netlify shows **Skipped** | Skipped-build cost | | credits used |
| 6 | Turn Branch deploys on for `content-edits` only. Save a small CMS edit. Open the preview (`content-edits--<site>.netlify.app`). Credits before/after. | Branch deploy | Preview shows the edit | **Preview** (address form and cost) | | minutes, credits, preview URL. **If credits are spent, turn Branch deploys off again.** |
| 7 | **Production deploy 1:** on GitHub commit to `main` with `[deploy]` in the message ("Test publish [deploy]"). Credits before/after. | **Yes (15)** | One build; temporary `*.netlify.app` address loads | | | credits |
| 8 | **Publish button:** Pages CMS > Publish site > confirm. | **Yes (15)** | Green Actions run; merge commit "Publish: content edits [deploy]" on `main`; one build; edit live; `content-edits` level with `main` | **Publish button** (and whether the `payload` box was needed) | | credits |
| 9 | **Failing publish:** on `content-edits` remove a published article's picture description; Save; Publish site. | No | Red run naming file and field; `main` unchanged; no build | | | error text |
| 10 | Recreate `content-edits` from `main` (or fix the field). | No | Branches level | | | |
| 11 | **Rollback:** Netlify Deploys > earlier deploy > Publish deploy. | No (expected 0) | Earlier version live | | | credits |
| 12 | **Undo without a build:** GitHub > Actions > Undo last publish > Run workflow, untick "Also build". | No | "Undo..." commit on `main`, build skipped | | | |

Production deploys 3 and 4 are spares for retrying step 7 or 8; do not use them for anything else.

## Credits measured
| Event | Before | After | Used |
|---|---|---|---|
| Skipped build (5) | | | |
| Branch deploy / preview (6) | | | |
| Production deploy (7) | | | 15 expected |
| Publish production (8) | | | 15 expected |
| Rollback (11) | | | 0 expected |

## Rollback and cleanup
Live problem: Netlify Deploys > earlier good deploy > Publish deploy (about 0 credits expected, step 11 measures it), then Undo last publish (untick "Also build"), then delete and recreate `content-edits` from `main`. Afterwards confirm `settings.json` has `amazonTrackingEnabled: false`.

## Decision after measuring
If a branch preview or skipped build costs credits, keep Branch deploys off and preview locally (`docs/OWNER-OPERATIONS.md`, developer appendix, no credits), and publish in fewer, bigger batches.

## What to record
The PASS/FAIL column, credits table, preview URL, exact marker text after the editor saves, branch-picker behaviour, exact errors, whether Publish worked first time, and whether Netlify's "Trigger deploy" honours `[deploy]`. Send them in the chat.
