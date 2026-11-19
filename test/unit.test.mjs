import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { amazonUrl, amazonAttrs, trackingActive, affiliateSettingsProblems } from "../src/lib/affiliate.mjs";
import { resolveProduct, shopGroups, imageUrl } from "../src/lib/catalog.mjs";
import { checkContent } from "../scripts/check-content.mjs";
import { REPO } from "./helpers.mjs";

describe("affiliate module (the only place Amazon links are built)", () => {
  const off = { amazonTrackingEnabled: false, amazonTrackingId: "x-20" };
  const on = { amazonTrackingEnabled: true, amazonTrackingId: "x-20" };
  test("plain URL when off, tagged only when on and an ID is set", () => {
    assert.equal(amazonUrl("B000XAHF7S", off), "https://www.amazon.com/dp/B000XAHF7S");
    assert.equal(amazonUrl("B000XAHF7S", on), "https://www.amazon.com/dp/B000XAHF7S?tag=x-20");
    assert.equal(amazonUrl("B000XAHF7S", { amazonTrackingEnabled: true, amazonTrackingId: "" }), "https://www.amazon.com/dp/B000XAHF7S");
    assert.equal(trackingActive({ amazonTrackingEnabled: true, amazonTrackingId: "  " }), false);
  });
  test("every outbound link is sponsored, noopener, noreferrer and opens a new tab", () => {
    const a = amazonAttrs("B000XAHF7S", on);
    assert.equal(a.rel, "sponsored noopener noreferrer"); assert.equal(a.target, "_blank");
  });
  test("enabled with no ID is a problem naming the field", () => {
    assert.match(affiliateSettingsProblems({ amazonTrackingEnabled: true, amazonTrackingId: "" })[0], /field "amazonTrackingId"/);
    assert.deepEqual(affiliateSettingsProblems(on), []);
  });
  test("the real settings file keeps tracking OFF and stores the tag", () => {
    const s = JSON.parse(fs.readFileSync(path.join(REPO, "src/content/settings.json"), "utf8"));
    assert.equal(s.amazonTrackingEnabled, false); assert.equal(s.amazonTrackingId, "planspastfive-20");
    assert.equal(s.amazonDisclosure, "As an Amazon Associate I earn from qualifying purchases.");
  });
  test("the tag appears nowhere in content or source except settings.json", () => {
    const hits = [];
    const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (/\.(md|json|astro|mjs|css)$/.test(e.name) && fs.readFileSync(p, "utf8").includes("planspastfive-20")) hits.push(path.relative(REPO, p)); });
    walk(path.join(REPO, "src")); walk(path.join(REPO, "plugins"));
    assert.deepEqual(hits, ["src/content/settings.json"]);
  });
});

describe("catalog rules", () => {
  const P = (o) => ({ id: "a", status: "verified", collection: "paper", name: "A", ...o });
  const map = (...ps) => new Map(ps.map((p) => [p.id, p]));
  test("verified resolves; candidate, held, unknown do not", () => {
    assert.equal(resolveProduct(map(P()), "a").product.id, "a");
    assert.match(resolveProduct(map(P({ status: "candidate" })), "a").error, /only a candidate/);
    assert.match(resolveProduct(map(P({ status: "held", statusReason: "r" })), "a").error, /on hold/);
    assert.match(resolveProduct(map(), "zzz").error, /no product called/);
  });
  test("replacement chains are followed, and loops and dead ends are errors", () => {
    const m = map(P({ id: "old", status: "discontinued", replacedBy: "mid" }), P({ id: "mid", status: "discontinued", replacedBy: "new" }), P({ id: "new" }));
    assert.equal(resolveProduct(m, "old").product.id, "new");
    assert.match(resolveProduct(map(P({ id: "x", status: "discontinued", replacedBy: "x" })), "x").error, /circle/);
    assert.match(resolveProduct(map(P({ id: "x", status: "discontinued", replacedBy: "gone" })), "x").error, /does not exist/);
  });
  test("a shop group appears only when it has a verified product", () => {
    const g = shopGroups([P({ collection: "paper" }), P({ id: "b", collection: "cozy", status: "candidate" })]);
    assert.deepEqual(g.map((x) => x.id), ["paper"]);
  });
  test("image paths typed in the CMS are normalised", () => {
    for (const p of ["x.jpg", "images/x.jpg", "/images/x.jpg", "public/images/x.jpg"]) assert.equal(imageUrl(p), "/images/x.jpg");
  });
});

describe("real repository content", () => {
  test("passes the content-integrity check, and only verified Cowork-checked products are present", () => {
    const { errors, content } = checkContent(REPO);
    assert.deepEqual(errors, []);
    assert.deepEqual(content.products.map((p) => p.data.asin).sort(), ["B000XAHF7S", "B0GRCBQ3Y2", "B0GRCCTYJ5"]);
    for (const p of content.products) { assert.equal(p.data.status, "verified"); assert.ok(p.data.verifiedOn && p.data.verificationSource); }
  });
});

describe("empty boxes saved by the CMS are treated as not filled in", () => {
  test("empty strings and an empty image group do not break a candidate product or a draft", async () => {
    const { productSchema, articleSchema } = await import("../src/lib/schemas.mjs");
    const p = productSchema.safeParse({ id: "a", name: "A", brand: "B", asin: "B000XAHF7S", status: "candidate", collection: "paper", statusReason: "", replacedBy: "", verifiedOn: "", verificationSource: "", image: { file: "", alt: "", source: "", licence: "", rights: "" } });
    assert.ok(p.success, JSON.stringify(p.error?.issues));
    assert.equal(p.data.image, undefined); assert.equal(p.data.verifiedOn, undefined);
    const a = articleSchema.safeParse({ title: "Draft title", status: "draft", publishedAt: "", updatedAt: "", hero: { image: "", alt: "", credit: "", source: "", licence: "", rights: "" } });
    assert.ok(a.success, JSON.stringify(a.error?.issues));
  });
});
