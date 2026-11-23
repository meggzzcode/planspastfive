// Product rules shared by the checks, the remark plugin and the pages. Pure functions on plain data.
import { COLLECTIONS } from "./schemas.mjs";

/**
 * Is this product allowed on the public site? It must be technically valid (status verified, or provisional
 * while launchMode is "preview") AND approved by an editorial decision. Evidence rules live in the schema.
 */
export function isShown(p, mode = "production") {
  if (p.editorialDecision !== "approve") return false;
  return p.status === "verified" || (p.status === "provisional" && mode !== "production");
}

/** Follow replacedBy until a shown product is reached. Never throws; returns {product} or {error}. */
export function resolveProduct(byId, id, mode = "production") {
  const seen = [];
  let cur = id;
  while (true) {
    const p = byId.get(cur);
    if (!p) {
      return { error: seen.length ? `the replacement chain ${[...seen, cur].join(" -> ")} ends at "${cur}", which does not exist` : `there is no product called "${cur}"` };
    }
    if (isShown(p, mode)) return { product: p, via: seen };
    if (seen.includes(cur)) return { error: `the replacement chain ${[...seen, cur].join(" -> ")} goes in a circle` };
    seen.push(cur);
    if (p.replacedBy) { cur = p.replacedBy; continue; }
    return {
      error: p.status === "candidate" ? `"${cur}" is only a candidate (not verified yet)`
        : p.status === "held" ? `"${cur}" is on hold${p.statusReason ? ` (${p.statusReason})` : ""}`
        : p.status === "discontinued" ? `"${cur}" is discontinued and has no replacement set`
        : p.status === "provisional" ? `"${cur}" is provisional (its evidence is incomplete), so it is shown only while launchMode is "preview"`
        : p.editorialDecision !== "approve" ? `"${cur}" has ${p.editorialDecision === "hold" ? "been held" : "not been approved"} by editorial decision (editorialDecision is ${p.editorialDecision ? `"${p.editorialDecision}"` : "empty"})`
        : `"${cur}" cannot be shown`,
    };
  }
}

export const shownProducts = (products, mode = "production") => products.filter((p) => isShown(p, mode));

/** Editorial order: the numeric `order` first (lowest first), the rest keep the order they were loaded in. */
export const byEditorialOrder = (list) =>
  list.map((p, i) => [p, i]).sort(([a, i], [b, j]) => (a.order ?? Infinity) - (b.order ?? Infinity) || i - j).map(([p]) => p);

/** Collections (in a fixed order) that have at least one shown product. */
export function shopGroups(products, mode = "production") {
  const v = shownProducts(products, mode);
  return Object.entries(COLLECTIONS)
    .map(([id, c]) => {
      const inGroup = byEditorialOrder(v.filter((p) => p.collection === id));
      const ids = new Set(inGroup.map((p) => p.id));
      // an alternative sits under its main product when that product is shown; otherwise it is an ordinary product
      const isAlt = (p) => p.choiceOf && ids.has(p.choiceOf) && !inGroup.find((x) => x.id === p.choiceOf)?.choiceOf;
      const alternatives = new Map();
      for (const p of inGroup.filter(isAlt)) alternatives.set(p.choiceOf, [...(alternatives.get(p.choiceOf) || []), p]);
      // an alternative whose main product is not shown becomes an ordinary product, without its alternative badge
      const all = inGroup.filter((p) => !isAlt(p)).map((p) => (p.choiceOf ? { ...p, choiceOf: undefined, choiceLabel: undefined } : p));
      const noun = (p) => (p.buttonLabel || "").replace(/^See the /, "").replace(/ on Amazon$/, "") || p.name;
      const glance = { essentials: all.filter((p) => p.shopTier !== "extras").map(noun), optional: all.filter((p) => p.shopTier === "extras").map(noun), own: c.own || "" };
      return { id, alternatives, glance, label: c.name, plain: c.plain, image: c.image, extrasLabel: c.extras || "Nice to have", products: all, start: all.filter((p) => p.shopTier !== "extras"), extras: all.filter((p) => p.shopTier === "extras"), get showStartHeading() { return this.start.length > 0 && this.extras.length > 0; } };
    })
    .filter((g) => g.products.length > 0);
}

/** Which published articles show each product? Map product id -> [{ id, title }] (replacement chains followed). */
export function articlesUsingProduct(articles, byId, mode = "production") {
  const out = new Map();
  for (const a of articles) {
    const ids = [...(a.picks || []), ...[...a.body.matchAll(MARKER)].map((m) => m[2])];
    for (const id of ids) {
      const r = resolveProduct(byId, id, mode);
      if (!r.product) continue;
      const list = out.get(r.product.id) || [];
      if (!list.some((x) => x.id === a.id)) list.push({ id: a.id, title: a.title });
      out.set(r.product.id, list);
    }
  }
  return out;
}

/**
 * Which PUBLISHED articles reference each product, shown or not? Map product id -> [{ id, title }].
 * A reference ({{pick:id}}, {{product:id}}, picks) counts for the product named and for every product on its
 * replacedBy chain, so a provisional replacement target is "used" too. Pass only published articles.
 */
export function productsReferencedBy(articles, byId) {
  const out = new Map();
  for (const a of articles) {
    const ids = [...(a.picks || []), ...[...a.body.matchAll(MARKER)].map((m) => m[2])];
    for (const id of ids) {
      const seen = new Set();
      for (let cur = id; cur && byId.has(cur) && !seen.has(cur); cur = byId.get(cur).replacedBy) {
        seen.add(cur);
        const list = out.get(cur) || [];
        if (!list.some((x) => x.id === a.id)) list.push({ id: a.id, title: a.title });
        out.set(cur, list);
      }
    }
  }
  return out;
}

/** Research products: provisional or candidate. In production they are never shown anywhere. */
export const isResearch = (p) => p.status === "provisional" || p.status === "candidate";

/** Pattern for inline product markers inside article Markdown. */
export const MARKER = /\{\{\s*(product|pick)\s*:\s*([^}\s]*)\s*\}\}/g;

/** Normalise an image path typed in the CMS: "x.jpg", "images/x.jpg" and "/images/x.jpg" all mean /images/x.jpg. */
export function imageUrl(p) {
  if (!p) return "";
  let s = String(p).trim().replace(/^\/+/, "");
  s = s.replace(/^public\//, "").replace(/^images\//, "");
  return `/images/${s}`;
}

/** "A Little Movement" -> "a-little-movement" (web address of a category page). */
export const categorySlug = (c) => String(c).toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
