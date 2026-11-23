// Release the next ready article from the queue in src/content/schedule.json.
// Usage: node scripts/release-next.mjs [--now] [--date YYYY-MM-DD] [rootFolder]
//   (no flag)  automatic mode: obeys "enabled" and "weekdays" in schedule.json
//   --now      the owner pressed "Release next article now": ignores the switch and weekdays
// It changes only ONE article file (draft -> published, dated today) and prints what it did. It never commits:
// the workflow checks the whole site first and commits only if everything passes.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadContent } from "../src/lib/content-fs.mjs";
import { pickNext, publishText, todayIn, WEEKDAYS } from "../src/lib/release.mjs";
import { imageUrl, resolveProduct, MARKER } from "../src/lib/catalog.mjs";
import { isApproved, recordForFile } from "../src/lib/images.mjs";

export function releaseNext(root, { mode = "auto", date, now = new Date() } = {}) {
  const c = loadContent(root);
  if (c.errors.length) return { released: null, reason: `The content has errors, so nothing was released:\n${c.errors.join("\n")}`, failed: true };
  const schedule = c.schedule;
  const today = date ? { date, weekday: WEEKDAYS[new Date(`${date}T00:00:00Z`).getUTCDay()] } : todayIn(schedule.timezone, now);
  const hasImageFile = (img) => {
    const hit = recordForFile(c.images, img);
    return fs.existsSync(path.join(root, "public", imageUrl(img).replace(/^\//, ""))) && !!hit && isApproved(hit[1]);
  };
  const byId = new Map(c.products.map((p) => [p.data.id, p.data]));
  const bodies = new Map(c.articles.map((a) => [a.slug, a.body]));
  const unshownProducts = (a) => [...new Set([...(a.data.picks || []), ...[...(bodies.get(a.slug) || "").matchAll(MARKER)].map((m) => m[2])])].filter((id) => !resolveProduct(byId, id, c.settings?.launchMode ?? "preview").product);
  const r = pickNext({ schedule, articles: c.articles.map((a) => ({ slug: a.slug, data: a.data })), today, mode, hasImageFile, unshownProducts });
  if (!r.slug) return { released: null, reason: r.reason, skipped: r.skipped || [] };
  const file = path.join(root, "src/content/articles", `${r.slug}.md`);
  fs.writeFileSync(file, publishText(fs.readFileSync(file, "utf8"), today.date));
  return { released: r.slug, date: today.date, skipped: r.skipped };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const now = args.includes("--now");
  const di = args.indexOf("--date");
  const date = di >= 0 ? args[di + 1] : undefined;
  const root = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--date")[0] || process.cwd();
  const r = releaseNext(root, { mode: now ? "now" : "auto", date });
  for (const s of r.skipped || []) console.log(`Skipped "${s.slug}": ${s.why}.`);
  if (r.released) console.log(`Released "${r.released}" dated ${r.date}.`);
  else console.log(r.reason);
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `released=${r.released || ""}\n`);
  process.exit(r.failed ? 1 : 0);
}
