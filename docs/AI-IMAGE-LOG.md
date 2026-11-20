# AI image log (replacement editorial images)

Status 2026-11-20: **no replacement image has been added to the site yet.** The Canva image generator produced one image (slot 1) and then refused every further request with `quota_cooldown` ("Your credit usage is cooling down"). The one result could only be retrieved as a 200x133 preview, not the full file, and canva.com returns HTTP 403 to automated downloads. So `public/images/` and `src/content/images.json` are unchanged (a record without a file would fail the checks). Nothing here is approved.

Tool: Canva AI image generator (Canva connector `generate-image`). Terms to be read by the owner in a browser (Canva returns 403 to automated fetchers):
- https://www.canva.com/policies/ai-product-terms/
- https://www.canva.com/policies/terms-of-use/
- https://www.canva.com/policies/content-license-agreement/

Common prompt rules: no text or letters, no logos or brand names, no recognisable people or faces, no specific product shapes. All images are illustrative, never a product photo or a thing we made. AI output: no exclusive copyright assumed.

| Planned file | Slot | Tool / date | Prompt (all end with: no text, no letters, no logos, no brand names, no people/faces, no specific product shapes) | Canva link | Status |
|---|---|---|---|---|---|
| `hobbies-busy-women-hero.jpg` | A09 Hobbies for Busy Women hero (3:2) | Canva AI, 2026-11-20 | Warm cosy collage-style overhead scene of a wooden table with hobby items: open journal with colourful pens, small handmade clay trinket dish, embroidery hoop with floral stitching, ball of yarn with crochet work, paperback book, two mahjong tiles. Soft warm daylight, butter-yellow and cherry-red accents, editorial lifestyle style. | https://www.canva.com/M/MAHbeCSP7vQ (media id MAHbeCSP7vQ) | Generated; preview looked plausible (journal, pens, clay dish, hoop, yarn, tiles, book) but file not obtained at full size. Must be exported and looked at before use. |
| `mahjong-night-table-hero.jpg` | A05 Mahjong Night hero (3:2) | not generated | American mahjong night: four wooden tile racks with rows of tiles, tiles on a table, friends' hands only (not identifiable), snack bowls, tea cups, warm lamplight. Tiles show only abstract coloured shapes, no numerals, no card. | none | Blocked: quota cooldown |
| `air-dry-clay-finished-pieces.jpg` | A03 clay (label "illustrative project ideas") | not generated | Flat-lay of finished air-dry clay pieces on linen: scalloped cream trinket dish with cherry-red painted rim, small pinch-pot ring dish, small rectangular tray. Soft natural light. | none | Blocked |
| `air-dry-clay-setup-overhead.jpg` | A03 clay setup (3:2) | not generated | Tidy overhead flat-lay of a clay-making setup on light wood: block of white clay, wooden rolling pin, small paint pots with brushes, cup of water, small cutter. | none | Blocked |
| `junk-journal-supplies-hero.jpg` | Junk Journal supplies hero | not generated | Open junk journal spread from above layered with tape strips, stickers, ephemera, pressed flowers, torn vintage papers, soft warm light. | none | Blocked |
| `shoebox-post-mood.jpg` | Shoebox Post mood | not generated | Cream and kraft envelopes tied with twine, old-fashioned stamps with abstract designs, kraft paper, wax seal, rustic table, warm muted light. No readable stamps/postmarks. | none | Blocked |
| `garden-press-mood.jpg` | Garden Press mood | not generated | Pressed flowers and leaves on botanical papers, wooden flower press, soft diffused light, muted greens and pinks. | none | Blocked |
| `blue-grey-minimal-mood.jpg` | Third mood (chosen: blue-grey tidy minimal) | not generated | Overhead neat stationery, notebook, pencils, small plant, blue-grey and white, lots of negative space. | none | Blocked |

## Steps for the owner or Cowork to approve each image
1. Open the three Canva terms pages above in a browser; save a dated copy (PDF or screenshot) and note the version date.
2. Generate or export each image from Canva at full size (for slot 1 open the Canva link and download); do not use Canva library photos or elements, and confirm the image used none.
3. Look at each image: reject garbled text, odd hands, brand marks or wrong subject. Resize to web size (hero 2000 px wide JPEG ~82, others 1200 to 1600 px, strip EXIF) into `public/images/`.
4. Add a record per image to `src/content/images.json`: kind `ai-illustration`, credit "Generated with Canva AI", source name "Canva AI image generator" plus the Canva link, licenceName "Canva AI Product Terms / Terms of Use", licenceUrl the terms URL, attribution `none`, notes with tool, date, exact prompt, link and "AI-generated: no exclusive copyright; illustrative image, not a product photo or a physical outcome". Start with commercialUse `unverified`, rightsStatus `pending`.
5. After step 1: set commercialUse `yes`, transferWithSite as the terms allow (Canva is silent on transfer, so likely `unverified`), `licenceCheckedOn`, `approvedOn`, and rightsStatus `approved`.
6. Caption each as "Illustrative image (AI-generated)".
