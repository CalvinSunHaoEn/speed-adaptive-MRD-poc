import { box, leaf } from '../figma';
import PaceSetterIcon from './PaceSetterIcon';
import PacingRun from './PacingRun';

import paceCurrent from '../assets/figma/pace-8-10.svg';
import paceNext from '../assets/figma/pace-7-30.svg';

/**
 * `Speed Indicator` (480:8558) — the pace pill.
 *
 * During the speed-up it narrows from 127px to 48px, slides right, scales to
 * 2× and its inset glow goes white → red; the old pace fades out while the new
 * one slides into the slot the old one used to occupy. All of that lives in
 * keyframes.css, keyed on this node's id.
 *
 * The pill clips its own content (`overflow: hidden`), which is why the second
 * pace readout can sit at x=112 inside a 127px-wide box.
 */
export default function SpeedIndicator() {
  return (
    <div
      style={{
        ...box(127, 0, 127, 48),
        borderRadius: 24,
        overflow: 'hidden',
        background: '#000000',
        boxShadow: 'inset 0px 0px 4px 0px #FFFFFF, inset 0px 0px 12px 0px rgba(255, 255, 255, 0.5)',
      }}
      data-node-id="480:8558"
    >
      <PacingRun />

      <div style={box(38, 14, 66, 20)} data-node-id="480:8627">
        <img style={leaf} src={paceCurrent} alt="8'10&quot; per km" />
      </div>
      <div style={box(112, 14, 67, 20)} data-node-id="480:8628">
        <img style={leaf} src={paceNext} alt="7'30&quot; per km" />
      </div>

      <PaceSetterIcon />
    </div>
  );
}
