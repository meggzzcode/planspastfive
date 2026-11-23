# Shopping strategy decision (2026-11-23)

**Decision: curated **Ready-to-Start Bundles** on our own site (collections of individually sold products, not prepackaged boxes), each product with its own tagged Amazon link, plus at most one or two "choose one" alternatives where taste matters.** Amazon Lists, Idea Lists and cart links are not used.

## Evidence (Amazon's own pages, read 2026-11-23; no amazon.com product page was fetched)
- Tagged Special Links may be displayed once you have applied (Program Policies, Participation 2(a)). Three qualifying sales within 180 days trigger the final review (Application Review Process help page).
- Special Links may not appear inside customer-generated content such as Wish Lists (Program Policies 6(p)). Linking from our site to a List is not stated to be forbidden, but List attribution and transfer rules are **not verified**.
- Idea Lists belong to the Influencer Program (separate qualification, separate store ID, onsite commission). Whether an Associates-only account qualifies is **not verified**.
- The multi-item Add-to-Cart form belonged to the PA-API documentation, which now redirects to the PA-API 5 deprecation notice. Its current status is **unconfirmed**; not used.
- Prices and Amazon images may not be stored or shown from our side (Policies 2(b), IP licence 2(h)). The Associates agreement cannot be assigned without Amazon's written approval, so a buyer opens their own account.

## Weighted comparison (score 1-5, weighted total out of 5)
| Approach | Audience appeal 25% | Compliance and attribution 20% | Likely qualified clicks 20% | Transferability 15% | Editorial and SEO 10% | Simplicity and cost 10% | Total |
|---|---|---|---|---|---|---|---|
| A. Individual links only | 3 | 5 | 4 | 5 | 3 | 5 | 4.0 |
| **B/F. Bundles on our site, individual links, limited alternatives** | **5** | **5** | **4** | **5** | **5** | **4** | **4.7** |
| C. Amazon List | 3 | 2 (not verified) | 3 | 1 (tied to a personal account) | 1 | 3 | 2.4 |
| D. Influencer Idea Lists | 4 | 2 (eligibility unverified) | 3 | 1 | 1 | 2 | 2.6 |
| E. Cart links | 2 | 1 (status unconfirmed) | 3 | 3 | 1 | 2 | 2.0 |

Scores are judgement, not measurement; no conversion claim is made. C, D and E also hit hard blockers (unverified attribution, personal-account dependence, unconfirmed deprecation) so they fail regardless of score.

## How readers shop
1. An article shows the finished result, then the supplies, with a card per product: a "Start here" or "Optional extra" label, a "Best for..." line, one reason, one honest caveat and a button reading "See It on Amazon" (it opens that product on Amazon).
2. The end of each article has "Our picks from this story" (the recommended products; alternatives are in the bundle) and a "See the whole bundle in our Shop: <bundle>" button that goes to the shelf in our Shop, not to Amazon.
3. Each Shop bundle lists essentials ("Start here"), then extras. Where taste matters, a product has a "choose one" block under it (label for how it differs: prettier, budget-friendly, premium, different style, mix-your-own). Alternatives are never presented as extra purchases.
4. Each button goes to one Amazon page. No button claims to buy everything.

## Bundles
Junk Journal Starter Bundle, Air-Dry Clay Starter Bundle, Cozy Paint Night Bundle (paint-by-numbers) and Host Your First Mahjong Night (American mahjong). A fourth, a cozy craft-night project, is held until a candidate is verified (Cowork batch 2, `docs/cowork/BATCH-2.md`). Three good kits beat eight thin ones.

## Amazon Lists: status after a second look (2026-11-23)
The earlier rejection was right to be cautious and is now narrower. Official pages (Program Policies updated 2026-04-14, Operating Agreement updated 2025-10-15) say Special Links may not be placed **inside** Wish Lists or other customer-generated content on Amazon (clause 4(p)). **Nothing official was found that allows or forbids a tagged link from an independent site to a public List**, documents a List URL format or `tag=` behaviour, or says whether purchases from a List count. Clause 2(b) (extra original content when linking to "pages with Product lists") may or may not cover Lists. Also not found: List sections, alternatives of one item, signed-out visibility rules, new-account restrictions, Influencer requirements. Attribution rules in general (24-hour click, 89-day cart) exist but are not tied to Lists. The tag and the agreement cannot be transferred, and nothing says Lists can be. So **"Shop the Full Bundle on Amazon" is not on the site.** `docs/cowork/AMAZON-BUNDLE-LISTS-LIVE-VERIFICATION.md` tells Cowork exactly what to test in a live browser; the site works fully without Lists.

### Cowork's live test of Lists (2026-11-23, `docs/cowork/AMAZON-BUNDLE-LISTS-RESULTS.md`)
Lists can be created in the owner's account and can carry notes (255 characters) and per-item priority, but have **no sections and no "choose one" or optional flag**, show Amazon prices and ratings we do not control, belong to the owner's personal Amazon account (not transferable), and generating a share link flips the List to Shared. Policy permission for a tagged link to a List, tag survival and attribution stayed Unverified or owner-gated (not tested). **Decision: do not use Amazon Lists for the Bundles.** The on-site Bundles with individual tagged product links stay the shopping system, and there is no "Shop the Full Bundle on Amazon" button. Revisit only if Amazon Associates support confirms in writing that tagged links to Lists are allowed and attributed. The owner should delete the private test List (`PPF test, Junk Journal Starter Bundle`).

## What the shop sells
Only what the activity needs that most readers would not already own (owner rule, 2026-11-23). Scissors and ordinary tape are not sold; washi is an optional extra. Articles mention such items in prose without a link.

## Rules for alternatives
Up to two per main product, only when the choice is about taste or budget; a budget alternative only if genuinely worthwhile. Nothing enters the catalog until its exact ASIN, variant and claims are verified on Amazon.com. No prices, ratings, discounts or "best seller" language.

## Not yet verified
Candidate products and ASINs (Strathmore, ephemera packs, Jovi, Crayola, paint-by-numbers, embroidery); live affiliate attribution; the owner's Associates approval; List or Idea List eligibility. These can be revisited after account approval, but nothing depends on them.

## Measuring (no new tools)
If GA4 is switched on later, each product button sends an `amazon_click` event with product, article or page, and placement, so outbound clicks can be read per article and per shelf. Nothing is measured now and no figure is promised.
