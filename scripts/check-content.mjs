// Content-integrity check. Plain English messages, each naming the file and the field.
// Usage: node scripts/check-content.mjs [rootFolder]     (also exported for the tests)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadContent } from "../src/lib/content-fs.mjs";
import { resolveProduct, isShown, MARKER, imageUrl } from "../src/lib/catalog.mjs";
import { affiliateSettingsProblems, trackingActive } from "../src/lib/affiliate.mjs";
import { recordForFile, whyNotApproved, isApproved } from "../src/lib/images.mjs";
import { verifiedGaps } from "../src/lib/schemas.mjs";

// Price rule. Dollar amounts are BLOCKED in product records, article titles/summaries and every built page except
// article prose; they are ALLOWED in article prose (budget estimates such as "under $25"), but never in a paragraph that
// names a product with {{product:...}} / {{pick:...}}. Price CLAIMS (sale, discount, deal, current price...) are blocked everywhere.
export const PRICE_AMOUNT = /\$\s?\d/;
export const PRICE_CLAIM = /\bonly\s+\$|\b(current price|lowest price|best price|priced at|on sale|sale|discount(ed)?|price drops?|coupons?)\b|(?<!big )\bdeals?\b/i;
const NO_AMOUNT = [
  [PRICE_AMOUNT, "contains a price (product prices are never shown)"],
  [PRICE_CLAIM, "contains a pricing claim (sale, discount, deal, current or lowest price...)"],
  [/\b\d(\.\d)?\s*(\/\s*5|out of 5|stars?)\b|★/i, "contains a star rating (ratings are never shown)"],
  [/\b(we|i)\s+(have\s+)?(tested|tried)\b|hands-on|after (weeks|months) of use|tried and true|tested by us/i, "makes a hands-on testing claim (we do not test products ourselves)"],
  [/amazon\.[a-z.]+|amzn\.to|[?&]tag=|[a-z]{3,}-20\b/i, "contains an Amazon address or tracking tag (links are built from the product's ASIN and the tag in settings)"],
];

export function checkContent(root) {
  const c = loadContent(root);
  const errors = [...c.errors];
  const warnings = [];
  const mode = c.settings?.launchMode ?? "preview";
  // Unfinished rights or evidence: a loud warning in "preview", a build failure in "production".
  const unfinished = (msg) => (mode === "production" ? errors : warnings).push(msg);
  const exists = (urlPath) => fs.existsSync(path.join(root, "public", urlPath.replace(/^\//, "")));
  const scan = (file, field, value, { prose = false } = {}) => {
    if (typeof value !== "string") return;
    for (const [re, msg] of NO_AMOUNT) {
      if (prose && re === PRICE_AMOUNT) continue; // budget estimates are allowed in article prose
      if (re.test(value)) errors.push(`${file}, field "${field}": ${msg}.`);
    }
  };

  if (c.settings) errors.push(...affiliateSettingsProblems(c.settings));

  // ---- products: duplicates, file name = id, replacement chains
  const byId = new Map();
  const asins = new Map();
  for (const { file, fileId, data: p } of c.products) {
    if (p.id !== fileId) errors.push(`${file}, field "id": the id "${p.id}" must be the same as the file name "${fileId}".`);
    if (byId.has(p.id)) errors.push(`${file}, field "id": the id "${p.id}" is already used by another product.`);
    byId.set(p.id, p);
    if (asins.has(p.asin)) errors.push(`${file}, field "asin": ${p.asin} is already used by ${asins.get(p.asin)}. One product per ASIN.`);
    asins.set(p.asin, file);
  }

  // image records that something public uses: key -> where
  const used = new Map();
  const use = (key, where) => used.set(key, [...(used.get(key) || []), where]);
  const needApproved = (key, rec, where) => {
    if (rec.rightsStatus === "rejected") errors.push(`src/content/images.json, "${key}": the picture was rejected but is used by ${where}. Remove it from there.`);
    else if (!isApproved(rec)) unfinished(`src/content/images.json, "${key}" (${rec.file}) is used by ${where} but is not approved: ${whyNotApproved(rec)}.`);
  };

  for (const { file, data: p } of c.products) {
    if (p.replacedBy) {
      if (!byId.has(p.replacedBy)) errors.push(`${file}, field "replacedBy": "${p.replacedBy}" does not exist.`);
      else {
        const r = resolveProduct(byId, p.id, mode);
        if (r.error) errors.push(`${file}, field "replacedBy": ${r.error}.`);
      }
    }
    for (const f of ["name", "brand", "statusReason", "bestUse", "whyWeLikeIt", "limitations", "descriptionOriginal", "suitability", "qualityNote"]) scan(file, f, p[f]);
    if (p.listingChecked) scan(file, "listingChecked.variant", p.listingChecked.variant);
    if (p.status === "provisional" && p.editorialDecision === "approve") unfinished(`Product "${p.id}" (${file}) is only provisional, so it is not ready for the live launch: ${verifiedGaps(p).join("; ")}.`);
    if (!isShown(p, mode)) continue;
    if (trackingActive(c.settings || {}) && p.listingChecked?.affiliateLinkEligible !== "yes") {
      errors.push(`${file}, field "listingChecked.affiliateLinkEligible": affiliate tracking is switched on but this shown product is not recorded as eligible for affiliate links ("${p.listingChecked?.affiliateLinkEligible || "empty"}"). Record the check, hold the product or switch tracking off.`);
    }
    if (p.image) {
      const hit = recordForFile(c.images, p.image.file);
      if (!hit) { if (p.imageStatus === "approved") errors.push(`${file}, field "image.file": imageStatus is "approved" but ${imageUrl(p.image.file)} has no record in src/content/images.json.`); }
      else if (p.imageStatus === "approved") {
        if (hit[1].kind !== "product-photo") errors.push(`${file}, field "image.file": the record "${hit[0]}" is a ${hit[1].kind}, not a product-photo.`);
        use(hit[0], `product "${p.id}"`);
      }
    }
  }

  // ---- articles
  const bySlug = new Map(c.articles.map((a) => [a.slug, a]));
  for (const a of c.articles) {
    const { file, data: d } = a;
    if (d.status !== "published") continue;
    const need = (field, v) => { if (!v || String(v).trim() === "") errors.push(`${file}, field "${field}": a published article needs this, but it is empty.`); };
    need("description", d.description);
    need("dek", d.dek);
    need("publishedAt", d.publishedAt);
    need("category", d.category);
    need("format", d.format);
    const h = d.hero || {};
    need("hero.image", h.image); need("hero.alt", h.alt);
    if (h.image) {
      const hit = recordForFile(c.images, h.image);
      if (!hit) errors.push(`${file}, field "hero.image": ${imageUrl(h.image)} has no rights record in src/content/images.json (kind, source, licence, commercial use, approval). Add one first.`);
      else use(hit[0], `the article "${a.slug}"`);
    }
    if (h.image && !exists(imageUrl(h.image))) errors.push(`${file}, field "hero.image": the file ${imageUrl(h.image)} is not in public/images/. Upload the picture first.`);
    for (const f of ["title", "description", "dek"]) scan(file, f, d[f]);
    scan(file, "body", a.body, { prose: true });
    // a dollar amount may sit in article prose, but not in a paragraph that names a product
    const blocks = a.body.split(/\n\s*\n/);
    const hasMarker = (t) => new RegExp(MARKER.source).test(t);
    const isPick = (t) => /^\s*\{\{\s*pick\s*:/.test(t || "");
    blocks.forEach((t, i) => {
      if ((hasMarker(t) || isPick(blocks[i - 1]) || isPick(blocks[i + 1])) && PRICE_AMOUNT.test(t)) {
        errors.push(`${file}, field "body": a dollar amount sits in or next to a paragraph that names a product ("${t.trim().slice(0, 50)}..."). Budget estimates are fine in ordinary prose, never beside a product.`);
      }
    });

    const refs = [...(d.picks || []).map((id) => ["picks", id])];
    for (const m of a.body.matchAll(MARKER)) refs.push([`body {{${m[1]}:${m[2]}}}`, m[2]]);
    for (const [field, id] of refs) {
      const r = resolveProduct(byId, id, mode);
      if (r.error) errors.push(`${file}, field "${field}": the product cannot be shown because ${r.error}.`);
    }
    for (const s of d.related || []) {
      const t = bySlug.get(s);
      if (!t) errors.push(`${file}, field "related": there is no article called "${s}".`);
      else if (t.data.status !== "published") errors.push(`${file}, field "related": the article "${s}" is a draft, so it cannot be linked.`);
    }
  }

  // ---- pictures used by the page templates (siteImage("key"))
  const srcDir = path.join(root, "src");
  const walk = (dir) => (fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)])) : []);
  for (const f of walk(srcDir).filter((x) => /\.(astro|mjs)$/.test(x))) {
    for (const m of fs.readFileSync(f, "utf8").matchAll(/siteImage\(\s*["']([^"']+)["']\s*\)/g)) {
      if (!c.images[m[1]]) errors.push(`${path.relative(root, f).split(path.sep).join("/")}: uses the picture "${m[1]}", which has no record in src/content/images.json.`);
      else use(m[1], `the page ${path.relative(root, f).split(path.sep).join("/")}`);
    }
  }

  // ---- rights of every picture that is used publicly
  for (const [key, rec] of Object.entries(c.images)) {
    if (!exists(imageUrl(rec.file))) errors.push(`src/content/images.json, "${key}", field "file": ${imageUrl(rec.file)} is not in public/images/.`);
    if (used.has(key)) needApproved(key, rec, [...new Set(used.get(key))].join(", "));
  }

  return { errors, warnings, mode, content: c };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = path.resolve(process.argv[2] || fileURLToPath(new URL("..", import.meta.url)));
  const { errors, warnings, mode, content } = checkContent(root);
  if (errors.length) {
    console.error("\nCONTENT CHECK FAILED. Nothing was published. Please fix these:\n");
    for (const e of errors) console.error(`  - ${e}`);
    console.error("");
    process.exit(1);
  }
  if (warnings.length) {
    console.warn(`\nLAUNCH WARNING: launchMode is "preview", so this builds, but the site is NOT ready for the live launch.\nSwitch launchMode to "production" in src/content/settings.json only when these are fixed (production would fail the build on each):\n`);
    for (const w of warnings) console.warn(`  ! ${w}`);
    console.warn("");
  }
  const pub = content.articles.filter((a) => a.data.status === "published").length;
  console.log(`Content check passed: ${pub} published article(s), ${content.articles.length - pub} draft(s), ${content.products.filter((p) => isShown(p.data, mode)).length} shown product(s) of ${content.products.length}; launchMode ${mode}; ${warnings.length} launch warning(s).`);
}
