# Amazon Lists for our Bundles: results (Cowork, 2026-11-23, steps 1 to 8)

**Not OK / not done, first:**
- Step 7 (signed-out view): **Unverified.** The browser tool cannot open a private/incognito window, and the one signed-out fetch attempt needed an approval nobody answered. Not retried.
- Step 6 phone view: **Unverified as a true mobile view.** I only emulated 390 px by framing the desktop page; Amazon served its desktop layout (side list of Lists crowds out the items, horizontal scroll). Real phone/app not tested.
- Step 8 (Share/Invite URL structure): **Blocked (owner gate).** The Invite dialog warns that copying a link changes the List's privacy to "Shared". Generating or copying a link would be sharing a List link, so I did not click "Copy link" or "Invite by email". The List is still **Private**.
- Steps 9 (make public), 10 (tagged link click), 11 (attribution): **BLOCKED (owner gate).** Not started.
- Alternative `B09HN2PR9K` (Scotch Abstract Modern) was not added: only one washi option is needed to test "choose one" behaviour. Add it if you want the alternative shown.
- Cleanup: the test List `PPF test, Junk Journal Starter Bundle` still exists, private, in the owner's account with 6 items. Delete it when finished (List menu "..." then Manage list, Delete list). Nothing was bought, nothing added to the cart.

## What I did
- Step 1: re-read the Associates Participation Requirements and Agreement pages (no changes found versus section C of the assignment).
- Step 2: Associates Central (signed in): account active; SiteStripe shows on Amazon pages and on the List page; tracking IDs not changed. No payment or settings change made.
- Step 3: List creation is allowed in the owner's account. Create dialog asks only for a List name. Manage list offers: name, Privacy (Private / Public / Shared), description textarea, recipient name, email, "make default List" checkbox, Alexa-device access options, Delete list. No List-count or item-count limit was shown.
- Step 4: created ONE List named `PPF test, Junk Journal Starter Bundle`, privacy Private (Amazon's default). Added 6 items using the product-page "Add to List" menu: B0CN7B82NG, B000XAHF7S, B0C4VRJ1XP, B0C922C7WT, B09HN34X72, B06VTCRXBC. No purchase.
- Step 5 (organization): per-item "Add a note" dialog has a comment (255 characters), Priority (lowest, low, medium, high, highest) and Needs / Has quantities. Saved a test note on the Tim Holtz item ("Optional extra. Skip if you already have ephemera."); it shows under the title with "Priority: medium". Sort menu: Most recently added, Custom, Priority (high to low), price low/high. Filter: Unpurchased / Purchased / All. There are **no sections or tabs** inside a List and **no optional/"choose one" flag**; those would have to be written into notes or done with separate Lists.
- Step 6: desktop view looked fine (title, Private badge, Add item, share, "..." menu; items in a list or grid toggle). Item prices, star ratings and review counts appear on every item and are controlled by Amazon, not us.

## F. Results table
| Test | Result | Evidence (source URL, date, screenshot name) | Remaining issue |
|---|---|---|---|
| Amazon Associates account eligibility | Verified | Associates Central signed in, 2026-11-23 (see BATCH-4-NOTES.md Part B) | Payment-related banner on the home page, not investigated |
| List creation permitted | Verified | Created a private List in owner's account, 2026-11-23; `lists-H-private-list-header.png` | None |
| Public List visibility (signed out) | Blocked | Owner gate (steps 7 and 9); a private List was not viewed signed out | Needs owner yes and a private window |
| Mobile presentation | Unverified | 390 px frame only; desktop layout served | Test on a real phone |
| Product alternatives ("choose one") | Unverified | No built-in feature found. Both 3-pack and 8-pack pens are in the List with no link between them | Only a note can say "choose one" |
| Essential versus optional organization | Unverified | Only per-item priority and notes exist; no sections | Use notes plus priority, or two Lists |
| Notes or descriptions on items | Verified | Saved a test note on the Tim Holtz item, 2026-11-23 | Note limit 255 characters; List itself has a description field |
| Sections or one-List-per-bundle | Verified (no sections exist) | Create/Manage dialogs, 2026-11-23 | Separate Lists would be needed to split essentials from optional |
| Tagged link permitted by policy | Unverified | Policy text read; no explicit permission for linking to Lists found. Participation Requirements 4(p) forbids Special Links placed inside a Wish List | Ask Associates support in writing before any use |
| Tag survives redirects | Blocked | Owner gate (step 10) | |
| Attribution independently verified | Blocked | Owner gate (step 11) | |
| Buyer transferability | Unverified | The List lives in the owner's personal Amazon account and cannot be transferred with the site | See section I |

## G. Recommendation
**Option 2: do not use Amazon Lists as the bundle format for the $1,500 sale.** Reasons from the evidence: (1) Lists have no sections and no "choose one" or optional flag, so our Essentials / Choose-one / Optional structure cannot be expressed except through notes; (2) a List is tied to the owner's personal Amazon account and cannot be handed to a buyer; (3) policy text does not clearly allow tagged links to customer Lists, and 4(p) forbids Special Links inside Wish Lists; (4) generating a share link changes privacy to Shared, so any link outward needs a deliberate owner decision; (5) viewers see Amazon prices and ratings we do not control. Keep the existing on-site bundle pages with individual tagged product links. Revisit as option 3 (optional future) only if Amazon support confirms in writing that tagged links to Lists are allowed and attributed.

## I. Buyer transferability
- The List, its URL and its items belong to the owner's Amazon customer account, not to the Associates tag or the site. A buyer cannot receive it; they would have to build their own.
- The Associates tag and Agreement cannot be assigned to another party (per the Agreement and IP License pages read in step 1).
- The test List should be deleted before sale; no reference to it exists in the repo.
