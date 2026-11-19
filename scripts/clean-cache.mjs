// Astro caches rendered Markdown by file content, but product links inside articles also depend on the
// product files and on settings.json (the Amazon tag). A stale cache could keep an OLD tag in an article,
// so every build starts from a clean cache.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("..", import.meta.url));
for (const d of [".astro", "node_modules/.astro", "node_modules/.vite"]) fs.rmSync(root + d, { recursive: true, force: true });
