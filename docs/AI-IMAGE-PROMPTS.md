# AI image prompt pack (approved direction, 2026-11-20)

Direction: AI-generated images are the intended look for article heroes, hobby inspiration, finished-project concepts, mood boards and Pinterest graphics. Product cards use authentic product photography only (none until Creators API access; text cards meanwhile). Never present an AI image as a real product, or as something we made or tested. Caption: "Illustrative image (AI-generated)".

Shared style line (end of every prompt): premium lifestyle photograph, soft natural window light, warm cream, butter-yellow and cherry-red accents, shallow depth of field, realistic materials, no text or letters, no logos or brand names, no people or faces, physically plausible.

| File to save in public/images/ | Article | Prompt (then add the shared style line) |
|---|---|---|
| junk-journal-shoebox-post.jpg | Junk Journal | Overhead handmade junk journal open to a tan kraft spread layered with airmail-style envelopes, torn aged paper, twine and black ink lines |
| junk-journal-garden-press.jpg | Junk Journal | Overhead junk journal spread with pressed flowers and leaves on botanical paper, sage green and blush, a pair of small scissors |
| junk-journal-tea-rose.jpg | Junk Journal | Overhead junk journal spread in tea-rose pinks, cream lace, scraps of floral paper and a pressed rose, no tape required |
| clay-cherry-dish.jpg | Air-Dry Clay | Small white air-dry clay ring dish with a cherry-red painted rim and a ring in it, on linen |
| clay-bow-trinket-dish.jpg | Air-Dry Clay | Scalloped blush clay trinket dish with a soft bow shape and butter-yellow rim, holding earrings |
| clay-coil-tray.jpg | Air-Dry Clay | Small oval olive-green clay tray with a low rolled lip and pressed pattern, holding keys |
| mahjong-night-setup.jpg | Mahjong Night | American mahjong hosting table: four tile racks, tiles, snack bowls, tea cups, strawberries, warm lamplight, tiles show only abstract shapes |
| busy-women-evening-hobbies.jpg | Busy Women | Cosy evening corner: journal, embroidery hoop, small clay dish and tea on a wooden table in lamplight |

## Saving and recording each image
1. Generate in Canva AI (or Lovable's image generator), download the full-size file, keep it ~2000 px wide JPEG, put it in `public/images/`.
2. Add a record in `src/content/images.json`: kind `ai-illustration`, credit "Generated with Canva AI", source name and link, licenceName "Canva AI Product Terms / Terms of Use", licenceUrl, attribution none, notes = tool, date, exact prompt, "illustrative, not a product photo or a physical outcome". The owner confirms the terms once (https://www.canva.com/policies/ai-product-terms/), then set commercialUse yes, licenceCheckedOn, approvedOn and rightsStatus approved.
3. Point the article hero at the new file.
