import settings from "../content/settings.json";
import images from "../content/images.json";
import { imageUrl } from "./catalog.mjs";
import { captionFor, recordForFile } from "./images.mjs";

export { settings, images };
export const abs = (p) => settings.siteUrl + p;
export const siteImage = (key) => ({ ...images[key], src: imageUrl(images[key].file), caption: captionFor(images[key]) });
/** The rights record (and its true caption) for a picture typed as a file path; null when there is none. */
export const recordFor = (file) => { const hit = recordForFile(images, file); return hit ? { ...hit[1], caption: captionFor(hit[1]) } : null; };
export const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
export const isoDate = (d) => new Date(d).toISOString().slice(0, 10);
export const readMinutes = (body) => Math.max(1, Math.round(body.split(/\s+/).length / 210));
export const legalUpdated = "November 23, 2026";
