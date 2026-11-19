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

export const PRODUCT_STATUSES = ["candidate", "verified", "held", "discontinued"];
export const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const ASIN_PATTERN = /^[A-Z0-9]{10}$/;

const text = z.string().trim();
// Pages CMS may save an empty box as "" (or an untouched group as empty boxes). Treat that as "not filled in".
const blank = (v) => v === "" || v === null || (typeof v === "object" && !Array.isArray(v) && !(v instanceof Date) && Object.values(v).every((x) => x === "" || x === null || x === undefined));
const optional = (schema) => z.preprocess((v) => (blank(v) ? undefined : v), schema.optional());
const date = z.coerce.date();

const imageRecord = z.object({
  image: text.optional(),
  alt: text.optional(),
  credit: text.optional(),
  source: text.optional(),
  licence: text.optional(),
  rights: optional(z.enum(["cleared", "pending"])),
});

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

export const productImageSchema = z.object({
  file: text.min(1),
  alt: text.min(1),
  source: text.min(1),
  licence: text.min(1),
  rights: z.enum(["cleared", "pending"]),
});

export const productSchema = z
  .object({
    id: text.regex(ID_PATTERN, "Use lowercase words joined by hyphens"),
    name: text.min(1),
    brand: text.min(1),
    asin: text.regex(ASIN_PATTERN, "An ASIN is exactly 10 capital letters or digits"),
    status: z.enum(PRODUCT_STATUSES),
    statusReason: text.optional(),
    replacedBy: text.optional(),
    whyWeLikeIt: text.optional(),
    bestUse: text.optional(),
    cta: optional(z.enum(CTA_LABELS)),
    limitations: text.optional(),
    descriptionOriginal: text.optional(),
    collection: z.enum(COLLECTION_IDS),
    image: optional(productImageSchema),
    verifiedOn: optional(date),
    verificationSource: text.optional(),
  })
  .superRefine((p, ctx) => {
    const need = (field, why) => {
      if (p[field] === undefined || p[field] === "") {
        ctx.addIssue({ code: "custom", path: [field], message: `${why}` });
      }
    };
    if (p.status === "held" || p.status === "discontinued") {
      need("statusReason", `A ${p.status} product needs a reason`);
    }
    if (p.status === "verified") {
      need("verifiedOn", "A verified product needs the date it was verified");
      need("verificationSource", "A verified product needs a note saying where it was verified");
      for (const f of ["whyWeLikeIt", "limitations", "descriptionOriginal"]) {
        need(f, "A verified product needs this text before it can be shown");
      }
    }
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
