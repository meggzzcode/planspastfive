# Repository privacy check

Checked 2026-11-20 on branch `wp-docs` (based on `main` at bd869ce): every tracked file, plus the whole git history (`git log -p`, all 10 commits, no deleted files, no other branches on the remote). This report lists findings only. It never repeats a secret value.

## One-time owner action (required)
The GitHub repository `meggzzcode/planspastfive` is **public** and the owner wants it **private**. Claude cannot change GitHub settings, so the owner must:

**GitHub > the repository > Settings > General > Danger Zone > Change repository visibility > Make private** (confirm by typing the repository name).

After that:
- **Pages CMS and Netlify keep working.** Each reaches the repository through its own GitHub app or authorisation, not through public access. Pages CMS says private repositories are reached through the GitHub App installation (pagescms.org, GitHub App guide). Netlify's GitHub app is likewise granted per account.
- **Re-check Netlify's GitHub connection** afterwards: Netlify > Project configuration > Build and deploy > Continuous deployment shows the repository as linked. If the Netlify GitHub app was only given access to public repositories, grant it this repository (GitHub > Settings > Applications > Netlify > Configure). UNVERIFIED: nobody has yet run Netlify against this repository.
- Also re-open Pages CMS once and confirm the repository still loads. Check Actions are still enabled (Settings > Actions > General).

**Making the repository private does not erase past exposure.** Anyone who already cloned, forked or starred it keeps their copy; search engines, archive sites and GitHub's own caches may still show old pages for a while. Treat everything below as already seen by the public.

## Result: no secrets found
| Check | Result |
|---|---|
| API keys, tokens, passwords, private keys (files and full history) | None. The only matches are workflow code that uses GitHub's built-in per-run token (`.github/workflows/publish-content.yml` lines 14, 48, 52; `undo-last-publish.yml` lines 40, 44). That token is created fresh for each run and is not stored in the repository. |
| `.env` or credential files | None tracked; `.gitignore` does not need one. |
| Commit author details | All 10 commits are authored as a generic "Claude" no-reply address. No personal email or name. |
| Picture metadata | The pictures carry at most an "AI generated" marker or an image-tool label (AI images) or a photographer credit (Pexels). No camera, location or personal data. |
| Amazon order numbers, card or payment details, Associates logins, account holder name | None, except the item below. |
| The owner's other site and its tracking ID | Not named anywhere. `docs/RISKS.md` line 3 says only "another site's tag". |

## Findings
| # | Where | Severity | What | Action |
|---|---|---|---|---|
| 1 | `docs/COSTS.md` line 12 (introduced in commit 0d1f4b9, so it remains in history) | **Low to medium** | A domain registrar order number was written next to the domain price. It is not a password and cannot be used without the registrar login, but order numbers help someone impersonate the owner to registrar support. | Removed from the current files in this branch. The number is still in git history and in any copy made while the repository was public. Option: because the repository is new, the owner may ask Claude to rewrite history before making it private, or accept the low risk. Keep the order number in the owner's own records. |
| 2 | `src/content/settings.json` line 5; `docs/TRANSFER.md` line 10; `docs/COSTS.md` line 13 | Low | The contact mailbox `hello@planspastfive.com` and its provider. This address is already printed on the live Contact page, so it is public by design. | None. Expect spam to it. |
| 3 | `src/content/settings.json` line 7; `docs/RISKS.md` line 3; tests | Low | The Amazon tracking ID `planspastfive-20`. Tracking IDs are visible to everyone in every affiliate link once tracking is on, so this is not a secret. It is stored in the repository while tracking is off, so someone could use it in their own links and credit the owner's account. | None needed; this is normal for affiliate IDs. Remove or replace it when selling (see `docs/TRANSFER.md`). |
| 4 | `docs/COSTS.md` lines 8 to 14 | Low | Cost figures: Netlify plan price, credits left, domain and mailbox prices, total paid, renewal dates. | A buyer needs these, so they stay. They are business facts, not account access. Credits-left changes daily and can be dropped. |
| 5 | `docs/RISKS.md`, `docs/OWNER-OPERATIONS.md` | Low | Candid statements: Associates approval not confirmed, no traffic or earnings, AI-picture rights unverified, trademark not searched. | Fine for a buyer. Some owners prefer not to publish these before a sale; privacy solves that. |
| 6 | `.github/workflows/*.yml`, `netlify.toml`, `.pages.yml` | Informational | Shows exactly how publishing works. Contains no credentials. | None. |

## What a public viewer could already see
The whole source of the site; all documentation; the tracking ID and contact email (findings 2 and 3); the cost figures and renewal dates (4); the open risks (5); the GA4 field (empty: no analytics ID is stored); the demo article and the three verified products. They could not see: any login, any key, any Associates account detail, any earnings, or the other site.

## Facts moved or removed in the docs (item 1 of this work)
- Registrar order number: removed from `docs/COSTS.md`.
- Account ids, amounts of any earnings, Associates account holder: not present in the docs; none added.
- The Associates status notes in the old project (`/home/user/plans-past-five`) name the owner's other site and its tracking ID; those must **not** be copied into this repository.

## Owner-only note (keep out of the repository)
Keep privately: the registrar order number, the registrar and mailbox logins, the Associates account email and any tracking ID other than the one used on this site, the Netlify account page. If a buyer asks for proof of purchase of the domain, show the registrar receipt directly.
