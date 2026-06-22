# Apply a theme

Goal: get a theme's verbs into the right `settings.json` without disturbing anything else.

## 1. Find and present the themes

Locate the themes directory (see SKILL.md for resolution order). Read each theme folder's `verbs.json`
for `name`, `description`, `verbs.length`, and `maintainers`.

If there are only a handful of themes, list them with name, verb count, maintainer, and two sample
verbs. If there are many, do not dump them all. Ask what the user is into (games, sci-fi, cooking, calm,
chaotic) and show the closest few. Let them ask to see more.

## 2. Confirm scope and mode

Before writing, state what you will do and let the user redirect:

- Scope: `user` (default, `~/.claude/settings.json`), `project`, or `local`. See mechanism.md.
- Mode: `replace` (default, only these verbs) or `append` (these plus Claude's defaults).
- If the user already has custom verbs and wants to keep them and add this theme, use
  `--add-to-existing` (it unions and writes `replace`).

## 3. Apply with the script

Always use `apply.mjs`. It preserves every other setting, writes a `.bak` backup, strips trailing
ellipses, and de-duplicates.

```
node scripts/apply.mjs <slug> --scope user --mode replace
```

Examples:

```
# default user scope, replace mode
node scripts/apply.mjs pokemon

# project scope, append to Claude's defaults
node scripts/apply.mjs pokemon --scope project --mode append

# keep my current custom verbs and add this theme on top
node scripts/apply.mjs pokemon --add-to-existing

# preview without writing
node scripts/apply.mjs pokemon --dry-run
```

You can also pass a path directly: `node scripts/apply.mjs ./themes/POKEMON/verbs.json`.

## 4. Confirm

Tell the user how many verbs were written, to which file, that a backup exists, and that they should
start a new turn or restart Claude Code to see the change. If they do not like it, the backup is at
`<settings>.bak`.
