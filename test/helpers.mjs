// Shared test helpers. Every test that changes anything works on a COPY of the repository in os.tmpdir.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

export const REPO = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const SKIP = new Set(["node_modules", "dist", ".git", ".astro"]);

/** Copy the repository (without node_modules, dist, .git) into a fresh temp folder; node_modules is linked. */
export function makeCopy(label = "ppf") {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `${label}-`));
  const copy = (from, to) => {
    for (const e of fs.readdirSync(from, { withFileTypes: true })) {
      if (SKIP.has(e.name) && from === REPO) continue;
      const a = path.join(from, e.name), b = path.join(to, e.name);
      if (e.isDirectory()) { fs.mkdirSync(b, { recursive: true }); copy(a, b); } else fs.copyFileSync(a, b);
    }
  };
  copy(REPO, dir);
  // Tests protect behaviour, not shipped wording: every copy gets FIXTURE articles and products (test/fixtures),
  // so editorial rewrites of src/content/articles or src/content/products cannot break them.
  for (const kind of ["articles", "products"]) {
    fs.rmSync(path.join(dir, "src/content", kind), { recursive: true, force: true });
    fs.cpSync(path.join(REPO, "test/fixtures", kind), path.join(dir, "src/content", kind), { recursive: true });
  }
  // Settings too: tests run against fixture settings (tracking OFF), so the owner switching tracking on,
  // changing the tag or the launch mode in the real settings file cannot break them.
  fs.copyFileSync(path.join(REPO, "test/fixtures/settings.json"), path.join(dir, "src/content/settings.json"));
  // One pending (unapproved) picture lives only in the fixtures, so the production-mode tests have something to reject.
  const imgPath = path.join(dir, "src/content/images.json");
  fs.writeFileSync(imgPath, JSON.stringify({ ...JSON.parse(fs.readFileSync(imgPath, "utf8")), ...JSON.parse(fs.readFileSync(path.join(REPO, "test/fixtures/images.json"), "utf8")) }, null, 2));
  fs.cpSync(path.join(REPO, "test/fixtures/images"), path.join(dir, "public/images"), { recursive: true });
  // node_modules: a real folder of links to the real packages, so each copy has its own Astro cache
  fs.mkdirSync(path.join(dir, "node_modules"));
  for (const e of fs.readdirSync(path.join(REPO, "node_modules"))) {
    if (e === ".astro" || e === ".vite") continue;
    fs.symlinkSync(path.join(REPO, "node_modules", e), path.join(dir, "node_modules", e));
  }
  return dir;
}
export const cleanup = (dir) => fs.rmSync(dir, { recursive: true, force: true });

const run = (cmd, args, cwd, env = {}) => {
  const r = spawnSync(cmd, args, { cwd, encoding: "utf8", env: { ...process.env, NODE_NO_WARNINGS: "1", ...env }, timeout: 180000 });
  return { ok: r.status === 0, out: `${r.stdout || ""}${r.stderr || ""}` };
};
/** The real pipeline: content check, Astro build, link check. */
export const npmBuild = (dir) => run("npm", ["run", "build", "--silent"], dir);
export const checkContentCli = (dir) => run("node", ["scripts/check-content.mjs"], dir);
export const astroBuildOnly = (dir) => run("node", ["scripts/clean-cache.mjs"], dir).ok && run("node", ["node_modules/astro/bin/astro.mjs", "build"], dir);

export const read = (dir, f) => fs.readFileSync(path.join(dir, f), "utf8");
export const write = (dir, f, s) => { fs.mkdirSync(path.dirname(path.join(dir, f)), { recursive: true }); fs.writeFileSync(path.join(dir, f), s); };
export const exists = (dir, f) => fs.existsSync(path.join(dir, f));
export const editJson = (dir, f, fn) => { const j = JSON.parse(read(dir, f)); fn(j); write(dir, f, JSON.stringify(j, null, 2)); };
export const ARTICLE = "src/content/articles/your-first-junk-journal-spread.md";
export const SETTINGS = "src/content/settings.json";
export const editArticle = (dir, fn) => write(dir, ARTICLE, fn(read(dir, ARTICLE)));

export const amazonLinks = (html) => [...html.matchAll(/href="(https:\/\/www\.amazon\.com\/[^"]+)"/g)].map((m) => m[1]);
export const distHtml = (dir, f) => read(dir, `dist/${f}`);

export const newProduct = (over = {}) => ({
  id: "washi-tape-demo", name: "Demo Washi Tape", brand: "Demo Brand", asin: "B0TESTAAAA", status: "candidate",
  whyWeLikeIt: "A soft matte finish that tears by hand.", bestUse: "Best for neat page edges",
  limitations: "The adhesive is light, so it suits paper and not fabric.", descriptionOriginal: "A roll of matte decorative paper tape.",
  collection: "creative", ...over,
});
export const addProduct = (dir, p) => write(dir, `src/content/products/${p.id}.json`, JSON.stringify(p, null, 2));

/** Evidence for a fully verified product (invented for TEST COPIES only, never for the real content). */
export const verifiedFields = (over = {}) => ({
  status: "verified", editorialDecision: "approve", verificationSource: "Test: listing read.",
  listingChecked: { checkedOn: "2026-11-20", variant: "test", listingAvailable: "yes", sellerType: "amazon", affiliateLinkEligible: "yes" },
  specsEvidence: "Test: https://maker.example/spec", suitability: "Test: suits beginners.", ...over,
});
/** Turn every real product in a copy into a fully verified one (needed before tracking can be switched on). */
export const promoteProducts = (dir) => {
  for (const f of fs.readdirSync(path.join(dir, "src/content/products"))) editJson(dir, `src/content/products/${f}`, (p) => Object.assign(p, verifiedFields()));
};
/** An approved image record (test copies only). */
export const approvedImage = (over = {}) => ({
  commercialUse: "yes", transferWithSite: "yes", licenceName: "Test licence", licenceUrl: "https://example.com/licence",
  licenceCheckedOn: "2026-11-20", approvedOn: "2026-11-20", rightsStatus: "approved", ...over,
});
export const IMAGES = "src/content/images.json";
