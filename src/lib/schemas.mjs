// The ONE place that says what an article, a product and the settings file must look like.
// Used by Astro (src/content.config.ts) and by the plain-node checks (scripts/check-content.mjs).
import { z } from "astro/zod";

export const COLLECTIONS = {
  paper: "The Paper Edit",
  creative: "The Creative Corner",
  cozy: "The Cozy Edit",
  hosting: "The Hosting Edit",
  sporty: "The Movement Edit",
  "little-adventures": "Little Adventures",
};
export const COLLECTION_IDS = Object.keys(COLLECTIONS);

export const PRODUCT_STATUSES = ["candidate", "verified", "held", "discontinued"];
export const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const ASIN_PATTERN = /^[A-Z0-9]{10}$/;

const text = z.string().trim();
const date = z.coerce.date();

const imageRecord = z.object({
  image: text.optional(),
  alt: text.optional(),
  credit: text.optional(),
  source: text.optional(),
  licence: text.optional(),
  rights: z.enum(["cleared", "pending"]).optional(),
});

export const articleSchema = z.object({
  title: text.min(3, "Title is required"),
  description: text.optional(),
  dek: text.optional(),
  publishedAt: date.optional(),
  updatedAt: date.optional(),
  status: z.enum(["draft", "published"]),
  hero: imageRecord.optional(),
  picks: z.array(text).default([]),
  related: z.array(text).default([]),
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
    whoItsFor: text.optional(),
    limitations: text.optional(),
    descriptionOriginal: text.optional(),
    collection: z.enum(COLLECTION_IDS),
    image: productImageSchema.optional(),
    verifiedOn: date.optional(),
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
      for (const f of ["whyWeLikeIt", "whoItsFor", "limitations", "descriptionOriginal"]) {
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
