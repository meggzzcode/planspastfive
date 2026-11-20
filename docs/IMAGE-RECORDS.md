# Image records

Every picture used on the site, with where it came from. Copied from the earlier Plans Past Five project's ledger (`docs/IMAGE-LICENSES.md` and `docs/content/IMAGE-LICENCE-LEDGER.md` there). Each picture has one record in `src/content/images.json` (the only place rights are recorded; articles and products only point to it by file name). A record can be `approved` only when commercial use is `yes` and the source address, licence name and address, licence-checked date, approval date and (photographs and product photos) credit are all present. In `launchMode` "production" a picture that is not approved cannot be used. `images.json` cannot be edited in a Pages CMS form: change it on GitHub's website or ask the AI or developer (see `docs/OWNER-OPERATIONS.md`).

All four are **AI-generated illustrations**, not photographs, and **all four are `pending`** (not approved). The owner supplied them for use, but the earlier ledger says: *no exclusivity or registrable copyright promised; the tools' commercial-use and transfer terms were not verified.* That is the open risk in `docs/RISKS.md`. No Amazon, manufacturer or stock images are used.

| File | Used on | Tool and source | Licence statement |
|---|---|---|---|
| `junk-journal-flatlay.jpg` | Demo article hero, journal and home cards | Lovable AI image tool (per the earlier project record), made 2026-11 | AI-generated; no exclusivity or registrable copyright promised; tool terms govern commercial use and transfer: not verified |
| `girls-night-crafts.jpg` | Home hero | Lovable AI image tool (as above) | as above |
| `weekend-picnic.jpg` | About page | Lovable AI image tool (as above) | as above |
| `cozy-corner.jpg` | Home brand band | Canva AI, https://www.canva.com/M/MAHbXzI-Ijo, exported 2026-11-19 | AI-generated under the Canva AI Product Terms (https://www.canva.com/policies/ai-product-terms/); transfer to a buyer not stated by Canva |

Alt text for each is in `src/content/images.json`. Status of each record today: `pending` (commercial use unverified; the Lovable-made pictures also lack a source address, licence and approval date).

## Fonts
Fraunces, DM Sans and Caveat (SIL Open Font License 1.1), self-hosted in `public/fonts/` from the `@fontsource-variable` packages (version 5.3.0, Latin subset). No requests to Google Fonts.

Captions follow the kind of picture: AI illustrations are captioned "Illustrative image (AI-generated)", photographs "Photo: <credit>", product photos "Product photo: <credit>". This stops an illustration being mistaken for a photo of a tested outcome or of a product.
