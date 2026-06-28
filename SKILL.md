---
name: spinner-customizer
description: >-
  Customize the Claude Code spinner, the animated status words shown while Claude works (verbs like
  "Cogitating", "Manifesting", "Pondering"). Use this whenever the user wants to change, set, or
  customize their spinner, spinner verbs, spinner words, status messages, or loading text; browse or
  pick a spinner theme; or make, edit, maintain, or contribute a spinner theme and open a pull request.
  Trigger on phrases like "change my spinner", "set my spinner to the pokemon theme", "what spinner
  themes are there", "make a spinner theme", "custom spinner verbs", or "contribute my theme".
license: MIT
---

# Spinner customizer

This skill manages the Claude Code `spinnerVerbs` setting and a collection of shareable spinner themes.
It does two jobs: it applies a theme to a user's settings, and it helps a contributor create, maintain,
and submit a theme as a pull request.

Read `references/mechanism.md` once before writing settings so you get the setting shape and rules right.

## Finding the themes and scripts

This is a single skill at its own root: `SKILL.md` here, with `references/`, `scripts/`, and `themes/`
beside it. Locate things at run time:

- Themes: the first of these that exists: `$CLAUDE_PLUGIN_ROOT/themes`, then `themes/` next to this
  `SKILL.md`. `apply.mjs` resolves this for you, or pass `--themes <dir>`.
- `scripts/apply.mjs`: writes verbs into a `settings.json` safely.
- `scripts/build.mjs` and `scripts/validate.mjs`: sync and lint themes, used by the create and
  contribute flows (run these from a clone of the repo).

When unsure of the path, run `pwd` and `ls`, or pass `--themes <dir>` to `apply.mjs`.

## Workflows

Pick the workflow that matches the request, then follow the matching reference file.

### Apply a theme  ->  `references/apply-theme.md`
The AskUserQuestion tool shows at most 4 options, so showcase the best 2 or 3 themes plus "Make my own
theme", and when more themes remain add "Show me the whole list" to page through the rest by navigating.
Once a theme is picked, use AskUserQuestion again
to offer vibe variations within it (for Taylor Swift: more energetic, more nostalgic, more folklore-ish)
and regenerate the verbs to match. Confirm scope and mode, then apply with `apply.mjs`. Never hand-edit
`settings.json`; the script preserves other settings and writes a backup.

### Create a theme  ->  `references/create-theme.md`
Help the user invent a coherent set of verbs, offering vibe directions via AskUserQuestion so the mood
fits. Scaffold the theme folder from `themes/_TEMPLATE`, write `verbs.json`, run `build.mjs`, and validate.

### Maintain a theme  ->  `references/create-theme.md` (same rules)
Edit an existing theme's `verbs.json`, rerun `build.mjs`, and validate.

### Contribute a theme  ->  `references/contribute-pr.md`
Fork or branch, commit the new or changed theme, push, and open a pull request. CI must pass and a
reviewer must approve before merge.

## Rules that always apply

- Confirm scope (user, project, or local) and mode (replace or append) before writing. Default to user
  scope and replace mode, but say what you are about to do and let the user redirect.
- Verbs never end with an ellipsis. Claude Code adds it. `apply.mjs` strips trailing ellipses anyway.
- `verbs.json` is the source of truth. After any change to verbs, run `build.mjs` so the README list
  stays in sync, then `validate.mjs`. CI rejects out-of-sync or invalid themes.
- Apply changes through `apply.mjs`, not by editing JSON yourself, so existing settings survive and a
  `.bak` backup is written.
- When you offer the user a set of choices (which theme, which scope, create versus apply), use the
  AskUserQuestion tool rather than a plain text list, and make any "make your own" or "something else"
  path an explicit, visible option, never a hidden one.
- AskUserQuestion shows at most 4 options, so never try to list a whole catalog at once: show a few
  matches plus "Make my own theme", and page through the rest behind a "Show me the whole list" option so
  the user moves through the full list a page at a time. The signature move of this skill is using AskUserQuestion to offer vibe
  variations within a theme (energetic, nostalgic, a specific era) and regenerating the verbs to match,
  so the user tunes the feel rather than just picking a fixed set.
