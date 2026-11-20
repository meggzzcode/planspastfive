# Real-account test (browser only), budgeted to spend few Netlify credits

**Why:** `npm test` proves everything that can be proven on a computer. It cannot prove: the real Pages CMS login and forms, whether the rich-text editor keeps `{{product:id}}` / `{{pick:id}}` markers, how a `content-edits` preview behaves on Netlify, the Publish button, or what previews and skipped builds cost. This test settles them on a **temporary Netlify site** using the repository `meggzzcode/planspastfive` (private; see `docs/REPO-PRIVACY-CHECK.md`). Do **not** use the live domain, do **not** switch Amazon tracking on, do **not** touch the old site.

**Credits (verified 2026-11-19):** Personal plan, 1,000 a month, 15 per production deploy, 135 left until 2026-12-16 (about 9 deploys). **Best run after the 2026-12-16 reset.** Budget: 2 production deploys (30 credits) required, up to 2 more.

## One-time owner actions (exactly these)
1. GitHub: make the repository private; confirm Settings > Actions > General > Workflow permissions = Read and write; no branch protection on `main`; create branch `content-edits` from `main`.
2. Pages CMS: sign in with GitHub at app.pagescms.org and install the GitHub App for this repository.
3. Netlify (Personal team): Add new site > Import from GitHub > this repository. Build command `npm run build`, publish directory `dist`, production branch `main` (already in `netlify.toml`). **Before creating, write down the credits left from the Usage page.** Add no domain.
4. After step 7 below (measuring a skipped build), switch on Branch deploys for `content-edits` only (Project configuration > Build and deploy > Branches and deploy contexts).

## The browser sequence
| # | Step (all in the browser) | Netlify deploy? | Expected result | PASS/FAIL | Notes |
|---|---|---|---|---|---|
| 1 | Open Pages CMS, repository, branch **content-edits** (find the branch control). Do Articles, Products and Site settings load? | No | All three load; note any `.pages.yml` error text | | how the branch is chosen: |
| 2 | Edit the demo article: add a sentence in the rich-text editor, Save (still Published). Then open the file on GitHub (branch `content-edits`) and look at the `{{product:...}}` / `{{pick:...}}` markers. | Branch deploy if on (cost unknown) | One commit on `content-edits`; `main` unchanged; **markers survive unchanged** (if altered: note exactly how, and whether the source view avoids it) | | marker result: |
| 3 | Change Top picture to a new upload; fill all boxes. | No | File in `public/images/`; note the exact text stored in `hero.image` | | stored value: |
| 4 | Add a Candidate product; set another to Discontinued with Replaced by = a new Verified one (with date and source). | No | Valid `<id>.json`; empty boxes do not break anything | | |
| 5 | Site settings: change the tracking ID text, leave tracking **off**. | No | Commit on `content-edits` | | |
| 6 | **Skipped build:** on GitHub's website edit README on `main` (message without `[deploy]`). Watch Netlify Deploys and the Usage page. | Skipped (cost unknown) | Deploy shows **Skipped**; **record credits used** | | before/after: |
| 7 | Turn on Branch deploys for `content-edits` (owner action 4). Save a small edit in Pages CMS. Open the branch preview (Netlify > Deploys > Branch deploys; `content-edits--<site>.netlify.app`). | Branch deploy (cost unknown) | Preview shows your edit; **record minutes taken and credits used** | | preview URL, credits: |
| 8 | **First production deploy:** on GitHub's website create a commit on `main` with `[deploy]` in the message (for example edit README, message "First test publish [deploy]"). | **Yes** | One build; the temporary `*.netlify.app` address loads; **record credits** | | credits: |
| 9 | **Publish button:** Pages CMS > **Publish site** > confirm. | **Yes** | Actions run green; `main` has a merge commit "Publish: content edits [deploy]"; one Netlify build; the edit is live; `content-edits` level with `main` | | credits; did it need the `payload` box? |
| 10 | **Failing publish:** on `content-edits` remove a published article's picture description, Save, press Publish site. | No (Actions only) | Red run naming file and field; `main` unchanged; no production build | | |
| 11 | Fix it (or recreate `content-edits` from `main`). | | | | |
| 12 | **Rollback:** Netlify Deploys > the earlier deploy > **Publish deploy**. | No credits expected | Old version live; **record credits** | | credits: |
| 13 | **Undo without a build:** GitHub > Actions > Undo last publish > Run workflow, untick "Also build". | No | "Undo..." commit on `main` without `[deploy]`; build skipped | | |
| 14 | **Optional, failed build:** with branch deploys on, make an edit that breaks the check on `content-edits`. | Possibly | Netlify build fails; live site untouched; **record credits** | | credits: |

## Credits used (fill in from Netlify's Usage page)
| Event | Before | After | Used |
|---|---|---|---|
| Skipped build (6) | | | |
| Branch deploy / preview (7) | | | |
| Production deploy (8) | | | (15 expected) |
| Production deploy via Publish (9) | | | |
| Rollback (12) | | | (0 expected) |
| Failed build (14, optional) | | | |

**Decision after measuring:** if a branch preview costs credits (each CMS save is a commit and so a preview build), turn Branch deploys off again and fall back to the developer appendix in `docs/OWNER-OPERATIONS.md` (local preview, no credits) or edit and publish in fewer, bigger batches.

## Also record
Exact `.pages.yml` errors, what the picture field stores, whether the rich-text editor keeps the markers, how branch switching works in the Pages CMS screen, whether Publish worked first time, whether the `ignore` rule behaved as `test/workflows.test.mjs` predicts, and whether Netlify's "Trigger deploy" button honours `[deploy]`.

## Teardown (after the test)
1. Netlify: Site configuration > General > **Delete this site** (credits spent stay spent), or Stop builds.
2. GitHub: if keeping the repository, delete the `content-edits` branch and recreate it from `main`.
3. Pages CMS / GitHub: remove the app's access if you are not keeping the repository.
4. Confirm `settings.json` still has `amazonTrackingEnabled: false`.

*Fallback host, not part of this test:* `dist/` is plain static files and also works on Cloudflare Pages (`public/_redirects` and `public/_headers` use syntax both document; behaviour on Cloudflare UNVERIFIED).
