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

import { shopGroups } from "../src/lib/catalog.mjs";
const mk = (id, extra = {}) => ({ id, name: id, brand: "B", asin: "B0TESTAAAA", status: "verified", editorialDecision: "approve", collection: "creative", ...extra });

test("an alternative sits under its main product and is not a second essential", () => {
  const g = shopGroups([mk("main"), mk("alt", { choiceOf: "main", choiceLabel: "Budget-friendly alternative" })])[0];
  assert.deepEqual(g.start.map((p) => p.id), ["main"]);
  assert.deepEqual(g.alternatives.get("main").map((p) => p.id), ["alt"]);
});

test("an alternative whose main product is not shown becomes an ordinary product", () => {
  const g = shopGroups([mk("main", { editorialDecision: "hold" }), mk("alt", { choiceOf: "main", choiceLabel: "Different style" })])[0];
  assert.deepEqual(g.start.map((p) => p.id), ["alt"]);
});

test("alternative card shows its label instead of Start here", () => {
  const h = productCardHtml({ ...p, shopTier: "start", choiceLabel: "Prettier alternative" }, settings, {});
  assert.match(h, /product-card__tier product-card__tier--alt">Prettier alternative</);
  assert.doesNotMatch(h, /Start here/);
});

import { makeCopy, cleanup, editJson, checkContentCli } from "./helpers.mjs";
test("check-content rejects a bad choiceOf and accepts a good one", () => {
  const dir = makeCopy("ppf-choice");
  try {
    const f = "src/content/products/nmjl-2026-standard-cards-four-pack.json";
    editJson(dir, f, (x) => { x.choiceOf = "tombow-mono-permanent"; x.choiceLabel = "Different style"; });
    assert.match(checkContentCli(dir).out, /different shop section/);
    editJson(dir, f, (x) => { x.choiceOf = "no-such-product"; });
    assert.match(checkContentCli(dir).out, /does not exist/);
    editJson(dir, f, (x) => { x.choiceOf = "nmjl-2026-large-print-cards-four-pack"; });
    assert.ok(checkContentCli(dir).ok);
  } finally { cleanup(dir); }
});
