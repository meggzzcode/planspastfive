# Article templates (what the five published articles already do)

Use the `format` field in an article to pick the shape. Voice for all: warm, specific, honest, a small concrete scene first, no hype, no first-hand testing claims, no prices. Length follows the job, not a word count (the published five run about 600 to 1,700 words).

## discovery (model: `hobbies-for-busy-women`)
Open with a relatable moment, then **sort the options by what the reader has left** (energy, budget, company). Each option is a short card: time, company, buying commitment, what you need, first step. Link to the full guide where one exists; **no product cards**, only links to guides and shop shelves. Close with "pick the smallest first step".

## starter-guide (models: `air-dry-clay-for-beginners`, `your-first-junk-journal-spread`)
Open with the finished result as a scene. Then: one honest note (limits, safety), what you need (essential, from home, optional), one rule that prevents most failures, numbered steps per project, what to do when it goes wrong, quick questions, one next step. Products appear once, where the reader first needs them (`{{pick:id}}`), with any alternative mentioned in prose (`{{product:id}}`). End with a link to the matching shop shelf.

## shopping-edit (model: `junk-journal-supplies-for-beginners`)
Open with the picture, then the **bundle at a glance** (essentials, optional extras, link to the matching bundle in the Shop). Offer a few looks to choose from, then the starter basket in the order the reader will use it, each with one pick and a plain sentence on how to use it. Only buy-worthy items get a card: things the activity needs that most readers do not already own. Optional extras sit separately and say so.

## experience-guide (model: `how-to-host-a-mahjong-night`)
Open with the scene at the start of the event, state the scope, then a realistic timeline, setup, a teaching or running order, food and drink, etiquette, what beginners get wrong, **borrow or buy** (products last, and the event works without them), questions, and the invitation line.

## Every article
- Front matter: title, description (one sentence), dek, category, format, `picks` (verified product ids only), `related` (existing articles only), a hero with alt text and an approved rights record (`docs/IMAGE-RECORDS.md`). Leave `status: draft` and no date until it is released (`docs/editorial/PUBLISHING-THE-BACKLOG.md`).
- Link to at least one related guide and the matching Shop bundle, and say truthfully what the bundle holds.
- Claims about products come from the product record; claims about the world come from a source you read (note it). Leave out anything you cannot source.
- Images: AI illustrations are captioned as such; never present one as a tested result.
