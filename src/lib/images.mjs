// Image-record rules shared by the pages, the plugin and the checks. Pure functions on plain data.
// The records themselves live ONLY in src/content/images.json (see imageAssetSchema in schemas.mjs).
import { approvalGaps } from "./schemas.mjs";
import { imageUrl } from "./catalog.mjs";

/** The caption must say what the picture really is. */
export function captionFor(r) {
  if (r.kind === "ai-illustration") return "Illustrative image (AI-generated)";
  if (r.kind === "product-photo") return r.credit ? `Product photo: ${r.credit}` : "Product photo";
  return r.credit ? `Photo: ${r.credit}` : "Photo";
}

export const isApproved = (r) => !!r && r.rightsStatus === "approved" && approvalGaps(r).length === 0;

/** Find the record for a file typed in a page or the CMS ("x.jpg", "/images/x.jpg" ...). */
export function recordForFile(images, file) {
  const want = imageUrl(file);
  return Object.entries(images || {}).find(([, r]) => imageUrl(r.file) === want) || null;
}

/** The record of a product's picture, only when the product claims "approved" and the record agrees. */
export function productImageFor(p, images) {
  if (!p.image || p.imageStatus !== "approved") return null;
  const hit = recordForFile(images, p.image.file);
  return hit && hit[1].kind === "product-photo" && isApproved(hit[1]) ? hit[1] : null;
}

/** Plain-English reason an image record is not approved ("" when it is). */
export function whyNotApproved(r) {
  if (!r) return "it has no record in src/content/images.json";
  if (r.rightsStatus === "rejected") return "its rights were rejected";
  if (r.rightsStatus === "pending") return `its rights are pending${approvalGaps(r).length ? ` (${approvalGaps(r).join("; ")})` : ""}`;
  const gaps = approvalGaps(r);
  return gaps.length ? gaps.join("; ") : "";
}
