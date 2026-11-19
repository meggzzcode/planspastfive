// Playwright is a big download, so it is NOT an npm dependency. Tests and screenshots use the copy that is
// preinstalled on the development machine, and skip politely if it is not there.
import { createRequire } from "node:module";
import { execSync } from "node:child_process";

export function requirePlaywright() {
  const require = createRequire(import.meta.url);
  try { return require("playwright"); } catch {}
  try {
    const root = execSync("npm root -g", { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    return require(root + "/playwright");
  } catch {}
  try { return require("/opt/node22/lib/node_modules/playwright"); } catch {}
  return null;
}
