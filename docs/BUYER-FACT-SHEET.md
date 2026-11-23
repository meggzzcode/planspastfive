# Plans Past Five: buyer fact sheet

Counts are as of 2026-11-23. Run `npm ci && npm run check && npm test` in a copy of the repository to confirm them.

## What this is
A small, static lifestyle magazine with a curated Amazon shop, built with Astro, edited in Pages CMS, hosted on Netlify. Pre-revenue: **no traffic, sales or earnings history, and no verified affiliate attribution.** The asking price is an asking price, not a valuation.

## What the buyer receives
| Item | Detail |
|---|---|
| Website source | Astro site, plain CSS, 15 built pages, tests (130 automated), content and link checks, no database, no client-side shopping code |
| Articles | 5 published (junk journal supplies, first junk journal spread, air-dry clay, mahjong night, hobbies for busy women): a shopping guide, two starter guides, an experience guide and a discovery pillar |
| Shop | 4 shelves (paper, creative, cozy, hosting); 20 product records of which 14 are shown (essentials, optional extras, and "choose one" alternatives); text-only cards with a verified "In the box" line, a "Worth knowing" caveat and a clear button |
| Product system | One JSON file per product with status, evidence and approval controls; links are built centrally from the ASIN and your tracking ID; unverified products cannot appear in production |
| Publishing | Pages CMS forms, a Publish button with checks, Undo, an optional release queue (manual or automatic posting, off by default), Netlify build rule that spends credits only on `[deploy]` commits |
| Pictures | 16 pictures with a rights record each: 12 AI-generated (10 Canva, 2 Lovable) and 4 Pexels photographs, plus the red "5" site icon |
| Domain | planspastfive.com (registered 2026-11-19, expires 2027-11-19, auto-renew off), moved by registrar transfer; mailbox hello@planspastfive.com on Namecheap |
| Documents | Owner guide, publishing guide, transfer steps, costs, risks, status, shopping strategy, image records, article templates (`docs/`) |

## What the buyer does NOT receive
- The seller's Amazon Associates account, tracking ID, sales history or the seller's 180-day qualifying period. Amazon's agreement cannot be assigned without its written approval; the buyer applies for their own account, replaces the tracking ID (`docs/OWNER-OPERATIONS.md`) and verifies every product again.
- The seller's Netlify plan or credits, GitHub or Cowork accounts, any password or credential.
- Any right in Amazon, Canva, Lovable or Pexels content beyond what those services' own terms give a buyer. **Image transfer rights are unverified** for the Canva, Lovable and Pexels pictures (`docs/IMAGE-RECORDS.md`); the buyer can replace any picture (steps are there).
- Product photographs: none are used, by design, until Amazon's Creators API access exists.

## What is proven and what is not
| Proven by automated checks | Not yet proven |
|---|---|
| Content, product-approval, price-rule and link checks; the production build with tracking on (in an isolated copy); the release logic | A real Pages CMS login, Publish, Undo and release run on GitHub and Netlify (`docs/cowork/BATCH-4.md` Part D); live affiliate attribution; the owner's Associates approval status; the live domain |

## Running costs (see `docs/COSTS.md`)
About $108 a year Netlify Personal, about $16 to $20 domain renewal, plus mailbox renewal (price unconfirmed). Each production deploy costs 15 of 1,000 monthly Netlify credits.

## First week as the new owner
1. Move the repository, Netlify site, domain and mailbox to your accounts (`docs/TRANSFER.md`).
2. Apply for your own Associates account; replace `amazonTrackingId`; keep tracking off until you are ready to launch.
3. Re-check every shown product on Amazon.com and update its checked date.
4. Read `docs/IMAGE-RECORDS.md`; replace any picture you are not comfortable keeping.
5. Publish one change from Pages CMS to see the whole workflow work.
