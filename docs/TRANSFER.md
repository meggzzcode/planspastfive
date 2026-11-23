# Handing the site to a buyer

## What is included in the sale
The Astro site source (5 articles, 16 product records of which 12 are shown, the shop, legal-page drafts, publishing workflows, tests), the owner documents in `docs/`, the picture files with their rights records, and the domain planspastfive.com (moved by registrar transfer). **Not included:** the seller's Amazon Associates account or tracking ID, Netlify plan or credits, GitHub or Cowork accounts, any login or credential, and any right in Amazon, Canva, Lovable or Pexels content beyond what their own terms give a buyer (see `docs/IMAGE-RECORDS.md`). The asking price ($1,500) is an asking price, not a valuation; the site has no traffic or earnings history.

## What the buyer must set up themselves
| Needs | Why |
|---|---|
| Their own **Amazon Associates account** and their own tracking ID | The seller's account and tag cannot be transferred (Operating Agreement). The buyer applies for their own account, replaces the tag, and starts their own 180-day qualifying-sales period |
| A **GitHub** account (private repository) | Holds the site and all content |
| A **Netlify** account (or another static host) | Builds and serves the site; the seller's plan does not transfer |
| A **domain registrar** account | The domain can be moved by the registrar's transfer process |
| A mailbox for the contact address | Currently hello@planspastfive.com on Namecheap Private Email |
| Pages CMS access | Free; sign in with GitHub and add the repository |

## Steps
1. Seller transfers or shares the repository (GitHub transfer), or the buyer receives a copy of the files.
2. Buyer connects the repository to their own Netlify site (build command `npm run build`, publish folder `dist`, Node 22).
3. Buyer sets repository Settings, Actions, Workflow permissions = Read and write; creates the branch `content-edits` from `main`.
4. Buyer opens Pages CMS and adds the repository.
5. In Site settings: replace `amazonTrackingId` with their own ID. Amazon lets a new Associate use links after applying (final approval follows three qualifying sales within 180 days; see `docs/AMAZON-ASSOCIATES.md`), so switch tracking on once the buyer's account is registered, the site is public and the buyer is ready, then publish. Update `contactEmail`, `siteUrl`, analytics ID.
6. Re-verify every product against its Amazon page (update `listingChecked.checkedOn` and `verificationSource` in their own name) before relying on the shop.
7. Seller deletes the seller's tracking ID from the repository history if the buyer asks; the seller's account is not part of the sale.
8. Move the domain and mail; update DNS; check the built site loads.
9. Re-read the picture tools' terms (`docs/IMAGE-RECORDS.md`) and replace any picture the buyer is not comfortable with.

**Never share personal credentials.** Do not send passwords, card details, Associates logins or two-factor codes. Add the buyer as a collaborator or transfer ownership through each service's own process.
