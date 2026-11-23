# Image records

Every picture on the site has one record in `src/content/images.json`, the only place rights are kept (articles and products point to it by key or file name). A record can be `approved` only when commercial use is `yes` and it has a source address, licence name and address, a licence-checked date and approval date (photographs also need a credit). In `launchMode` production a picture a page uses must be approved. `images.json` is not editable in the CMS form: edit it on GitHub or ask the AI or developer (`docs/OWNER-OPERATIONS.md`).

Captions follow the kind: AI illustrations carry no caption (the use of AI imagery is disclosed on the About and Terms pages and in the privacy page; owner decision 2026-11-23), photographs "Photo: <credit>", product photos "Product photo: <credit>". An illustration is never presented as a tested result or a photo of a product. No Amazon, manufacturer or stock-product images are used.

## Inventory (16 used pictures)
| File | Used on | Kind and tool | Rights status |
|---|---|---|---|
| `girls-night-crafts.jpg` | Home hero | AI (Lovable) | approved 2026-11-20 |
| `cozy-corner.jpg` | Home story band, hobbies article hero | AI (Canva) | approved 2026-11-20 |
| `junk-journal-spread-leaves-collage.jpg` | Junk journal supplies hero; Shop paper shelf | Photo (Pexels) | approved 2026-11-20 |
| `junk-journal-floral-handmade-book.jpg` | Tutorial hero | Photo (Pexels) | approved 2026-11-20 |
| `clay-ring-dish-painted-blossoms.jpg` | About page; Shop creative shelf | Photo (Pexels) | approved 2026-11-20 |
| `junk-journal-shoebox-post.jpg` | Supplies article (Shoebox Post) | AI (Canva) | approved 2026-11-20 |
| `clay-cherry-dish.jpg` | Clay article (Project 1) | AI (Canva) | approved 2026-11-20 |
| `friends-mahjong-night.jpg` | Mahjong article hero | AI (Canva) | approved 2026-11-23 |
| `american-mahjong-table-tiles-and-racks.jpg` | Mahjong article inline; Shop hosting shelf | Photo (Pexels) | approved 2026-11-20 |
| `clay-three-projects-hero.jpg` | Clay article hero | AI (Canva) | approved 2026-11-20 |
| `junk-journal-garden-press.jpg` | Supplies article (Garden Press) | AI (Canva) | approved 2026-11-20 |
| `junk-journal-tea-rose.jpg` | Supplies article (Tea Rose) | AI (Canva) | approved 2026-11-20 |
| `clay-coil-tray.jpg` | Clay article (Project 3) | AI (Canva) | approved 2026-11-20 |
| `clay-bow-scalloped-dish.jpg` | Clay article (Project 2) | AI (Canva) | approved 2026-11-20 |
| `junk-journal-finished-spread.jpg` | Supplies article (seven steps) | AI (Canva) | approved 2026-11-20 |
| `junk-journal-three-layouts.jpg` | Tutorial (three layouts) | AI (Canva) | approved 2026-11-20 |

`junk-journal-flatlay.jpg` was an unused legacy file and has been removed.

## Third-party rights and what a buyer must do
- **Canva AI images (11):** generated with Canva's AI image tool under its AI Product Terms and Terms of Use; the owner read and approved them on 2026-11-20. Canva's terms say nothing explicit about transferring a site with the images, so transfer is **unverified**. A buyer should read the terms themselves, or regenerate or replace any image they are not comfortable keeping. No exclusivity or registrable copyright is promised for AI images.
- **Lovable AI image (1: `girls-night-crafts`):** generated with Lovable's image tool; terms read by the owner 2026-11-20; transfer unverified, same advice.
- **Pexels photographs (4):** free to use under the Pexels License, credited to the photographers; the licence does not say whether images pass to a buyer of a site, so treat transfer as **unverified**. Replace any one by uploading your own photo to `public/images/`, adding a record, and pointing the article at it.
- **Fonts:** Fraunces, DM Sans and Caveat (SIL Open Font License 1.1), self-hosted in `public/fonts/`.

## Replace or remove a picture (no developer needed)
1. Put the new JPEG (about 2000 px wide) in `public/images/` (GitHub: Add file > Upload).
2. Add a record for it in `src/content/images.json` (copy an existing one; set kind, credit, source, licence, dates).
3. In the article's Top picture field, or in the Markdown figure, point to the new file name. Pictures on Home, About and the Shop shelves are chosen by the record key in `src/pages/index.astro`, `about.astro` and `COLLECTIONS` in `src/lib/schemas.mjs`.
4. Delete the old file and record. `npm run check` fails if anything still points to a missing picture.
