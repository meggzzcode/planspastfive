// Publishing workflow logic (item 6): workflow files parsed, publish/undo scripts run in scratch git repos
// with a local "origin", and the Netlify build-ignore rule run for every case. Nothing here touches GitHub or Netlify.
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import YAML from "yaml";
import { REPO } from "./helpers.mjs";

const PUBLISH = path.join(REPO, "scripts/publish.sh");
const UNDO = path.join(REPO, "scripts/undo-publish.sh");
const sh = (cwd, cmd, env = {}) => spawnSync("bash", ["-c", cmd], { cwd, encoding: "utf8", env: { ...process.env, GIT_AUTHOR_NAME: "t", GIT_AUTHOR_EMAIL: "t@t", GIT_COMMITTER_NAME: "t", GIT_COMMITTER_EMAIL: "t@t", ...env } });
const git = (cwd, args) => { const r = sh(cwd, `git ${args}`); assert.equal(r.status, 0, r.stderr); return r.stdout.trim(); };

/** A scratch world: bare origin with main (+ content-edits), and a fresh working clone like the Actions runner makes. */
function world(editFn) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "ppf-wf-"));
  const origin = path.join(root, "origin.git");
  const seed = path.join(root, "seed");
  git(root, `init -q --bare -b main origin.git`);
  git(root, `clone -q origin.git seed`);
  fs.mkdirSync(path.join(seed, "src/content/articles"), { recursive: true });
  fs.mkdirSync(path.join(seed, "public/images"), { recursive: true });
  fs.mkdirSync(path.join(seed, "src/pages"), { recursive: true });
  fs.writeFileSync(path.join(seed, "src/content/articles/a.md"), "one\n");
  fs.writeFileSync(path.join(seed, "src/pages/index.astro"), "code\n");
  git(seed, "add -A"); git(seed, 'commit -q -m "start"'); git(seed, "push -q origin HEAD:main");
  git(seed, "checkout -q -b content-edits");
  if (editFn) editFn(seed);
  git(seed, "add -A"); git(seed, 'commit -q --allow-empty -m "cms edit"'); git(seed, "push -q origin content-edits");
  git(seed, "checkout -q main");
  const runner = path.join(root, "runner");
  git(root, `clone -q origin.git runner`);
  return { root, origin, seed, runner, mainSha: () => git(origin, "rev-parse main"), log: () => git(origin, "log --first-parent --format=%s main") };
}
const publish = (w, env = {}) => sh(w.runner, `bash ${PUBLISH}`, { CHECK_CMD: "true", ...env });

describe("publish script (guard, merge, check, push) in scratch repos", () => {
  test("content and picture edits are merged to main with the [deploy] marker, and content-edits is levelled", () => {
    const w = world((s) => { fs.writeFileSync(path.join(s, "src/content/articles/a.md"), "two\n"); fs.writeFileSync(path.join(s, "public/images/p.jpg"), "x"); });
    const before = w.mainSha();
    const r = publish(w);
    assert.equal(r.status, 0, r.stdout + r.stderr);
    assert.notEqual(w.mainSha(), before);
    assert.equal(w.log().split("\n")[0], "Publish: content edits [deploy]");
    assert.equal(git(w.origin, "rev-parse content-edits"), w.mainSha());
  });
  for (const [name, edit] of [
    ["a code change", (s) => fs.writeFileSync(path.join(s, "src/pages/index.astro"), "hacked\n")],
    ["a workflow change", (s) => { fs.mkdirSync(path.join(s, ".github/workflows"), { recursive: true }); fs.writeFileSync(path.join(s, ".github/workflows/x.yml"), "x"); }],
    ["a file outside the content folders", (s) => fs.writeFileSync(path.join(s, "netlify.toml"), "x")],
    ["a file named like content but outside it (src/content.config.ts)", (s) => fs.writeFileSync(path.join(s, "src/content.config.ts"), "x")],
    ["a symbolic link inside src/content", (s) => fs.symlinkSync("/etc/passwd", path.join(s, "src/content/articles/link.md"))],
  ]) test(`the path guard refuses ${name} and leaves main untouched`, () => {
    const w = world(edit);
    const before = w.mainSha();
    const r = publish(w);
    assert.notEqual(r.status, 0);
    assert.match(r.stdout + r.stderr, /Nothing published/);
    assert.equal(w.mainSha(), before);
  });
  test("a failing site check stops the publish and leaves main exactly as it was", () => {
    const w = world((s) => fs.writeFileSync(path.join(s, "src/content/articles/a.md"), "broken\n"));
    const before = w.mainSha();
    const r = publish(w, { CHECK_CMD: "echo 'field problem listed here'; false" });
    assert.notEqual(r.status, 0);
    assert.match(r.stdout + r.stderr, /field problem listed here/);
    assert.match(r.stdout + r.stderr, /Nothing was changed/);
    assert.equal(w.mainSha(), before);
  });
  test("with nothing new it succeeds and changes nothing", () => {
    const w = world();
    const first = publish(w);
    assert.equal(first.status, 0);
    const w2 = world(); git(w2.origin, "update-ref refs/heads/content-edits refs/heads/main");
    const r = publish(w2); const m = w2.mainSha();
    assert.equal(r.status, 0); assert.match(r.stdout, /Nothing to publish/); assert.equal(w2.mainSha(), m);
  });
  test("a missing content-edits branch fails plainly", () => {
    const w = world(); git(w.origin, "branch -D content-edits");
    const r = publish(w);
    assert.notEqual(r.status, 0); assert.match(r.stdout + r.stderr, /does not exist yet/);
  });
  test("an edit that clashes with a direct change on main fails and leaves main alone", () => {
    const w = world((s) => fs.writeFileSync(path.join(s, "src/content/articles/a.md"), "edit side\n"));
    git(w.seed, "checkout -q main"); fs.writeFileSync(path.join(w.seed, "src/content/articles/a.md"), "main side\n");
    git(w.seed, "add -A"); git(w.seed, 'commit -q -m "direct"'); git(w.seed, "push -q origin main");
    git(w.runner, "pull -q");
    const before = w.mainSha();
    const r = publish(w);
    assert.notEqual(r.status, 0); assert.match(r.stdout + r.stderr, /clash/);
    assert.equal(w.mainSha(), before);
  });
});

describe("undo script in scratch repos", () => {
  const publishedWorld = () => { const w = world((s) => fs.writeFileSync(path.join(s, "src/content/articles/a.md"), "two\n")); assert.equal(publish(w).status, 0); git(w.runner, "pull -q"); return w; };
  test("undo reverses the last publish with a new commit (with [deploy] by default) and keeps history", () => {
    const w = publishedWorld(); const n = git(w.origin, "rev-list --count main");
    const r = sh(w.runner, `bash ${UNDO}`, { CHECK_CMD: "true" });
    assert.equal(r.status, 0, r.stdout + r.stderr);
    assert.equal(git(w.origin, "rev-list --count main"), String(Number(n) + 1));
    assert.equal(git(w.origin, "log -1 --format=%s main"), "Undo the last publish of content edits [deploy]");
    assert.equal(git(w.origin, "show main:src/content/articles/a.md"), "one");
  });
  test("with DEPLOY=false the undo commit has no marker (no Netlify credits)", () => {
    const w = publishedWorld();
    assert.equal(sh(w.runner, `bash ${UNDO}`, { CHECK_CMD: "true", DEPLOY: "false" }).status, 0);
    assert.doesNotMatch(git(w.origin, "log -1 --format=%s main"), /\[deploy\]/);
  });
  test("undo with no earlier publish fails plainly; a failing check leaves main alone", () => {
    const w = world(); const r = sh(w.runner, `bash ${UNDO}`, { CHECK_CMD: "true" });
    assert.notEqual(r.status, 0); assert.match(r.stdout + r.stderr, /nothing to undo/);
    const p = publishedWorld(); const m = p.mainSha();
    assert.notEqual(sh(p.runner, `bash ${UNDO}`, { CHECK_CMD: "false" }).status, 0);
    assert.equal(p.mainSha(), m);
  });
});

describe("workflow files", () => {
  const load = (f) => YAML.parse(fs.readFileSync(path.join(REPO, ".github/workflows", f), "utf8"));
  for (const f of ["publish-content.yml", "undo-last-publish.yml"]) {
    test(`${f}: only manual start, main only, minimal permissions, no third-party actions, payload input`, () => {
      const y = load(f); const on = y.on ?? y[true];
      assert.deepEqual(Object.keys(on), ["workflow_dispatch"]);
      assert.ok("payload" in on.workflow_dispatch.inputs, "Pages CMS needs a payload input");
      assert.deepEqual(y.permissions, {});
      const job = Object.values(y.jobs)[0];
      assert.deepEqual(job.permissions, { contents: "write" });
      assert.match(job.if, /github\.ref == 'refs\/heads\/main'/);
      const text = fs.readFileSync(path.join(REPO, ".github/workflows", f), "utf8");
      assert.doesNotMatch(text, /^\s*-?\s*uses:/m, "no third-party actions");
      assert.doesNotMatch(text, /secrets\./);
      assert.doesNotMatch(text, /\$\{\{\s*(github\.event|inputs\.payload)/, "untrusted input never goes into a command");
    });
  }
  test("the deploy marker is the same in publish.sh, the undo script, netlify.toml and the workflow docs", () => {
    assert.match(fs.readFileSync(PUBLISH, "utf8"), /MARKER="\[deploy\]"/);
    assert.match(fs.readFileSync(UNDO, "utf8"), /\[deploy\]/);
    assert.match(fs.readFileSync(path.join(REPO, "netlify.toml"), "utf8"), /grep -q '\\\[deploy\\\]'/);
  });
  test("the publish workflow runs the publish script, which runs the full check", () => {
    assert.match(fs.readFileSync(path.join(REPO, ".github/workflows/publish-content.yml"), "utf8"), /bash scripts\/publish\.sh/);
    assert.match(fs.readFileSync(PUBLISH, "utf8"), /npm ci && npm run check/);
  });
});

describe("netlify.toml", () => {
  const toml = fs.readFileSync(path.join(REPO, "netlify.toml"), "utf8");
  const rule = /ignore\s*=\s*'''\n?([\s\S]*?)'''/.exec(toml)[1];
  test("build command, publish folder and Node version are set", () => {
    assert.match(toml, /command = "npm run build"/); assert.match(toml, /publish = "dist"/); assert.match(toml, /NODE_VERSION = "22"/);
  });
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "ppf-ignore-"));
  git(scratch, "init -q"); 
  const decide = (msg, context) => { git(scratch, `commit -q --allow-empty -m ${JSON.stringify(msg)}`); const env = context ? { CONTEXT: context } : {}; const e = { ...process.env, ...env }; if (!context) delete e.CONTEXT; const r = spawnSync("bash", ["-c", rule], { cwd: scratch, env: { ...e, GIT_AUTHOR_NAME: "t", GIT_AUTHOR_EMAIL: "t@t", GIT_COMMITTER_NAME: "t", GIT_COMMITTER_EMAIL: "t@t" } }); return r.status === 0 ? "SKIP" : "BUILD"; };
  for (const [name, msg, want, ctx] of [
    ["CMS save without marker", "content(update): src/content/articles/x.md", "SKIP", "production"],
    ["docs-only commit", "docs: reword", "SKIP", "production"],
    ["publish merge commit", "Publish: content edits [deploy]", "BUILD", "production"],
    ["marker in the last line", "content: x\n\nRelease [deploy]", "BUILD", "production"],
    ["undo without marker", "Undo the last publish of content edits (no live build requested)", "SKIP", "production"],
    ["undo with marker", "Undo the last publish of content edits [deploy]", "BUILD", "production"],
    ["misspelled marker", "Release [deplo]", "SKIP", "production"],
    ["context unset behaves like production", "content: y", "SKIP", ""],
    ["branch deploy builds (listed at 0 credits, UNVERIFIED)", "content: z", "BUILD", "branch-deploy"],
    ["deploy preview builds", "content: w", "BUILD", "deploy-preview"],
  ]) test(`ignore rule: ${name} -> ${want}`, () => assert.equal(decide(msg, ctx), want));
});

describe(".pages.yml", () => {
  const y = YAML.parse(fs.readFileSync(path.join(REPO, ".pages.yml"), "utf8"));
  test("uses only keys documented at pagescms.org/docs (see docs/OWNER-OPERATIONS.md)", () => {
    const top = new Set(["settings", "media", "content", "actions"]);
    for (const k of Object.keys(y)) assert.ok(top.has(k), `unknown top-level key ${k}`);
    const entryKeys = new Set(["name", "label", "type", "path", "format", "filename", "view", "fields"]);
    const fieldKeys = new Set(["name", "label", "type", "required", "description", "options", "pattern", "default", "list", "fields"]);
    const optionKeys = new Set(["values", "multiple", "collection", "search", "value", "label", "minlength", "maxlength", "format", "switcher", "time", "media"]);
    const checkFields = (fields, where) => fields.forEach((f) => {
      for (const k of Object.keys(f)) assert.ok(fieldKeys.has(k), `${where}.${f.name}: undocumented field key ${k}`);
      for (const k of Object.keys(f.options || {})) assert.ok(optionKeys.has(k), `${where}.${f.name}: undocumented option ${k}`);
      if (f.fields) checkFields(f.fields, `${where}.${f.name}`);
    });
    for (const c of y.content) { for (const k of Object.keys(c)) assert.ok(entryKeys.has(k), `${c.name}: undocumented key ${k}`); checkFields(c.fields, c.name); }
    for (const a of y.actions) for (const k of Object.keys(a)) assert.ok(["name", "label", "workflow", "ref", "cancelable", "confirm"].includes(k), `action key ${k}`);
    assert.deepEqual(y.media, { input: "public/images", output: "/images", categories: ["image"], rename: "safe" });
  });
  test("every product and article field the site needs has a form field, and actions point at real workflows", () => {
    const names = (n) => y.content.find((c) => c.name === n).fields.map((f) => f.name);
    for (const f of ["id", "name", "brand", "asin", "status", "statusReason", "replacedBy", "whyWeLikeIt", "bestUse", "cta", "limitations", "descriptionOriginal", "collection", "image", "verificationSource", "editorialDecision", "order", "listingChecked", "specsEvidence", "suitability", "qualityNote", "imageStatus"]) assert.ok(names("products").includes(f), f);
    for (const f of ["title", "description", "dek", "publishedAt", "updatedAt", "status", "category", "format", "featured", "hero", "picks", "body"]) assert.ok(names("articles").includes(f), f);
    for (const a of y.actions) assert.ok(fs.existsSync(path.join(REPO, ".github/workflows", a.workflow)));
    assert.ok(y.content.find((c) => c.name === "settings").fields.some((f) => f.name === "launchMode"));
    assert.equal(y.content.find((c) => c.name === "settings").path, "src/content/settings.json");
  });
});
