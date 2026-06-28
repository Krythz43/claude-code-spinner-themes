# Contributing

Thanks for adding to the spinner themes. The fastest path is to let the skill do it: open Claude Code in
a clone of this repo and say "help me make a spinner theme". It writes the verbs with you, scaffolds the
folder, runs the checks, and opens the pull request. If you would rather do it by hand, here is the whole
process.

## Add a theme by hand

1. Copy `themes/_TEMPLATE` to `themes/<NAME>`. Use the theme name in caps for the folder, for example
   `STARTREK`.

2. Edit `themes/<NAME>/verbs.json`:

   ```json
   {
     "name": "Star Trek",
     "slug": "startrek",
     "description": "One line shown in the theme index.",
     "authors": [{ "name": "Your Name", "github": "your-handle" }],
     "tags": ["sci-fi", "tv"],
     "verbs": ["Aligning the deflector dish", "Consulting the ship's computer"]
   }
   ```

   - `slug`: lowercase letters, digits, and hyphens.
   - `authors`: one entry per author (a theme can have several); GitHub handle only, no `@`.
   - `verbs`: one line each, no trailing ellipsis, no near-duplicates. Roughly 20 to 50 reads best, and
     keeping each under about 60 characters avoids truncation in narrow terminals.

3. Write the human part of `themes/<NAME>/README.md`, everything above the `## Verbs` heading. Leave the
   generated block between the markers alone.

4. Sync and validate from the repo root:

   ```
   node scripts/build.mjs            # fills the README verb list and the theme index
   node scripts/validate.mjs <NAME>  # lints the theme
   ```

   Fix any errors. Warnings are advice, not blockers.

## Good verbs

- Read as a task in progress, work happening now, in any phrasing. The spinner shows each as "<verb>…",
  so not a bare quote or label: "Charting a route", "Folding the dough", "Deep in the warp core".
- Cover the breadth of the theme rather than ten takes on one action.
- Stay in good taste. Nothing hateful, harassing, or NSFW.

## Trademarks and fan themes

Themes based on a game, show, or brand are welcome as fan content. Add a short line to the theme README
saying it is fan made and not affiliated with the rights holder. Do not copy long passages of
copyrighted text; write original verbs inspired by the theme.

## Open the pull request

`main` is protected, so you cannot push to it directly. Work on a branch and open a PR:

```
git checkout -b theme/<slug>
git add themes/<NAME> themes/README.md
git commit -m "Add <Name> spinner theme"
gh pr create --fill --base main
```

If you do not have push access, `gh` will offer to fork and push to your fork. No `gh`? Fork on GitHub,
push your branch to the fork, and open the PR from there.

## What happens next

CI runs `validate.mjs` and `build.mjs --check` on your PR. Both must pass. A reviewer then looks it over and
approves before it merges. If CI fails, read the log, fix the theme, run `build.mjs` again, and push to
the same branch.
