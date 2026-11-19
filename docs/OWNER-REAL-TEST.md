# Real-account test (owner or Cowork), budgeted to spend as few Netlify credits as possible

**Why:** everything that can be proven on a computer is proven by `npm test`. These things cannot: Pages CMS login and forms, a real Netlify build and its `[deploy]` rule, and a real GitHub Actions run. This test settles them on a **temporary Netlify site** and the **new private repository** (suggested: `github.com/<owner>/planspastfive`). Do **not** use the live domain, do **not** switch Amazon tracking on, do **not** touch the old site.

**Credits (verified 2026-11-19):** Personal plan, 1,000 credits a month, 15 per production deploy; 135 left until Dec 16 (about 9 deploys). The test site lives in the same team, so it spends the same credits. **Recommended: run this after the Dec 16 reset.** It can run earlier (the budget below is 2 to 4 deploys, 30 to 60 credits) but leaves a thin margin.

**Budget: 2 production deploys required, up to 2 optional (4 at most).** Everything else is free (GitHub, Pages CMS, local preview).

## Accounts and permissions
- GitHub account with admin on the new private repo (push this project to it first).
- Pages CMS: sign in at app.pagescms.org with GitHub; install the GitHub App on **this repo only**.
- Netlify: the Personal team. Create the temporary site from the repo (below). Do not add a domain.
- GitHub repo Settings, Actions, General, Workflow permissions = **Read and write**; no branch protection on `main`.

## Setup (no deploys)
1. Push the project to the new private repo (`main`). Create the branch `content-edits` from `main`.
2. Netlify: Add new site, Import from GitHub, pick the repo. Build command `npm run build`, publish directory `dist`, production branch `main`. (`netlify.toml` already says this; Node is pinned to 22.) **Before creating it, check the Usage page and write the credits left in the log.** Branch deploys and deploy previews: leave OFF.
3. Local, free: `npm ci`, `npm run build`, `npm run preview`. Open the address. This is your no-credit preview for the whole test.

## The sequence
| # | Step | Netlify deploy? | Expected result | PASS/FAIL | Notes |
|---|---|---|---|---|---|
| 1 | Open Pages CMS on branch **content-edits**. Do the forms load for Articles, Products and Site settings? Write down anything it rejects in `.pages.yml`. | No | All three load, no config error | | |
| 2 | **(Milestone 1) Edit and save an article** (add a sentence), still Published, Save. | No | A commit on `content-edits` only; `main` unchanged; the curly-bracket markers `{{product:...}}` survive (check the file on GitHub) | | |
| 3 | **(2) Upload a picture:** change the article's Top picture to a new upload; fill all boxes. | No | File appears in `public/images/`; note the exact text stored in `hero.image` (is it `/images/x.jpg`?) | | stored value: |
| 4 | **(3) Add a product** as Candidate; then edit another product to Discontinued with Replaced by = the new one (set the new one Verified with date and source). Confirm the `picks` box lists products. | No | Valid JSON file named `<id>.json`; empty boxes do not break the build | | |
| 5 | **(4) Settings:** change the tracking ID text (leave tracking **off**). | No | Commit on `content-edits` | | |
| 6 | **Local preview of the branch:** `git fetch`, `git checkout content-edits`, `git pull`, `npm run build`, `npm run preview`. | No | Build passes; the page shows your edits; this stands in for a Netlify preview | | |
| 7 | **Skipped build:** push (or edit on GitHub) a commit on `main` **without** `[deploy]`, e.g. a README change. Look at Netlify Deploys and the Usage page. | Skipped build (cost is an unknown) | Deploy shows **Skipped**; **record credits used** | | credits before/after: |
| 8 | **First production deploy (deploy 1):** commit on `main` with `[deploy]` in the message (empty commit: `git commit --allow-empty -m "First test publish [deploy]"`). | **Yes** | Netlify builds once; the temporary `*.netlify.app` address loads the site; **record credits used** | | credits: |
| 9 | **Publish button (deploy 2):** in Pages CMS press **Publish site**. | **Yes** | Actions run is green; `main` has a merge commit "Publish: content edits [deploy]"; Netlify builds once; the edited article is live; `content-edits` is level with `main` | | credits: |
| 10 | **A failing publish:** on `content-edits` make a published article lack its picture description, Save, press Publish site. | No (Actions only) | Run is red with a message naming the file and field; `main` unchanged; **no** Netlify build | | |
| 11 | Fix it on `content-edits` (or reset the branch to `main`). | No | | | |
| 12 | **Rollback, free route:** Netlify Deploys, the earlier deploy, **Publish deploy**. | No credits expected (rollback) | Old version live; **record credits used** | | credits: |
| 13 | **Undo workflow, no deploy:** GitHub Actions, Undo last publish, Run workflow, **untick** "Also build". | No | New "Undo..." commit on `main` without `[deploy]`; a build is skipped | | |
| 14 | **OPTIONAL deploy 3, branch deploy:** only after step 7 to 13 show how credits behave. Netlify, Project configuration, Build and deploy, Branches: switch on branch deploys for `content-edits` only. Save an edit in Pages CMS. | **Yes (cost unknown)** | A preview address appears for `content-edits`; **record credits used**; leave it ON only if the cost is acceptable | | credits: |
| 15 | **OPTIONAL, failed build:** with branch deploys on, make an edit that breaks the check on `content-edits`. | Possibly | Netlify build fails and the live site is untouched; **record credits used** | | credits: |

Deploys that cost credits: steps 8 and 9 are required; 14 and 15 are optional; step 7 is a skipped build (measured, probably 0).

## Credits used (the open unknowns; fill in from Netlify's Usage page)
| Event | Credits before | Credits after | Credits used |
|---|---|---|---|
| Skipped build (step 7) | | | |
| Production deploy (step 8) | | | (15 expected) |
| Production deploy via Publish (step 9) | | | |
| Rollback "Publish deploy" (step 12) | | | (0 expected) |
| Branch deploy / preview (step 14, optional) | | | |
| Failed build (step 15, optional) | | | |

## No-credit fallback if previews are not worth it
Skip steps 14 and 15. Preview locally (`npm run preview` on the `content-edits` checkout), and rely on the rule "production builds only when the newest commit on `main` contains `[deploy]`". If Netlify's **Trigger deploy** button is needed, note in the log whether it shows "Skipped" (unknown) and use an empty commit with `[deploy]` instead.

## Also record
- The exact `.pages.yml` errors, if any, and what Pages CMS stores for the picture field.
- Whether the Publish button needed the `payload` input and worked on the first press.
- Whether the Netlify `ignore` rule behaved as `test/workflows.test.mjs` predicts.

## Rollback and teardown (after the test)
1. Netlify: Site configuration, General, **Delete this site** (the credits spent stay spent). Or, to keep it, Build settings, Stop builds.
2. GitHub: if the repo was only for the test, Settings, Danger zone, delete it. Otherwise delete the `content-edits` branch and reset `main` to the first commit if you want a clean start.
3. Pages CMS / GitHub: Settings, Applications, Installed GitHub Apps, remove access to the repo if you are not keeping it.
4. Confirm `settings.json` still has `amazonTrackingEnabled: false`.

*Fallback host, not part of this test:* the built `dist/` folder is plain static files and also works on Cloudflare Pages or any static host; `public/_redirects` and `public/_headers` only use syntax both Netlify and Cloudflare Pages document (behaviour on Cloudflare UNVERIFIED).
