// The one place product markup is written (used by the article plugin, the shop page and the end-of-story section).
import { amazonAttrs } from "./affiliate.mjs";
import { imageUrl } from "./catalog.mjs";

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
  return `<p class="disclosure"><strong>Shopping note.</strong> ${esc(settings.amazonDisclosure)} <a href="/affiliate-disclosure/">How our links work</a>.</p>`;
}

export function productMentionHtml(p, settings, ctx) {
  return `<a class="product-mention" ${linkAttrs(p, settings, ctx, "inline")}>${esc(p.name)}<span class="sr-only"> (Amazon, opens in a new tab)</span></a>`;
}

export function productCardHtml(p, settings, { disclosure = false, heading = "h3", compact = false, ctx = {}, placement = "card" } = {}) {
  const img = p.image && p.image.rights === "cleared"
    ? `<figure class="product-card__media"><img src="${esc(imageUrl(p.image.file))}" alt="${esc(p.image.alt)}" loading="lazy" decoding="async"></figure>`
    : "";
  return `<article class="product-card${img ? " product-card--with-image" : ""}${compact ? " product-card--compact" : ""}" data-product-id="${esc(p.id)}">
${img}<div class="product-card__body">
<p class="product-card__brand">${esc(p.brand)}${p.bestUse ? ` <span class="product-card__use">${esc(p.bestUse)}</span>` : ""}</p>
<${heading} class="product-card__name">${esc(p.name)}</${heading}>
<p class="product-card__desc">${esc(p.descriptionOriginal)}</p>
${compact ? "" : `<dl class="product-card__facts">
<div><dt>Why we picked it</dt><dd>${esc(p.whyWeLikeIt)}</dd></div>
${p.limitations ? `<div><dt>Worth knowing</dt><dd>${esc(p.limitations)}</dd></div>` : ""}
</dl>`}
<p class="product-card__action"><a class="button" ${linkAttrs(p, settings, ctx, placement)}>${esc(p.cta || "See It on Amazon")}<span class="sr-only"> (opens in a new tab)</span></a></p>
${disclosure ? disclosureHtml(settings) : ""}
</div>
</article>`;
}
