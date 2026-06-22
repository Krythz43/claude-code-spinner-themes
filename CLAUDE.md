# CLAUDE.md

Working notes for developing this repo. This file is for contributors and for Claude Code when editing
the project. It will be trimmed to a short contributor guide before the first public release.

## What this is

`claude-code-spinner-themes` is one repo that is a Claude Code skill, a plugin, a marketplace, and an
npm installer at once. It manages the `spinnerVerbs` setting (see
`skills/spinner-customizer/references/mechanism.md`) and ships a growing collection of themes.

## Layout

- `skills/spinner-customizer/` the skill: `SKILL.md`, `references/`, and `scripts/apply.mjs` (safe
  settings merge, bundled so a standalone install works).
- `themes/<NAME>/` one theme: `verbs.json` (source of truth) and `README.md` (prose on top, generated
  verb list at the bottom). `_TEMPLATE` is the starting point and is ignored by the tooling.
- `scripts/` the engine: `build.mjs` syncs READMEs and the index from `verbs.json`, `validate.mjs`
  lints. `lib/themes.mjs` is shared by both.
- `bin/cli.mjs` the npm install command (`spinnerverbs4cc`). Install only, no theme logic.
- `.claude-plugin/` plugin and marketplace manifests.
- `.github/` CI and templates.

## Rules

- `verbs.json` is the only source of truth for verbs. After any verb change, run `node scripts/build.mjs`
  so the READMEs stay in sync, then `node scripts/validate.mjs`. CI enforces both.
- Verbs: one line, no trailing ellipsis, no near-duplicates, roughly 20 to 50 per theme.
- Never hand-edit a user's `settings.json`. Use `apply.mjs`, which preserves other keys and writes a
  `.bak`.
- No runtime dependencies. Node built-ins only, so CI needs no install step.

## Writing style

No em-dashes, no filler. Real content only, in both docs and READMEs.

## Commands

```
node scripts/build.mjs            # regenerate READMEs and the index
node scripts/build.mjs --check    # CI sync check, writes nothing
node scripts/validate.mjs         # lint all themes
node scripts/validate.mjs POKEMON # lint one theme
node bin/cli.mjs install --dir /tmp/skills   # try the installer without touching ~/.claude
```

## Before going public

- The owner handle is `Krythz43`, set across `package.json`, the README install command, and the POKEMON
  theme. The only remaining `your-github-handle` placeholders are in `themes/_TEMPLATE/`, which is
  intentional, since contributors copy it and fill in their own.
- Trim this file to a short contributor guide. Confirm README, CONTRIBUTING, LICENSE, and templates read
  well.
- Create the public repo, push, and protect `main`: require a pull request, require review, require the
  `validate-themes` check, include administrators, block direct pushes and merges.
- `npm publish` the `spinnerverbs4cc` package.
