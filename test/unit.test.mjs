import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { amazonUrl, amazonAttrs, trackingActive, affiliateSettingsProblems } from "../src/lib/affiliate.mjs";
import { resolveProduct, shopGroups, imageUrl, articlesUsingProduct } from "../src/lib/catalog.mjs";
import { captionFor, isApproved } from "../src/lib/images.mjs";
import { disclosureText } from "../src/lib/affiliate.mjs";
import { imageAssetSchema } from "../src/lib/schemas.mjs";
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
  test("the real settings file stores the tag and the required statement (tracking may be on or off)", () => {
    const s = JSON.parse(fs.readFileSync(path.join(REPO, "src/content/settings.json"), "utf8"));
    assert.equal(typeof s.amazonTrackingEnabled, "boolean"); assert.equal(s.amazonTrackingId, "planspastfive-20");
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
  const P = (o) => ({ id: "a", status: "verified", editorialDecision: "approve", collection: "paper", name: "A", ...o });
  const map = (...ps) => new Map(ps.map((p) => [p.id, p]));
  test("verified resolves; candidate, held, unknown do not", () => {
    assert.equal(resolveProduct(map(P()), "a").product.id, "a");
    assert.match(resolveProduct(map(P({ status: "candidate" })), "a").error, /only a candidate/);
    assert.match(resolveProduct(map(P({ status: "held", statusReason: "r" })), "a").error, /on hold/);
    assert.match(resolveProduct(map(), "zzz").error, /no product called/);
  });
  test("technically valid is not enough: a verified product needs editorialDecision approve; provisional shows only in preview", () => {
    assert.match(resolveProduct(map(P({ editorialDecision: "hold" })), "a").error, /held by editorial decision/);
    assert.match(resolveProduct(map(P({ editorialDecision: undefined })), "a").error, /not been approved/);
    const prov = map(P({ status: "provisional" }));
    assert.ok(resolveProduct(prov, "a", "preview").product);
    assert.match(resolveProduct(prov, "a", "production").error, /provisional/);
    assert.deepEqual(shopGroups([P({ status: "provisional" })], "production"), []);
    assert.equal(shopGroups([P({ status: "provisional" })], "preview").length, 1);
  });
  test("deliberate ordering: numeric order first, the rest keep their stable order", () => {
    const g = shopGroups([P({ id: "x" }), P({ id: "y", order: 2 }), P({ id: "z", order: 1 }), P({ id: "w" })]);
    assert.deepEqual(g[0].products.map((p) => p.id), ["z", "y", "x", "w"]);
  });
  test("which articles show a product (picks, markers, replacement chains)", () => {
    const m = map(P({ id: "old", status: "discontinued", replacedBy: "a" }), P());
    const used = articlesUsingProduct([{ id: "s1", title: "T1", picks: ["old"], body: "" }, { id: "s2", title: "T2", picks: [], body: "x {{product:a}} y" }], m);
    assert.deepEqual(used.get("a").map((x) => x.id), ["s1", "s2"]);
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
  test("passes the content-integrity check; every public product is approved and no product is called verified without its evidence", () => {
    const { errors, content } = checkContent(REPO);
    assert.deepEqual(errors, []);
    for (const p of content.products) {
      assert.ok(["provisional", "verified"].includes(p.data.status) ? p.data.editorialDecision === "approve" : true);
      if (p.data.status === "verified") assert.equal(p.data.listingChecked.affiliateLinkEligible, "yes");
    }
  });
  test("the real settings are valid and the launch mode is a known value", () => {
    const { content } = checkContent(REPO);
    assert.equal(typeof content.settings.amazonTrackingEnabled, "boolean");
    assert.ok(["preview", "production"].includes(content.settings.launchMode));
  });
  test("no image record claims approval without commercial use, and no AI image is described as a photograph", () => {
    const { content } = checkContent(REPO);
    for (const r of Object.values(content.images)) {
      if (r.rightsStatus === "approved") assert.equal(r.commercialUse, "yes");
      if (r.kind === "ai-illustration") assert.equal(captionFor(r), "", "AI images carry no caption; the disclosure is in About and Terms");
    }
  });
});

describe("image records and captions", () => {
  const base = { file: "a.jpg", alt: "x", kind: "photograph", credit: "Jo", source: { name: "Jo", url: "https://e.com" }, commercialUse: "yes", transferWithSite: "yes", licenceName: "L", licenceUrl: "https://e.com/l", licenceCheckedOn: "2026-11-20", approvedOn: "2026-11-20", attribution: "none", rightsStatus: "approved" };
  test("captions reflect the real kind of picture", () => {
    assert.equal(captionFor(base), "Photo: Jo");
    assert.equal(captionFor({ ...base, kind: "ai-illustration" }), "");
    assert.equal(captionFor({ ...base, kind: "product-photo", credit: "Tombow" }), "Product photo: Tombow");
    assert.doesNotMatch(captionFor(base), /llustrat/);
    assert.doesNotMatch(captionFor({ ...base, kind: "ai-illustration" }), /Photo/);
  });
  test("approval needs commercial use yes, licence details, checked date and owner approval date", () => {
    assert.ok(imageAssetSchema.safeParse(base).success);
    assert.ok(isApproved(base));
    for (const [k, v] of [["commercialUse", "unverified"], ["licenceUrl", ""], ["licenceCheckedOn", ""], ["approvedOn", ""], ["credit", ""]]) {
      assert.ok(!imageAssetSchema.safeParse({ ...base, [k]: v }).success, k);
    }
    assert.ok(imageAssetSchema.safeParse({ ...base, commercialUse: "unverified", transferWithSite: "unverified", rightsStatus: "pending" }).success);
  });
});

describe("affiliate disclosure wording follows the tracking state", () => {
  test("off: never claims earnings; on: carries the exact required statement", () => {
    const off = disclosureText({ amazonTrackingEnabled: false, amazonTrackingId: "x-20", amazonDisclosure: "As an Amazon Associate I earn from qualifying purchases." });
    const on = disclosureText({ amazonTrackingEnabled: true, amazonTrackingId: "x-20", amazonDisclosure: "As an Amazon Associate I earn from qualifying purchases." });
    assert.match(off, /earn nothing from them yet/); assert.doesNotMatch(off, /Associate|commission/);
    assert.match(on, /As an Amazon Associate I earn from qualifying purchases\.$/);
    assert.notEqual(off, on);
  });
});

describe("empty boxes saved by the CMS are treated as not filled in", () => {
  test("empty strings and an empty image group do not break a candidate product or a draft", async () => {
    const { productSchema, articleSchema } = await import("../src/lib/schemas.mjs");
    const p = productSchema.safeParse({ id: "a", name: "A", brand: "B", asin: "B000XAHF7S", status: "candidate", collection: "paper", statusReason: "", replacedBy: "", listingChecked: { checkedOn: "", variant: "", listingAvailable: "", sellerType: "", affiliateLinkEligible: "" }, specsEvidence: "", order: "", editorialDecision: "", imageStatus: "", verificationSource: "", image: { file: "", alt: "" } });
    assert.ok(p.success, JSON.stringify(p.error?.issues));
    assert.equal(p.data.image, undefined); assert.equal(p.data.listingChecked, undefined); assert.equal(p.data.order, undefined);
    const a = articleSchema.safeParse({ title: "Draft title", status: "draft", publishedAt: "", updatedAt: "", hero: { image: "", alt: "", credit: "", source: "", licence: "", rights: "" } });
    assert.ok(a.success, JSON.stringify(a.error?.issues));
  });
});
