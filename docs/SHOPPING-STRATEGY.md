# Shopping strategy decision (2026-11-23)

**Decision: curated "Shop the Kit" shelves on our own site, each product with its own tagged Amazon link, plus at most one or two "choose one" alternatives where taste matters.** Amazon Lists, Idea Lists and cart links are not used.

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
| **B/F. Kit shelves on our site, individual links, limited alternatives** | **5** | **5** | **4** | **5** | **5** | **4** | **4.7** |
| C. Amazon List | 3 | 2 (not verified) | 3 | 1 (tied to a personal account) | 1 | 3 | 2.4 |
| D. Influencer Idea Lists | 4 | 2 (eligibility unverified) | 3 | 1 | 1 | 2 | 2.6 |
| E. Cart links | 2 | 1 (status unconfirmed) | 3 | 3 | 1 | 2 | 2.0 |

Scores are judgement, not measurement; no conversion claim is made. C, D and E also hit hard blockers (unverified attribution, personal-account dependence, unconfirmed deprecation) so they fail regardless of score.

## How readers shop
1. An article shows the finished result, then the supplies, with a card per product: a "Start here" or "Optional extra" label, a "Best for..." line, one reason, one honest caveat and a button reading "See It on Amazon" (it opens that product on Amazon).
2. The end of each article has "Shop this story" (every mentioned product) and a "See the whole kit: <shelf>" button that goes to the shelf in our Shop, not to Amazon.
3. The Shop shelf lists essentials ("Start here"), then extras. Where taste matters, a product has a "choose one" block under it (label for how it differs: prettier, budget-friendly, premium, different style, mix-your-own). Alternatives are never presented as extra purchases.
4. Each button goes to one Amazon page. No button claims to buy everything.

## Kits
Paper Edit (junk journaling), Creative Edit (air-dry clay), Hosting Edit (American mahjong). A fourth, a cozy craft-night project, is held until a candidate is verified (Cowork batch 2, `docs/cowork/BATCH-2.md`). Three good kits beat eight thin ones.

## What the shop sells
Only what the activity needs that most readers would not already own (owner rule, 2026-11-23). Scissors and ordinary tape are not sold; washi is an optional extra. Articles mention such items in prose without a link.

## Rules for alternatives
Up to two per main product, only when the choice is about taste or budget; a budget alternative only if genuinely worthwhile. Nothing enters the catalog until its exact ASIN, variant and claims are verified on Amazon.com. No prices, ratings, discounts or "best seller" language.

## Not yet verified
Candidate products and ASINs (Strathmore, ephemera packs, Jovi, Crayola, paint-by-numbers, embroidery); live affiliate attribution; the owner's Associates approval; List or Idea List eligibility. These can be revisited after account approval, but nothing depends on them.

## Measuring (no new tools)
If GA4 is switched on later, each product button sends an `amazon_click` event with product, article or page, and placement, so outbound clicks can be read per article and per shelf. Nothing is measured now and no figure is promised.
