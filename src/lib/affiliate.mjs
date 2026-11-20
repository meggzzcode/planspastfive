// The ONLY place that builds an Amazon link. Tag comes from settings.json and nowhere else.
export const AMAZON_REL = "sponsored noopener noreferrer";

/** True when links should carry the tracking tag. */
export function trackingActive(settings) {
  return settings.amazonTrackingEnabled === true && String(settings.amazonTrackingId || "").trim() !== "";
}

/** https://www.amazon.com/dp/<ASIN>  (+ ?tag=<id> only when tracking is switched on and an id is set). */
export function amazonUrl(asin, settings) {
  const base = `https://www.amazon.com/dp/${asin}`;
  return trackingActive(settings) ? `${base}?tag=${encodeURIComponent(settings.amazonTrackingId.trim())}` : base;
}

/** Attributes every outbound Amazon link must carry. */
export function amazonAttrs(asin, settings) {
  return { href: amazonUrl(asin, settings), rel: AMAZON_REL, target: "_blank" };
}

/**
 * The one-line shopping note, accurate to the tracking state. Tracking on: the plain sentence plus the exact
 * required statement from settings. Tracking off: says we earn nothing yet (never claims commissions).
 */
export function disclosureText(settings) {
  return trackingActive(settings)
    ? `Some links on this site go to Amazon and are affiliate links. ${settings.amazonDisclosure}`
    : "Product links on this site go to Amazon. They are ordinary links for now, so we earn nothing from them yet.";
}

/** Plain-English problems with the affiliate settings (empty list = fine). */
export function affiliateSettingsProblems(settings, file = "src/content/settings.json") {
  const out = [];
  if (settings.amazonTrackingEnabled === true && String(settings.amazonTrackingId || "").trim() === "") {
    out.push(`${file}, field "amazonTrackingId": tracking is switched on (amazonTrackingEnabled) but there is no tracking ID. Add the ID or switch tracking off.`);
  }
  return out;
}
