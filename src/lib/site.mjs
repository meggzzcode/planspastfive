import settings from "../content/settings.json";
import images from "../content/images.json";
import { imageUrl } from "./catalog.mjs";

export { settings };
export const abs = (p) => settings.siteUrl + p;
export const siteImage = (key) => ({ ...images[key], src: imageUrl(images[key].file) });
export const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
export const isoDate = (d) => new Date(d).toISOString().slice(0, 10);
export const readMinutes = (body) => Math.max(1, Math.round(body.split(/\s+/).length / 210));
export const legalUpdated = "November 19, 2026";
