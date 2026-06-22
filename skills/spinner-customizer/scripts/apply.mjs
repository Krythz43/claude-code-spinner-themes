#!/usr/bin/env node
// Safely writes a theme's verbs into a Claude Code settings.json.
// Self-contained (Node built-ins only) so it works from a standalone skill
// install as well as from the repo.
//
//   node apply.mjs <theme-slug|path-to-verbs.json> [options]
//
// Options:
//   --scope user|project|local   where to write (default user = ~/.claude/settings.json)
//   --mode replace|append        replace all defaults, or append to them (default replace)
//   --settings <path>            write to an explicit file (overrides --scope, used for testing)
//   --themes <dir>               look for themes here instead of the bundled location
//   --add-to-existing            union the theme with the user's current custom verbs (writes mode replace)
//   --dry-run                    print what would happen, write nothing

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const fail = (msg) => { console.error(msg); process.exit(1); };

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) out[key] = true;
      else { out[key] = next; i++; }
    } else out._.push(a);
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));
const themeArg = args._[0];
if (!themeArg) {
  fail('Usage: node apply.mjs <theme-slug|path-to-verbs.json> [--scope user|project|local] [--mode replace|append] [--settings <path>] [--themes <dir>] [--add-to-existing] [--dry-run]');
}

const mode = String(args.mode || 'replace');
if (!['replace', 'append'].includes(mode)) fail(`--mode must be replace or append, got "${mode}"`);

const scope = String(args.scope || 'user');
let settingsPath;
if (args.settings) settingsPath = resolve(String(args.settings));
else if (scope === 'user') settingsPath = join(homedir(), '.claude', 'settings.json');
else if (scope === 'project') settingsPath = join(process.cwd(), '.claude', 'settings.json');
else if (scope === 'local') settingsPath = join(process.cwd(), '.claude', 'settings.local.json');
else fail(`--scope must be user, project, or local, got "${scope}"`);

function themesCandidates() {
  const list = [];
  if (args.themes) list.push(resolve(String(args.themes)));
  if (process.env.CLAUDE_PLUGIN_ROOT) list.push(join(process.env.CLAUDE_PLUGIN_ROOT, 'themes'));
  list.push(join(scriptDir, '..', 'themes'));             // bundled inside an installed skill
  list.push(join(scriptDir, '..', '..', '..', 'themes')); // repo layout
  return list;
}

function loadTheme() {
  const direct = isAbsolute(themeArg) ? themeArg : resolve(themeArg);
  if (existsSync(direct)) {
    const file = statSync(direct).isDirectory() ? join(direct, 'verbs.json') : direct;
    if (existsSync(file)) return JSON.parse(readFileSync(file, 'utf8'));
  }
  const wanted = String(themeArg).toLowerCase();
  for (const dir of themesCandidates()) {
    if (!existsSync(dir)) continue;
    for (const folder of readdirSync(dir)) {
      if (folder.startsWith('_') || folder.startsWith('.')) continue;
      const tdir = join(dir, folder);
      if (!statSync(tdir).isDirectory()) continue;
      const file = join(tdir, 'verbs.json');
      if (!existsSync(file)) continue;
      let data;
      try { data = JSON.parse(readFileSync(file, 'utf8')); } catch { continue; }
      if (folder.toLowerCase() === wanted || String(data.slug || '').toLowerCase() === wanted) return data;
    }
  }
  return null;
}

const stripEllipsis = (s) => String(s).replace(/\s*(\.\.\.|…)+\s*$/u, '').trimEnd();
const dedupe = (arr) => {
  const seen = new Set();
  const out = [];
  for (const v of arr) {
    const k = v.trim().toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(v);
  }
  return out;
};

const data = loadTheme();
if (!data) fail(`Theme "${themeArg}" not found. Looked in:\n  ${themesCandidates().join('\n  ')}`);
if (!Array.isArray(data.verbs) || data.verbs.length === 0) fail(`Theme "${themeArg}" has no verbs.`);

const verbs = dedupe(data.verbs.map(stripEllipsis).filter((v) => v && v.trim()));

let raw = '';
let settings = {};
if (existsSync(settingsPath)) {
  raw = readFileSync(settingsPath, 'utf8');
  if (raw.trim()) {
    try { settings = JSON.parse(raw); }
    catch (e) { fail(`Refusing to write: ${settingsPath} is not valid JSON (${e.message}). Fix it first.`); }
  }
}

let result;
if (mode === 'append' && args['add-to-existing'] && settings.spinnerVerbs && Array.isArray(settings.spinnerVerbs.verbs)) {
  result = { mode: 'replace', verbs: dedupe([...settings.spinnerVerbs.verbs.map(stripEllipsis), ...verbs]) };
} else {
  result = { mode, verbs };
}

settings.spinnerVerbs = result;
const out = JSON.stringify(settings, null, 2) + '\n';

if (args['dry-run']) {
  console.log(`[dry run] would write ${result.verbs.length} verbs (mode ${result.mode}) to ${settingsPath}`);
  process.exit(0);
}

mkdirSync(dirname(settingsPath), { recursive: true });
if (raw) writeFileSync(`${settingsPath}.bak`, raw);
writeFileSync(settingsPath, out);

console.log(`Applied "${data.name || themeArg}" (${result.verbs.length} verbs, mode ${result.mode}) to ${settingsPath}`);
if (raw) console.log(`Backup written to ${settingsPath}.bak`);
console.log('Start a new turn or restart Claude Code to see the new spinner.');
