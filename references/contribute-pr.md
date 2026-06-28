# Contribute a theme as a pull request

Goal: get the new or changed theme onto a branch and into a pull request. `main` is protected, so direct
pushes are rejected; every change goes through a PR that passes CI and gets a reviewer's approval.

## Preconditions

- The theme validates: `node scripts/validate.mjs <NAME>` is clean and `node scripts/build.mjs --check`
  reports in sync.
- The contributor has a GitHub account.

## Path A: gh CLI (preferred)

Check `gh auth status`. If signed in:

```
git checkout -b theme/<slug>
git add themes/<NAME> themes/README.md
git commit -m "Add <Name> spinner theme"
gh pr create --fill --base main
```

If the contributor does not have push access to the upstream repo, `gh pr create` will offer to fork and
push to their fork. Accept that. Then the PR opens from their fork against upstream `main`.

## Path B: manual fork

If `gh` is not available:

1. Fork the repo on GitHub.
2. `git remote add fork https://github.com/<user>/claude-code-spinner-themes.git`
3. `git checkout -b theme/<slug>`
4. Commit the theme folder and `themes/README.md`.
5. `git push fork theme/<slug>`
6. Open the PR on GitHub from the fork's branch to upstream `main`.

## In the PR

The pull request template asks contributors to confirm:

- `verbs.json` is the source of truth and the README is built from it (`build.mjs` was run).
- `validate.mjs` passes with no errors.
- Verbs have no trailing ellipses and no near-duplicates.
- For any branded or trademarked theme, a short "fan made, not affiliated" disclaimer is in the theme
  README.

## After opening

Tell the contributor: CI runs `validate.mjs` and `build.mjs --check` on the PR, both must pass, and a
reviewer reviews and approves before merge. If CI fails, read the log, fix the theme, rebuild, and push
again to the same branch.
