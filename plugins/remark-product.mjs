// Remark plugin: turns {{product:id}} (inline link) and {{pick:id}} (inline product card) in article
// Markdown into output built from the product source. An unknown or unpublishable id FAILS THE BUILD.
// A one-line Amazon disclosure is placed BEFORE the first product link or card (never only after it).
import { fileURLToPath } from "node:url";
import { loadContent } from "../src/lib/content-fs.mjs";
import { resolveProduct, MARKER } from "../src/lib/catalog.mjs";
import { productCardHtml, productMentionHtml, disclosureHtml } from "../src/lib/render-product.mjs";

const ROOT = fileURLToPath(new URL("..", import.meta.url));

export default function remarkProduct() {
  const content = loadContent(ROOT);
  const byId = new Map(content.products.map((p) => [p.data.id, p.data]));
  const settings = content.settings;
  const mode = settings.launchMode;

  return (tree, file) => {
    const where = (file.path || "an article").replace(ROOT, "");
    const ctx = { article: (file.path || "").split("/").pop().replace(/\.md$/, "") };
    const refs = [];
    let disclosed = false;

    const get = (kind, id) => {
      const r = resolveProduct(byId, id, mode);
      if (r.error) {
        throw new Error(`${where}: {{${kind}:${id}}} cannot be shown because ${r.error}. Fix the product in src/content/products/ or remove the marker.`);
      }
      refs.push(r.product.id);
      return r.product;
    };

    const walk = (node) => {
      if (!node.children) return;
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (child.type === "paragraph" && child.children.length === 1 && child.children[0].type === "text") {
          const only = new RegExp(`^\\s*${MARKER.source}\\s*$`).exec(child.children[0].value);
          if (only && only[1] === "pick") {
            const p = get("pick", only[2]);
            const card = { type: "html", value: productCardHtml(p, settings, { ctx, images: content.images }) };
            if (!disclosed) {
              node.children.splice(i, 1, { type: "html", value: disclosureHtml(settings) }, card);
              i++;
              disclosed = true;
            } else node.children[i] = card;
            continue;
          }
        }
        if (child.type === "text" && MARKER.test(child.value)) {
          MARKER.lastIndex = 0;
          const parts = [];
          let last = 0, m;
          while ((m = MARKER.exec(child.value))) {
            if (m.index > last) parts.push({ type: "text", value: child.value.slice(last, m.index) });
            const p = get(m[1], m[2]);
            parts.push({ type: "html", value: productMentionHtml(p, settings, ctx) });
            last = m.index + m[0].length;
          }
          if (last < child.value.length) parts.push({ type: "text", value: child.value.slice(last) });
          node.children.splice(i, 1, ...parts);
          i += parts.length - 1;
          if (!disclosed) {
            // the short disclosure goes straight BEFORE the first paragraph that links a product
            disclosed = true;
            node.__needsDisclosure = true;
          }
          continue;
        }
        walk(child);
        if (child.__needsDisclosure && (node.type === "paragraph" || node.type === "heading")) {
          node.__needsDisclosure = true; // never put a block inside a paragraph: let the parent place it
          delete child.__needsDisclosure;
        } else if (child.__needsDisclosure) {
          delete child.__needsDisclosure;
          node.children.splice(i, 0, { type: "html", value: disclosureHtml(settings) });
          i++;
        }
      }
    };
    walk(tree);
    MARKER.lastIndex = 0;
    const fm = file.data.astro?.frontmatter;
    if (fm) { fm.productRefs = [...new Set(refs)]; fm.disclosureShown = disclosed; }
  };
}
