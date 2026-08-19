/**
 * Figma exports for frame 480:8550 "Speed up Icon+STRIP META POC"
 * (file 6LyB9UDTJOIJCJPtdoLUnX).
 *
 * Every asset here is an export of a node the designer authored in Figma —
 * nothing is redrawn or substituted.
 *
 * Assets resolve in two steps:
 *   1. If a matching `<name>.svg` has been vendored into this directory, that
 *      local file wins (Vite fingerprints it into the build).
 *   2. Otherwise we fall back to Figma's temporary MCP export URL. Those URLs
 *      expire roughly 7 days after they were generated, so vendoring the SVGs
 *      is required for a build that keeps working. See README.
 *
 * The eight `leafUnrotated` entries are exported with each node rooted at
 * ITSELF rather than at its parent. Rooting at the parent bakes the node's
 * resting rotation into the SVG, which would double up against the `rotate`
 * track we animate on the same node.
 */

const local = import.meta.glob<string>('./*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
})

import exports from './exports.json'

/** Figma MCP export ids, keyed by the name used in this codebase. */
const remote: Record<string, string> = exports

function resolve(name: string): string {
  const vendored = local[`./${name}.svg`]
  if (vendored) return vendored
  return `https://www.figma.com/api/mcp/asset/${remote[name]}.svg`
}

export const asset = Object.fromEntries(
  Object.keys(remote).map((name) => [name, resolve(name)]),
) as Record<keyof typeof remote, string>

/** True when every asset is served from a vendored file rather than Figma. */
export const assetsAreVendored = Object.keys(remote).every(
  (name) => `./${name}.svg` in local,
)

/**
 * The Slow Down Arrow as Figma renders it rather than as the file stores it:
 * the inner shadow recoloured cyan, and its offset negated so it survives the
 * strip's 180deg rotation and lands at the chevron's tip. Both derivations, and
 * why each is needed, are in `scripts/vendor-figma-assets.mjs`.
 */
export { default as sdArrowFillRuntime } from './sdArrowFill-runtime.svg?url'
