# Browse, tune, and apply a theme

Goal: get a set of verbs the user loves into the right `settings.json`, using the AskUserQuestion tool
as the interface, with the freedom to tune the vibe.

## 1. Showcase a few themes, not the whole catalog

Locate the themes directory (see SKILL.md for resolution order). Read each theme's `verbs.json` for
`name`, `slug`, `description`, `verbs`, and `authors`.

Present with the AskUserQuestion tool. It shows at most 4 options at once, so you cannot list a whole
catalog in one prompt. Use the slots well:

- The best 2 or 3 themes for the user's hints. If they named a vibe or a fandom, lead with matches.
- A visible "Make my own theme" option (routes to `create-theme.md`).
- When more themes remain, a "Show me the whole list" option. When the user picks it, page through the
  rest with AskUserQuestion, a few per page, each page ending in a "More themes" option, so the user
  moves through the whole catalog by navigating, never a text dump.

When the whole catalog already fits in 4 options, just show them all (no "Show me the whole list" needed).

Put a sample verb or two in each option's description (a short line), not in a multi-line preview: some
terminals collapse previews to a "N lines hidden" fold, so the flavor never shows. Keep any preview to a
single line, or omit it. List options explicitly; do not rely on the picker's hidden "Other".

## 2. Shape the verbs before applying

A theme is a starting point, not a fixed set. After a theme is picked, use the AskUserQuestion tool AGAIN
to offer ways to shape it: apply as-is, shift the vibe, regenerate a fresh set, or customize the existing
verbs (add, remove, swap, or fix specific ones). The vibe shift is the signature move: offer about 4 to 5
vibe directions WITHIN the theme. For Taylor Swift, for example:

- Balanced: deep cuts across every era
- More energetic: pop bangers, reputation and 1989 energy
- More nostalgic: debut, Fearless, Speak Now
- More folklore-ish: folklore and evermore, cottagecore, melancholy
- Let me describe the vibe myself

Always include a "describe my own vibe" option. When the user chooses, regenerate or reselect the verbs
toward that mood: keep each one a task in progress (something happening now, any phrasing), on theme, one line, no trailing ellipsis, deduped,
roughly 20 to 50. Show the result and keep tuning on request ("more energetic", "swap that one", "add a
few about the vault"). The user can always ask to see and edit the full verb list directly.

Regenerate produces a brand new set for the same theme; customize lets the user add, remove, swap, or
reword specific verbs and fix any that are not a task in progress. By default all of this makes a
personalized set for the user's own settings and does not change the shared theme in the repo. To save
the result back into the theme, or as a new one, follow "Maintain a theme" or `create-theme.md`, then run
`build.mjs` and `validate.mjs`.

## 3. Confirm scope and mode

Before writing, state what you will do and let the user redirect:

- Scope: `user` (default, `~/.claude/settings.json`), `project`, or `local`. See mechanism.md.
- Mode: `replace` (default, only these verbs) or `append` (these plus Claude's defaults).
- To keep the user's current custom verbs and add a theme on top, use `--add-to-existing`.

## 4. Apply with the script

Always use `apply.mjs`. It preserves every other setting, writes a `.bak` backup, strips trailing
ellipses, and de-duplicates. For a saved theme pass the slug; for a tuned set that is not saved, write
the verbs to a temp `verbs.json` and pass its path:

```
# a saved theme
node scripts/apply.mjs pokemon --scope user --mode replace

# a vibe-tuned set you just generated (temp file needs only {"name": "...", "verbs": [...]})
node scripts/apply.mjs /tmp/tuned-verbs.json --scope user --mode replace

# append to Claude's defaults, or add on top of the user's current custom verbs
node scripts/apply.mjs taylorswift --mode append
node scripts/apply.mjs taylorswift --add-to-existing

# preview without writing
node scripts/apply.mjs pokemon --dry-run
```

## 5. Confirm

Tell the user how many verbs were written, to which file, that a `.bak` backup exists, and that they
should start a new turn or restart Claude Code to see the change. The backup is at `<settings>.bak`.
