/**
 * Generates src/styles/keyframes.css from the Figma timeline data in
 * tracks.mjs. Run with `npm run gen:keyframes` (the build does it for you).
 *
 * Why generate instead of hand-writing CSS: the timeline has 28 animated
 * nodes and ~700 keyframes, several of them with per-segment easing curves.
 * Transcribing that by hand would be unverifiable; here the source of truth
 * stays the raw Figma data and the CSS is a pure function of it.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { DURATION_MS, tracks } from './tracks.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '../../src/styles/keyframes.css');

/** Props that all fold into a single `transform` declaration. */
const TRANSFORM_PROPS = ['x', 'y', 'rotate', 'scaleX', 'scaleY'];
/** Props that get their own @keyframes and can safely stack. */
const CSS_PROP_NAME = {
  opacity: 'opacity',
  width: 'width',
  boxShadow: 'box-shadow',
  filter: 'filter',
};

// ---------------------------------------------------------------------------
// cubic-bezier evaluation (same parametrization as CSS cubic-bezier())
// ---------------------------------------------------------------------------

const bezierComponent = (t, a, b) => {
  const c = 3 * a;
  const d = 3 * (b - a) - c;
  const e = 1 - c - d;
  return ((e * t + d) * t + c) * t;
};

/** y at progress x for cubic-bezier(x1,y1,x2,y2); Newton + bisection fallback. */
function cubicBezier(x, [x1, y1, x2, y2]) {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  let t = x;
  for (let i = 0; i < 8; i += 1) {
    const cx = bezierComponent(t, x1, x2) - x;
    if (Math.abs(cx) < 1e-6) return bezierComponent(t, y1, y2);
    const slope =
      (3 * (1 - 3 * x2 + 3 * x1) * t + 2 * (3 * x2 - 6 * x1)) * t + 3 * x1;
    if (Math.abs(slope) < 1e-6) break;
    t -= cx / slope;
  }
  let lo = 0;
  let hi = 1;
  t = x;
  for (let i = 0; i < 40; i += 1) {
    const cx = bezierComponent(t, x1, x2);
    if (Math.abs(cx - x) < 1e-6) break;
    if (cx < x) lo = t;
    else hi = t;
    t = (lo + hi) / 2;
  }
  return bezierComponent(t, y1, y2);
}

const easeAt = (u, ease) => (ease === 'linear' ? u : cubicBezier(u, ease));

// ---------------------------------------------------------------------------
// track helpers
// ---------------------------------------------------------------------------

function normalize(id, name, track) {
  const { times, values, ease } = track;
  if (times.length !== values.length) {
    throw new Error(`${id}.${name}: ${times.length} times vs ${values.length} values`);
  }
  if (ease.length !== times.length - 1) {
    throw new Error(`${id}.${name}: ${ease.length} easings for ${times.length} keyframes`);
  }
  // Figma occasionally emits times past 1 (see the Arrow filter track).
  let prev = -Infinity;
  const clamped = times.map((t) => {
    const v = Math.min(Math.max(t, 0), 1);
    const monotonic = Math.max(v, prev);
    prev = monotonic;
    return monotonic;
  });
  return { ...track, times: clamped };
}

/** Value of a numeric track at normalized time t, honouring segment easing. */
function sampleNumeric(track, t) {
  const { times, values, ease } = track;
  if (t <= times[0]) return values[0];
  const last = times.length - 1;
  if (t >= times[last]) return values[last];
  let i = 0;
  while (i < last && times[i + 1] < t) i += 1;
  const span = times[i + 1] - times[i];
  const u = span <= 0 ? 1 : (t - times[i]) / span;
  const p = easeAt(u, ease[i]);
  return values[i] + (values[i + 1] - values[i]) * p;
}

const round = (n) => Number(n.toFixed(4));
const pct = (t) => `${round(t * 100)}%`;
const cssId = (id) => `fig-${id.replace(':', '-')}`;

const timingCss = (ease) =>
  ease === 'linear' ? 'linear' : `cubic-bezier(${ease.join(', ')})`;

/** Build one `transform: ...` value from the props present on a node. */
function transformValue(props, sample) {
  const parts = [];
  if (props.x || props.y) {
    const dx = props.x ? sample('x') - props.x.values[0] : 0;
    const dy = props.y ? sample('y') - props.y.values[0] : 0;
    parts.push(`translate3d(${round(dx)}px, ${round(dy)}px, 0)`);
  }
  if (props.rotate) parts.push(`rotate(${round(sample('rotate'))}deg)`);
  if (props.scaleX || props.scaleY) {
    const sx = props.scaleX ? sample('scaleX') : 1;
    const sy = props.scaleY ? sample('scaleY') : 1;
    parts.push(`scale(${round(sx)}, ${round(sy)})`);
  }
  return parts.join(' ');
}

const sameTimes = (a, b) =>
  a.length === b.length && a.every((v, i) => v === b[i]);

/** Extra sample density used when transform props disagree on their times. */
const RESAMPLE_STEP = 0.005;

function transformKeyframes(id, props) {
  const present = TRANSFORM_PROPS.filter((p) => props[p]);
  const base = props[present[0]];
  const aligned = present.every((p) => sameTimes(props[p].times, base.times));

  if (aligned) {
    // Exact: one keyframe per Figma keyframe, with its own easing.
    return base.times.map((t, i) => ({
      time: t,
      value: transformValue(props, (p) => props[p].values[i]),
      ease: i < base.times.length - 1 ? base.ease[i] : null,
    }));
  }

  // Mixed time grids (only the Speed Indicator pill): resample densely and
  // let CSS interpolate linearly between samples.
  const grid = new Set([0, 1]);
  for (const p of present) for (const t of props[p].times) grid.add(round(t));
  for (let t = 0; t <= 1; t = round(t + RESAMPLE_STEP)) grid.add(t);
  return [...grid]
    .sort((a, b) => a - b)
    .map((t) => ({
      time: t,
      value: transformValue(props, (p) => sampleNumeric(props[p], t)),
      ease: 'linear',
    }));
}

function renderKeyframes(name, property, frames) {
  const body = frames
    .map(({ time, value, ease }) => {
      const timing = ease ? `\n    animation-timing-function: ${timingCss(ease)};` : '';
      return `  ${pct(time)} {\n    ${property}: ${value};${timing}\n  }`;
    })
    .join('\n');
  return `@keyframes ${name} {\n${body}\n}`;
}

// ---------------------------------------------------------------------------
// emit
// ---------------------------------------------------------------------------

const blocks = [];
const rules = [];

for (const track of tracks) {
  const { id, origin } = track;
  const props = {};
  for (const [name, value] of Object.entries(track.props)) {
    props[name] = normalize(id, name, value);
  }

  const names = [];

  if (TRANSFORM_PROPS.some((p) => props[p])) {
    const name = `${cssId(id)}-transform`;
    blocks.push(renderKeyframes(name, 'transform', transformKeyframes(id, props)));
    names.push(name);
  }

  for (const [prop, cssProp] of Object.entries(CSS_PROP_NAME)) {
    const track2 = props[prop];
    if (!track2) continue;
    const unit = track2.unit ?? '';
    const name = `${cssId(id)}-${cssProp}`;
    const frames = track2.times.map((t, i) => ({
      time: t,
      value: `${track2.values[i]}${unit}`,
      ease: i < track2.times.length - 1 ? track2.ease[i] : null,
    }));
    blocks.push(renderKeyframes(name, cssProp, frames));
    names.push(name);
  }

  const decls = [
    origin ? `  transform-origin: ${origin};` : null,
    `  animation-name: ${names.join(', ')};`,
    `  animation-duration: ${names.map(() => `${DURATION_MS}ms`).join(', ')};`,
    `  animation-timing-function: ${names.map(() => 'linear').join(', ')};`,
    `  animation-fill-mode: ${names.map(() => 'both').join(', ')};`,
    `  animation-iteration-count: ${names.map(() => '1').join(', ')};`,
    `  animation-play-state: ${names.map(() => 'var(--fig-play-state, paused)').join(', ')};`,
  ].filter(Boolean);

  rules.push(`[data-node-id="${id}"] {\n${decls.join('\n')}\n}`);
}

const header = `/*
 * GENERATED FILE — do not edit.
 * Source: tools/motion/tracks.mjs (Figma timeline of frame 480:8550)
 * Regenerate with: npm run gen:keyframes
 *
 * Every animation runs once and holds its final frame (fill-mode: both,
 * iteration-count: 1). Playback is gated by --fig-play-state, which the app
 * flips from "paused" to "running" on the first tap; replaying remounts the
 * subtree so the animations restart from 0%.
 */
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, `${header}\n${rules.join('\n\n')}\n\n${blocks.join('\n\n')}\n`);

const keyframeCount = tracks.reduce(
  (sum, t) => sum + Object.values(t.props).reduce((s, p) => s + p.times.length, 0),
  0,
);
console.log(
  `keyframes.css: ${tracks.length} animated nodes, ${blocks.length} @keyframes blocks, ${keyframeCount} source keyframes`,
);
