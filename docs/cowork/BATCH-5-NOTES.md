# Batch 5 notes (Parts 1, 2, 3; 2026-11-23)

Part 4 was NOT done (owner-gated). No personal email, account or other-business names are recorded here. Nothing was changed, bought, or saved from Amazon.

## Not OK / needs the owner (first)
- **FAIL, Part 2.2 GitHub:** Settings, Actions, General, Workflow permissions is **"Read repository contents and packages permissions"**. The brief says it should be **Read and write**. Not changed (owner action). The three workflows are listed and enabled but have **0 runs so far**, so they are untested.
- **FAIL, Part 2.1 Namecheap:** **Auto-renew is OFF** for both the domain and the privacy protection. Both run to Nov 19, 2027. Turn on or note a reminder. Domain lock is ON.
- **Watch, Part 2.3 Netlify:** credits left **95.2 of 1,000**, plan resets Dec 16. The usage panel shows production deploy credits already used this period. Every push to main triggers a "Canceled" production row plus a completed `preview` branch deploy, and the preview builds spend credits.
- **Part 3:** no picnic blanket fully meets the brief. The only one sold by Amazon.com does not say machine washable; the washable one is third party. No third paint-by-numbers kit states a colour count, so none is recommended.
- **Part 1:** nothing in any terms states that images can be transferred to a buyer; ask each provider if this matters.

## Part 1. Image licence wording: PASS (read from the public pages, 2026-11-23)
| Source (page date) | (a) Commercial use | (b) Pass to a website buyer | (c) Attribution |
|---|---|---|---|
| Canva AI Product Terms (effective 26 June 2026) | "You may use your Output for any lawful purpose" (subject to these terms, at your own risk). Terms also say you own your Output, except content that incorporates Licensed Content, which is licensed separately. | Not stated. Output is "User Content" that you own; ownership is not restricted but transfer is not mentioned. | Not stated. Terms note outputs may not be unique to you. |
| Canva Terms of Use (effective 16 November 2026) | Licensed Content (stock, etc.) is governed by the Content License Agreement, which varies by item; "We never own your designs" but restrictions apply. | Not stated for designs. The Service licence itself is "non-transferable". Licensed Content may not be sold or sublicensed on its own. | Not stated here; depends on each item's licence (shown by the info icon in Canva). |
| Lovable Terms of Service (last updated Aug 28, 2026) | You may use the Services to create, deploy and operate apps and websites; "you also own any AI Output generated for you", subject to third-party rights. | Not stated for a sale. The licence to use the Services is non-transferable; your Customer Data (apps, sites) is yours. | Not stated. |
| Pexels License (page not dated) | "All photos and videos on Pexels are free to use." | Not stated. Bans reselling or redistributing the files on other stock platforms, and selling unaltered copies as products. | "Attribution is not required." |
Read sections only; I did not read every clause (the Content License Agreement itself was not opened).

## Part 2. Launch-readiness items: PARTIAL (one FAIL, see top)
### 2.1 Namecheap (read-only, owner signed in)
- Status ACTIVE, Nov 19, 2026 to Nov 19, 2027. Privacy protection on, same dates. **Auto-renew OFF** (both). **Domain lock ON.** Nameservers: Namecheap BasicDNS ("Standard Nameservers").
- DNS records (nothing edited): A `@` to `75.2.60.5`; CNAME `www` to `plans-past-five.netlify.app.`; TXT `@` SPF `v=spf1 include:spf.privateemail.com ~all`; TXT `@` Pinterest site verification (token not copied here); MX `@` to `mx1.privateemail.com.` and `mx2.privateemail.com.`, both priority 10.
- Private Email: 1 of 1 mailboxes in use; **`hello@planspastfive.com` exists** in the control panel. Valid to Nov 19, 2027.
- No redirects, parking page OFF. A "change ownership" option exists on the Sharing & Transfer tab if the buyer has a Namecheap account.
### 2.2 GitHub: FAIL on permissions; workflows PASS
`Publish content`, `Undo last publish`, `Release next article` are all listed under Actions (no disabled marker; 0 runs).
### 2.3 Netlify (read-only)
- Last production deploy attempt: `main@f8fda05` today 6:21 PM, **Canceled** (by design: build ignored unless the commit message has [deploy]). Same for the cce4616, c74b04a, 1449eb8, 4ee3055 and d2f0fb8 commits.
- Last successful production deploy: **`main@4ab3cc4`** ("Merge branch 'wp-photo'", commit dated 2026-11-20 15:09 UTC); the page shows it as "Published". The deploy's own timestamp was not read.
- Branch deploys for `preview` are enabled: `preview@f8fda05` Completed in 19s today 6:21 PM.
- Credits: 95.2 / 1,000 remaining (Personal plan).

## Part 3. Amazon product checks: PASS with gaps (details in BATCH-5-RESULTS.csv)
Link Checker (`.../dp/<ASIN>?tag=planspastfive-20`) returned "Success: The link tags to a valid tag or sub-tag for your Associate ID." for every ASIN listed below (it checks tag format only).
1. Picnic bag: **ADD** Fit & Fresh Mari `B0CQPPZB8W` (sold by Amazon.com, 12-can, 11.5 x 5 x 12.5 in); alternative Away Cooler Tote `B0H5RKFQDX` (sold by Away). Sealed liner and a main zip closure are not stated for the Mari.
2. Ice packs: **ADD** Fit & Fresh soft 2-pack `B0DY2R4VBK` (Amazon.com, "Non-toxic and BPA-free"); alternative Cooler Shock `B078FR9CND` (non-toxic not shown, needs filling).
3. Blanket: alternative Scuddles `B07D39W1JV` (Amazon.com, 3-4 people, waterproof, carry strap, **not stated machine washable**); REJECT ZAZE `B0919RGDRV` (washable but third party).
4. Third paint kit: no ADD. HeeBenor `B0F2FC95YW` (8x12 framed, easel, acrylic, brand seller) shows no colour count and a title that says "Oil"; Bowetile and BAISITE also show none.
5. Claim checks: Faber-Castell `B08DGL3R8K`: pre-printed brush strokes **not shown**; wet-on-wet or washes **not shown**; six 5 ml pots (white, purple, medium blue, yellow, green, magenta); canvas 6 x 8 in. JOOZ `B0D6VHXD88`: 8 x 12 in canvas with wooden frame, adjustable wooden easel, 3 brushes, "a set of acrylic paints"; paint count **not shown**; the title says "Oil Painting Kit".

Not done: Part 4 (owner-gated). Not for Cowork: deleting `cowork/batch-4`, the private test List, Associates changes.
