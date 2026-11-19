import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import fs from "node:fs";
import remarkProduct from "./plugins/remark-product.mjs";

const settings = JSON.parse(fs.readFileSync(new URL("./src/content/settings.json", import.meta.url), "utf8"));

export default defineConfig({
  site: settings.siteUrl,
  output: "static",
  trailingSlash: "always",
  build: { format: "directory" },
  compressHTML: true,
  devToolbar: { enabled: false },
  integrations: [sitemap({ filter: (page) => !/\/404\/?$/.test(page) })],
  markdown: { remarkPlugins: [remarkProduct], smartypants: true },
});
