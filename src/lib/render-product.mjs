// The one place product markup is written (used by the article plugin, the shop page and the end-of-story section).
import { amazonAttrs } from "./affiliate.mjs";
import { imageUrl } from "./catalog.mjs";

export const esc = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const linkAttrs = (p, settings) => {
  const a = amazonAttrs(p.asin, settings);
  return `href="${esc(a.href)}" rel="${a.rel}" target="${a.target}" data-product-id="${esc(p.id)}"`;
};

export function disclosureHtml(settings) {
  return `<p class="disclosure"><strong>Shopping note.</strong> ${esc(settings.amazonDisclosure)} <a href="/affiliate-disclosure/">How our links work</a>.</p>`;
}

export function productMentionHtml(p, settings) {
  return `<a class="product-mention" ${linkAttrs(p, settings)}>${esc(p.name)}<span class="sr-only"> (Amazon, opens in a new tab)</span></a>`;
}

export function productCardHtml(p, settings, { disclosure = false, heading = "h3", compact = false } = {}) {
  const img = p.image && p.image.rights === "cleared"
    ? `<figure class="product-card__media"><img src="${esc(imageUrl(p.image.file))}" alt="${esc(p.image.alt)}" loading="lazy" decoding="async"></figure>`
    : "";
  return `<article class="product-card${img ? " product-card--with-image" : ""}${compact ? " product-card--compact" : ""}" data-product-id="${esc(p.id)}">
${img}<div class="product-card__body">
<p class="product-card__brand">${esc(p.brand)}</p>
<${heading} class="product-card__name">${esc(p.name)}</${heading}>
<p class="product-card__desc">${esc(p.descriptionOriginal)}</p>
${compact ? "" : `<dl class="product-card__facts">
<div><dt>Why we like it</dt><dd>${esc(p.whyWeLikeIt)}</dd></div>
<div><dt>Who it&rsquo;s for</dt><dd>${esc(p.whoItsFor)}</dd></div>
<div><dt>Worth knowing</dt><dd>${esc(p.limitations)}</dd></div>
</dl>`}
<p class="product-card__action"><a class="button" ${linkAttrs(p, settings)}>See it on Amazon<span class="sr-only"> (opens in a new tab)</span></a></p>
${disclosure ? disclosureHtml(settings) : ""}
</div>
</article>`;
}
