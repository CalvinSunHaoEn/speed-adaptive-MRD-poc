#!/usr/bin/env node
/**
 * Download the Figma exports listed in src/assets/figma/exports.json into
 * src/assets/figma/ so the build no longer depends on Figma's temporary URLs.
 *
 * Those URLs expire roughly 7 days after the MCP session that produced them, so
 * run this soon after regenerating them. If a download 403s or 404s, the ids
 * have expired — re-run the Figma MCP `get_design_context` calls for frame
 * 480:8550 to mint fresh ones and update exports.json.
 *
 *   node scripts/vendor-figma-assets.mjs
 */
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// Node's built-in fetch ignores HTTPS_PROXY unless NODE_USE_ENV_PROXY is set at
// startup, which cannot be done from inside a running process. Behind a proxy,
// re-exec ourselves once with the flag so the script works there as well as on
// a machine with direct access.
if (process.env.HTTPS_PROXY && !process.env.NODE_USE_ENV_PROXY) {
  const { status } = spawnSync(process.execPath, [fileURLToPath(import.meta.url)], {
    stdio: 'inherit',
    env: { ...process.env, NODE_USE_ENV_PROXY: '1' },
  })
  process.exit(status ?? 1)
}

const here = dirname(fileURLToPath(import.meta.url))
const dir = join(here, '..', 'src', 'assets', 'figma')
const exports = JSON.parse(await readFile(join(dir, 'exports.json'), 'utf8'))

await mkdir(dir, { recursive: true })

let failed = 0
for (const [name, id] of Object.entries(exports)) {
  const url = `https://www.figma.com/api/mcp/asset/${id}.svg`
  const response = await fetch(url)
  if (!response.ok) {
    console.error(`✗ ${name}: HTTP ${response.status}`)
    failed += 1
    continue
  }
  await writeFile(join(dir, `${name}.svg`), Buffer.from(await response.arrayBuffer()))
  console.log(`✓ ${name}.svg`)
}

// Two corrections to the Slow Down Arrow's export, both giving the layer as Figma
// actually renders 499:9370 rather than as the file stores it.
//
// 1. Colour. The export bakes the inner shadow red, inherited from the Speed Up
//    frame this one was duplicated from. Slow Down is cyan throughout — the
//    designer's call, confirmed by the node's own motion track (#00F6FF) and by
//    Figma's video render, in which no pixel of the frame is red-dominant. The
//    red in the static canvas render is a preview bug.
// 2. Shadow offset. Figma applies a shadow's offset in canvas space; it does not
//    rotate with the layer. The strip is rotated 180deg, and the export bakes the
//    offset as dy=-23 in the node's own unrotated space, so carrying the SVG
//    through that rotation lands the lit edge along the top of the chevron
//    instead of down at its tip. Negating it cancels the rotation.
const SHADOW_RED = /<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"\/>/
// #00F6FF: G = 246/255, B = 1.
const SHADOW_CYAN =
  '<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.964706 0 0 0 0 1 0 0 0 1 0"/>'
const SHADOW_UP = /<feOffset dy="-23"\/>/
const sdArrow = join(dir, 'sdArrowFill.svg')
if (existsSync(sdArrow)) {
  const src = await readFile(sdArrow, 'utf8')
  for (const [pattern, what] of [
    [SHADOW_RED, 'bakes its inner shadow red'],
    [SHADOW_UP, 'offsets that shadow by dy=-23'],
  ]) {
    if (!pattern.test(src)) {
      console.error(`\n\u2717 sdArrowFill.svg no longer ${what}.`)
      console.error('  The derived variant is what makes Slow Down render correctly —')
      console.error('  re-check 499:9455 before regenerating.')
      process.exit(1)
    }
  }
  await writeFile(
    join(dir, 'sdArrowFill-runtime.svg'),
    src.replace(SHADOW_RED, SHADOW_CYAN).replace(SHADOW_UP, '<feOffset dy="23"/>'),
  )
  console.log('\u2713 sdArrowFill-runtime.svg (cyan, shadow offset negated for the 180deg strip)')
}

if (failed) {
  console.error(`\n${failed} asset(s) failed. See the note above about expired ids.`)
  process.exit(1)
}
console.log(`\nVendored ${Object.keys(exports).length} assets into src/assets/figma/.`)
