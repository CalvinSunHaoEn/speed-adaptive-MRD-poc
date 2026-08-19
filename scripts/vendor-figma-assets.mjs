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

if (failed) {
  console.error(`\n${failed} asset(s) failed. See the note above about expired ids.`)
  process.exit(1)
}
console.log(`\nVendored ${Object.keys(exports).length} assets into src/assets/figma/.`)
