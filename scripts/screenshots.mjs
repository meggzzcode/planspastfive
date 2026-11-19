// Takes screenshots of the built site with Playwright (preinstalled on the dev machine; not an npm dependency).
// Usage: node scripts/screenshots.mjs [outDir] [distDir]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { startServer } from "./preview.mjs";
import { requirePlaywright } from "./playwright-loader.mjs";

export async function takeScreenshots(dist, outDir, articleSlug) {
  const pw = requirePlaywright();
  if (!pw) throw new Error("Playwright is not installed on this machine, so screenshots cannot be taken.");
  const { chromium } = pw;
  fs.mkdirSync(outDir, { recursive: true });
  const { server, port } = await startServer(dist);
  const browser = await chromium.launch();
  const pages = [["home", "/"], ["journal", "/journal/"], ["article", `/journal/${articleSlug}/`], ["shop", "/shop/"], ["about", "/about/"]];
  const files = [];
  try {
    for (const [w, h] of [[1280, 900], [390, 844]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } });
      const page = await ctx.newPage();
      for (const [name, url] of pages) {
        await page.goto(`http://127.0.0.1:${port}${url}`, { waitUntil: "networkidle" });
        await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); });
        await page.waitForLoadState("networkidle");
        const f = path.join(outDir, `${name}-${w}.png`);
        await page.screenshot({ path: f, fullPage: true });
        files.push(f);
      }
      await ctx.close();
    }
  } finally { await browser.close(); server.close(); }
  return files;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL("..", import.meta.url));
  const out = path.resolve(process.argv[2] || path.join(root, "docs/milestone-1/screenshots"));
  const dist = path.resolve(process.argv[3] || path.join(root, "dist"));
  const files = await takeScreenshots(dist, out, "your-first-junk-journal-spread");
  console.log(files.join("\n"));
}
