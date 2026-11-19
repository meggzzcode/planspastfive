#!/usr/bin/env bash
# Undo the newest "Publish: content edits" merge on main by adding a new commit that reverses it
# (history is kept; nothing is rewritten or force-pushed). The content-edits branch is not touched.
# Environment: DEPLOY=true adds the [deploy] marker so Netlify builds the undo (default true).
#              CHECK_CMD, MAIN as in publish.sh.
set -euo pipefail
MAIN="${MAIN:-main}"
CHECK_CMD="${CHECK_CMD:-npm ci && npm run check}"
DEPLOY="${DEPLOY:-true}"
fail() { echo "::error title=Nothing undone::$1 Nothing was changed."; exit 1; }

git checkout --quiet "$MAIN"
git config user.name  >/dev/null 2>&1 || git config user.name "Plans Past Five publisher"
git config user.email >/dev/null 2>&1 || git config user.email "noreply@users.noreply.github.com"
target="$(git log --first-parent --format=%H --grep='^Publish: content edits' -n 1 "$MAIN")"
[ -n "$target" ] || fail "No earlier publish was found on $MAIN, so there is nothing to undo."
if ! git revert --no-commit -m 1 "$target" >/dev/null 2>&1; then
  git revert --abort >/dev/null 2>&1 || true
  git reset --hard --quiet
  fail "The newest publish cannot be undone automatically because later changes touch the same files. Ask the site maintainer."
fi
if [ "$DEPLOY" = "true" ]; then msg="Undo the last publish of content edits [deploy]"; else msg="Undo the last publish of content edits (no live build requested)"; fi
git commit --quiet -m "$msg"
if ! bash -c "$CHECK_CMD"; then
  git reset --hard --quiet "origin/$MAIN" 2>/dev/null || git reset --hard --quiet HEAD~1
  fail "After the undo the site check found a problem (listed above)."
fi
git push --quiet origin "HEAD:refs/heads/$MAIN" || fail "GitHub refused the push (main changed while this ran, or main is protected, or Actions may not write)."
echo "Undone. Next: reset the content-edits branch so the undone edits do not come back (docs/OWNER-OPERATIONS.md)."
