import type { CSSProperties } from 'react';

/**
 * Every number in this prototype comes straight out of the Figma document
 * (frame 480:8550, file 6LyB9UDTJOIJCJPtdoLUnX) via the MCP `get_metadata`
 * tool, which reports each node's box relative to its parent. `box()` is the
 * single place that turns one of those boxes into CSS.
 *
 * Rotations are NOT baked in here: nodes that the timeline rotates keep their
 * unrotated Figma box and get their `transform` from src/styles/keyframes.css,
 * which is generated from the timeline data.
 */
export const box = (x: number, y: number, w: number, h: number): CSSProperties => ({
  position: 'absolute',
  left: `${x}px`,
  top: `${y}px`,
  width: `${w}px`,
  height: `${h}px`,
});

/**
 * A vector leaf: the exported SVG stretched over its Figma box exactly.
 * Both dimensions are pinned so the asset can never fall back to its own
 * intrinsic size.
 */
export const leaf: CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  display: 'block',
  maxWidth: 'none',
};
