// Product rules shared by the checks, the remark plugin and the pages. Pure functions on plain data.
import { COLLECTIONS } from "./schemas.mjs";

/** Follow replacedBy until a verified product is reached. Never throws; returns {product} or {error}. */
export function resolveProduct(byId, id) {
  const seen = [];
  let cur = id;
  while (true) {
    const p = byId.get(cur);
    if (!p) {
      return { error: seen.length ? `the replacement chain ${[...seen, cur].join(" -> ")} ends at "${cur}", which does not exist` : `there is no product called "${cur}"` };
    }
    if (p.status === "verified") return { product: p, via: seen };
    if (seen.includes(cur)) return { error: `the replacement chain ${[...seen, cur].join(" -> ")} goes in a circle` };
    seen.push(cur);
    if (p.replacedBy) { cur = p.replacedBy; continue; }
    return {
      error: p.status === "candidate" ? `"${cur}" is only a candidate (not verified yet)`
        : p.status === "held" ? `"${cur}" is on hold${p.statusReason ? ` (${p.statusReason})` : ""}`
        : p.status === "discontinued" ? `"${cur}" is discontinued and has no replacement set` : `"${cur}" cannot be shown`,
    };
  }
}

export const verifiedProducts = (products) => products.filter((p) => p.status === "verified");

/** Collections (in a fixed order) that have at least one verified product. */
export function shopGroups(products) {
  const v = verifiedProducts(products);
  return Object.entries(COLLECTIONS)
    .map(([id, label]) => ({ id, label, products: v.filter((p) => p.collection === id).sort((a, b) => a.name.localeCompare(b.name)) }))
    .filter((g) => g.products.length > 0);
}

/** Pattern for inline product markers inside article Markdown. */
export const MARKER = /\{\{\s*(product|pick)\s*:\s*([^}\s]*)\s*\}\}/g;

/** Normalise an image path typed in the CMS: "x.jpg", "images/x.jpg" and "/images/x.jpg" all mean /images/x.jpg. */
export function imageUrl(p) {
  if (!p) return "";
  let s = String(p).trim().replace(/^\/+/, "");
  s = s.replace(/^public\//, "").replace(/^images\//, "");
  return `/images/${s}`;
}
