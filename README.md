# claude-code-spinner-themes

Themes for the Claude Code spinner. Browse a pack of themed status messages, apply it in one step, or
make your own and share it through a pull request. The repo is a Claude Code skill, a plugin, a
marketplace, and an npm installer at the same time, so you can use whichever install path you like.

## What is a spinner verb

While Claude Code works, it shows a rotating status word: "Cogitating", "Manifesting", "Pondering", and
so on. Since Claude Code v2.1.23 you can replace these with your own through the `spinnerVerbs` setting
in `settings.json`:

```json
{
  "spinnerVerbs": {
    "mode": "replace",
    "verbs": ["Healing up at the Pokemon Center", "Strategizing for the Elite Four"]
  }
}
```

- `mode`: `replace` uses only your verbs, `append` adds them to the built-in defaults.
- `verbs`: an array of strings, no trailing ellipsis (Claude Code adds one).

This project gives you ready-made packs of those verbs and a skill that edits the setting for you,
safely, without touching the rest of your config.

## Install

Pick one. All three give you the same skill.

**Plugin marketplace**

```
/plugin marketplace add Krythz43/claude-code-spinner-themes
/plugin install spinner-themes
```

**npm**

```
npx spinnerverbs4cc
```

This copies the skill and the themes into `~/.claude/skills/`. Add `--update` to refresh a later version.

**Manual**

Clone the repo and copy `SKILL.md`, `references/`, `scripts/`, and `themes/` into
`~/.claude/skills/spinner-customizer/`. Or just run `npx spinnerverbs4cc`, which does exactly that.

## Use it

Open Claude Code and ask in plain language:

- "What spinner themes are there?"
- "Change my spinner to the Pokemon theme."
- "Add the Pokemon verbs on top of my current ones."
- "Help me make a spinner theme."

The skill lists themes, confirms where to write (user, project, or local) and whether to replace or
append, backs up your `settings.json`, and applies the change. Start a new turn to see the result.

## Themes

Browse them in [`themes/`](themes/). Each theme has a `verbs.json` (the source of truth) and a README
with the full list at the bottom. The first theme is [Pokemon](themes/POKEMON/).

## Make your own

The skill writes the verbs with you, scaffolds the folder, validates it, and opens the pull request.
Clone the repo, open Claude Code, and say "help me make a spinner theme". If you prefer to do it by
hand, see [CONTRIBUTING](CONTRIBUTING.md). Every theme goes through a pull request that has to pass CI
and get a maintainer's approval before it lands on `main`.

## How it works

- `verbs.json` is the single source of truth for each theme.
- `scripts/build.mjs` regenerates the verb list inside each README and the theme index.
- `scripts/validate.mjs` lints every theme; CI runs it and the sync check on every pull request.
- `scripts/apply.mjs` merges a theme into a `settings.json` without disturbing your other settings, and
  writes a `.bak` backup first.

## License

MIT. See [LICENSE](LICENSE).
