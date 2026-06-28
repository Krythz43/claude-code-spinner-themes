// Shared helpers for the build and validate scripts.
// Node built-ins only, no dependencies.

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = join(here, '..', '..');
export const THEMES_DIR = join(REPO_ROOT, 'themes');

export const BEGIN_VERBS = '<!-- BEGIN GENERATED VERBS: do not edit by hand, run scripts/build.mjs -->';
export const END_VERBS = '<!-- END GENERATED VERBS -->';
export const BEGIN_INDEX = '<!-- BEGIN GENERATED INDEX: do not edit by hand, run scripts/build.mjs -->';
export const END_INDEX = '<!-- END GENERATED INDEX -->';

// Theme folders are real directories that do not start with "_" or ".".
// "_TEMPLATE" and dotfiles are skipped on purpose.
export function listThemeFolders(themesDir = THEMES_DIR) {
  return readdirSync(themesDir)
    .filter((name) => !name.startsWith('_') && !name.startsWith('.'))
    .filter((name) => statSync(join(themesDir, name)).isDirectory())
    .sort();
}

export function readTheme(folder, themesDir = THEMES_DIR) {
  const dir = join(themesDir, folder);
  const file = join(dir, 'verbs.json');
  const data = JSON.parse(readFileSync(file, 'utf8'));
  return { folder, dir, file, data };
}

export function stripTrailingEllipsis(s) {
  return String(s).replace(/\s*(\.\.\.|…)+\s*$/u, '').trimEnd();
}

export function dedupe(verbs) {
  const seen = new Set();
  const out = [];
  for (const v of verbs) {
    const key = v.trim().toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(v);
  }
  return out;
}

export function renderVerbsBlock(verbs) {
  const lines = verbs.map((v) => `- ${v}`);
  return [BEGIN_VERBS, '', ...lines, '', END_VERBS].join('\n');
}

export function replaceBlock(content, begin, end, replacement) {
  const re = new RegExp(`${escapeRe(begin)}[\\s\\S]*?${escapeRe(end)}`);
  return re.test(content) ? content.replace(re, replacement) : null;
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Returns { errors: string[], warnings: string[] } for one theme's verbs.json data.
export function validateTheme(data, folder) {
  const errors = [];
  const warnings = [];
  const must = (cond, msg) => { if (!cond) errors.push(msg); };

  must(typeof data.name === 'string' && data.name.trim().length > 0, 'name must be a non-empty string');
  must(typeof data.slug === 'string' && /^[a-z0-9-]+$/.test(data.slug || ''), 'slug must be lowercase letters, digits, or hyphens');
  must(typeof data.description === 'string' && data.description.trim().length > 0, 'description must be a non-empty string');
  must(Array.isArray(data.authors) && data.authors.length >= 1, 'authors must have at least one entry');
  if (Array.isArray(data.authors)) {
    data.authors.forEach((m, i) => {
      must(m && typeof m.name === 'string' && m.name.trim(), `authors[${i}].name is required`);
      must(m && typeof m.github === 'string' && /^[A-Za-z0-9-]+$/.test((m && m.github) || ''), `authors[${i}].github must be a GitHub handle without the @`);
    });
  }

  must(Array.isArray(data.verbs) && data.verbs.length >= 1, 'verbs must be a non-empty array');
  if (Array.isArray(data.verbs)) {
    const seen = new Map();
    data.verbs.forEach((v, i) => {
      if (typeof v !== 'string' || !v.trim()) { errors.push(`verbs[${i}] must be a non-empty string`); return; }
      if (/(\.\.\.|…)\s*$/u.test(v)) errors.push(`verbs[${i}] must not end with an ellipsis (Claude Code adds it): "${v}"`);
      if (/[\r\n\t]/.test(v)) errors.push(`verbs[${i}] must not contain line breaks or tabs: "${v}"`);
      if (v !== v.trim()) errors.push(`verbs[${i}] has leading or trailing whitespace: "${v}"`);
      const key = v.trim().toLowerCase();
      if (seen.has(key)) errors.push(`verbs[${i}] duplicates verbs[${seen.get(key)}]: "${v}"`);
      else seen.set(key, i);
      if (v.length > 60) warnings.push(`verbs[${i}] is ${v.length} chars and may truncate in narrow terminals: "${v}"`);
    });
    if (data.verbs.length < 5) warnings.push(`only ${data.verbs.length} verb(s); 20 to 50 reads best`);
    if (data.verbs.length > 100) warnings.push(`${data.verbs.length} verbs; consider trimming below 100`);
  }

  if (typeof data.slug === 'string' && data.slug && data.slug !== folder.toLowerCase().replace(/[^a-z0-9-]/g, '-')) {
    warnings.push(`slug "${data.slug}" does not match folder "${folder}" (folder lowercased would be "${folder.toLowerCase()}")`);
  }

  if (data.tags !== undefined && !(Array.isArray(data.tags) && data.tags.every((t) => typeof t === 'string'))) {
    errors.push('tags, if present, must be an array of strings');
  }

  return { errors, warnings };
}
