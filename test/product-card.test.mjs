// The product card stays simple: name, one reason, one caveat, the button. Evidence fields stay private.
import { test } from "node:test";
import assert from "node:assert/strict";
import { productCardHtml } from "../src/lib/render-product.mjs";

const p = {
  id: "demo", name: "Demo Pen", brand: "Demo Brand", asin: "B0TESTAAAA", cta: "See It on Amazon",
  whyWeLikeIt: "Writes cleanly on glued paper. A second sentence of detail.", bestUse: "Best for captions",
  limitations: "Not refillable. More detail follows.", descriptionOriginal: "A long original description.",
  suitability: "Private suitability note.", specsEvidence: "Private evidence.", qualityNote: "Private quality note.",
};
const settings = { amazonTag: "", trackingEnabled: false, launchMode: "demo" };

test("card shows name, best-use label, one reason, one caveat and the button; no extras", () => {
  const h = productCardHtml(p, settings, {});
  assert.match(h, /Demo Pen/);
  assert.match(h, /Writes cleanly on glued paper\./);
  assert.doesNotMatch(h, /second sentence|More detail/);
  assert.match(h, /Worth knowing:<\/strong> Not refillable\./);
  assert.match(h, /class="button"/);
  assert.match(h, /product-card__best">Best for captions</);
  for (const hidden of ["long original description", "Private", "<dl", "product-card__media"]) assert.doesNotMatch(h, new RegExp(hidden));
});

test("card marks essentials and optional extras from shopTier", () => {
  assert.match(productCardHtml({ ...p, shopTier: "start" }, settings, {}), /product-card__tier">Start here</);
  assert.match(productCardHtml({ ...p, shopTier: "extras" }, settings, {}), /product-card__tier">Optional extra</);
  assert.doesNotMatch(productCardHtml(p, settings, {}), /product-card__tier/);
});

test("compact card is just name and button", () => {
  const h = productCardHtml(p, settings, { compact: true });
  assert.doesNotMatch(h, /Writes cleanly|Worth knowing/);
  assert.match(h, /class="button"/);
});
