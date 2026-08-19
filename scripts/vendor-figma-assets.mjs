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
import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
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

// The Slow Down Arrow's export bakes its inner shadow red — the frame's stored
// state, inherited from the Speed Up frame it was duplicated from. Its motion
// track drives that shadow to #00F6FF, and cyan is what Figma renders once the
// timeline runs: sampled off a frame export, the strip plateaus at R=0 G=21
// B=23. So a cyan variant is derived here, leaving the original export
// untouched and the derivation repeatable.
const SHADOW_RED = /<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"\/>/
// #00F6FF: G = 246/255, B = 1.
const SHADOW_CYAN =
  '<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.964706 0 0 0 0 1 0 0 0 1 0"/>'
const sdArrow = join(dir, 'sdArrowFill.svg')
if (existsSync(sdArrow)) {
  const src = await readFile(sdArrow, 'utf8')
  if (!SHADOW_RED.test(src)) {
    console.error('\n✗ sdArrowFill.svg no longer bakes its inner shadow as red.')
    console.error('  The cyan variant is what makes Slow Down read cyan — check the')
    console.error('  export (the designer may have fixed it upstream) before regenerating.')
    process.exit(1)
  }
  await writeFile(join(dir, 'sdArrowFill-cyan.svg'), src.replace(SHADOW_RED, SHADOW_CYAN))
  console.log('✓ sdArrowFill-cyan.svg (inner shadow recoloured to match the motion track)')
}

if (failed) {
  console.error(`\n${failed} asset(s) failed. See the note above about expired ids.`)
  process.exit(1)
}
console.log(`\nVendored ${Object.keys(exports).length} assets into src/assets/figma/.`)
