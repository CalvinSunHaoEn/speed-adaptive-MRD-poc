import { box, leaf } from '../figma';

import arrowMask from '../assets/figma/arrow-mask.svg';
import arrowFill from '../assets/figma/arrow-fill.svg';
import ellipseMask from '../assets/figma/ellipse-mask.svg';
import ellipseFill from '../assets/figma/ellipse-fill.svg';

/**
 * `Speed up STRIP` (480:8630) — the chevron at the bottom of the display.
 *
 * Two masked layers, both clipped to the chevron outline:
 *  - 480:8633 `Arrow`, which rises 23px into place, blurs, and takes on an
 *    inset red glow;
 *  - 480:8635 `Ellipse`, a soft blob that sweeps upward through the chevron
 *    five times over the course of the timeline.
 */
export default function SpeedUpStrip() {
  return (
    <div style={box(70, 350, 240, 150)} data-node-id="480:8630">
      <div style={box(0, 0, 240, 150)} data-node-id="480:8631">
        <div
          style={{
            ...box(0, 0, 240, 150),
            maskImage: `url("${arrowMask}")`,
            maskSize: '240px 150px',
            maskRepeat: 'no-repeat',
            maskMode: 'alpha',
            WebkitMaskImage: `url("${arrowMask}")`,
            WebkitMaskSize: '240px 150px',
            WebkitMaskRepeat: 'no-repeat',
          }}
          data-node-id="480:8633"
        >
          <div style={box(-4.008, -1.005, 248.016, 140.895)}>
            <img style={leaf} src={arrowFill} alt="" />
          </div>
        </div>

        <div
          style={{
            ...box(0, 0, 240, 150),
            maskImage: `url("${ellipseMask}")`,
            maskPosition: '-4px -0.999px',
            maskSize: '248px 140.896px',
            maskRepeat: 'no-repeat',
            maskMode: 'alpha',
            WebkitMaskImage: `url("${ellipseMask}")`,
            WebkitMaskPosition: '-4px -0.999px',
            WebkitMaskSize: '248px 140.896px',
            WebkitMaskRepeat: 'no-repeat',
          }}
        >
          {/* Figma centres this node horizontally; the -50% lives on a wrapper
              so the timeline keeps sole ownership of the node's transform. */}
          <div
            style={{
              position: 'absolute',
              left: 'calc(50% - 0.3px)',
              top: '40.77px',
              width: '159.403px',
              height: '162.475px',
              transform: 'translateX(-50%)',
            }}
          >
            <div style={{ position: 'absolute', inset: 0 }} data-node-id="480:8635">
              <img style={leaf} src={ellipseFill} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
