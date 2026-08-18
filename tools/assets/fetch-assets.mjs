/**
 * Replaces the placeholder SVGs with the real Figma exports.
 *
 * Add a `url` to each entry in manifest.json first — those URLs come from the
 * Figma MCP tools (`get_design_context` lists them; `download_assets` re-issues
 * them per node) and expire roughly 7 days after they are issued.
 *
 *   npm run fetch:assets
 *
 * Anything without a `url` is left alone, so this is safe to re-run while only
 * some of the assets have been refreshed.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(HERE, '../../src/assets/figma');
const manifest = JSON.parse(readFileSync(resolve(HERE, 'manifest.json'), 'utf8'));

const pending = manifest.assets.filter((a) => a.url);
if (pending.length === 0) {
  console.error('No `url` fields in manifest.json — nothing to fetch.');
  process.exit(1);
}

let failed = 0;
for (const asset of pending) {
  try {
    const response = await fetch(asset.url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const body = Buffer.from(await response.arrayBuffer());
    if (body.length === 0) throw new Error('empty response');
    writeFileSync(resolve(OUT_DIR, asset.file), body);
    console.log(`✔ ${asset.file} (${body.length} bytes)`);
  } catch (error) {
    failed += 1;
    console.error(`✘ ${asset.file}: ${error.message}`);
  }
}

if (failed > 0) {
  console.error(`\n${failed} asset(s) failed. Expired URLs are the usual cause — re-issue them from Figma.`);
  process.exit(1);
}
