// Release rules for the optional article queue. Pure functions on plain data, tested in test/release.test.mjs.
// Nothing here publishes anything by itself: scripts/release-next.mjs applies the result, and the workflow
// .github/workflows/release-next.yml checks the whole site before anything reaches main.
/** "2026-11-23" from a Date (what the content loader gives) or from text. */
export const dayOf = (x) => (x instanceof Date ? x.toISOString().slice(0, 10) : String(x ?? "").slice(0, 10));

export const WEEKDAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

/** "2026-11-24" and "tue" for a moment in a time zone. */
export function todayIn(timezone, now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit", weekday: "short" }).formatToParts(now);
  const get = (t) => parts.find((p) => p.type === t).value;
  return { date: `${get("year")}-${get("month")}-${get("day")}`, weekday: get("weekday").toLowerCase().slice(0, 3) };
}

/** A draft can go live only when it has the things a published article must have. Returns a list of what is missing. */
export function notReadyBecause(article, hasImageFile) {
  const d = article.data;
  const why = [];
  if (d.status !== "draft") why.push(`it is already ${d.status}`);
  if (!d.hero?.image) why.push("it has no top picture yet");
  else if (!hasImageFile(d.hero.image)) why.push("its top picture is missing or has no approved rights record");
  if (d.hero?.image && !d.hero?.alt) why.push("its top picture has no description");
  if (!d.description) why.push("it has no summary (description)");
  if (!d.dek) why.push("it has no intro line (dek)");
  if (!d.category) why.push("it has no category");
  if (!d.format) why.push("it has no format");
  return why;
}

/**
 * Decide what to release. `schedule` is src/content/schedule.json, `articles` is [{ slug, data }].
 * mode "auto": only when enabled, today is one of the weekdays, and nothing was released today yet.
 * mode "now": the owner pressed the button, so the switch and weekdays do not matter.
 * Returns { slug, skipped: [{slug, why}] } or { slug: null, reason }.
 */
export function pickNext({ schedule, articles, today, mode = "auto", hasImageFile }) {
  if (mode === "auto") {
    if (!schedule.enabled) return { slug: null, reason: "Automatic releases are switched off (schedule.json: enabled is false)." };
    if (!schedule.weekdays.includes(today.weekday)) return { slug: null, reason: `Today is ${today.weekday}; releases happen on ${schedule.weekdays.join(", ")}.` };
    if (articles.some((a) => dayOf(a.data.publishedAt) === today.date && a.data.status === "published")) return { slug: null, reason: "Something was already published today." };
  }
  const skipped = [];
  for (const slug of schedule.queue) {
    const a = articles.find((x) => x.slug === slug);
    if (!a) { skipped.push({ slug, why: "there is no article with this name" }); continue; }
    if (a.data.status === "published") continue; // already live: nothing to do
    const why = notReadyBecause(a, hasImageFile);
    if (why.length) { skipped.push({ slug, why: why.join("; ") }); continue; }
    return { slug, skipped };
  }
  return { slug: null, reason: skipped.length ? "Nothing in the queue is ready to publish." : "The queue is empty.", skipped };
}

/** Turn a draft's text into a published one, dated today. Only touches the top block of settings. */
export function publishText(text, date) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) throw new Error("the article has no settings block");
  let block = m[1];
  if (!/^status:\s*["']?draft["']?\s*$/m.test(block)) throw new Error("the article is not a draft");
  block = block.replace(/^status:\s*["']?draft["']?\s*$/m, () => "status: published");
  if (/^publishedAt:.*$/m.test(block)) block = block.replace(/^publishedAt:.*$/m, () => `publishedAt: ${date}`);
  else block = block.replace(/^status: published$/m, () => `publishedAt: ${date}\nstatus: published`);
  return text.replace(m[1], () => block);
}
