import { box, leaf } from '../figma';

import iconA from '../assets/figma/icon-pace-setter-a.svg';
import iconB from '../assets/figma/icon-pace-setter-b.svg';

/**
 * `ic_exercise_pace_setter` (480:8629) — the resting glyph in the pill.
 * It cross-fades with the running figure: this one is visible while the pace
 * is steady, the runner takes over during the speed-up.
 */
export default function PaceSetterIcon() {
  return (
    <div style={box(12, 12, 24, 24)} data-node-id="480:8629">
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div style={box(5.9232, 3.7392, 14.4, 17.1432)}>
          <img style={leaf} src={iconA} alt="" />
        </div>
        <div style={box(1.5576, 3.7392, 14.4024, 17.1432)}>
          <img style={leaf} src={iconB} alt="" />
        </div>
      </div>
    </div>
  );
}
