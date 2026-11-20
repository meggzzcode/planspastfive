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
3. To go live set Status = Published, choose Category and Kind of story, fill the search summary, standfirst, publish date and the top picture (the picture and its description for screen readers), then Save. The picture must also have a record in `src/content/images.json` (see "Change a picture" below), or the check fails. "Feature on the home page" puts it in Featured experiences.
4. A product is named in a sentence with `{{product:the-product-id}}`, or shown as a card with `{{pick:the-product-id}}` alone on its own line. UNVERIFIED: whether the rich-text editor leaves those curly-bracket markers untouched. If it changes them, use the editor's source/markdown view, or edit the file on GitHub's website.

## Add or replace a product
- **Add:** Products, New. The product id (lowercase words with hyphens) becomes the file name; never change it later. The ASIN is the 10 letters and digits on the Amazon page under Product details. Start at Status = **Candidate**: it never shows. Write your own words for the description, "why we picked it" and "worth knowing"; never copy Amazon's text; no prices, ratings or Amazon pictures. See "Product statuses and evidence" below for what each status needs.
- **Replace:** create the new product (Verified, with its evidence). On the old one set Discontinued, write a reason, and pick the new one in **Replaced by**.
- If a product is no longer right, set it to Held (with a reason). A published article that still points at it will refuse to publish until you swap it.

### Product statuses and evidence
A product is shown only when its **Editorial decision** is Approve **and** its status allows it.

| Status | Meaning | Shown on the site? |
|---|---|---|
| `candidate` | An idea; not checked. | Never. |
| `provisional` | Listing checked, but some evidence is missing. | **Only while `launchMode` is `preview`.** Never in production. |
| `verified` | All the evidence below is recorded. | Yes, when Editorial decision is Approve. |
| `held` | Paused. Needs a reason (`statusReason`). | Never. |
| `discontinued` | No longer sold. Needs a reason; may point to `replacedBy`. | Never. |

The evidence fields on a product (all in the Products form):
- `listingChecked`: date checked (`checkedOn`), exact variant, `listingAvailable`, `sellerType`, `affiliateLinkEligible`.
- `specsEvidence`: a short note with the maker's or seller's web address that backs up the facts you state.
- `suitability`: who it suits.
- `qualityNote`: what customers say, in your words (optional but encouraged).
- `imageStatus`: `none`, `pending` or `approved`. Use `approved` only when the product has a picture whose record in `images.json` is an approved `product-photo`. Amazon pictures are never used.
- `editorialDecision`: `approve` or `hold`.
- `order`: an optional whole number; the shop lists lower numbers first, the rest keep their usual order.

**Verified needs all of these:** `checkedOn` filled; `listingAvailable` = yes; `sellerType` = Amazon or the brand/maker; `affiliateLinkEligible` = yes; `specsEvidence`; `suitability`; plus `verificationSource` (where you checked), `whyWeLikeIt`, `limitations` and `descriptionOriginal`. If any is missing the build refuses "verified": use `provisional` or `candidate` until it is known. A `provisional` product needs the check date and the same text fields, and cannot be shown if the listing is unavailable or not eligible for affiliate links (hold it instead).

## Change a picture
Each picture has **one record** in `src/content/images.json`, matched to the article or product by file name. The article's **Top picture** form only takes the picture (it goes to `public/images`) and the description for screen readers. Who made it, the licence and the approval live in the record, not in the article. Any old `credit`, `source`, `licence` or `rights` lines in an article are ignored.

**`images.json` cannot be edited in a Pages CMS form.** To change it, either open the file on GitHub's website (`src/content/images.json`, pencil icon, on the `content-edits` branch) and edit it there, or ask the AI or developer to do it. Each record looks like this:

```
"file-key": {
  "file": "name.jpg",             // in public/images/
  "alt": "what the picture shows",
  "kind": "photograph",           // photograph | ai-illustration | product-photo
  "credit": "Photographer or brand",   // required for photograph and product-photo
  "source": { "name": "Pexels", "url": "https://..." },
  "licenceName": "...", "licenceUrl": "https://...", "licenceCheckedOn": "2026-11-20",
  "commercialUse": "yes",         // yes | no | unverified
  "transferWithSite": "unverified",   // yes | no | unverified
  "attribution": "none",          // the required credit wording, or the word "none"
  "rightsStatus": "approved",     // approved | pending | rejected
  "approvedOn": "2026-11-20",
  "notes": "optional"
}
```
A record can be `approved` only when commercial use is `yes` and it has the source address, licence name and address, the date the licence was checked, your approval date, and (for photographs and product photos) the credit. Otherwise the build refuses the record. A `rejected` picture fails the build wherever it is used. A `pending` picture used on the site is a warning in preview mode and a failure in production mode.

**Captions** are chosen automatically from the kind: AI illustration = "Illustrative image (AI-generated)"; photograph = "Photo: <credit>"; product photo = "Product photo: <credit>". You do not type them, and an AI picture can never be captioned as a photograph. Only use pictures you have the right to use. Never use Amazon's.

## What you can and cannot say about prices
Budget estimates are allowed in ordinary article prose ("most of this fits under $25"). Never put a price for a product: not in a product record, an article title or summary, a product card, or in a paragraph that names a product with `{{product:...}}` or `{{pick:...}}` (or sits next to a product card). The words sale, discount, coupon, deal, "current price", "lowest price" and similar are refused everywhere. Star ratings, "we tested it" claims and Amazon addresses or tracking tags are also refused.

## The Amazon note (disclosure)
A short shopping note appears before the first product link or card on every page that has product links (articles, shop, home) and in the footer. Its wording follows the tracking switch:
- **Tracking off (now):** "Product links on this site go to Amazon. They are ordinary links for now, so we earn nothing from them yet."
- **Tracking on:** "Some links on this site go to Amazon and are affiliate links." followed by the exact sentence in Site settings ("Amazon disclosure sentence", currently "As an Amazon Associate I earn from qualifying purchases.").

## Launch mode: preview or production
`launchMode` in `src/content/settings.json` is either:
- **`preview`** (now): unfinished picture rights and product evidence do **not** stop the build. The build log prints a **LAUNCH WARNING** listing each item, and the build passes. Provisional products are shown.
- **`production`**: the build **fails** on any pending picture used by a page, article or product, any missing evidence on a shown product, and any provisional product that a **published** article uses (the message names the article and what is missing). Provisional and candidate products are never shown in production. Research products that no published article uses are simply left out of the live site: no error, no warning, only the line "N research products not shown in production". In preview the LAUNCH WARNING lists "Blocks production" (used by a published article) separately from "Research products no published article uses" (ignored in production).

**Owner step: switch `launchMode` to `production` only when you are ready to launch**, and only after the LAUNCH WARNING list in the build log is empty. How: in Pages CMS open Site settings and set **Launch mode** to Production, then Save and Publish (or edit `"launchMode"` in `src/content/settings.json` on GitHub's website; or ask the AI or developer). **Caveat:** nothing yet ties the Netlify production deploy to this setting. The live site is built from whatever `settings.json` says on `main`, so the switch is a deliberate manual step and not an automatic guard. Do not rely on it to stop an unready publish.

**Current production blockers** (what the "Blocks production" list shows today): only the 4 pending pictures (`girls-night-crafts`, `cozy-corner`, `weekend-picnic`, `junk-journal-flatlay`: commercial use unverified, plus missing licence details and approval date). No product blocks: the one published article uses Tombow, which is verified.

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
