// Serves the built site (dist/) the way a static host would. Usage: npm run preview   (PORT=4321 by default)
// Exported startServer() is used by the tests.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".xml": "application/xml", ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".woff2": "font/woff2", ".txt": "text/plain", ".ico": "image/x-icon" };

export function startServer(dist, port = 0) {
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (p === "/sitemap.xml") p = "/sitemap-index.xml"; // mirrors public/_redirects
    let file = path.join(dist, p);
    if (!file.startsWith(dist)) { res.writeHead(403).end("Forbidden"); return; }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!fs.existsSync(file) && fs.existsSync(file + ".html")) file += ".html";
    if (!fs.existsSync(file)) {
      res.writeHead(404, { "content-type": TYPES[".html"] });
      res.end(fs.existsSync(path.join(dist, "404.html")) ? fs.readFileSync(path.join(dist, "404.html")) : "Not found");
      return;
    }
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(port, "127.0.0.1", () => resolve({ server, port: server.address().port })));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dist = path.resolve(fileURLToPath(new URL("../dist", import.meta.url)));
  if (!fs.existsSync(path.join(dist, "index.html"))) { console.error("There is no built site yet. Run: npm run build"); process.exit(1); }
  const { port } = await startServer(dist, Number(process.env.PORT) || 4321);
  console.log(`Preview running at http://127.0.0.1:${port}/  (Ctrl+C to stop)`);
}
