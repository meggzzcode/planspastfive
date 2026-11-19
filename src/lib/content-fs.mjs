// Reads content straight from disk for the checks and the remark plugin (plain node, no Astro needed).
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { articleSchema, productSchema, settingsSchema, describeIssues } from "./schemas.mjs";

const rel = (root, f) => path.relative(root, f).split(path.sep).join("/");

export function parseFrontmatter(raw) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!m) return { error: "the file must start with a block of settings between two lines of ---" };
  try {
    return { data: YAML.parse(m[1]) ?? {}, body: m[2] };
  } catch (e) {
    return { error: `the settings block at the top is not valid (${String(e.message).split("\n")[0]})` };
  }
}

export function loadContent(root) {
  const errors = [];
  const out = { root, settings: null, articles: [], products: [], errors };

  const sFile = path.join(root, "src/content/settings.json");
  try {
    const parsed = settingsSchema.safeParse(JSON.parse(fs.readFileSync(sFile, "utf8")));
    if (parsed.success) out.settings = parsed.data;
    else errors.push(...describeIssues("src/content/settings.json", parsed.error));
  } catch (e) {
    errors.push(`src/content/settings.json: cannot be read as JSON (${e.message})`);
  }

  const aDir = path.join(root, "src/content/articles");
  for (const f of fs.existsSync(aDir) ? fs.readdirSync(aDir).sort() : []) {
    if (!f.endsWith(".md")) continue;
    const file = rel(root, path.join(aDir, f));
    const fm = parseFrontmatter(fs.readFileSync(path.join(aDir, f), "utf8"));
    if (fm.error) { errors.push(`${file}: ${fm.error}`); continue; }
    const parsed = articleSchema.safeParse(fm.data);
    if (!parsed.success) { errors.push(...describeIssues(file, parsed.error)); continue; }
    out.articles.push({ file, slug: f.replace(/\.md$/, ""), data: parsed.data, raw: fm.data, body: fm.body });
  }

  const pDir = path.join(root, "src/content/products");
  for (const f of fs.existsSync(pDir) ? fs.readdirSync(pDir).sort() : []) {
    if (!f.endsWith(".json")) continue;
    const file = rel(root, path.join(pDir, f));
    let json;
    try { json = JSON.parse(fs.readFileSync(path.join(pDir, f), "utf8")); }
    catch (e) { errors.push(`${file}: cannot be read as JSON (${e.message})`); continue; }
    const parsed = productSchema.safeParse(json);
    if (!parsed.success) { errors.push(...describeIssues(file, parsed.error)); continue; }
    out.products.push({ file, fileId: f.replace(/\.json$/, ""), data: parsed.data });
  }
  return out;
}
