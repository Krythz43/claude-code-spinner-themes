# Create or maintain a theme

Goal: a coherent, on-theme set of verbs in a valid theme folder, with the README in sync.

## 1. Gather the idea

Use the AskUserQuestion tool for every choice here, including the first one, never a plain text list.

- The theme itself: present a few example ideas (a show, a game, a craft, a mood) plus a visible
  "Describe my own theme" option, so the user picks an idea or types their own in the input.
- A one-line description (it shows in the theme index).
- The vibe. Offer about 4 to 5 vibe directions via AskUserQuestion that fit the theme (for a music
  artist: energetic, nostalgic, a specific era; for a game: cozy, hardcore, lore-heavy), plus a
  "describe my own" option, so the verbs match the feel the user wants.
- Roughly how many verbs. 20 to 50 reads best.
- Each author's name and GitHub handle. A theme can have one or more authors; list everyone who
  worked on it.

## 2. Write the verbs

The spinner renders each verb as "<verb>…" while Claude works, so every verb must read as a task in
progress, something happening right now. It does not have to start with an -ing word or be a grammatical
verb; it just has to convey that work is underway.

Good verbs:

- Indicate ongoing work, in any phrasing: "Charting a route", "Deep in the warp core", "On the Elite Four".
- Avoid static labels or standalone quotes that do not imply progress. To use a catchphrase, frame it as
  something happening: not "That's what she said" but "Stuck on a that's-what-she-said bug".
- Match the chosen vibe and vary the imagery, so the rotation does not feel repetitive.
- Are one line, under about 60 characters, with no trailing ellipsis.
- Are distinct from each other (no near-duplicates).

Aim for breadth across the theme's world rather than ten variations of one action. Offer to retune
("make it more energetic", "lean harder into the lore") and regenerate until the user is happy.

## 3. Scaffold the folder

Copy `themes/_TEMPLATE` to `themes/<NAME>` (folder name is the theme in caps, for example `STARTREK`).
Fill `verbs.json`:

```json
{
  "name": "Star Trek",
  "slug": "startrek",
  "description": "Engage. Boldly waiting where no spinner has waited before.",
  "authors": [{ "name": "Your Name", "github": "your-handle" }],
  "tags": ["sci-fi", "tv"],
  "verbs": ["Aligning the deflector dish", "Consulting the ship's computer"]
}
```

- `slug`: lowercase letters, digits, and hyphens. Keep it close to the folder name lowercased.
- `authors`: one object per author (a theme can have several), GitHub handle only, no `@`.

## 4. Sync the README and validate

Write the human part of `themes/<NAME>/README.md` (everything above the `## Verbs` heading). Leave the
generated block alone. Then, from the repo root:

```
node scripts/build.mjs              # fills the README verb list and the index
node scripts/validate.mjs <NAME>    # checks the theme
```

Fix any errors `validate.mjs` reports. Warnings are advisory. Re-run `build.mjs` after any verb change so
the README stays in sync; CI checks this.

## 5. Preview (optional)

Apply it locally to try it out, ideally to a throwaway file first:

```
node scripts/apply.mjs <slug> --settings /tmp/preview-settings.json --dry-run
```

When the theme looks right, move on to `contribute-pr.md` to open the pull request.
