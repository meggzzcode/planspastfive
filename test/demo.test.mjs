// MILESTONE 1 DEMONSTRATION: the article-to-purchase journey, with simulated CMS operations,
// each on a temporary COPY of the repo (nothing real is modified).
import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import {
  REPO, makeCopy, cleanup, npmBuild, checkContentCli, astroBuildOnly, read, write, exists, editJson, editArticle,
  ARTICLE, SETTINGS, IMAGES, amazonLinks, distHtml, newProduct, addProduct, verifiedFields, promoteProducts, approvedImage,
} from "./helpers.mjs";

const SLUG = "your-first-junk-journal-spread";

describe("baseline: the real repo content passes every check (item 7)", () => {
  let dir;
  const fresh = () => { if (dir) cleanup(dir); dir = makeCopy("ppf-demo"); };
  after(() => dir && cleanup(dir));
  before(fresh);
  test("npm run build (content check + build + link validation) passes", () => {
    const r = npmBuild(dir);
    assert.ok(r.ok, r.out);
    assert.match(r.out, /Content check passed/);
    assert.match(r.out, /Link check passed/);
  });
  test("article page has hero caption, inline product, pick card, one disclosure BEFORE the first product, shop section", () => {
    const h = distHtml(dir, `journal/${SLUG}/index.html`);
    assert.match(h, /<figcaption>Illustrative image \(AI-generated\)<\/figcaption>/);
    assert.match(h, /class="product-mention"/);
    assert.match(h, /class="product-card/);
    assert.match(h, /Shop this story/);
    assert.equal((h.match(/class="disclosure"/g) || []).length, 1, "exactly one disclosure block in an article that shows its product inline");
    // the disclosure comes before the first product mention, which comes before the card
    assert.ok(h.indexOf('class="disclosure"') < h.indexOf("product-mention"));
    assert.ok(h.indexOf("product-mention") < h.indexOf('class="product-card'));
    assert.match(h, /"@type":"Article"/);
    assert.match(h, /<link rel="canonical" href="https:\/\/planspastfive\.com\/journal\//);
  });
  test("tracking is OFF by default: every Amazon link is the plain /dp/ASIN form", () => {
    const links = amazonLinks(distHtml(dir, `journal/${SLUG}/index.html`)).concat(amazonLinks(distHtml(dir, "shop/index.html")));
    assert.ok(links.length >= 4);
    for (const l of links) assert.match(l, /^https:\/\/www\.amazon\.com\/dp\/[A-Z0-9]{10}$/);
  });
  test("shop shows only collections that have verified products", () => {
    const s = distHtml(dir, "shop/index.html");
    assert.match(s, /The Paper Edit/); assert.match(s, /The Hosting Edit/);
    assert.doesNotMatch(s, /The Cozy Edit|The Sporty Edit|Little Adventures|The Creative Edit/);
  });
});

describe("(1) edit the article text and publish it (draft -> published)", () => {
  let dir;
  const fresh = () => { if (dir) cleanup(dir); dir = makeCopy("ppf-demo"); };
  after(() => dir && cleanup(dir));
  before(fresh);
  test("as a draft it is not in dist, not in the sitemap, and its title is nowhere in the build", () => {
    editArticle(dir, (s) => s.replace("status: published", "status: draft"));
    const r = npmBuild(dir);
    assert.ok(r.ok, r.out);
    assert.ok(!exists(dir, `dist/journal/${SLUG}/index.html`));
    const sm = read(dir, "dist/sitemap-0.xml");
    assert.ok(!sm.includes(SLUG));
    assert.doesNotMatch(distHtml(dir, "index.html"), /Your First Junk Journal Spread/);
  });
  test("edit the text and switch to published: the build output changes and the page is in the sitemap", () => {
    editArticle(dir, (s) => s.replace("status: draft", "status: published").replace("Stop when\nyou smile at it.", "Stop when you smile at it.").replace("Step back.", "Step back and squint. A lopsided page is a good sign."));
    const r = npmBuild(dir);
    assert.ok(r.ok, r.out);
    const h = distHtml(dir, `journal/${SLUG}/index.html`);
    assert.match(h, /A lopsided page is a good sign/);
    assert.match(read(dir, "dist/sitemap-0.xml"), new RegExp(`/journal/${SLUG}/`));
  });
  test("a published article with a missing field fails with a plain message naming file and field", () => {
    editArticle(dir, (s) => s.replace(/^description:.*\n/m, ""));
    const r = checkContentCli(dir);
    assert.ok(!r.ok);
    assert.match(r.out, /src\/content\/articles\/your-first-junk-journal-spread\.md, field "description": a published article needs this/);
  });
});

describe("(2) upload a NEW image and change the hero (one rights record per picture)", () => {
  let dir;
  const fresh = () => { if (dir) cleanup(dir); dir = makeCopy("ppf-demo"); };
  after(() => dir && cleanup(dir));
  before(fresh);
  const IMG = "public/images/new-hero.jpg";
  const hero = (alt = "A woman reading in an armchair") => (s) => s.replace(/hero:[\s\S]*?\npicks:/, `hero:\n  image: /images/new-hero.jpg\n  alt: "${alt}"\npicks:`);
  const record = { file: "new-hero.jpg", alt: "A woman reading", kind: "photograph", credit: "Jo Photographer", source: { name: "Jo", url: "https://example.com/jo" }, attribution: "none", ...approvedImage() };
  test("a hero with no rights record, or with a missing file or alt, fails with plain messages", () => {
    fs.copyFileSync(path.join(REPO, "public/images/cozy-corner.jpg"), path.join(dir, IMG));
    editArticle(dir, hero(""));
    let r = checkContentCli(dir);
    assert.ok(!r.ok);
    assert.match(r.out, /field "hero\.alt"/);
    assert.match(r.out, /field "hero\.image": \/images\/new-hero\.jpg has no rights record in src\/content\/images\.json/);
    editArticle(dir, (s) => s.replace("/images/new-hero.jpg", "/images/not-there.jpg"));
    r = checkContentCli(dir);
    assert.match(r.out, /field "hero\.image": the file \/images\/not-there\.jpg is not in public\/images\//);
  });
  test("an approved record passes; the page and share image use the picture and a PHOTO caption", () => {
    editArticle(dir, hero());
    editJson(dir, IMAGES, (j) => { j["new-hero"] = record; });
    const r = npmBuild(dir);
    assert.ok(r.ok, r.out);
    const h = distHtml(dir, `journal/${SLUG}/index.html`);
    assert.match(h, /src="\/images\/new-hero\.jpg"/);
    assert.match(h, /og:image" content="https:\/\/planspastfive\.com\/images\/new-hero\.jpg"/);
    assert.match(h, /alt="A woman reading in an armchair"/);
    assert.match(h, /<figcaption>Photo: Jo Photographer<\/figcaption>/);
  });
  test("a pending hero is a loud warning in preview mode and a failure in production mode naming what is missing", () => {
    editJson(dir, IMAGES, (j) => Object.assign(j["new-hero"], { rightsStatus: "pending", commercialUse: "unverified", licenceUrl: "", approvedOn: "" }));
    let r = checkContentCli(dir);
    assert.ok(r.ok, r.out);
    assert.match(r.out, /LAUNCH WARNING/);
    assert.match(r.out, /"new-hero" \(new-hero\.jpg\) is used by the article "your-first-junk-journal-spread" but is not approved/);
    assert.match(r.out, /commercial use is "unverified"/); assert.match(r.out, /licenceUrl\) is missing/); assert.match(r.out, /approvedOn\) is missing/);
    editJson(dir, SETTINGS, (s) => { s.launchMode = "production"; });
    r = checkContentCli(dir);
    assert.ok(!r.ok);
    assert.match(r.out, /CONTENT CHECK FAILED/);
    assert.match(r.out, /"new-hero" \(new-hero\.jpg\) is used by the article .* not approved/);
    assert.ok(!npmBuild(dir).ok, "the full build must fail too");
  });
  test('a record cannot be "approved" unless commercial use is yes; a rejected picture always fails', () => {
    editJson(dir, SETTINGS, (s) => { s.launchMode = "preview"; });
    editJson(dir, IMAGES, (j) => Object.assign(j["new-hero"], { rightsStatus: "approved", commercialUse: "unverified" }));
    let r = checkContentCli(dir);
    assert.match(r.out, /new-hero\.rightsStatus": cannot be "approved" yet: commercial use is "unverified"/);
    editJson(dir, IMAGES, (j) => Object.assign(j["new-hero"], approvedImage({ rightsStatus: "rejected" })));
    r = checkContentCli(dir);
    assert.match(r.out, /the picture was rejected but is used by the article/);
  });
});

describe("(3) add a product, then replace a product", () => {
  let dir;
  const fresh = () => { if (dir) cleanup(dir); dir = makeCopy("ppf-demo"); };
  after(() => dir && cleanup(dir));
  before(fresh);
  test("a candidate product is not shown anywhere", () => {
    addProduct(dir, newProduct());
    const r = npmBuild(dir);
    assert.ok(r.ok, r.out);
    for (const f of ["shop/index.html", `journal/${SLUG}/index.html`, "index.html"]) {
      assert.doesNotMatch(distHtml(dir, f), /B0TESTAAAA|Demo Washi Tape/);
    }
  });
  test("a published article that references the candidate fails the check (picks) ...", () => {
    editArticle(dir, (s) => s.replace("  - tombow-mono-permanent\nrelated", "  - tombow-mono-permanent\n  - washi-tape-demo\nrelated"));
    const r = checkContentCli(dir);
    assert.ok(!r.ok);
    assert.match(r.out, /field "picks": the product cannot be shown because "washi-tape-demo" is only a candidate/);
  });
  test("... and the inline marker fails the build itself even if the content check were skipped", () => {
    editArticle(dir, (s) => s.replace("  - washi-tape-demo\n", "").replace("Work from the bottom layer up", "Try {{product:washi-tape-demo}} on the edges. Work from the bottom layer up"));
    const r = astroBuildOnly(dir);
    assert.ok(!r.ok);
    assert.match(r.out, /\{\{product:washi-tape-demo\}\} cannot be shown because "washi-tape-demo" is only a candidate/);
    const unknown = astroBuildOnly((editArticle(dir, (s) => s.replace("washi-tape-demo", "no-such-product")), dir));
    assert.ok(!unknown.ok);
    assert.match(unknown.out, /there is no product called "no-such-product"/);
  });
  test("verified without its evidence is refused, naming every missing item", () => {
    editArticle(dir, (s) => s.replace("Try {{product:no-such-product}} on the edges. ", ""));
    addProduct(dir, newProduct({ status: "verified" }));
    const r = checkContentCli(dir);
    assert.ok(!r.ok);
    assert.match(r.out, /washi-tape-demo\.json, field "status": A verified product needs: the date the listing was checked/);
    assert.match(r.out, /affiliateLinkEligible must be "yes"/);
    assert.match(r.out, /specsEvidence/); assert.match(r.out, /suitability/);
    assert.match(r.out, /field "verificationSource"/);
  });
  test("verified with its evidence: shown in the shop with a TAGGED link when tracking is on", () => {
    addProduct(dir, newProduct(verifiedFields()));
    promoteProducts(dir);
    editJson(dir, SETTINGS, (s) => { s.amazonTrackingEnabled = true; });
    editArticle(dir, (s) => s.replace("  - tombow-mono-permanent\nrelated", "  - tombow-mono-permanent\n  - washi-tape-demo\nrelated"));
    const r = npmBuild(dir);
    assert.ok(r.ok, r.out);
    const shop = distHtml(dir, "shop/index.html");
    assert.match(shop, /Demo Washi Tape/);
    assert.ok(amazonLinks(shop).includes("https://www.amazon.com/dp/B0TESTAAAA?tag=planspastfive-20"));
    assert.match(distHtml(dir, `journal/${SLUG}/index.html`), /dp\/B0TESTAAAA\?tag=planspastfive-20/);
    assert.match(shop, /The Creative Edit/, "a new group appears when it gets its first verified product");
  });
  test("replace a product: new id, old one discontinued with replacedBy; every reference shows the new product", () => {
    addProduct(dir, newProduct({ id: "washi-tape-demo-2", name: "Demo Washi Tape Mk2", asin: "B0TESTBBBB", ...verifiedFields() }));
    addProduct(dir, newProduct({ status: "discontinued", statusReason: "Maker stopped selling it.", replacedBy: "washi-tape-demo-2" }));
    const r = npmBuild(dir);
    assert.ok(r.ok, r.out);
    const art = distHtml(dir, `journal/${SLUG}/index.html`);
    assert.match(art, /Demo Washi Tape Mk2/);
    assert.match(art, /B0TESTBBBB/);
    assert.doesNotMatch(art, /B0TESTAAAA|Demo Washi Tape</);
    assert.doesNotMatch(distHtml(dir, "shop/index.html"), /B0TESTAAAA/);
  });
  test("a dangling replacement fails", () => {
    addProduct(dir, newProduct({ status: "discontinued", statusReason: "Gone.", replacedBy: "nothing-here" }));
    const r = checkContentCli(dir);
    assert.ok(!r.ok);
    assert.match(r.out, /washi-tape-demo\.json, field "replacedBy": "nothing-here" does not exist/);
  });
  test("a replacement circle fails", () => {
    addProduct(dir, newProduct({ status: "discontinued", statusReason: "Gone.", replacedBy: "washi-tape-demo-2" }));
    addProduct(dir, newProduct({ id: "washi-tape-demo-2", name: "Mk2", asin: "B0TESTBBBB", status: "discontinued", statusReason: "Gone too.", replacedBy: "washi-tape-demo" }));
    const r = checkContentCli(dir);
    assert.ok(!r.ok);
    assert.match(r.out, /goes in a circle/);
  });
  test("duplicate ASINs and bad ASINs are refused", () => {
    addProduct(dir, newProduct({ id: "another", asin: "B000XAHF7S" }));
    addProduct(dir, newProduct({ id: "badasin", asin: "short" }));
    const r = checkContentCli(dir);
    assert.match(r.out, /field "asin": B000XAHF7S is already used by/);
    assert.match(r.out, /badasin\.json, field "asin": An ASIN is exactly 10/);
  });
});

describe("(4) change the tracking tag; enable tracking with no ID", () => {
  let dir;
  const fresh = () => { if (dir) cleanup(dir); dir = makeCopy("ppf-demo"); };
  after(() => dir && cleanup(dir));
  before(fresh);
  test("changing the tag in settings changes EVERY Amazon link on the built site", () => {
    promoteProducts(dir);
    editJson(dir, SETTINGS, (s) => { s.amazonTrackingEnabled = true; s.amazonTrackingId = "firsttag-20"; });
    assert.ok(npmBuild(dir).ok);
    const pages = ["shop/index.html", `journal/${SLUG}/index.html`];
    const first = pages.flatMap((p) => amazonLinks(distHtml(dir, p)));
    assert.ok(first.length >= 4 && first.every((l) => l.endsWith("?tag=firsttag-20")));
    editJson(dir, SETTINGS, (s) => { s.amazonTrackingId = "secondtag-20"; });
    const r = npmBuild(dir);
    assert.ok(r.ok, r.out);
    const second = pages.flatMap((p) => amazonLinks(distHtml(dir, p)));
    assert.equal(second.length, first.length);
    assert.ok(second.every((l) => l.endsWith("?tag=secondtag-20")));
    const all = fs.readdirSync(path.join(dir, "dist"), { recursive: true }).filter((f) => f.endsWith(".html")).map((f) => read(dir, `dist/${f}`)).join("");
    assert.ok(!all.includes("firsttag-20"));
  });
  test("tracking enabled with no ID fails the build with a plain message", () => {
    editJson(dir, SETTINGS, (s) => { s.amazonTrackingEnabled = true; s.amazonTrackingId = ""; });
    const r = npmBuild(dir);
    assert.ok(!r.ok);
    assert.match(r.out, /settings\.json, field "amazonTrackingId": tracking is switched on .* but there is no tracking ID/);
  });
  test("a tag or Amazon address typed into an article or product is refused", () => {
    editJson(dir, SETTINGS, (s) => { s.amazonTrackingEnabled = false; s.amazonTrackingId = "planspastfive-20"; });
    editArticle(dir, (s) => s.replace("Close the book", "Buy it at https://www.amazon.com/dp/B000XAHF7S?tag=planspastfive-20 today. Close the book"));
    const r = checkContentCli(dir);
    assert.ok(!r.ok);
    assert.match(r.out, /contains an Amazon address or tracking tag/);
  });
  test("ratings, testing claims and pricing claims in text are refused", () => {
    fresh();
    editArticle(dir, (s) => s.replace("Close the book", "It is on sale with a coupon and has 4.5 stars. We tested it for weeks. Close the book"));
    const r = checkContentCli(dir);
    assert.match(r.out, /pricing claim/); assert.match(r.out, /star rating/); assert.match(r.out, /hands-on testing claim/);
  });
  test("tracking on while a shown product is not recorded as affiliate-eligible fails; with eligibility recorded it passes", () => {
    fresh();
    editJson(dir, SETTINGS, (s) => { s.amazonTrackingEnabled = true; });
    assert.match(checkContentCli(dir).out, /affiliateLinkEligible": affiliate tracking is switched on but this shown product is not recorded as eligible/);
    promoteProducts(dir);
    assert.ok(checkContentCli(dir).ok);
  });
});

describe("price rule: product prices blocked, editorial budget estimates in article prose allowed", () => {
  let dir;
  before(() => { dir = makeCopy("ppf-price"); });
  after(() => dir && cleanup(dir));
  test("a budget estimate in ordinary article prose passes the content check AND the built-site check", () => {
    editArticle(dir, (s) => s.replace("Close the book", "Most first spreads cost under $25, or about $20 to $40 to start properly. Close the book"));
    const r = npmBuild(dir);
    assert.ok(r.ok, r.out);
    assert.match(distHtml(dir, `journal/${SLUG}/index.html`), /under \$25/);
  });
  test("a dollar amount in a paragraph that names a product, or next to a product card, is refused", () => {
    editArticle(dir, (s) => s.replace("Close the book", "Close the book. {{product:tombow-mono-permanent}} is about $6 a roll."));
    assert.match(checkContentCli(dir).out, /a dollar amount sits in or next to a paragraph that names a product/);
    editArticle(dir, (s) => s.replace(" {{product:tombow-mono-permanent}} is about $6 a roll.", "").replace("{{pick:tombow-mono-permanent}}", "{{pick:tombow-mono-permanent}}\n\nCosts about $6."));
    assert.match(checkContentCli(dir).out, /a dollar amount sits in or next to a paragraph/);
  });
  test("dollar amounts in a product record, an article summary, or pricing claims anywhere are refused", () => {
    editArticle(dir, (s) => s.replace("Costs about $6.", "Fine."));
    editJson(dir, "src/content/products/tombow-mono-permanent.json", (p) => { p.limitations += " Priced at $6."; });
    assert.match(checkContentCli(dir).out, /tombow-mono-permanent\.json, field "limitations": contains a price/);
    editJson(dir, "src/content/products/tombow-mono-permanent.json", (p) => { p.limitations = p.limitations.replace(" Priced at $6.", ""); });
    for (const bad of ["The current price is low.", "A real deal.", "Now with a discount.", "Only $5 today."]) {
      editArticle(dir, (s) => s.replace("Fine.", bad));
      assert.match(checkContentCli(dir).out, /pricing claim|contains a price|dollar amount/, bad);
      editArticle(dir, (s) => s.replace(bad, "Fine."));
    }
    editArticle(dir, (s) => s.replace(/^description: .*$/m, 'description: "Costs $5."'));
    assert.match(checkContentCli(dir).out, /field "description": contains a price/);
  });
  test("built-site check: a dollar amount inside a product card or on the shop page is caught, even where article prose may have one", async () => {
    cleanup(dir); dir = makeCopy("ppf-price");
    assert.ok(npmBuild(dir).ok);
    const { checkDist } = await import(path.join(REPO, "scripts/check-dist.mjs"));
    const f = path.join(dir, `dist/journal/${SLUG}/index.html`);
    const good = fs.readFileSync(f, "utf8");
    fs.writeFileSync(f, good.replace("class=\"product-card__why\">", "class=\"product-card__why\">$6 "));
    assert.ok(checkDist(dir).errors.some((e) => /dollar amount appears in a product card/.test(e)));
    fs.writeFileSync(f, good.replace("<div class=\"prose", "<div class=\"prose"));
    assert.deepEqual(checkDist(dir).errors, []);
  });
});

describe("link validation catches problems in the built site", () => {
  let dir;
  const fresh = () => { if (dir) cleanup(dir); dir = makeCopy("ppf-demo"); };
  after(() => dir && cleanup(dir));
  before(fresh);
  test("a tampered build is caught (wrong tag, missing rel, other retailer, Amazon image, price, dead link, listed draft)", async () => {
    assert.ok(npmBuild(dir).ok);
    const f = path.join(dir, "dist/shop/index.html");
    const good = fs.readFileSync(f, "utf8");
    const { checkDist } = await import(path.join(REPO, "scripts/check-dist.mjs"));
    const tamper = (fn, pattern) => {
      fs.writeFileSync(f, fn(good));
      const { errors } = checkDist(dir);
      assert.ok(errors.some((e) => pattern.test(e)), `expected ${pattern} in:\n${errors.join("\n")}`);
    };
    tamper((h) => h.replace("B000XAHF7S\"", "B000XAHF7S?tag=sneaky-20\""), /should be exactly https:\/\/www\.amazon\.com\/dp\/B000XAHF7S/);
    tamper((h) => h.replace(/rel="sponsored noopener noreferrer"/, 'rel="noopener"'), /missing rel="sponsored"/);
    tamper((h) => h.replace("https://www.amazon.com/dp/B000XAHF7S", "https://www.walmart.com/ip/1"), /another retailer|goes to www\.walmart\.com/);
    tamper((h) => h.replace("</main>", '<img src="https://m.media-amazon.com/images/I/x.jpg" alt="x"></main>'), /Amazon image address/);
    tamper((h) => h.replace("</main>", "<p>Only $19.99 today</p></main>"), /a price appears/);
    tamper((h) => h.replace("</main>", '<a href="/nowhere/">x</a></main>'), /does not exist in the built site/);
    tamper((h) => h.replace("</main>", '<a href="/shop/#nope">x</a></main>'), /does not exist on that page|spot/);
    fs.writeFileSync(f, good);
    fs.writeFileSync(path.join(dir, "dist/sitemap-0.xml"), read(dir, "dist/sitemap-0.xml").replace("</urlset>", "<url><loc>https://planspastfive.com/journal/secret-draft/</loc></url></urlset>"));
    assert.ok(checkDist(dir).errors.some((e) => /secret-draft/.test(e)));
  });
});

describe("(5) preview, screenshots, mobile layout and accessibility", () => {
  let dir;
  const fresh = () => { if (dir) cleanup(dir); dir = makeCopy("ppf-demo"); };
  after(() => dir && cleanup(dir));
  let child, port;
  before(async () => {
    fresh();
    const r = npmBuild(dir);
    assert.ok(r.ok, r.out);
    port = 4400 + Math.floor(Math.random() * 500);
    child = spawn("node", ["scripts/preview.mjs"], { cwd: dir, env: { ...process.env, PORT: String(port), NODE_NO_WARNINGS: "1" } });
    await new Promise((res, rej) => { child.stdout.on("data", (d) => /Preview running/.test(String(d)) && res()); child.on("exit", () => rej(new Error("preview exited"))); setTimeout(() => rej(new Error("preview did not start")), 10000); });
  });
  after(() => child && child.kill());
  test("`npm run preview` serves the built site", async () => {
    for (const p of ["/", "/journal/", `/journal/${SLUG}/`, "/shop/", "/about/", "/privacy/", "/terms/", "/affiliate-disclosure/", "/sitemap.xml", "/robots.txt"]) {
      const res = await fetch(`http://127.0.0.1:${port}${p}`);
      assert.equal(res.status, 200, p);
    }
    assert.equal((await fetch(`http://127.0.0.1:${port}/nope/`)).status, 404);
    assert.match(await (await fetch(`http://127.0.0.1:${port}/nope/`)).text(), /gone for the weekend/);
  });
  test("screenshots at 1280 and 390, no horizontal scroll at 390, no serious accessibility violations (axe)", async (t) => {
    const { requirePlaywright } = await import(path.join(REPO, "scripts/playwright-loader.mjs"));
    const pw = requirePlaywright();
    if (!pw) return t.skip("Playwright is not installed on this machine");
    const axePath = path.join(REPO, "node_modules/axe-core/axe.min.js");
    const browser = await pw.chromium.launch();
    const out = fs.mkdtempSync(path.join(path.dirname(dir), "shots-"));
    try {
      for (const [w, h] of [[1280, 900], [390, 844]]) {
        const page = await (await browser.newContext({ viewport: { width: w, height: h } })).newPage();
        for (const [name, p] of [["home", "/"], ["journal", "/journal/"], ["article", `/journal/${SLUG}/`], ["shop", "/shop/"], ["about", "/about/"], ["privacy", "/privacy/"], ["affiliate", "/affiliate-disclosure/"], ["404", "/nope/"]]) {
          await page.goto(`http://127.0.0.1:${port}${p}`, { waitUntil: "networkidle" });
          if (["home", "journal", "article", "shop"].includes(name)) await page.screenshot({ path: path.join(out, `${name}-${w}.png`), fullPage: true });
          const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
          assert.ok(overflow <= 0, `${name} at ${w}px scrolls horizontally by ${overflow}px`);
          await page.addScriptTag({ path: axePath });
          const res = await page.evaluate(async () => (await window.axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "best-practice"] })).violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.length} node(s), e.g. ${v.nodes[0].html.slice(0, 120)}`));
          assert.deepEqual(res, [], `${name} at ${w}px`);
        }
      }
      for (const n of ["home-1280", "journal-1280", "article-1280", "shop-1280", "home-390", "journal-390", "article-390", "shop-390"]) assert.ok(fs.statSync(path.join(out, `${n}.png`)).size > 10000, n);
    } finally { await browser.close(); fs.rmSync(out, { recursive: true, force: true }); }
  });
});

describe("shell rules from the owner's master brief", () => {
  let dir;
  const fresh = () => { if (dir) cleanup(dir); dir = makeCopy("ppf-shell"); };
  before(fresh);
  after(() => dir && cleanup(dir));
  const navLinks = (h) => [...(/<nav aria-label="Main">([\s\S]*?)<\/nav>/.exec(h)[1]).matchAll(/<a [^>]*>([^<]+)<\/a>/g)].map((m) => m[1]);
  test("header has exactly four destinations; footer has the seven required links", () => {
    assert.ok(npmBuild(dir).ok);
    const h = distHtml(dir, "index.html");
    assert.deepEqual(navLinks(h), ["Home", "The Journal", "The Shop", "About"]);
    const foot = /<footer[\s\S]*<\/footer>/.exec(h)[0];
    for (const t of ["Journal", "Shop", "About", "Contact", "Privacy", "Terms", "Affiliate Disclosure"]) assert.match(foot, new RegExp(`>${t}</a>`));
  });
  test("home: hero wording and CTAs; no Featured section when nothing is featured; no placeholder text anywhere", () => {
    const h = distHtml(dir, "index.html");
    assert.match(h, /Explore the Journal/); assert.match(h, /Shop Our Favorites/);
    assert.match(h, /Your next favorite thing starts here\. Discover fun hobbies, pretty little projects and thoughtfully chosen supplies for making the most of life after five\./);
    assert.doesNotMatch(h, /Featured experiences/);
    for (const f of ["index.html", "journal/index.html", "shop/index.html", "about/index.html"]) assert.doesNotMatch(distHtml(dir, f), /coming soon|lorem|placeholder/i);
    assert.ok(h.indexOf("Latest from the Journal") < h.indexOf("A little shopping inspiration"));
    assert.ok(h.indexOf("A little shopping inspiration") < h.indexOf("Our story"));
  });
  test("featuring an article adds the Featured experiences section", () => {
    editArticle(dir, (x) => x.replace("featured: false", "featured: true"));
    assert.ok(npmBuild(dir).ok);
    const h = distHtml(dir, "index.html");
    assert.match(h, /Featured experiences/);
    assert.doesNotMatch(h, /Latest from the Journal/, "the same story is not shown twice");
  });
  test("category pages exist only for categories with published articles, and the index links them", () => {
    assert.ok(exists(dir, "dist/journal/category/creative-corner/index.html"));
    assert.ok(!exists(dir, "dist/journal/category/after-hours/index.html"));
    assert.match(distHtml(dir, "journal/index.html"), /href="\/journal\/category\/creative-corner\/"/);
    assert.match(read(dir, "dist/sitemap-0.xml"), /journal\/category\/creative-corner/);
  });
  test("a published article without category or format fails", () => {
    editArticle(dir, (x) => x.replace(/^category:.*\n/m, "").replace(/^format:.*\n/m, ""));
    const r = checkContentCli(dir);
    assert.match(r.out, /field "category": a published article needs this/); assert.match(r.out, /field "format"/);
  });
  test("shop: no verified products means no shop teaser, no shop button and no empty collection", () => {
    fresh();
    for (const f of fs.readdirSync(path.join(dir, "src/content/products"))) editJson(dir, `src/content/products/${f}`, (p) => { p.status = "held"; p.statusReason = "paused for test"; });
    editArticle(dir, (x) => x.replace(/\n  - tombow-mono-permanent/, "").replace(/\{\{product:tombow-mono-permanent\}\}/, "dry adhesive runner").replace("{{pick:tombow-mono-permanent}}", ""));
    const r = npmBuild(dir);
    assert.ok(r.ok, r.out);
    const h = distHtml(dir, "index.html");
    assert.doesNotMatch(h, /A little shopping inspiration|Shop Our Favorites/);
    assert.doesNotMatch(distHtml(dir, "shop/index.html"), /product-card|The Paper Edit/);
  });
  test("analytics: off by default (no Google script, no click handler); on only with an ID, with one click event carrying product, article and placement", () => {
    fresh();
    assert.ok(npmBuild(dir).ok);
    const off = distHtml(dir, `journal/${SLUG}/index.html`);
    assert.doesNotMatch(off, /googletagmanager|gtag/);
    assert.match(off, /data-article="your-first-junk-journal-spread" data-placement="inline"/);
    editJson(dir, SETTINGS, (s) => { s.ga4MeasurementId = "G-TEST123456"; });
    assert.ok(npmBuild(dir).ok);
    const on = distHtml(dir, `journal/${SLUG}/index.html`);
    assert.match(on, /googletagmanager\.com\/gtag\/js\?id=G-TEST123456/);
    assert.equal((on.match(/gtag\("event"/g) || []).length, 1);
    assert.match(on, /amazon_click/);
    for (const p of ["inline", "card", "story-end"]) assert.match(on, new RegExp(`data-placement="${p}"`));
    assert.match(distHtml(dir, "shop/index.html"), /data-page="shop" data-placement="shop"/);
    editJson(dir, SETTINGS, (s) => { s.ga4MeasurementId = "not-an-id"; });
    assert.match(checkContentCli(dir).out, /field "ga4MeasurementId"/);
  });
});

describe("disclosure placement, launchMode, homepage journey and captions in the built site", () => {
  let dir;
  const fresh = () => { if (dir) cleanup(dir); dir = makeCopy("ppf-journey"); };
  before(fresh);
  after(() => dir && cleanup(dir));
  const pages = ["index.html", "shop/index.html", `journal/${SLUG}/index.html`];
  const firstProductLink = (h) => h.search(/<a [^>]*data-product-id=|<a [^>]*href="\/shop\/#/);
  test("the shopping note comes BEFORE the first product link on home, shop and article; wording follows tracking", () => {
    assert.ok(npmBuild(dir).ok);
    for (const f of pages) {
      const h = distHtml(dir, f);
      assert.ok(h.indexOf('class="disclosure"') >= 0 && h.indexOf('class="disclosure"') < firstProductLink(h), `${f}: note first`);
      assert.match(h, /Product links on this site go to Amazon\. They are ordinary links for now, so we earn nothing from them yet\./);
      assert.doesNotMatch(h.slice(h.indexOf('class="disclosure"'), h.indexOf('class="disclosure"') + 400), /Associate/);
    }
    assert.doesNotMatch(distHtml(dir, "index.html").split("<footer")[1], /Associate|commission/);
    promoteProducts(dir);
    editJson(dir, SETTINGS, (s) => { s.amazonTrackingEnabled = true; });
    assert.ok(npmBuild(dir).ok);
    for (const f of pages) {
      const h = distHtml(dir, f);
      assert.ok(h.indexOf('class="disclosure"') < firstProductLink(h), `${f}: note first (tracking on)`);
      assert.match(h, /As an Amazon Associate I earn from qualifying purchases\./);
      assert.ok(h.indexOf("As an Amazon Associate") < h.search(/<a [^>]*data-product-id=/) || f === "index.html");
      assert.doesNotMatch(h, /earn nothing from them yet/);
    }
  });
  test("homepage teaser: each item links to its Shop collection and to the article that shows it; Shop intro is renamed", () => {
    fresh();
    assert.ok(npmBuild(dir).ok);
    const h = distHtml(dir, "index.html");
    const teaser = h.slice(h.indexOf("A little shopping inspiration"), h.indexOf("Our story"));
    assert.equal((teaser.match(/<li class="teaser">/g) || []).length, 2, "one item per shop collection that has products");
    assert.equal((teaser.match(/href="\/shop\/#\w+"/g) || []).length, 2);
    assert.match(teaser, /Shop The Paper Edit/); assert.match(teaser, new RegExp(`href="/journal/${SLUG}/">See where it appears`));
    assert.match(distHtml(dir, "shop/index.html"), /<h1>The Good Stuff, Already Found<\/h1>/);
    assert.doesNotMatch(distHtml(dir, "shop/index.html"), /Small on purpose/);
  });
  test("shop follows the editorial `order` field instead of the alphabet", () => {
    editJson(dir, "src/content/products/nmjl-2026-standard-cards-four-pack.json", (p) => { p.order = 1; });
    assert.ok(npmBuild(dir).ok);
    const s = distHtml(dir, "shop/index.html");
    assert.ok(s.indexOf('data-product-id="nmjl-2026-standard-cards-four-pack"') < s.indexOf('data-product-id="nmjl-2026-large-print-cards-four-pack"'));
  });
  test("launchMode production fails on a provisional product a published article uses, and on pending images; unused ones are ignored", () => {
    fresh();
    editJson(dir, SETTINGS, (s) => { s.launchMode = "production"; });
    const r = checkContentCli(dir);
    assert.ok(!r.ok);
    assert.match(r.out, new RegExp(`Product "tombow-mono-permanent".*only provisional but the published article "${SLUG}" uses it.*Missing:.*affiliateLinkEligible must be "yes"`));
    assert.equal((r.out.match(/"tombow-mono-permanent"/g) || []).length, 1, "reported once, not twice");
    for (const id of ["nmjl-2026-large-print-cards-four-pack", "nmjl-2026-standard-cards-four-pack"]) assert.doesNotMatch(r.out, new RegExp(id));
    for (const k of ["junk-journal-flatlay"]) assert.match(r.out, new RegExp(`"${k}".*not approved`));
    editJson(dir, SETTINGS, (s) => { s.launchMode = "preview"; });
    const p = checkContentCli(dir);
    assert.ok(p.ok); assert.match(p.out, /LAUNCH WARNING/);
    // preview separates the two groups
    const [blocks, ignored] = p.out.split("Research products no published article uses");
    assert.match(blocks, /Blocks production:[\s\S]*tombow-mono-permanent/);
    assert.doesNotMatch(blocks, /nmjl-2026/);
    assert.match(ignored, /nmjl-2026-large-print-cards-four-pack[\s\S]*nmjl-2026-standard-cards-four-pack/);
    assert.doesNotMatch(ignored, /tombow/);
  });
  describe("unused research products in production", () => {
    const approveAll = () => {
      editJson(dir, IMAGES, (j) => { for (const [k, r] of Object.entries(j)) j[k] = { ...r, source: { name: r.source.name, url: "https://example.com/s" }, ...approvedImage() }; });
      editJson(dir, "src/content/products/tombow-mono-permanent.json", (p) => Object.assign(p, verifiedFields()));
    };
    test("an unused provisional product builds in production and is absent from dist, shop, home and sitemap", () => {
      fresh(); approveAll();
      editJson(dir, SETTINGS, (s) => { s.launchMode = "production"; });
      const r = npmBuild(dir);
      assert.ok(r.ok, r.out);
      assert.match(r.out, /2 research product\(s\) not shown in production/);
      assert.doesNotMatch(r.out, /LAUNCH WARNING/);
      let all = "";
      const walk = (d) => { for (const e of fs.readdirSync(path.join(dir, d), { withFileTypes: true })) { const f = `${d}/${e.name}`; if (e.isDirectory()) walk(f); else if (/\.(html|xml)$/.test(e.name)) all += fs.readFileSync(path.join(dir, f), "utf8"); } };
      walk("dist");
      for (const asin of ["B0GRCCTYJ5", JSON.parse(read(dir, "src/content/products/nmjl-2026-standard-cards-four-pack.json")).asin]) assert.ok(!all.includes(asin), asin);
      assert.doesNotMatch(all, /nmjl-2026|NMJL/i);
      assert.match(distHtml(dir, "shop/index.html"), /data-product-id="tombow-mono-permanent"/);
      assert.doesNotMatch(read(dir, "dist/sitemap-0.xml"), /nmjl|draft/i);
    });
    test("a verified product is shown in both modes", () => {
      fresh(); approveAll();
      for (const mode of ["preview", "production"]) {
        editJson(dir, SETTINGS, (s) => { s.launchMode = mode; });
        assert.ok(npmBuild(dir).ok, mode);
        assert.match(distHtml(dir, "shop/index.html"), /data-product-id="tombow-mono-permanent"/, mode);
        assert.match(distHtml(dir, `journal/${SLUG}/index.html`), /tombow/i, mode);
      }
    });
    test("tracking on: an unused provisional product does not fail production, a shown one still needs eligibility", () => {
      fresh(); approveAll();
      editJson(dir, SETTINGS, (s) => { s.launchMode = "production"; s.amazonTrackingEnabled = true; });
      const r = npmBuild(dir);
      assert.ok(r.ok, r.out);
      editJson(dir, "src/content/products/tombow-mono-permanent.json", (p) => { p.listingChecked.affiliateLinkEligible = "unknown"; });
      const bad = checkContentCli(dir);
      assert.ok(!bad.ok); assert.match(bad.out, /tombow-mono-permanent.*affiliateLinkEligible/);
    });
  });
  test("production passes once every shown product and picture is fully approved", () => {
    promoteProducts(dir);
    editJson(dir, IMAGES, (j) => { for (const [k, r] of Object.entries(j)) j[k] = { ...r, source: { name: r.source.name, url: "https://example.com/s" }, ...approvedImage() }; });
    editJson(dir, SETTINGS, (s) => { s.launchMode = "production"; });
    const r = npmBuild(dir);
    assert.ok(r.ok, r.out);
    assert.doesNotMatch(r.out, /LAUNCH WARNING/);
  });
  test("captions and the About AI statement follow the real kind of each picture", () => {
    editJson(dir, IMAGES, (j) => { for (const r of Object.values(j)) { r.kind = "ai-illustration"; } });
    assert.ok(npmBuild(dir).ok);
    const h = distHtml(dir, "index.html");
    assert.match(h, /Illustrative image \(AI-generated\)/);
    assert.match(distHtml(dir, "about/index.html"), /AI-generated illustrations/);
    editJson(dir, IMAGES, (j) => { for (const r of Object.values(j)) { r.kind = "photograph"; r.credit = "Jo Photographer"; } });
    assert.ok(npmBuild(dir).ok);
    assert.match(distHtml(dir, "index.html"), /<span class="illus">Photo: Jo Photographer<\/span>/);
    assert.doesNotMatch(distHtml(dir, "index.html") + distHtml(dir, `journal/${SLUG}/index.html`), /Illustrative image/);
    assert.doesNotMatch(distHtml(dir, "about/index.html"), /AI-generated illustrations/);
  });
});
