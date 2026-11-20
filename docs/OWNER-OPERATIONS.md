# Running the site (plain English)

Everything below is done **in a web browser**. You do not need a computer set up for programming.

The flow: **Pages CMS (edit) > Netlify preview link (look) > Publish site button (go live) > check the live site.** Every save is stored in GitHub on a side branch called `content-edits`. Nothing goes live until you press **Publish site**.

> **Status: not yet tried with a real login.** The forms and buttons are written from the Pages CMS documentation, and the publishing logic is tested on a computer, but the real Pages CMS login, the real Netlify preview and the real Publish button have never been run. Do `docs/OWNER-REAL-TEST.md` first. Until then, treat each step below as "expected", not "proven".

## One-time owner actions (before the browser workflow works)
1. Make the GitHub repository **private** (`docs/REPO-PRIVACY-CHECK.md`) and re-check that Netlify is still connected to it.
2. Sign in at app.pagescms.org with GitHub and install the Pages CMS GitHub App for this repository.
3. GitHub > repository > Settings > Actions > General > Workflow permissions = **Read and write**. No branch protection on `main`.
4. Create the branch `content-edits` from `main` (GitHub > branch menu > type the name > Create branch).
5. Netlify > the site > Project configuration > Build and deploy > Branches and deploy contexts > turn **Branch deploys** on for `content-edits` only. This gives you a preview link. (Do this after the real test has measured what it costs; see below.)
6. Look at Netlify's Usage page and note the credits left.

## The credit budget (read once)
Your Netlify Personal plan ($9 a month) gives 1,000 credits a month. A production deploy costs 15 (verified 2026-11-19), so about 66 publishes a month. As of 2026-11-19 you had **135 credits left until 2026-12-16** (about 9 deploys).

The design that saves credits: the live site is rebuilt **only** when the newest commit on `main` contains `[deploy]`, which only the Publish button adds. Saving in the CMS never changes the live site. Netlify's documentation says branch deploys, deploy previews, failed builds and rollbacks cost 0 credits, but your account's real figures, and what a **skipped build** costs, are **UNKNOWN** until the real test measures them. So: batch your edits, save as often as you like, publish once.

## Edit an article
1. Open Pages CMS, choose this repository and the branch **content-edits** (Pages CMS expects you to pick the branch; the exact control is UNVERIFIED).
2. Articles, pick one (or New). Change the text. Keep **Status = Draft** while writing; a draft never shows on the website.
3. To go live set Status = Published, choose Category and Kind of story, fill the search summary, standfirst, publish date and every box of the top picture (Rights must be Cleared), then Save. "Feature on the home page" puts it in Featured experiences.
4. A product is named in a sentence with `{{product:the-product-id}}`, or shown as a card with `{{pick:the-product-id}}` alone on its own line. UNVERIFIED: whether the rich-text editor leaves those curly-bracket markers untouched. If it changes them, use the editor's source/markdown view, or edit the file on GitHub's website.

## Add or replace a product
- **Add:** Products, New. Fill every box. The product id (lowercase words with hyphens) becomes the file name; never change it later. The ASIN is the 10 letters and digits on the Amazon page under Product details. Keep Status = **Candidate**: it never shows. When *you* have checked the Amazon listing (right item, in stock, sold by Amazon or the maker) set **Verified**, fill the date and where you checked, and write your own words for the description, "why we picked it" and "worth knowing". Never copy Amazon's text; no prices, ratings or Amazon pictures.
- **Replace:** create the new product (Verified). On the old one set Discontinued, write a reason, and pick the new one in **Replaced by**.
- If a product is no longer right, set it to Held (with a reason). A published article that still points at it will refuse to publish until you swap it.

## Change a picture
In the article's **Top picture** upload the picture (it goes to `public/images`) and fill every box: description for screen readers, credit, source, licence, Rights = Cleared. Only use pictures you have the right to use. Never use Amazon's.

## Change settings and the tracking ID
Site settings in the CMS. **The Amazon tracking ID lives only here.** Keep "Switch Amazon affiliate tracking on" **off** until you have confirmed eligibility and decided to launch: Amazon lets you use links after applying, but the site must be public first (`docs/AMAZON-ASSOCIATES.md`). Switching it on with an empty ID fails the build. Changing the ID changes every Amazon link at the next publish.

## Preview, publish, check
1. **Preview:** after you save, Netlify builds the `content-edits` branch. Open Netlify > Deploys > Branch deploys, or the address `https://content-edits--<your-site-name>.netlify.app` (form per Netlify's branch-deploy documentation; UNVERIFIED for this site). Check the page, the Amazon buttons and the phone view. UNVERIFIED: how many minutes it takes, and whether it costs credits (the real test measures this).
2. **Publish:** in Pages CMS press **Publish site** and confirm. GitHub checks everything (content, build, every link) on a temporary copy, and only then merges `content-edits` into `main` with `[deploy]` in the message. If a check fails nothing changes and the message names the file and box to fix (GitHub > Actions > the red run).
3. **Check the live site:** about 2 to 5 minutes later open planspastfive.com (or the temporary address during testing), reload, and open the changed page. If it is not there, look at Netlify > Deploys.

## Roll back
- **Fastest, no credits expected:** Netlify > Deploys > an earlier good deploy > **Publish deploy**.
- Then make GitHub match: Pages CMS **Undo last publish** (or GitHub > Actions > Undo last publish > Run workflow; untick "also build" if you already used Publish deploy). Then delete the `content-edits` branch and create it again from `main`, so the undone edits do not return.

## If credits run out
The site pauses and visitors see "Site not available" until the monthly reset. Options: wait, buy credits, or move hosting. The built site is plain static files so it also runs on Cloudflare Pages or any static host (fallback only; not set up or tested).

## Monthly checklist (about 2 hours)
- Open each product's Amazon page: still the right item, in stock, sold by Amazon or the maker? If not, Held or replace it. (40 min)
- Click every "See it on Amazon" button on the live site. (10 min)
- Netlify Usage page: credits left? (5 min)
- Read analytics if on. (15 min)
- Associates Central: account in good standing, qualifying sales count. (10 min)
- Write or tidy one story; publish once. (40 min)

## Yearly
Domain renewal (auto-renew is OFF; first year paid to 2027-11-19), mailbox plan renewal (price unconfirmed), Netlify plan, GitHub, and re-check picture tool licence terms.

## Appendix for developers only: local preview with Git and npm
Not needed for normal editing. On a computer with Node 22: `git fetch`, `git checkout content-edits`, `git pull`, `npm ci`, `npm run build` (checks content, builds, checks every link), `npm run preview`, open the printed address. It costs no credits. If the CMS cannot be used, files can also be edited directly on GitHub's website on the `content-edits` branch.

## Pages CMS keys used (all from https://pagescms.org/docs/, read 2026-11-19)
`/docs/configuration/` (top-level `settings`, `media`, `content`, `actions`); `/configuration/media/` (`input`, `output`, `categories`, `rename`); `/configuration/content/` (`name`, `label`, `type`, `path`, `format`, `filename`, `fields`, `view`); `/configuration/content/filename/`; `/configuration/content/view/`; `/configuration/content/fields/` (`required`, `pattern`, `description`, `options`); field pages for `string`, `text`, `select`, `reference`, `image`, `date`, `boolean`, `object`, `rich-text` (`options.format`, `switcher`); `/configuration/settings/` (`content.merge`); `/configuration/actions/` (`name`, `label`, `workflow`, `ref`, `cancelable`, `confirm`).
**Left out because the docs were unclear:** a custom message for `pattern`; a `related` articles picker (it can be added by hand and is kept thanks to `settings.content.merge`); a filename-only `image` format (the checks accept `x.jpg`, `images/x.jpg` and `/images/x.jpg`). On 2026-11-20 the Pages CMS rich-text field page returned "not found" and the quick-start page does not describe branch selection, so the branch picker and the rich-text behaviour remain **unverified until the real test**, along with the image field's stored value, `reference` with JSON collections, and the Publish buttons.
