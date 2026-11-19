// MILESTONE 1 DEMONSTRATION: the article-to-purchase journey, with simulated CMS operations,
// each on a temporary COPY of the repo (nothing real is modified).
import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import {
  REPO, makeCopy, cleanup, npmBuild, checkContentCli, astroBuildOnly, read, write, exists, editJson, editArticle,
  ARTICLE, SETTINGS, amazonLinks, distHtml, newProduct, addProduct,
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
  test("article page has hero credit, inline product, pick card, one disclosure beside the first product, shop section", () => {
    const h = distHtml(dir, `journal/${SLUG}/index.html`);
    assert.match(h, /Image: Plans Past Five/);
    assert.match(h, /class="product-mention"/);
    assert.match(h, /class="product-card/);
    assert.match(h, /Shop this story/);
    assert.equal((h.match(/class="disclosure"/g) || []).length, 1, "exactly one disclosure block in an article that shows its product inline");
    // first product mention comes before the disclosure which comes before the card
    assert.ok(h.indexOf("product-mention") < h.indexOf('class="disclosure"'));
    assert.ok(h.indexOf('class="disclosure"') < h.indexOf('class="product-card'));
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
    assert.doesNotMatch(s, /The Cozy Edit|The Movement Edit|Little Adventures|The Creative Corner/);
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

describe("(2) upload a NEW image and change the hero", () => {
  let dir;
  const fresh = () => { if (dir) cleanup(dir); dir = makeCopy("ppf-demo"); };
  after(() => dir && cleanup(dir));
  before(fresh);
  const IMG = "public/images/new-hero.jpg";
  test("missing alt, credit and rights fail with plain messages", () => {
    fs.copyFileSync(path.join(REPO, "public/images/cozy-corner.jpg"), path.join(dir, IMG));
    editArticle(dir, (s) => s.replace(/hero:[\s\S]*?\npicks:/, "hero:\n  image: /images/new-hero.jpg\n  source: test\n  licence: test\n  rights: pending\npicks:"));
    const r = checkContentCli(dir);
    assert.ok(!r.ok);
    assert.match(r.out, /field "hero\.alt"/);
    assert.match(r.out, /field "hero\.credit"/);
    assert.match(r.out, /field "hero\.rights": must be "cleared"/);
  });
  test("a hero file that does not exist fails", () => {
    editArticle(dir, (s) => s.replace("/images/new-hero.jpg", "/images/not-there.jpg"));
    const r = checkContentCli(dir);
    assert.match(r.out, /field "hero\.image": the file \/images\/not-there\.jpg is not in public\/images\//);
  });
  test("a complete record passes, and the built page and share image use the new picture", () => {
    editArticle(dir, (s) => s.replace(/hero:[\s\S]*?\npicks:/, 'hero:\n  image: /images/new-hero.jpg\n  alt: "A woman reading in an armchair"\n  credit: "Plans Past Five"\n  source: "test source"\n  licence: "test licence"\n  rights: cleared\npicks:'));
    const r = npmBuild(dir);
    assert.ok(r.ok, r.out);
    const h = distHtml(dir, `journal/${SLUG}/index.html`);
    assert.match(h, /src="\/images\/new-hero\.jpg"/);
    assert.match(h, /og:image" content="https:\/\/planspastfive\.com\/images\/new-hero\.jpg"/);
    assert.match(h, /alt="A woman reading in an armchair"/);
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
  test("verified without verifiedOn / verificationSource is refused", () => {
    editArticle(dir, (s) => s.replace("Try {{product:no-such-product}} on the edges. ", ""));
    addProduct(dir, newProduct({ status: "verified" }));
    const r = checkContentCli(dir);
    assert.ok(!r.ok);
    assert.match(r.out, /washi-tape-demo\.json, field "verifiedOn": A verified product needs the date/);
    assert.match(r.out, /field "verificationSource"/);
  });
  test("verified with its evidence: shown in the shop with a TAGGED link when tracking is on", () => {
    addProduct(dir, newProduct({ status: "verified", verifiedOn: "2026-11-20", verificationSource: "Test: listing read, seller Amazon.com, in stock." }));
    editJson(dir, SETTINGS, (s) => { s.amazonTrackingEnabled = true; });
    editArticle(dir, (s) => s.replace("  - tombow-mono-permanent\nrelated", "  - tombow-mono-permanent\n  - washi-tape-demo\nrelated"));
    const r = npmBuild(dir);
    assert.ok(r.ok, r.out);
    const shop = distHtml(dir, "shop/index.html");
    assert.match(shop, /Demo Washi Tape/);
    assert.ok(amazonLinks(shop).includes("https://www.amazon.com/dp/B0TESTAAAA?tag=planspastfive-20"));
    assert.match(distHtml(dir, `journal/${SLUG}/index.html`), /dp\/B0TESTAAAA\?tag=planspastfive-20/);
    assert.match(shop, /The Creative Corner/, "a new group appears when it gets its first verified product");
  });
  test("replace a product: new id, old one discontinued with replacedBy; every reference shows the new product", () => {
    addProduct(dir, newProduct({ id: "washi-tape-demo-2", name: "Demo Washi Tape Mk2", asin: "B0TESTBBBB", status: "verified", verifiedOn: "2026-11-21", verificationSource: "Test: re-checked." }));
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
  test("prices, ratings and testing claims in text are refused", () => {
    fresh();
    editArticle(dir, (s) => s.replace("Close the book", "It costs $12 and has 4.5 stars. We tested it for weeks. Close the book"));
    const r = checkContentCli(dir);
    assert.match(r.out, /contains a price/); assert.match(r.out, /star rating/); assert.match(r.out, /hands-on testing claim/);
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
