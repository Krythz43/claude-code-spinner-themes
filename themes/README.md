# Spinner themes

Every folder here is one theme for the Claude Code spinner. `verbs.json` is the source of truth for a
theme's verbs and metadata. Each theme's `README.md` repeats those verbs at the bottom for easy reading,
and CI keeps the two in sync.

Want to add your own? See [CONTRIBUTING](../CONTRIBUTING.md). The easiest path is to ask Claude Code,
"help me make a spinner theme," and the skill walks you through it and opens the pull request.

## Available themes

<!-- BEGIN GENERATED INDEX: do not edit by hand, run scripts/build.mjs -->

| Theme | Verbs | Maintainers | What it is |
| --- | --- | --- | --- |
| [Pokemon](POKEMON/) | 40 | [@Krythz43](https://github.com/Krythz43) | Gotta catch them all while Claude works. A trainer's journey, one spinner at a time. |

<!-- END GENERATED INDEX -->

## How a theme is laid out

```
themes/YOUR-THEME/
  verbs.json    source of truth: name, slug, description, maintainers, tags, verbs
  README.md     your write up on top, generated verb list at the bottom
```

`_TEMPLATE/` is a starting point you can copy. Folders that start with `_` are ignored by the tooling.
