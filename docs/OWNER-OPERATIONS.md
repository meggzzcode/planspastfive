# Running the site (plain English)

You edit in **Pages CMS** (a website that edits this repository for you). Every save is a saved version in GitHub. Nothing goes live until you press **Publish site**.

> Status: the CMS forms and publish button are written from the Pages CMS documentation but have **not yet been tried with a real login**. Do `docs/OWNER-REAL-TEST.md` first.

## The credit budget (read once)
Netlify's Personal plan gives 1,000 credits a month, and each production deploy costs 15 (verified 2026-11-19). That is about **66 publishes a month**. So: **batch your edits**, save as many times as you like, and press Publish once. Saving never costs anything. Whether previews and skipped builds cost credits is **not yet known**; the real test records it.

## Edit an article
1. Open Pages CMS, choose the repository and the branch **content-edits** (branch picker).
2. Articles, pick one (or New). Change the text. Keep **Status = Draft** while you write; nothing shows on the website.
3. To go live set Status = Published, choose the **Category** and **Kind of story**, fill the search summary, standfirst, publish date and every box of the top picture (Rights must be Cleared), then Save. Tick "Feature on the home page" to show it in the home page's Featured experiences row (it then does not repeat under Latest). Category pages appear by themselves for categories that have a published story.
4. A product can be mentioned in a sentence with `{{product:the-product-id}}`, or shown as a card by typing `{{pick:the-product-id}}` on its own line. The "Products" box at the top of the article feeds the **Shop this story** section. If the editor changes the curly brackets, use the Source tab.

## Add or replace a product
- **Add:** Products, New. Fill every box. The product id (lowercase words with hyphens) becomes the file name; never change it later. The ASIN is the 10 letters and digits on the Amazon page under Product details. Keep Status = **Candidate**: it never shows. When *you* have checked the Amazon listing (right item, in stock, sold by Amazon or the maker) set Status = **Verified**, fill the date and a note of where you checked, and add your own words for the description, "why we picked it" and "worth knowing" boxes. Optionally add a short best-use label and choose the button wording (See It on Amazon, Explore This Starter Kit, Shop the Supplies, See Our Pick). Never copy Amazon's text, never add prices, ratings or Amazon pictures.
- **Replace:** create the new product (Verified). Open the old one: Status = Discontinued, write a reason, and choose the new one in **Replaced by**. Every article that used the old product now shows the new one.
- If a product is no longer right, set it to Held (with a reason). A published article that still points at it will refuse to publish until you swap it.

## Change a picture
Open the article, in **Top picture** upload the picture (it goes to `public/images`) and fill every box: description for screen readers, credit line, where it came from, licence/permission, and Rights = Cleared. Only use pictures you have the right to use. Never use Amazon's.

## Change settings and the tracking ID
Site settings in the CMS. **The Amazon tracking ID lives only here.** Leave "Switch Amazon affiliate tracking on" **off** until your Associates account is approved and the ID is yours. Switching it on with an empty ID fails the build. Changing the ID changes every Amazon link on the whole site at the next publish.

## Preview, then publish
1. **Best free preview:** on your computer `git pull`, then `npm run build` and `npm run preview` and open the address it prints. This costs no credits.
2. Optional: a Netlify branch preview of `content-edits` (switch it on only after checking what branch deploys cost on Netlify's Usage page; see `docs/OWNER-REAL-TEST.md`).
3. In Pages CMS press **Publish site**. GitHub checks everything (content, build, every link) on a temporary copy and only then merges `content-edits` into `main` with the words `[deploy]` in the message. Netlify builds production only for commits containing `[deploy]`. If a check fails, nothing changes and the message names the file and box to fix.

## Roll back
- **Fastest, no credits:** Netlify, Deploys, an earlier good deploy, **Publish deploy**.
- Then make GitHub match: Pages CMS **Undo last publish** (or GitHub, Actions, Undo last publish, Run workflow; untick "also build" to save 15 credits if you already used Publish deploy). Then reset the `content-edits` branch to `main` (delete it and create it again from `main`) so the undone edits do not return.

## If credits run out
The site pauses and visitors see "Site not available" until the monthly reset. Options: wait for the reset, buy credits, or move hosting. The built site is plain static files, so it also runs on Cloudflare Pages or any static host (fallback only; not set up or tested).

## Monthly checklist (about 2 hours)
- Open each product's Amazon page: still the right item, in stock, sold by Amazon or the maker? If not, Held or replace it. (40 min)
- Click every "See it on Amazon" button on the live site. (10 min)
- Read the Netlify Usage page: credits left? (5 min)
- Read analytics if switched on; note which stories are read. (15 min)
- Check Associates Central: account in good standing, qualifying sales. (10 min)
- Write or tidy one story; publish once. (40 min)

## Yearly
Domain renewal (auto-renew is OFF; first year paid to 2027-11-19), the mailbox plan renewal (price unconfirmed), Netlify plan, GitHub, and re-check licence terms of the picture tools. Keep the card on file current.

## Pages CMS keys used (all from https://pagescms.org/docs/, read 2026-11-19)
`/docs/configuration/` (top-level `settings`, `media`, `content`, `actions`); `/configuration/media/` (`input`, `output`, `categories`, `rename`); `/configuration/content/` (`name`, `label`, `type`, `path`, `format` = `yaml-frontmatter` or `json`, `filename`, `fields`, `view`); `/configuration/content/filename/` (`{primary}`, `{id}` tokens, `template`/`field`); `/configuration/content/view/`; `/configuration/content/fields/` (`required`, `pattern` as a plain string, `description`, `options.minlength/maxlength`); `/configuration/content/list/`; field pages for `string`, `text`, `select` (`options.values` with `name`/`label`), `reference` (`collection`, `multiple`, `search`, `value`, `label`), `image`, `date` (`options.format`, `default`), `boolean`, `object`, `rich-text` (`options.format`, `switcher`); `/configuration/settings/` (`content.merge`); `/configuration/actions/` (`name`, `label`, `workflow`, `ref`, `cancelable`, `confirm`).
**Left out because the docs were unclear:** a custom message for `pattern`; a `related` articles picker (the docs do not say which token gives just the file name; `related` can be added by hand and is kept thanks to `settings.content.merge`); a filename-only `image` stored-value format (the checks accept `x.jpg`, `images/x.jpg` and `/images/x.jpg`). **Unverified until the real test:** that the rich-text editor leaves `{{ }}` markers intact, that an `image` field stores `/images/<file>`, that `reference` works with JSON collections, and that the Publish buttons work.
