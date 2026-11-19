// Remark plugin: turns {{product:id}} (inline link) and {{pick:id}} (inline product card) in article
// Markdown into output built from the product source. An unknown or unpublishable id FAILS THE BUILD.
// The first product block in an article also carries the Amazon disclosure.
import { fileURLToPath } from "node:url";
import { loadContent } from "../src/lib/content-fs.mjs";
import { resolveProduct, MARKER } from "../src/lib/catalog.mjs";
import { productCardHtml, productMentionHtml, disclosureHtml } from "../src/lib/render-product.mjs";

const ROOT = fileURLToPath(new URL("..", import.meta.url));

export default function remarkProduct() {
  const content = loadContent(ROOT);
  const byId = new Map(content.products.map((p) => [p.data.id, p.data]));
  const settings = content.settings;

  return (tree, file) => {
    const where = (file.path || "an article").replace(ROOT, "");
    const refs = [];
    let disclosed = false;

    const get = (kind, id) => {
      const r = resolveProduct(byId, id);
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
            node.children[i] = { type: "html", value: productCardHtml(p, settings, { disclosure: !disclosed }) };
            disclosed = true;
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
            parts.push({ type: "html", value: productMentionHtml(p, settings) });
            last = m.index + m[0].length;
          }
          if (last < child.value.length) parts.push({ type: "text", value: child.value.slice(last) });
          node.children.splice(i, 1, ...parts);
          i += parts.length - 1;
          if (!disclosed && node.type === "paragraph") {
            // put the short disclosure straight after the first paragraph that mentions a product
            disclosed = true;
            node.__needsDisclosure = true;
          }
          continue;
        }
        walk(child);
        if (child.__needsDisclosure) {
          node.children.splice(i + 1, 0, { type: "html", value: disclosureHtml(settings) });
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
