# Image records

Every picture used on the site, with where it came from. Copied from the earlier Plans Past Five project's ledger (`docs/IMAGE-LICENSES.md` and `docs/content/IMAGE-LICENCE-LEDGER.md` there). A picture can be published only when its record says `rights: cleared`; the records the site reads are in `src/content/images.json` (home and about pages) and in each article's `hero` block.

All four are **AI-generated illustrations**, not photographs. Each has `rights: cleared` in this repository because the owner supplied them as licensed for the site. The earlier ledger, however, says: *no exclusivity or registrable copyright promised; the tools' commercial-use and transfer terms were not verified.* That is the open risk in `docs/RISKS.md`. No Amazon, manufacturer or stock images are used.

| File | Used on | Tool and source | Licence statement |
|---|---|---|---|
| `junk-journal-flatlay.jpg` | Demo article hero, journal and home cards | Lovable AI image tool (per the earlier project record), made 2026-11 | AI-generated; no exclusivity or registrable copyright promised; tool terms govern commercial use and transfer: not verified |
| `girls-night-crafts.jpg` | Home hero | Lovable AI image tool (as above) | as above |
| `weekend-picnic.jpg` | About page | Lovable AI image tool (as above) | as above |
| `cozy-corner.jpg` | Home brand band | Canva AI, https://www.canva.com/M/MAHbXzI-Ijo, exported 2026-11-19 | AI-generated under the Canva AI Product Terms (https://www.canva.com/policies/ai-product-terms/); transfer to a buyer not stated by Canva |

Alt text for each is in `src/content/images.json` and the demo article's frontmatter.

## Fonts
Fraunces, DM Sans and Caveat (SIL Open Font License 1.1), self-hosted in `public/fonts/` from the `@fontsource-variable` packages (version 5.3.0, Latin subset). No requests to Google Fonts.
