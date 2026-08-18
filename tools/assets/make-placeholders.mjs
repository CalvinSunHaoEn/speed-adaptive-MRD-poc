/**
 * Writes stand-in SVGs for any asset in manifest.json that has not been
 * fetched from Figma yet.
 *
 * These are NOT the design. They exist so the rig, the layout and the whole
 * 4.221s timeline can be run and reviewed before the real exports land; every
 * file carries a `data-placeholder` marker and `npm run fetch:assets`
 * overwrites it with the genuine Figma export.
 *
 * Sizes come from the Figma node boxes, so swapping in the real assets cannot
 * change any geometry.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(HERE, '../../src/assets/figma');
const manifest = JSON.parse(readFileSync(resolve(HERE, 'manifest.json'), 'utf8'));

const MARK = 'data-placeholder="true"';

const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" ${MARK}>${body}</svg>\n`;

/** the chevron outline used by both masks, drawn to fill its box */
const chevron = (w, h) => {
  const t = h * 0.42; // stroke thickness of the arrow band
  return `M ${w / 2} 0 L ${w} ${h - t} L ${w} ${h} L ${w / 2} ${t} L 0 ${h} L 0 ${h - t} Z`;
};

const builders = {
  limb: (w, h) => svg(w, h, `<rect width="${w}" height="${h}" rx="${Math.min(w, h) / 2}" fill="#FFFFFF"/>`),
  head: (w, h) => svg(w, h, `<circle cx="${w / 2}" cy="${h / 2}" r="${Math.min(w, h) / 2}" fill="#FFFFFF"/>`),
  glyph: (w, h) =>
    svg(w, h, `<rect x="${w * 0.1}" y="0" width="${w * 0.8}" height="${h}" rx="${w * 0.2}" fill="#FFFFFF"/>`),
  text: (w, h, asset) =>
    svg(
      w,
      h,
      `<text x="0" y="${h * 0.76}" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" ` +
        `font-size="15" font-weight="600" letter-spacing="0.7875" fill="#FFFFFF" ` +
        `textLength="${w}" lengthAdjust="spacingAndGlyphs">${asset.text ?? ''}</text>`,
    ),
  'chevron-mask': (w, h) => svg(w, h, `<path d="${chevron(w, h)}" fill="#FFFFFF"/>`),
  'chevron-fill': (w, h) =>
    svg(
      w,
      h,
      `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">` +
        `<stop offset="0" stop-color="#FF2A2A"/><stop offset="1" stop-color="#7A0000"/>` +
        `</linearGradient></defs><rect width="${w}" height="${h}" fill="url(#g)"/>`,
    ),
  glow: (w, h) =>
    svg(
      w,
      h,
      `<defs><radialGradient id="g"><stop offset="0" stop-color="#FF6B6B" stop-opacity="1"/>` +
        `<stop offset="1" stop-color="#FF0000" stop-opacity="0"/></radialGradient></defs>` +
        `<ellipse cx="${w / 2}" cy="${h / 2}" rx="${w / 2}" ry="${h / 2}" fill="url(#g)"/>`,
    ),
};

mkdirSync(OUT_DIR, { recursive: true });

let written = 0;
let kept = 0;
for (const asset of manifest.assets) {
  const path = resolve(OUT_DIR, asset.file);
  if (existsSync(path) && !readFileSync(path, 'utf8').includes(MARK)) {
    kept += 1; // a real Figma export is already in place
    continue;
  }
  const [w, h] = asset.size;
  const build = builders[asset.kind];
  if (!build) throw new Error(`${asset.file}: unknown kind "${asset.kind}"`);
  writeFileSync(path, build(w, h, asset));
  written += 1;
}

console.log(`placeholders: wrote ${written}, kept ${kept} real Figma export(s)`);
