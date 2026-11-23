// Product card pictures: shown only for an approved product-photo record, linked to the affiliate URL, replaceable.
import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { makeCopy, cleanup, npmBuild, checkContentCli, editJson, write, distHtml, approvedImage, promoteProducts, IMAGES, SETTINGS } from "./helpers.mjs";
import { captionFor } from "../src/lib/images.mjs";

const SLUG = "your-first-junk-journal-spread";
const ID = "tombow-mono-permanent";
const PROD = `src/content/products/${ID}.json`;
const ALT = "Tombow Mono Permanent Adhesive Applicator, a white and blue hand-held tape runner";
// 1x1 PNG
const PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", "base64");
const record = (file, over = {}) => ({ file, alt: ALT, kind: "product-photo", credit: "Tombow", source: { name: "Tombow press kit", url: "https://example.com/press" }, attribution: "none", ...approvedImage(), ...over });
const pages = (dir) => [`journal/${SLUG}/index.html`, "shop/index.html"].map((f) => [f, distHtml(dir, f)]);
const cardOf = (h) => h.match(new RegExp(`<article class="product-card[^"]*" data-product-id="${ID}">[\\s\\S]*?</article>`))?.[0] || "";

describe("product card pictures", () => {
  let dir;
  const setup = (file, recOver = {}, status = "approved") => {
    write(dir, `public/images/${file}`, PNG);
    editJson(dir, IMAGES, (j) => { for (const k of Object.keys(j)) if (j[k].kind === "product-photo") delete j[k]; j["tombow-photo"] = record(file, recOver); });
    editJson(dir, PROD, (p) => { p.image = { file, alt: ALT }; p.imageStatus = status; });
  };
  before(() => { dir = makeCopy("ppf-card"); promoteProducts(dir); });
  after(() => dir && cleanup(dir));

  test("an approved product photo shows on the article and shop cards, linked to the affiliate URL, with a product caption and no Amazon image", () => {
    setup("tombow-a.png");
    const r = npmBuild(dir); assert.ok(r.ok, r.out);
    for (const [f, h] of pages(dir)) {
      const card = cardOf(h);
      assert.match(card, /<figure class="product-card__media">/, f);
      const m = card.match(/<a class="product-card__photo" href="([^"]+)" rel="([^"]+)"[^>]*><img src="\/images\/tombow-a\.png" alt="([^"]+)"/);
      assert.ok(m, f);
      const button = card.match(/<a class="button" href="([^"]+)"/)[1];
      assert.equal(m[1], button, "image links to the same affiliate URL as the button");
      assert.match(m[1], /^https:\/\/www\.amazon\.com\/dp\/B000XAHF7S/);
      assert.match(m[2], /sponsored/); assert.match(m[2], /noopener/); assert.match(m[2], /noreferrer/);
      assert.equal(m[3], ALT);
      assert.match(card, /<figcaption>Product photo: Tombow<\/figcaption>/);
      assert.doesNotMatch(card, /Illustrative image/);
      assert.doesNotMatch(h, /media-amazon|ssl-images-amazon/);
    }
  });

  test("a pending or rejected record, or an unapproved product, falls back to a text-only card", () => {
    for (const [name, rec, status, strict] of [["pending", { rightsStatus: "pending", commercialUse: "unverified", transferWithSite: "unverified" }, "approved", true], ["rejected", { rightsStatus: "rejected" }, "approved", false], ["product not approved", {}, "pending", false]]) {
      setup("tombow-a.png", rec, status);
      editJson(dir, SETTINGS, (s) => { s.launchMode = "preview"; });
      const c = checkContentCli(dir);
      if (name === "rejected") assert.ok(!c.ok, `${name}: ${c.out}`);
      else if (strict) assert.match(c.out, /LAUNCH WARNING/);
      if (name !== "rejected") {
        assert.ok(npmBuild(dir).ok, name);
        for (const [f, h] of pages(dir)) { const card = cardOf(h); assert.ok(card, f); assert.doesNotMatch(card, /product-card__media|<img/, `${name} ${f}`); }
      }
    }
    setup("tombow-a.png", { rightsStatus: "pending", commercialUse: "unverified", transferWithSite: "unverified" });
    editJson(dir, SETTINGS, (s) => { s.launchMode = "production"; });
    assert.ok(!checkContentCli(dir).ok, "production refuses an unapproved image in use");
    editJson(dir, SETTINGS, (s) => { s.launchMode = "preview"; });
  });

  test("REPLACEMENT: pointing the product at a new approved image changes the built pages and drops the old file", () => {
    setup("tombow-a.png");
    assert.ok(npmBuild(dir).ok);
    assert.match(distHtml(dir, "shop/index.html"), /tombow-a\.png/);
    fs.rmSync(path.join(dir, "public/images/tombow-a.png"));
    setup("tombow-b.png", { alt: "Tombow Mono roller, new packshot" });
    editJson(dir, PROD, (p) => { p.image.alt = "Tombow Mono roller, new packshot"; });
    const r = npmBuild(dir); assert.ok(r.ok, r.out);
    for (const [f, h] of pages(dir)) {
      assert.match(cardOf(h), /src="\/images\/tombow-b\.png" alt="Tombow Mono roller, new packshot"/, f);
      assert.doesNotMatch(h, /tombow-a\.png/, f);
    }
    assert.ok(!fs.existsSync(path.join(dir, "dist/images/tombow-a.png")));
    assert.ok(fs.existsSync(path.join(dir, "dist/images/tombow-b.png")));
  });
});

test("captions differ for photograph, ai-illustration and product-photo and never mix", () => {
  const base = { file: "x.jpg", alt: "x", credit: "Jo" };
  const c = ["photograph", "ai-illustration", "product-photo"].map((kind) => captionFor({ ...base, kind }));
  assert.deepEqual(c, ["Photo: Jo", "", "Product photo: Jo"]);
  assert.equal(new Set(c).size, 3);
  assert.equal(captionFor({ kind: "product-photo" }), "Product photo");
});
