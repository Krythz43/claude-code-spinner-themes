#!/usr/bin/env node
// spinnerverbs4cc: install only. Copies the spinner-customizer skill and the
// themes collection into the user's Claude Code skills folder. Everything else
// (browse, apply, create, contribute) happens through the skill inside Claude.

import { cpSync, existsSync, rmSync, mkdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

const here = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(here, '..');
const SKILL_NAME = 'spinner-customizer';
const args = process.argv.slice(2);
const has = (...flags) => flags.some((f) => args.includes(f));

if (has('--version', '-v')) {
  const pkg = JSON.parse(readFileSync(join(pkgRoot, 'package.json'), 'utf8'));
  console.log(pkg.version);
  process.exit(0);
}

if (has('--help', '-h')) {
  console.log(`spinnerverbs4cc: install the Claude Code spinner themes skill

Usage:
  npx spinnerverbs4cc [install] [--update] [--dir <skills-dir>]

  install         copy the skill and themes into your Claude Code skills folder (default action)
  --update        overwrite an existing install
  --dir <path>    target skills directory (default: ~/.claude/skills)
  --version, -v   print the version
  --help, -h      show this help

After installing, open Claude Code and say "change my spinner theme".
The themes also install through the plugin marketplace; see the project README.`);
  process.exit(0);
}

const dirIdx = args.indexOf('--dir');
const skillsDir = dirIdx !== -1 && args[dirIdx + 1] ? args[dirIdx + 1] : join(homedir(), '.claude', 'skills');
const target = join(skillsDir, SKILL_NAME);
const update = has('--update');

const SKILL_ITEMS = ['SKILL.md', 'references', 'scripts', 'themes'];
if (!existsSync(join(pkgRoot, 'SKILL.md'))) {
  console.error(`Cannot find SKILL.md at ${pkgRoot}. Is the package intact?`);
  process.exit(1);
}

if (existsSync(target) && !update) {
  console.error(`${target} already exists. Re-run with --update to overwrite it.`);
  process.exit(1);
}
if (existsSync(target)) rmSync(target, { recursive: true, force: true });

mkdirSync(target, { recursive: true });
for (const item of SKILL_ITEMS) {
  const src = join(pkgRoot, item);
  if (existsSync(src)) cpSync(src, join(target, item), { recursive: true });
}

console.log(`Installed ${SKILL_NAME} to ${target}`);
console.log('Open Claude Code and say "change my spinner theme" to use it.');
