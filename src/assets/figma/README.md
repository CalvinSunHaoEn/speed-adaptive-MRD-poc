# Figma vector assets

Every file here belongs to a node in Figma frame `480:8550`
("Speed up Icon+STRIP META POC", file `6LyB9UDTJOIJCJPtdoLUnX`).
`../../../tools/assets/manifest.json` is the node-id ↔ filename map, and it also
records each node's box in Figma so an asset can never be swapped in at the
wrong size.

## Status: these are placeholders

The export URLs in `tools/assets/manifest.json` were re-issued from Figma on
**2026-08-19** and are good for about seven days, but they still could not be
downloaded here: the egress policy on this build environment answers `403` to
`CONNECT www.figma.com:443`, which is the host every Figma MCP asset URL lives
on. Each file in this directory is therefore still a
`tools/assets/make-placeholders.mjs` stand-in at the node's exact Figma
dimensions, carrying a `data-placeholder="true"` marker.

Layout, timing and the animation rig are correct; the artwork is not.

## Replacing them with the real exports

The manifest already carries a fresh `"url"` on all 24 entries, so from a
machine that can reach `www.figma.com`:

```bash
npm run fetch:assets
```

If those URLs have since expired, re-issue them first — the MCP
`get_design_context` response for `480:8550` lists the 22 vector URLs, and
`download_assets` with `defaultFormat: "svg"` re-issues the two pace-text nodes
(`480:8627`, `480:8628`) — then paste each one into the matching entry's `"url"`
field and re-run the command.

The fetch script only touches entries that have a `url`, and
`make-placeholders.mjs` never overwrites a file that lacks the placeholder
marker — so a partially-real set is safe to keep working with.

Dropping the SVGs in by hand works too: same filenames, same directory.
