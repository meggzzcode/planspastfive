// The ONE place that says what an article, a product and the settings file must look like.
// Used by Astro (src/content.config.ts) and by the plain-node checks (scripts/check-content.mjs).
import { z } from "astro/zod";

export const COLLECTIONS = {
  paper: { name: "The Paper Edit", plain: "Journaling and stationery" },
  creative: { name: "The Creative Edit", plain: "Painting, clay and making" },
  cozy: { name: "The Cozy Edit", plain: "Slow evenings in" },
  hosting: { name: "The Hosting Edit", plain: "Game nights and gatherings" },
  sporty: { name: "The Sporty Edit", plain: "Moving a little more" },
  "little-adventures": { name: "The Little Adventures Edit", plain: "Days out and small trips" },
};
export const CATEGORIES = ["Creative Corner", "After Hours", "Better Together", "The Weekend Edit", "Table for One", "A Little Movement"];
export const FORMATS = ["starter-guide", "shopping-edit", "experience-guide", "discovery"];
export const CTA_LABELS = ["See It on Amazon", "Explore This Starter Kit", "Shop the Supplies", "See Our Pick"];
export const COLLECTION_IDS = Object.keys(COLLECTIONS);

export const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const ASIN_PATTERN = /^[A-Z0-9]{10}$/;

const text = z.string().trim();
// Pages CMS may save an empty box as "" (or an untouched group as empty boxes). Treat that as "not filled in".
const blank = (v) => v === "" || v === null || (typeof v === "object" && !Array.isArray(v) && !(v instanceof Date) && Object.values(v).every((x) => x === "" || x === null || x === undefined));
const optional = (schema) => z.preprocess((v) => (blank(v) ? undefined : v), schema.optional());
const date = z.coerce.date();

// An article's top picture. Rights live ONLY in src/content/images.json (matched by file); the old
// credit/source/licence/rights lines are tolerated and ignored so existing articles keep working.
const imageRecord = z.object({
  image: text.optional(),
  alt: text.optional(),
  credit: text.optional(),
  source: text.optional(),
  licence: text.optional(),
  rights: text.optional(),
});

// ---- Image rights: ONE authoritative record per picture (src/content/images.json).
export const IMAGE_KINDS = ["photograph", "ai-illustration", "product-photo"];
export const RIGHTS_STATUSES = ["approved", "pending", "rejected"];
const yesNoUnverified = z.enum(["yes", "no", "unverified"]);
export const imageAssetSchema = z
  .object({
    file: text.min(1),
    alt: text.min(1),
    kind: z.enum(IMAGE_KINDS),
    credit: optional(text), // photographer (photograph) or brand (product-photo)
    source: z.object({ name: text.min(1), url: optional(text) }),
    licenceName: optional(text),
    licenceUrl: optional(text),
    licenceCheckedOn: optional(date),
    commercialUse: yesNoUnverified,
    transferWithSite: yesNoUnverified,
    attribution: text.min(1), // the required credit text, or the word "none"
    rightsStatus: z.enum(RIGHTS_STATUSES),
    approvedOn: optional(date),
    notes: optional(text),
  })
  .superRefine((r, ctx) => {
    if (r.rightsStatus !== "approved") return;
    for (const gap of approvalGaps(r)) ctx.addIssue({ code: "custom", path: ["rightsStatus"], message: `cannot be "approved" yet: ${gap}` });
  });
export const imagesFileSchema = z.record(text.min(1), imageAssetSchema);

/** What an image record still needs before it may be "approved". Empty list = nothing missing. */
export function approvalGaps(r) {
  const gaps = [];
  if (r.commercialUse !== "yes") gaps.push(`commercial use is "${r.commercialUse}" (it must be "yes")`);
  if (!r.source?.url) gaps.push("the source address (source.url) is missing");
  if (!r.licenceName) gaps.push("the licence name is missing");
  if (!r.licenceUrl) gaps.push("the licence address (licenceUrl) is missing");
  if (!r.licenceCheckedOn) gaps.push("the date the licence was checked (licenceCheckedOn) is missing");
  if (!r.approvedOn) gaps.push("the owner approval date (approvedOn) is missing");
  if ((r.kind === "photograph" || r.kind === "product-photo") && !r.credit) gaps.push(`the credit (${r.kind === "photograph" ? "photographer" : "brand"}) is missing`);
  return gaps;
}

export const articleSchema = z.object({
  title: text.min(3, "Title is required"),
  description: text.optional(),
  dek: text.optional(),
  publishedAt: optional(date),
  updatedAt: optional(date),
  status: z.enum(["draft", "published"]),
  category: optional(z.enum(CATEGORIES)),
  format: optional(z.enum(FORMATS)),
  featured: z.boolean().default(false),
  hero: optional(imageRecord),
  picks: z.preprocess((v) => (v == null || v === "" ? [] : v), z.array(text)),
  related: z.preprocess((v) => (v == null || v === "" ? [] : v), z.array(text)),
});

// A product picture is only a pointer; its rights are the matching record in src/content/images.json.
export const productImageSchema = z.object({
  file: text.min(1),
  alt: optional(text),
});

// What we recorded when we looked at the Amazon listing. "unverified"/"unknown" = not recorded.
const listingChecked = z.object({
  checkedOn: optional(date),
  variant: optional(text),
  listingAvailable: optional(yesNoUnverified),
  sellerType: optional(z.enum(["amazon", "brand", "other", "unverified"])),
  affiliateLinkEligible: optional(z.enum(["yes", "no", "unknown"])),
});

// candidate = idea; provisional = checked but evidence incomplete (shown ONLY in launchMode "preview");
// verified = all evidence present (shown in any mode when editorialDecision is "approve").
export const PRODUCT_STATUSES = ["candidate", "provisional", "verified", "held", "discontinued"];

/** What a product still needs before it may be "verified". Empty list = nothing missing. */
export function verifiedGaps(p) {
  const l = p.listingChecked || {};
  const gaps = [];
  if (!l.checkedOn) gaps.push("the date the listing was checked (listingChecked.checkedOn)");
  if (l.listingAvailable !== "yes") gaps.push(`listingChecked.listingAvailable must be "yes" (it is ${l.listingAvailable ? `"${l.listingAvailable}"` : "empty"})`);
  if (l.sellerType !== "amazon" && l.sellerType !== "brand") gaps.push(`listingChecked.sellerType must be "amazon" or "brand" (it is ${l.sellerType ? `"${l.sellerType}"` : "empty"})`);
  if (l.affiliateLinkEligible !== "yes") gaps.push(`listingChecked.affiliateLinkEligible must be "yes" (it is ${l.affiliateLinkEligible ? `"${l.affiliateLinkEligible}"` : "empty"})`);
  if (!p.specsEvidence) gaps.push("specsEvidence (a short note with the maker or seller web address)");
  if (!p.suitability) gaps.push("suitability (who it suits)");
  return gaps;
}

export const productSchema = z
  .object({
    id: text.regex(ID_PATTERN, "Use lowercase words joined by hyphens"),
    name: text.min(1),
    brand: text.min(1),
    asin: text.regex(ASIN_PATTERN, "An ASIN is exactly 10 capital letters or digits"),
    status: z.enum(PRODUCT_STATUSES),
    editorialDecision: optional(z.enum(["approve", "hold"])),
    order: optional(z.coerce.number().int()),
    statusReason: text.optional(),
    replacedBy: text.optional(),
    whyWeLikeIt: text.optional(),
    bestUse: text.optional(),
    cta: optional(z.enum(CTA_LABELS)),
    limitations: text.optional(),
    descriptionOriginal: text.optional(),
    collection: z.enum(COLLECTION_IDS),
    listingChecked: optional(listingChecked),
    specsEvidence: text.optional(),
    suitability: text.optional(),
    qualityNote: text.optional(),
    imageStatus: optional(z.enum(["none", "approved", "pending"])),
    image: optional(productImageSchema),
    verificationSource: text.optional(),
  })
  .superRefine((p, ctx) => {
    const need = (field, why) => {
      if (p[field] === undefined || p[field] === "") ctx.addIssue({ code: "custom", path: [field], message: `${why}` });
    };
    const l = p.listingChecked || {};
    if (p.status === "held" || p.status === "discontinued") need("statusReason", `A ${p.status} product needs a reason`);
    if (p.status === "verified" || p.status === "provisional") {
      need("verificationSource", `A ${p.status} product needs a note saying where it was checked`);
      for (const f of ["whyWeLikeIt", "limitations", "descriptionOriginal"]) need(f, `A ${p.status} product needs this text before it can be shown`);
    }
    if (p.status === "verified") {
      for (const g of verifiedGaps(p)) ctx.addIssue({ code: "custom", path: ["status"], message: `A verified product needs: ${g}. Use "provisional" or "candidate" until it is known` });
    }
    if (p.status === "provisional") {
      if (!l.checkedOn) ctx.addIssue({ code: "custom", path: ["listingChecked", "checkedOn"], message: "A provisional product needs the date the listing was checked" });
      if (l.listingAvailable === "no" || l.affiliateLinkEligible === "no") ctx.addIssue({ code: "custom", path: ["status"], message: "A product whose listing is unavailable or not eligible for affiliate links cannot be shown; mark it held" });
    }
    if (p.imageStatus === "approved" && !p.image) ctx.addIssue({ code: "custom", path: ["image"], message: 'imageStatus is "approved" but there is no image' });
  });

export const settingsSchema = z.object({
  siteName: text.min(1),
  tagline: text,
  siteUrl: text.regex(/^https?:\/\/[^/]+$/, "Use the full address with no trailing slash, e.g. https://example.com"),
  contactEmail: text.regex(/^[^@\s]+@[^@\s]+\.[^@\s]+$/, "Must be an email address"),
  ga4MeasurementId: text.regex(/^(G-[A-Z0-9]+)?$/, "Must look like G-XXXXXXXXXX or be empty"),
  amazonTrackingId: text.regex(/^([A-Za-z0-9]+(-[A-Za-z0-9]+)*-\d{2})?$/, "Must look like yourname-20 or be empty"),
  amazonTrackingEnabled: z.boolean(),
  amazonMarketplace: z.literal("amazon.com"),
  amazonDisclosure: text.min(10),
  // preview (default): unfinished rights/evidence are loud warnings. production: they FAIL the build.
  launchMode: z.enum(["preview", "production"]).default("preview"),
  searchConsoleVerification: text,
});

/** Turn zod issues into plain English lines: "<file>, field "<x>": <message>". */
export function describeIssues(file, error) {
  return error.issues.map((i) => {
    const field = i.path.length ? i.path.join(".") : "(whole file)";
    let msg = i.message;
    if (i.code === "invalid_type" && /undefined|required/i.test(msg)) msg = "this is required but missing";
    if (i.code === "invalid_enum_value" || i.code === "invalid_value") msg = `not one of the allowed choices (${msg})`;
    return `${file}, field "${field}": ${msg}`;
  });
}
