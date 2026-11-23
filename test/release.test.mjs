// Optional article queue: what gets released, when, and that nothing unready or unscheduled ever goes live.
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { pickNext, publishText, todayIn, notReadyBecause } from "../src/lib/release.mjs";
import { makeCopy, cleanup, editJson, checkContentCli, write, read, REPO } from "./helpers.mjs";
import { releaseNext } from "../scripts/release-next.mjs";

const art = (slug, data = {}) => ({ slug, data: { status: "draft", description: "d", dek: "d", category: "After Hours", format: "discovery", hero: { image: "/images/x.jpg", alt: "a" }, ...data } });
const ready = () => true;
const base = { enabled: true, weekdays: ["tue", "fri"], timezone: "America/New_York", queue: ["a", "b"] };

describe("pickNext", () => {
  test("does nothing while automatic releases are off", () => {
    const r = pickNext({ schedule: { ...base, enabled: false }, articles: [art("a")], today: { date: "2026-12-01", weekday: "tue" }, hasImageFile: ready });
    assert.equal(r.slug, null); assert.match(r.reason, /switched off/);
  });
  test("does nothing on a day that is not a release day", () => {
    const r = pickNext({ schedule: base, articles: [art("a")], today: { date: "2026-12-02", weekday: "wed" }, hasImageFile: ready });
    assert.equal(r.slug, null);
  });
  test("releases the first ready draft in queue order on a release day", () => {
    const r = pickNext({ schedule: base, articles: [art("b"), art("a")], today: { date: "2026-12-01", weekday: "tue" }, hasImageFile: ready });
    assert.equal(r.slug, "a");
  });
  test("skips a queued draft with no picture and releases the next ready one", () => {
    const r = pickNext({ schedule: base, articles: [art("a", { hero: undefined }), art("b")], today: { date: "2026-12-01", weekday: "tue" }, hasImageFile: ready });
    assert.equal(r.slug, "b"); assert.match(r.skipped[0].why, /no top picture/);
  });
  test("skips a draft whose picture has no approved record", () => {
    const r = pickNext({ schedule: { ...base, queue: ["a"] }, articles: [art("a")], today: { date: "2026-12-01", weekday: "tue" }, hasImageFile: () => false });
    assert.equal(r.slug, null); assert.match(r.skipped[0].why, /rights record/);
  });
  test("never releases a draft that is not queued", () => {
    const r = pickNext({ schedule: { ...base, queue: [] }, articles: [art("a")], today: { date: "2026-12-01", weekday: "tue" }, hasImageFile: ready });
    assert.equal(r.slug, null);
  });
  test("releases only once a day", () => {
    const r = pickNext({ schedule: base, articles: [art("x", { status: "published", publishedAt: "2026-12-01" }), art("a")], today: { date: "2026-12-01", weekday: "tue" }, hasImageFile: ready });
    assert.equal(r.slug, null);
  });
  test("the manual button ignores the switch and the weekdays", () => {
    const r = pickNext({ schedule: { ...base, enabled: false }, articles: [art("a")], today: { date: "2026-12-02", weekday: "wed" }, mode: "now", hasImageFile: ready });
    assert.equal(r.slug, "a");
  });
  test("an already-published queued article is passed over", () => {
    const r = pickNext({ schedule: base, articles: [art("a", { status: "published" }), art("b")], today: { date: "2026-12-01", weekday: "tue" }, hasImageFile: ready });
    assert.equal(r.slug, "b");
  });
});

test("todayIn uses the time zone, not UTC", () => {
  const t = todayIn("America/New_York", new Date("2026-12-02T03:30:00Z")); // still Tuesday evening in New York
  assert.deepEqual(t, { date: "2026-12-01", weekday: "tue" });
});

test("publishText flips the draft, dates it and touches nothing else", () => {
  const src = "---\ntitle: T\nstatus: draft\ncategory: After Hours\n---\n\nBody status: draft stays.\n";
  const out = publishText(src, "2026-12-01");
  assert.match(out, /publishedAt: 2026-12-01\nstatus: published\ncategory/);
  assert.match(out, /Body status: draft stays\./);
  const dated = publishText("---\ntitle: T\npublishedAt: 2026-01-01\nstatus: draft\n---\nx", "2026-12-01");
  assert.match(dated, /publishedAt: 2026-12-01/);
  assert.throws(() => publishText("---\ntitle: T\nstatus: published\n---\nx", "2026-12-01"), /not a draft/);
});

describe("release in a scratch copy of the site", () => {
  const prep = () => {
    const dir = makeCopy("ppf-release");
    const real = fs.readdirSync(path.join(dir, "src/content/articles"))[0].replace(/\.md$/, "");
    const draft = read(dir, `src/content/articles/${real}.md`).replace("status: published", "status: draft").replace(/^publishedAt:.*\n/m, "").replace(/image: \/images\/[^\n]+/, "image: /images/cozy-corner.jpg");
    write(dir, "src/content/articles/queued-one.md", draft.replace(/^title:.*$/m, 'title: "Queued one"'));
    return dir;
  };
  test("queue, ready draft, release day: the file becomes published and the site still checks", () => {
    const dir = prep();
    try {
      editJson(dir, "src/content/schedule.json", (s) => { s.enabled = true; s.queue = ["queued-one"]; });
      const r = releaseNext(dir, { date: "2026-12-01" });
      assert.equal(r.released, "queued-one");
      assert.match(read(dir, "src/content/articles/queued-one.md"), /publishedAt: 2026-12-01\nstatus: published/);
      assert.ok(checkContentCli(dir).ok);
    } finally { cleanup(dir); }
  });
  test("default schedule (off) releases nothing and changes no file", () => {
    const dir = prep();
    try {
      const before = read(dir, "src/content/articles/queued-one.md");
      const r = releaseNext(dir, { date: "2026-12-01" });
      assert.equal(r.released, null);
      assert.equal(read(dir, "src/content/articles/queued-one.md"), before);
    } finally { cleanup(dir); }
  });
  test("a queue entry that is not an article fails the content check with a plain message", () => {
    const dir = prep();
    try {
      editJson(dir, "src/content/schedule.json", (s) => { s.queue = ["no-such-article"]; });
      const r = checkContentCli(dir);
      assert.ok(!r.ok); assert.match(r.out, /schedule\.json, field "queue": "no-such-article" is not an article/);
    } finally { cleanup(dir); }
  });
  test("an unready queued draft only warns", () => {
    const dir = prep();
    try {
      editJson(dir, "src/content/schedule.json", (s) => { s.queue = ["queued-one"]; });
      let t = read(dir, "src/content/articles/queued-one.md").replace(/^hero:\n(  .*\n)+/m, "");
      write(dir, "src/content/articles/queued-one.md", t);
      const r = checkContentCli(dir);
      assert.ok(r.ok, r.out); assert.match(r.out, /Queued draft "queued-one" cannot be released yet: it has no top picture yet/);
    } finally { cleanup(dir); }
  });
});

describe("release workflow file", () => {
  const text = fs.readFileSync(path.join(REPO, ".github/workflows/release-next.yml"), "utf8");
  const y = YAML.parse(text); const on = y.on ?? y[true];
  test("runs on a daily schedule or by hand, on main only, minimal permissions, no third-party actions or secrets", () => {
    assert.deepEqual(Object.keys(on).sort(), ["schedule", "workflow_dispatch"]);
    assert.deepEqual(y.permissions, {});
    const job = y.jobs.release;
    assert.deepEqual(job.permissions, { contents: "write" });
    assert.match(job.if, /refs\/heads\/main/);
    assert.doesNotMatch(text, /^\s*-?\s*uses:/m);
    assert.doesNotMatch(text, /secrets\./);
    assert.doesNotMatch(text, /\$\{\{\s*(github\.event\.|inputs\.)/);
  });
  test("commits with the same deploy marker Netlify looks for, only after the full check", () => {
    assert.match(text, /\[deploy\]/);
    assert.ok(text.indexOf("npm run check") < text.indexOf("git commit"));
    assert.match(fs.readFileSync(path.join(REPO, "netlify.toml"), "utf8"), /\[deploy\]/);
  });
  test("is off by default: the shipped schedule has automatic releases disabled", () => {
    assert.equal(JSON.parse(fs.readFileSync(path.join(REPO, "src/content/schedule.json"), "utf8")).enabled, false);
  });
  test(".pages.yml offers the queue form and the manual button", () => {
    const p = YAML.parse(fs.readFileSync(path.join(REPO, ".pages.yml"), "utf8"));
    assert.ok(p.content.find((c) => c.name === "schedule"));
    assert.ok(p.actions.find((a) => a.workflow === "release-next.yml"));
  });
});

describe("fixes from the independent review", () => {
  test("the one-a-day guard works when publishedAt is a Date, as the content loader gives it", () => {
    const published = { slug: "x", data: { status: "published", publishedAt: new Date("2026-12-01T00:00:00Z") } };
    const r = pickNext({ schedule: base, articles: [published, art("a", { dek: "d", category: "After Hours", format: "discovery" })], today: { date: "2026-12-01", weekday: "tue" }, hasImageFile: ready });
    assert.equal(r.slug, null); assert.match(r.reason, /already published today/);
  });
  test("a draft missing its intro line, category or format is not ready, so it cannot block the queue", () => {
    const why = notReadyBecause(art("a", { dek: undefined, category: undefined, format: undefined }), ready).join(";");
    assert.match(why, /dek/); assert.match(why, /category/); assert.match(why, /format/);
    const r = pickNext({ schedule: base, articles: [art("a", { dek: undefined }), art("b")], today: { date: "2026-12-01", weekday: "tue" }, hasImageFile: ready });
    assert.equal(r.slug, "b");
  });
  test("publishText copes with a quoted status and with dollar patterns in the text", () => {
    const out = publishText('---\ntitle: T\ndescription: "Costs $& more"\nstatus: "draft"\n---\nbody', "2026-12-01");
    assert.match(out, /description: "Costs \$& more"/);
    assert.match(out, /status: published/);
  });
});
