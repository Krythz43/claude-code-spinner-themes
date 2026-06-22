#!/usr/bin/env node
// Lints every theme: verbs.json shape, verb rules, and README sync.
// Exits 1 on any error. Warnings do not fail the run. Used by CI and by the
// skill's create flow.
//
//   node scripts/validate.mjs            check all themes
//   node scripts/validate.mjs POKEMON    check one theme folder

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  listThemeFolders, readTheme, validateTheme, renderVerbsBlock,
  BEGIN_VERBS, END_VERBS,
} from './lib/themes.mjs';

const only = process.argv.slice(2).filter((a) => !a.startsWith('-'));
const folders = only.length ? only : listThemeFolders();

if (!folders.length) {
  console.error('No themes found in themes/.');
  process.exit(1);
}

let hadError = false;

for (const folder of folders) {
  let theme;
  try {
    theme = readTheme(folder);
  } catch (e) {
    console.error(`[${folder}] error: cannot read verbs.json (${e.message})`);
    hadError = true;
    continue;
  }

  const { errors, warnings } = validateTheme(theme.data, folder);

  const readmePath = join(theme.dir, 'README.md');
  if (!existsSync(readmePath)) {
    errors.push('README.md is missing (run scripts/build.mjs)');
  } else {
    const readme = readFileSync(readmePath, 'utf8');
    const block = renderVerbsBlock(theme.data.verbs);
    if (!readme.includes(BEGIN_VERBS) || !readme.includes(END_VERBS)) {
      errors.push('README.md is missing the generated verbs markers (run scripts/build.mjs)');
    } else if (!readme.includes(block)) {
      errors.push('README.md verbs are out of sync with verbs.json (run scripts/build.mjs)');
    }
  }

  for (const w of warnings) console.warn(`[${folder}] warning: ${w}`);
  for (const e of errors) console.error(`[${folder}] error: ${e}`);
  if (errors.length) hadError = true;
  else console.log(`[${folder}] ok (${theme.data.verbs.length} verbs)`);
}

process.exit(hadError ? 1 : 0);
