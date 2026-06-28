# How the spinner setting works

Claude Code shows rotating status words while it works. Since v2.1.23 these are controlled by the
`spinnerVerbs` key in a `settings.json` file.

## The setting

```json
{
  "spinnerVerbs": {
    "mode": "replace",
    "verbs": [
      "Healing up at the Pokemon Center",
      "Strategizing for the Elite Four"
    ]
  }
}
```

- `mode`:
  - `replace`: use only these verbs.
  - `append`: add these verbs to Claude Code's built-in defaults.
- `verbs`: an array of strings. Do not add a trailing ellipsis; Claude Code appends one when it renders.

## Where it lives (scopes, by precedence)

1. User, global: `~/.claude/settings.json`. Best default for a personal preference like this.
2. Project, shared: `<project>/.claude/settings.json`. Committed, applies to everyone on the repo.
3. Local, personal: `<project>/.claude/settings.local.json`. Not committed, overrides the others.

Higher numbers win where they overlap.

## Rules and limits

- Each verb reads as a task in progress, something happening right now (the spinner shows it as
  "<verb>…"). It need not be an -ing word or a traditional verb; it just has to indicate work is underway.
- No trailing ellipsis on any verb.
- Keep verbs on one line, no tabs or newlines.
- Roughly 20 to 50 verbs reads best. Very long verbs can truncate in narrow terminals (aim under 60
  characters).
- Avoid duplicates (the tooling treats them case-insensitively).

## The append nuance

`append` mode adds your verbs to Claude's built-in defaults, not to any custom verbs already set. If the
user already has a custom set and wants to keep those and add a theme on top, that is a different
operation: union the two lists and write them with `mode: replace`. `apply.mjs --add-to-existing` does
exactly this. Ask the user which they mean before choosing.

## Related settings

- `spinnerTipsEnabled` (boolean): toggles helper tips next to the spinner. Separate from verbs.
- `prefersReducedMotion` (boolean): reduces UI animation for accessibility.

## Status

This feature is stable but not yet in the official settings documentation. It has worked across
versions since v2.1.23.
