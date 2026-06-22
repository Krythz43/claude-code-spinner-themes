#!/usr/bin/env node
// Regenerates the "## Verbs" block in each theme README from its verbs.json,
// and the theme table in themes/README.md. Run with --check in CI to fail when
// anything is out of sync (it writes nothing in that mode).
//
//   node scripts/build.mjs          regenerate in place
//   node scripts/build.mjs --check  exit 1 if a file would change

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  THEMES_DIR, listThemeFolders, readTheme, renderVerbsBlock, replaceBlock,
  BEGIN_VERBS, END_VERBS, BEGIN_INDEX, END_INDEX,
} from './lib/themes.mjs';

const check = process.argv.includes('--check');
const changed = [];

function ensureWrite(file, next) {
  const prev = existsSync(file) ? readFileSync(file, 'utf8') : '';
  if (prev === next) return;
  changed.push(file);
  if (!check) writeFileSync(file, next);
}

const folders = listThemeFolders();
const rows = [];

for (const folder of folders) {
  const { dir, data } = readTheme(folder);
  const block = renderVerbsBlock(data.verbs);
  const readmePath = join(dir, 'README.md');

  let readme = existsSync(readmePath)
    ? readFileSync(readmePath, 'utf8')
    : `# ${data.name}\n\n${data.description}\n\n## Verbs\n\n${block}\n`;

  const replaced = replaceBlock(readme, BEGIN_VERBS, END_VERBS, block);
  readme = replaced === null ? `${readme.trimEnd()}\n\n## Verbs\n\n${block}\n` : replaced;
  ensureWrite(readmePath, readme);

  const maint = (data.maintainers || [])
    .map((m) => `[@${m.github}](https://github.com/${m.github})`)
    .join(', ');
  rows.push(`| [${data.name}](${folder}/) | ${data.verbs.length} | ${maint} | ${data.description} |`);
}

const table = ['| Theme | Verbs | Maintainers | What it is |', '| --- | --- | --- | --- |', ...rows].join('\n');
const indexBlock = `${BEGIN_INDEX}\n\n${table}\n\n${END_INDEX}`;
const indexPath = join(THEMES_DIR, 'README.md');

let index = existsSync(indexPath)
  ? readFileSync(indexPath, 'utf8')
  : `# Spinner themes\n\nEvery folder here is one theme. \`verbs.json\` is the source of truth; each\nREADME mirrors its verbs at the bottom.\n\n${indexBlock}\n`;
const replacedIndex = replaceBlock(index, BEGIN_INDEX, END_INDEX, indexBlock);
index = replacedIndex === null ? `${index.trimEnd()}\n\n${indexBlock}\n` : replacedIndex;
ensureWrite(indexPath, index);

if (check && changed.length) {
  console.error('Out of sync. Run `node scripts/build.mjs` and commit:');
  for (const f of changed) console.error(`  ${f}`);
  process.exit(1);
}
console.log(check ? 'In sync.' : `Built ${folders.length} theme(s).`);
