# Amazon Lists for our Bundles: live verification (Cowork assignment)

Terminology: a **Bundle** is a curated collection of individually sold products on Plans Past Five, not a prepackaged Amazon bundle. The on-site Ready-to-Start Bundles are finished and work on their own. This assignment decides only whether a **"Shop the Full Bundle on Amazon"** button, pointing to a public Amazon List, may be added. That button is **not on the site** and will not be added until the results below are Verified.

## A. Objective
Verify whether we can create and use public Amazon.com Lists as compliant, commission-eligible curated collections for Plans Past Five, and whether they work for a reader on desktop and phone.

## B. Prerequisites and owner gates
| Task | Needs |
|---|---|
| Read Amazon's official guidance | Live browser (public pages, no login) |
| Check Associates status and SiteStripe | Owner's signed-in Associates Central (read-only) |
| Create a **private** test List | Owner's signed-in Amazon customer account; owner's yes in the message that starts this task |
| Make a List **public**, or share its link | Owner's explicit yes (a public List is an outward commitment) |
| Signed-out view of the List | A private/incognito browser window |
| Click a tagged List link and look at the Associates report | Owner's explicit yes; **one** click only |
| Anything involving a purchase, payment, or a new account | **Not allowed. Stop and write BLOCKED.** |
Never ask for, type into a document, or paste a password, code or payment detail. **This repository is PUBLIC: never write a personal email address, a login name, account or property names that belong to other businesses, phone numbers, payment details, order numbers or any credential into a note, file, screenshot or commit message. Say "the owner's Google account" instead.** Redact such details from screenshots before saving them. Do not change Associates settings or the live website. Tracking in our repository is ON and the tag is `planspastfive-20`; do not change either.

## C. What the official pages already say (read by Claude Code, 2026-11-23; re-read them yourself and note changes)
| Point | Finding | Source | Status |
|---|---|---|---|
| Special Links inside Wish Lists | Not allowed "in a customer review, forum, Wish List, guide, or any other customer-generated context" (Participation Requirements 4(p)) | https://affiliate-program.amazon.com/help/operating/policies (updated 2026-04-14) | Verified. Concerns links placed inside Amazon, not links from our site |
| Linking from our site to a List | Nothing found that allows or forbids it | same | Not found |
| Linking to "pages with Product lists" | "must have additional original content" (2(b)); unclear whether customer Lists are "Product lists" | same | Unclear |
| List URL format and `tag=` | Not documented on the pages checked. The Agreement says only "The links must properly use the special 'tagged' link formats we provide" | https://affiliate-program.amazon.com/help/operating/agreement (updated 2025-10-15) | Not found |
| Attribution rules | 24 hours from the click; items added to a cart within 89 days | policies page, Commission Income Statement | Verified in general; not tied to Lists |
| Transfer | Tag and Agreement cannot be assigned or used by anyone else (IP License 2(b); Agreement section 12) | both pages | Verified; nothing on Lists |
| SiteStripe on a List page | "lets you build links to any page on Amazon"; Lists not mentioned | https://affiliate-program.amazon.com/help/node/topic/GJMMT7G4C8K4Y3AY | Unclear |
| List privacy, sharing, comments | Public / Shareable / Private; shared editors can change priorities and comments (search snippet only; the help page returned 503) | https://www.amazon.com/gp/help/customer/display.html?nodeId=GN4QEEU54LKE5976 | Unclear |
Unverified secondary claim: a partner guide reportedly says to append `&tag=YOUR_TAG-20` to a Wish List URL. Do not rely on it; test it.

## D. Exact browser tasks (in order; stop at any owner gate and document it)
1. Re-read the policies and agreement pages above; quote any wording about Lists, Wish Lists or "Product lists" (15 words or fewer per quote). Search Associates Central help for "list", "wish list", "SiteStripe" and "Amazon Lists".
2. In Associates Central (read-only), record: account status wording, whether SiteStripe is available, qualifying sales count and days remaining, the tracking IDs listed, and any restriction notice for newer accounts.
3. In the owner's Amazon account (after the owner's yes), find out whether Lists can be created and whether Amazon shows a limit, a name, a description or privacy options.
4. Create **one private test List** named `PPF test, Junk Journal Starter Bundle`. Add the products in section E for that bundle. Do not buy.
5. Test organization: can items carry a note or comment? A priority or "need" count? Can items be grouped in sections or tabs? Can two alternatives for one supply (for example the 3-pen and 8-pen sets) sit in the List with a note saying "choose one"? Can optional extras be flagged? If one List cannot express essential, choose-one and optional, say whether separate Lists would be needed.
6. View the test List on **desktop** and at **phone width (about 390)**: item order, notes visible?, product images (Amazon's own, on Amazon), buy buttons, how clear "choose one" is. Take non-sensitive screenshots (hide account name and address).
7. Open the List in a private/incognito window with no login: is it visible? What does the visitor see?
8. Find the sharing URL (Amazon's "Invite" or "Share" link). Record its structure with the List ID blurred.
9. With the owner's explicit yes: make the test List public, then check what signed-out visitors see. Return it to private when finished unless the owner says keep it.
10. Determine the supported affiliate-link format: does SiteStripe or Associates Central offer a tagged link for a List? If not, test (with the owner's yes, **one click**) whether `<List URL>?tag=planspastfive-20` keeps the tag after Amazon's redirects (look at the final address bar) and whether the page loads normally.
11. Look for a legitimate way to confirm attribution **without buying**: after the one click, check Associates Central reports (clicks by tracking ID) for a recorded click, and look for Amazon's Link Checker or a documented test method. A recorded click is **not** proof of commission eligibility; say so. Do not repeat clicks and do not create artificial referrals.
12. Write down every limitation, uncertainty and anything that would worry a buyer who takes over the site.

## E. The proposed bundles (exact approved records; do not add held or unverified products)
| Bundle | Essentials (Start here) | Choose-one alternative | Optional extras | You probably own |
|---|---|---|---|---|
| Junk Journal Starter Bundle | Canson Graduate Mixed Media 5.5 x 8.5 book `B0CN7B82NG`; Tombow MONO permanent adhesive `B000XAHF7S`; Staedtler Pigment Liner black 3-pack `B0C4VRJ1XP` | Staedtler black 8-pack `B0C922C7WT` (for the 3-pack) | Scotch Expressions washi, Whimsical 15 rolls `B09HN34X72` (alt: Abstract Modern 8 rolls `B09HN2PR9K`); Tim Holtz Idea-ology Snippets `B06VTCRXBC` | tape, scissors |
| Air-Dry Clay Starter Bundle | DAS air-hardening white clay 2.2 lb `B001GAP4YA`; Winsor & Newton Galeria 20 x 12 ml `B08NJZPZG6` | Liquitex BASICS 12 x 22 ml `B07VSZM41G` (for the Galeria set) | none | rolling pin or bottle, butter knife, toothpick, damp cloth |
| Host Your First Mahjong Night | YMI Sapphire American mahjong set `B09VGX38JV`; NMJL 2026 large-print four-pack `B0GRCBQ3Y2` | none | none | a table and friends |
| (fourth) Cozy Paint Night Bundle | Faber-Castell Monet Water Lilies paint-by-numbers kit `B08DGL3R8K` | JOOZ landscape with frame 8 x 12 `B0D6VHXD88` | none | none |
Note for the Mahjong bundle: the card is the 2026 edition and must be replaced each year, which a public List would also need.

## F. Results (Cowork fills this in; use only Verified, Failed, Blocked or Unverified)
| Test | Result | Evidence (source URL, date, screenshot name) | Remaining issue |
|---|---|---|---|
| Amazon Associates account eligibility | | | |
| List creation permitted | | | |
| Public List visibility (signed out) | | | |
| Mobile presentation | | | |
| Product alternatives ("choose one") | | | |
| Essential versus optional organization | | | |
| Notes or descriptions on items | | | |
| Sections or one-List-per-bundle | | | |
| Tagged link permitted by policy | | | |
| Tag survives redirects | | | |
| Attribution independently verified | | | |
| Buyer transferability | | | |
"Attribution independently verified" can be Verified only through Amazon's own documented method or an Associates report showing tracked clicks **and** ordered items for a genuine reader purchase; a URL format check or a recorded click alone is Unverified.

## G. Recommendation (Cowork must choose one, with reasons from the evidence above)
1. Use Amazon Lists (state which bundles, one List per bundle or not, and the exact link format).
2. Do not use Amazon Lists.
3. Keep Lists as an optional future convenience feature.

## H. If Lists are approved: what Claude Code will do (not before)
Add the verified public List URL to one field per bundle in the Shop data, show a **"Shop the Full Bundle on Amazon"** button after the individual product cards with the sentence "Opens our collection on Amazon. Each item is bought separately.", generate the tag from settings in code (never typed into Markdown), keep every individual product link, and add the buyer notes below.

## I. Buyer transferability (record the answers)
Which Amazon customer account owns each List; whether a List can be transferred (almost certainly not: the buyer recreates it); how the buyer replaces the List URLs and the tracking ID; what happens if the seller's account closes (the button must be removed and the site keeps working on individual links).

## J. Outcome file
Push to branch `cowork/bundle-lists` only: `docs/cowork/AMAZON-BUNDLE-LISTS-RESULTS.md` (section F filled, section G chosen, screenshots in `docs/cowork/final-check-evidence/`). Message the owner a one-paragraph summary leading with anything Failed or Blocked.
