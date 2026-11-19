// Content-integrity check. Plain English messages, each naming the file and the field.
// Usage: node scripts/check-content.mjs [rootFolder]     (also exported for the tests)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadContent } from "../src/lib/content-fs.mjs";
import { resolveProduct, MARKER, imageUrl } from "../src/lib/catalog.mjs";
import { affiliateSettingsProblems } from "../src/lib/affiliate.mjs";

const BAD_TEXT = [
  [/\$\s?\d/, "contains a price (prices are never shown)"],
  [/\b\d(\.\d)?\s*(\/\s*5|out of 5|stars?)\b|★/i, "contains a star rating (ratings are never shown)"],
  [/\b(we|i)\s+(have\s+)?(tested|tried)\b|hands-on|after (weeks|months) of use|tried and true|tested by us/i, "makes a hands-on testing claim (we do not test products ourselves)"],
  [/amazon\.[a-z.]+|amzn\.to|[?&]tag=|[a-z]{3,}-20\b/i, "contains an Amazon address or tracking tag (links are built from the product's ASIN and the tag in settings)"],
];

export function checkContent(root) {
  const c = loadContent(root);
  const errors = [...c.errors];
  const exists = (urlPath) => fs.existsSync(path.join(root, "public", urlPath.replace(/^\//, "")));
  const scan = (file, field, value) => {
    if (typeof value !== "string") return;
    for (const [re, msg] of BAD_TEXT) if (re.test(value)) errors.push(`${file}, field "${field}": ${msg}.`);
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
  for (const { file, data: p } of c.products) {
    if (p.replacedBy) {
      if (!byId.has(p.replacedBy)) errors.push(`${file}, field "replacedBy": "${p.replacedBy}" does not exist.`);
      else {
        const r = resolveProduct(byId, p.id);
        if (r.error && p.status !== "verified") errors.push(`${file}, field "replacedBy": ${r.error}.`);
      }
    }
    for (const f of ["name", "brand", "statusReason", "bestUse", "whyWeLikeIt", "limitations", "descriptionOriginal"]) scan(file, f, p[f]);
    if (p.status === "verified" && p.image) {
      if (p.image.rights !== "cleared") errors.push(`${file}, field "image.rights": the picture is not marked as cleared, so it cannot be shown. Remove the picture or clear the rights.`);
      else if (!exists(imageUrl(p.image.file))) errors.push(`${file}, field "image.file": the picture file ${imageUrl(p.image.file)} is not in public/images/.`);
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
    need("hero.image", h.image); need("hero.alt", h.alt); need("hero.credit", h.credit);
    need("hero.source", h.source); need("hero.licence", h.licence);
    if (h.rights !== "cleared") errors.push(`${file}, field "hero.rights": must be "cleared" before the article is published (it is ${h.rights ? `"${h.rights}"` : "empty"}).`);
    if (h.image && !exists(imageUrl(h.image))) errors.push(`${file}, field "hero.image": the file ${imageUrl(h.image)} is not in public/images/. Upload the picture first.`);
    for (const f of ["title", "description", "dek"]) scan(file, f, d[f]);
    scan(file, "body", a.body);

    const refs = [...(d.picks || []).map((id) => ["picks", id])];
    for (const m of a.body.matchAll(MARKER)) refs.push([`body {{${m[1]}:${m[2]}}}`, m[2]]);
    for (const [field, id] of refs) {
      const r = resolveProduct(byId, id);
      if (r.error) errors.push(`${file}, field "${field}": the product cannot be shown because ${r.error}.`);
    }
    for (const s of d.related || []) {
      const t = bySlug.get(s);
      if (!t) errors.push(`${file}, field "related": there is no article called "${s}".`);
      else if (t.data.status !== "published") errors.push(`${file}, field "related": the article "${s}" is a draft, so it cannot be linked.`);
    }
  }

  // ---- image records used by the home and about pages
  const recFile = path.join(root, "src/content/images.json");
  if (fs.existsSync(recFile)) {
    const recs = JSON.parse(fs.readFileSync(recFile, "utf8"));
    for (const [key, r] of Object.entries(recs)) {
      for (const f of ["file", "alt", "credit", "source", "licence"]) if (!r[f]) errors.push(`src/content/images.json, "${key}", field "${f}": missing.`);
      if (r.rights !== "cleared") errors.push(`src/content/images.json, "${key}", field "rights": must be "cleared" to be used on a page.`);
      if (r.file && !exists(imageUrl(r.file))) errors.push(`src/content/images.json, "${key}", field "file": ${imageUrl(r.file)} is not in public/images/.`);
    }
  } else errors.push("src/content/images.json: missing (the picture records for the home and about pages).");

  return { errors, content: c };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = path.resolve(process.argv[2] || fileURLToPath(new URL("..", import.meta.url)));
  const { errors, content } = checkContent(root);
  if (errors.length) {
    console.error("\nCONTENT CHECK FAILED. Nothing was published. Please fix these:\n");
    for (const e of errors) console.error(`  - ${e}`);
    console.error("");
    process.exit(1);
  }
  const pub = content.articles.filter((a) => a.data.status === "published").length;
  console.log(`Content check passed: ${pub} published article(s), ${content.articles.length - pub} draft(s), ${content.products.filter((p) => p.data.status === "verified").length} verified product(s) of ${content.products.length}.`);
}
