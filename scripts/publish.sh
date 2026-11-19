#!/usr/bin/env bash
# Publish: merge the `content-edits` branch into `main`, but only if (1) it changes nothing except content
# and pictures, (2) the whole site still checks and builds after the merge. Otherwise `main` is left exactly
# as it was. Run from inside a clone of the repository. Used by .github/workflows/publish-content.yml and
# tested in scratch repositories by test/workflows.test.mjs.
#
# Environment:  CHECK_CMD   command that must succeed after the merge (default: npm ci && npm run check)
#               MAIN, EDITS branch names (defaults: main, content-edits)
set -euo pipefail
MAIN="${MAIN:-main}"
EDITS="${EDITS:-content-edits}"
CHECK_CMD="${CHECK_CMD:-npm ci && npm run check}"
MARKER="[deploy]"

fail() { echo "::error title=Nothing published::$1 Nothing was changed and the live site is as it was."; exit 1; }

git checkout --quiet "$MAIN"
git fetch --quiet origin "$EDITS" || fail "The branch called $EDITS does not exist yet. Open Pages CMS on that branch, save an edit, then press Publish again."

# 1. Path guard: only content and pictures can be published with this button.
bad=0
while IFS= read -r -d '' f; do
  case "$f" in
    src/content/*|public/images/*) ;;
    *) echo "Not allowed: $f"; bad=1 ;;
  esac
done < <(git diff --name-only -z "origin/$MAIN...origin/$EDITS")
if git ls-tree -r "origin/$EDITS" -- src/content public/images | grep -q '^120000'; then
  echo "Not allowed: a shortcut (symbolic link) inside src/content or public/images"; bad=1
fi
[ "$bad" = 0 ] || fail "The $EDITS branch changes files that are not website content (listed above). Only src/content/ and public/images/ can be published with this button."

# 2. Nothing new?
if git merge-base --is-ancestor "origin/$EDITS" HEAD; then
  echo "Nothing to publish: $EDITS has no changes that $MAIN does not already have."
  exit 0
fi

# 3. Merge here (nothing is pushed yet) with the deploy marker that netlify.toml looks for.
git config user.name  >/dev/null 2>&1 || git config user.name "Plans Past Five publisher"
git config user.email >/dev/null 2>&1 || git config user.email "noreply@users.noreply.github.com"
if ! git merge --no-ff "origin/$EDITS" -m "Publish: content edits $MARKER" >/dev/null 2>&1; then
  git merge --abort || true
  fail "These edits clash with a change made directly on $MAIN. Ask the site maintainer to reset the $EDITS branch (docs/OWNER-OPERATIONS.md)."
fi

# 4. Full check and build on the merged result.
if ! bash -c "$CHECK_CMD"; then
  git reset --hard --quiet "origin/$MAIN"
  fail "The site check failed after merging (the list just above names the file and field). Fix it in Pages CMS on the $EDITS branch, save, then press Publish again."
fi

# 5. Publish, then level the edit branch.
git push --quiet origin "HEAD:refs/heads/$MAIN" || fail "GitHub refused the final step (main may have changed while this ran; just try again), or main is protected, or Actions may not write to this repository."
git push --quiet origin "HEAD:refs/heads/$EDITS" || echo "::warning title=Published, but $EDITS was not levelled::Your edits are live. Reset the $EDITS branch before your next edit."
echo "Published: the edits are merged into $MAIN. Netlify now builds the live site."
