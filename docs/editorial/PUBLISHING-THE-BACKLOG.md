# Publishing new articles: by hand or on a schedule (for the owner or a buyer)

Everything unpublished is a **draft** in `src/content/articles/` (the file says `status: draft`). Drafts are never built into the site and never appear in the sitemap. Nothing goes live because a date has passed: a date is only written when an article is released.

## Three ways to publish. Pick one, switch any time.

| Way | You do | Costs |
|---|---|---|
| **A. By hand** | In Pages CMS open the draft, add its top picture, set Status to Published, set the date, Save, then press **Publish site**. | One Netlify production deploy |
| **B. One click** | Press **Release next article now** in Pages CMS. The next ready article in your queue goes live today. | One deploy |
| **C. Automatic** | In Pages CMS open **Release queue**, switch **Post automatically** on, pick the days, set your time zone, keep the queue in order. Each release day the next ready article goes live by itself. | One deploy per release |

The shipped setting is **off** (`enabled: false`), so nothing posts unless you turn it on. At two releases a week, expect about 8 to 9 deploys a month; at 15 credits each that is roughly 130 of the 1,000 monthly credits on the Netlify Personal plan (checked 2026-11-19; check your own Usage page).

## Changing the rhythm (all in the Release queue form, `src/content/schedule.json`)
- **Releases a week:** the number of ticked days. One day = one a week; Tuesday and Friday = two a week.
- **Which days:** Monday to Sunday.
- **Time zone:** decides what "today" means (for example `America/New_York`).
- **Order:** the order of the queue list. Move a name up to publish it sooner; remove it to keep it back.
- **Time of day:** the check wakes up daily at 14:00 UTC. To change it, edit the one line `cron: "0 14 * * *"` in `.github/workflows/release-next.yml` (GitHub runs scheduled jobs on UTC and may start them a few minutes late).
- **Pause everything:** switch **Post automatically** off.

## What "ready" means (the release skips anything not ready, and tells you why)
1. It is in the queue and still a draft.
2. It has a **top picture** with a description, the picture file is in `public/images/` and has an **approved** record in `src/content/images.json` (see `docs/IMAGE-RECORDS.md`).
3. It has a summary (description).
4. The whole site check passes with it live: product markers point at verified products, no prices or invented claims, links resolve. If the check fails, **nothing is published** and GitHub shows the exact message.

## Add a new article to the queue
1. Pages CMS > Articles > New. Fill title, summary, category, format. Leave Status on **Draft** and leave the date empty.
2. Use `{{pick:product-id}}` only for products with status verified (see `docs/SHOPPING-STRATEGY.md`). New products go through the product process in `docs/OWNER-OPERATIONS.md` first.
3. Add the article's file name (no `.md`) to the queue where you want it.
4. Add the picture when you have it. Until then the queue skips it.
After release, add a link to the new article from the related guides that should point to it.

## If releases stop
- **GitHub pauses scheduled workflows** in a repository with no activity for 60 days. Open GitHub > Actions > Release next article > Enable workflow. Any commit also resets the clock.
- **Workflow permissions:** Settings > Actions > General > Workflow permissions must be Read and write.
- **No red run, nothing published:** the log says whether the switch is off, it is not a release day, or nothing in the queue is ready.
- **Wrong article went out:** use **Undo last publish** (`docs/OWNER-OPERATIONS.md`).

## Status of this automation
The release logic has automated tests (`test/release.test.mjs`: queue order, release days, skipping unready drafts, the manual button, nothing published when a check fails). The GitHub workflow itself has **not run on GitHub yet**, like the other workflows; its first real run is part of `docs/cowork/BATCH-3.md` Part 4. Until then treat automatic posting as untested and prefer way A or B.
