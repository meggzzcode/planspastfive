// The one place product markup is written (used by the article plugin, the shop page and the end-of-story section).
import { amazonAttrs, disclosureText } from "./affiliate.mjs";
import { imageUrl } from "./catalog.mjs";
import { productImageFor, captionFor } from "./images.mjs";

export const esc = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// ctx = { article: "slug" } on article pages, { page: "shop" } elsewhere; placement = inline | card | story-end | shop.
// These data attributes are read only by the optional analytics click script (src/layouts/Base.astro).
const linkAttrs = (p, settings, ctx = {}, placement = "card") => {
  const a = amazonAttrs(p.asin, settings);
  const where = ctx.article ? `data-article="${esc(ctx.article)}"` : `data-page="${esc(ctx.page || "other")}"`;
  return `href="${esc(a.href)}" rel="${a.rel}" target="${a.target}" data-product-id="${esc(p.id)}" ${where} data-placement="${placement}"`;
};

export function disclosureHtml(settings) {
  return `<p class="disclosure"><strong>Shopping note.</strong> ${esc(disclosureText(settings))} <a href="/affiliate-disclosure/">How our links work</a>.</p>`;
}

export function productMentionHtml(p, settings, ctx) {
  return `<a class="product-mention" ${linkAttrs(p, settings, ctx, "inline")}>${esc(p.name)}<span class="sr-only"> (Amazon, opens in a new tab)</span></a>`;
}

// Cards show one short reason and one caveat; the full evidence stays in the product record.
const firstSentence = (t) => { const m = String(t ?? "").trim().match(/^.*?[.!?](?=\s|$)/); return m ? m[0] : String(t ?? "").trim(); };

export function productCardHtml(p, settings, { heading = "h3", compact = false, ctx = {}, placement = "card", images = {} } = {}) {
  // A picture is shown only when its record in images.json is approved (see productImageFor).
  const rec = productImageFor(p, images);
  const alt = esc(p.image?.alt || rec?.alt);
  const img = rec
    ? `<figure class="product-card__media"><a class="product-card__photo" ${linkAttrs(p, settings, ctx, `${placement}-image`)}><img src="${esc(imageUrl(rec.file))}" alt="${alt}" loading="lazy" decoding="async"></a><figcaption>${esc(captionFor(rec))}</figcaption></figure>`
    : "";
  return `<article class="product-card${img ? " product-card--with-image" : ""}${compact ? " product-card--compact" : ""}" data-product-id="${esc(p.id)}">
${img}<div class="product-card__body">
<p class="product-card__brand">${esc(p.brand)}</p>
<${heading} class="product-card__name">${esc(p.name)}</${heading}>
${compact ? "" : `<p class="product-card__why">${esc(firstSentence(p.whyWeLikeIt))}</p>
${p.limitations ? `<p class="product-card__note"><strong>Worth knowing:</strong> ${esc(firstSentence(p.limitations))}</p>` : ""}
`}<p class="product-card__action"><a class="button" ${linkAttrs(p, settings, ctx, placement)}>${esc(p.cta || "See It on Amazon")}<span class="sr-only"> (opens in a new tab)</span></a></p>
</div>
</article>`;
}
