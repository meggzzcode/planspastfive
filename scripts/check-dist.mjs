// Link and safety validation of the BUILT site (dist/). Plain English messages.
// Usage: node scripts/check-dist.mjs [rootFolder]     (also exported for the tests)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadContent } from "../src/lib/content-fs.mjs";
import { amazonUrl, AMAZON_REL } from "../src/lib/affiliate.mjs";
import { resolveProduct } from "../src/lib/catalog.mjs";

const RETAILERS = /(^|\.)(walmart|target|etsy|ebay|bestbuy|temu|shein|aliexpress|michaels|joann|hobbylobby|shareasale|rstyle|shopltk|liketoknow|bit)\.(com|it|co)$/i;
const AMAZON_IMAGE_HOSTS = /(m\.media-amazon|images-na\.ssl-images-amazon|ssl-images-amazon|images-amazon|media-amazon|amazon-adsystem|fls-na\.amazon|ws-na\.amazon-adsystem)\./i;

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
const attrsOf = (tag) => { const o = {}; for (const m of tag.matchAll(/([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g)) if (m[1] !== tag.slice(1, 1 + m[1].length) || m.index > 1) o[m[1].toLowerCase()] = m[2] ?? m[3] ?? m[4] ?? ""; return o; };
const tagsOf = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))].map((m) => ({ raw: m[0], a: attrsOf(m[0]) }));
const textOf = (html) => html.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ");

export function checkDist(root) {
  const errors = [];
  const dist = path.join(root, "dist");
  if (!fs.existsSync(path.join(dist, "index.html"))) return { errors: ["dist/index.html: the site has not been built yet."] };
  const c = loadContent(root);
  if (!c.settings) return { errors: ["src/content/settings.json: cannot read the settings, so the built site cannot be checked."] };
  const S = c.settings;
  const files = walk(dist).map((f) => path.relative(dist, f).split(path.sep).join("/"));
  const fileSet = new Set(files);
  const htmlFiles = files.filter((f) => f.endsWith(".html"));
  const html = Object.fromEntries(htmlFiles.map((f) => [f, fs.readFileSync(path.join(dist, f), "utf8")]));

  // redirects (only exact-path 200/301/302 rules are understood)
  const redirects = new Map();
  if (fileSet.has("_redirects")) for (const l of fs.readFileSync(path.join(dist, "_redirects"), "utf8").split("\n")) {
    const t = l.trim(); if (!t || t.startsWith("#")) continue;
    const [from, to] = t.split(/\s+/); if (from && to && !from.includes("*")) redirects.set(from, to);
  }

  const fileFor = (p, depth = 0) => {
    p = decodeURI(p);
    if (p.endsWith("/")) return fileSet.has(p.slice(1) + "index.html") ? p.slice(1) + "index.html" : null;
    const bare = p.slice(1);
    if (fileSet.has(bare)) return bare;
    if (fileSet.has(bare + "/index.html")) return bare + "/index.html";
    if (redirects.has(p) && depth < 3) return fileFor(redirects.get(p), depth + 1);
    return null;
  };
  const toLocal = (u) => {
    if (u.startsWith("//")) return null;
    if (u.startsWith("/")) return u;
    if (u.startsWith(S.siteUrl + "/") || u === S.siteUrl) return u.slice(S.siteUrl.length) || "/";
    return null;
  };

  const pageUrls = new Set();
  const asinOk = new Map(); // asin -> product id, for every product that is verified
  const byId = new Map(c.products.map((p) => [p.data.id, p.data]));
  for (const p of c.products) if (p.data.status === "verified") asinOk.set(p.data.asin, p.data.id);

  for (const f of htmlFiles) {
    const h = html[f];
    const where = `dist/${f}`;
    const err = (m) => errors.push(`${where}: ${m}`);
    const isPage = f !== "404.html";
    const ids = new Set([...h.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));

    // SEO basics
    if (!/<title>[^<]+<\/title>/.test(h)) err("the page has no title.");
    if (!/<meta name="description" content="[^"]+"/.test(h)) err("the page has no meta description.");
    const canon = tagsOf(h, "link").find((t) => t.a.rel === "canonical");
    if (!canon) err("the page has no canonical link.");
    else if (isPage) {
      const lp = toLocal(canon.a.href);
      if (!lp || !fileFor(lp)) err(`the canonical link ${canon.a.href} does not point at a page of this site.`);
      else pageUrls.add(canon.a.href);
    }
    if (!/property="og:title"/.test(h)) err("the page has no Open Graph title.");
    if (f.startsWith("journal/") && f !== "journal/index.html" && !f.startsWith("journal/category/") && !/"@type":"Article"/.test(h)) err("the article has no Article structured data (JSON-LD).");

    // images: alt text, self-hosted
    for (const t of tagsOf(h, "img")) {
      if (t.a.alt === undefined) err(`an image has no alt attribute (${t.a.src}).`);
      const src = t.a.src || "";
      if (/^https?:\/\//i.test(src) && !toLocal(src)) err(`an image is loaded from another website (${src}). All images must be on this site.`);
    }

    // resolve every internal reference
    const refs = [];
    for (const t of tagsOf(h, "a")) if (t.a.href !== undefined) refs.push(["link", t.a.href]);
    for (const t of tagsOf(h, "link")) if (t.a.href) refs.push(["file", t.a.href]);
    for (const t of tagsOf(h, "img")) { if (t.a.src) refs.push(["file", t.a.src]); for (const s of (t.a.srcset || "").split(",")) if (s.trim()) refs.push(["file", s.trim().split(/\s+/)[0]]); }
    for (const t of tagsOf(h, "script")) if (t.a.src && toLocal(t.a.src) !== null) refs.push(["file", t.a.src]);
    for (const t of tagsOf(h, "meta")) if ((t.a.property === "og:image" || t.a.property === "og:url") && t.a.content) refs.push(["file", t.a.content]);
    for (const [kind, href] of refs) {
      if (/^(mailto:|tel:|#)/.test(href) && !href.startsWith("#")) continue;
      if (href.startsWith("#")) { if (href.length > 1 && !ids.has(href.slice(1))) err(`the link ${href} points at a spot on the page that does not exist.`); continue; }
      const lp = toLocal(href);
      if (lp === null) continue;
      const [pathPart, frag] = lp.split("#"); const clean = pathPart.split("?")[0];
      const target = fileFor(clean);
      if (!target) { err(`the ${kind === "link" ? "link" : "file"} ${href} does not exist in the built site.`); continue; }
      if (frag && target.endsWith(".html") && !new RegExp(`\\sid="${frag}"`).test(html[target] || "")) err(`the link ${href} points at a spot (#${frag}) that does not exist on that page.`);
    }

    // outbound links
    for (const t of tagsOf(h, "a")) {
      const href = t.a.href || "";
      if (!/^https?:\/\//i.test(href)) continue;
      let u; try { u = new URL(href); } catch { err(`the link ${href} is not a valid address.`); continue; }
      const isAmazon = /(^|\.)amazon\.[a-z.]+$/i.test(u.hostname) || /^amzn\.to$/i.test(u.hostname);
      const productId = t.a["data-product-id"];
      if (isAmazon) {
        const m = /^https:\/\/www\.amazon\.com\/dp\/([A-Z0-9]{10})(\?tag=([^&]+))?$/.exec(href);
        if (!m) { err(`the Amazon link ${href} is not in the required form https://www.amazon.com/dp/<ASIN>${S.amazonTrackingEnabled ? "?tag=<id>" : ""}.`); continue; }
        if (!asinOk.has(m[1])) err(`the Amazon link ${href} is for ASIN ${m[1]}, which is not a verified product.`);
        if (href !== amazonUrl(m[1], S)) err(`the Amazon link ${href} should be exactly ${amazonUrl(m[1], S)} (tag only when tracking is switched on in settings).`);
        const rel = new Set((t.a.rel || "").split(/\s+/));
        for (const need of AMAZON_REL.split(" ")) if (!rel.has(need)) err(`the Amazon link ${href} is missing rel="${need}".`);
        if (t.a.target !== "_blank") err(`the Amazon link ${href} should open in a new tab (target="_blank").`);
        if (!productId) err(`the Amazon link ${href} is not inside a product block (no data-product-id).`);
        else if (asinOk.get(m[1]) !== productId) err(`the Amazon link ${href} belongs to product "${asinOk.get(m[1])}" but is labelled "${productId}".`);
      } else {
        if (productId) err(`the product link for "${productId}" goes to ${u.hostname}, not Amazon. Only Amazon links are allowed in product blocks.`);
        if (RETAILERS.test(u.hostname)) err(`the link ${href} goes to another retailer (${u.hostname}). Only Amazon is allowed.`);
      }
    }

    // prices and ratings in visible text
    const txt = textOf(h);
    if (/\$\s?\d/.test(txt)) err("a price appears on the page (prices are never shown).");
    if (/\b\d(\.\d)?\s*(\/\s*5|out of 5|stars?)\b|★/i.test(txt)) err("a star rating appears on the page (ratings are never shown).");
  }

  // Amazon image hosts anywhere in the build
  for (const f of files.filter((x) => /\.(html|css|js|xml|json|txt|svg)$/i.test(x))) {
    const body = f.endsWith(".html") ? html[f] : fs.readFileSync(path.join(dist, f), "utf8");
    if (AMAZON_IMAGE_HOSTS.test(body)) errors.push(`dist/${f}: contains an Amazon image address. Amazon pictures must never be used.`);
  }

  // sitemap
  const sm = files.filter((f) => /^sitemap-\d+\.xml$/.test(f));
  if (!fileSet.has("sitemap-index.xml") || sm.length === 0) errors.push("dist/sitemap-index.xml: the sitemap is missing.");
  else {
    const locs = new Set(sm.flatMap((f) => [...fs.readFileSync(path.join(dist, f), "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])));
    for (const u of pageUrls) if (!locs.has(u)) errors.push(`dist/sitemap-0.xml: the page ${u} is not listed in the sitemap.`);
    for (const l of locs) if (!pageUrls.has(l)) errors.push(`dist/sitemap-0.xml: lists ${l}, which is not a page in the built site.`);
  }

  // drafts, candidates and unpublishable products must not be reachable
  const allText = Object.values(html).join("\n");
  for (const a of c.articles.filter((a) => a.data.status !== "published")) {
    if (fileSet.has(`journal/${a.slug}/index.html`)) errors.push(`dist/journal/${a.slug}/index.html: the draft article "${a.slug}" was built. Drafts must never be published.`);
    if (a.data.title && allText.includes(a.data.title.replace(/&/g, "&amp;"))) errors.push(`dist: the title of the draft "${a.slug}" appears in the built site.`);
  }
  for (const p of c.products) {
    if (p.data.status === "verified") continue;
    const r = resolveProduct(byId, p.data.id);
    if (allText.includes(p.data.asin)) errors.push(`dist: the ${p.data.status} product "${p.data.id}" (ASIN ${p.data.asin}) is reachable in the built site.`);
    if (!r.product && allText.includes(p.data.name)) errors.push(`dist: the ${p.data.status} product "${p.data.id}" is named in the built site.`);
  }
  const shop = html["shop/index.html"] || "";
  for (const p of c.products.filter((p) => p.data.status === "verified")) {
    if (!shop.includes(`data-product-id="${p.data.id}"`)) errors.push(`dist/shop/index.html: the verified product "${p.data.id}" is missing from the shop.`);
  }
  return { errors, pages: pageUrls.size };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = path.resolve(process.argv[2] || fileURLToPath(new URL("..", import.meta.url)));
  const { errors, pages } = checkDist(root);
  if (errors.length) {
    console.error("\nLINK CHECK FAILED on the built site. Please fix these:\n");
    for (const e of errors) console.error(`  - ${e}`);
    console.error("");
    process.exit(1);
  }
  console.log(`Link check passed: ${pages} pages, every link and asset resolves, Amazon links correct.`);
}
