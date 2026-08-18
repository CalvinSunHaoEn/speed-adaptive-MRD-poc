import { box, leaf } from '../figma';

import vector8564 from '../assets/figma/vector-8564.svg';
import vector8567 from '../assets/figma/vector-8567.svg';
import vector8573 from '../assets/figma/vector-8573.svg';
import vector8579 from '../assets/figma/vector-8579.svg';
import vector8581 from '../assets/figma/vector-8581.svg';
import vector8584 from '../assets/figma/vector-8584.svg';
import vector8590 from '../assets/figma/vector-8590.svg';
import frame8578 from '../assets/figma/frame-8578.svg';
import frame8568 from '../assets/figma/frame-8568.svg';
import frame8574 from '../assets/figma/frame-8574.svg';
import frame8585 from '../assets/figma/frame-8585.svg';
import frame8591 from '../assets/figma/frame-8591.svg';
import frame8601 from '../assets/figma/frame-8601.svg';
import frame8607 from '../assets/figma/frame-8607.svg';
import frame8618 from '../assets/figma/frame-8618.svg';
import frame8624 from '../assets/figma/frame-8624.svg';

/**
 * `pacing-run 2` (480:8559) — the running figure inside the pace pill.
 *
 * The rig is drawn twice: 480:8562… and its duplicate 480:8594…, whose limb
 * rotations run a few frames apart. That offset is what produces the trailing
 * "ghost" of the stride, so both copies have to be rendered.
 *
 * Every limb is an empty wrapper frame in Figma whose only job is to carry a
 * rotation with its own transform-origin; keyframes.css drives them by node id.
 */

type CopyIds = {
  /** torso group / its two rotating segments and their leaf assets */
  torso: string;
  thighFront: string;
  shinFront: string;
  footFront: string;
  footFrontAsset: string;
  armBack: string;
  forearmBack: string;
  handBack: string;
  forearmBackAsset: string;
  /** the statically rotated wedge (no timeline of its own) */
  wedge: string;
  head: string;
  thighBack: string;
  shinBack: string;
  footBack: string;
  footBackAsset: string;
  armFront: string;
  forearmFront: string;
  handFront: string;
  forearmFrontAsset: string;
};

const COPY_A: CopyIds = {
  torso: '480:8562',
  thighFront: '480:8563',
  shinFront: '480:8566',
  footFront: '480:8569',
  footFrontAsset: frame8568,
  armBack: '480:8571',
  forearmBack: '480:8572',
  handBack: '480:8575',
  forearmBackAsset: frame8574,
  wedge: '480:8577',
  head: '480:8579',
  thighBack: '480:8580',
  shinBack: '480:8583',
  footBack: '480:8586',
  footBackAsset: frame8585,
  armFront: '480:8588',
  forearmFront: '480:8589',
  handFront: '480:8592',
  forearmFrontAsset: frame8591,
};

const COPY_B: CopyIds = {
  torso: '480:8595',
  thighFront: '480:8596',
  shinFront: '480:8599',
  footFront: '480:8602',
  footFrontAsset: frame8601,
  armBack: '480:8604',
  forearmBack: '480:8605',
  handBack: '480:8608',
  forearmBackAsset: frame8607,
  wedge: '480:8610',
  head: '480:8612',
  thighBack: '480:8613',
  shinBack: '480:8616',
  footBack: '480:8619',
  footBackAsset: frame8618,
  armFront: '480:8621',
  forearmFront: '480:8622',
  handFront: '480:8625',
  forearmFrontAsset: frame8624,
};

/**
 * 480:8577 / 480:8610 carry a fixed -159° rotation in the design itself, so
 * Figma reports their axis-aligned bounding box (4.5417 × 7.1563). These are
 * the unrotated box and the offset that put its centre back on the AABB centre.
 */
const WEDGE_AABB = { x: 2.3575117588043213, y: 10.292738914489746, w: 4.541701085578097, h: 7.156301398467235 };
const WEDGE = { w: 2.2543, h: 6.8005, rotation: -159 };
const wedgeStyle = box(
  WEDGE_AABB.x + WEDGE_AABB.w / 2 - WEDGE.w / 2,
  WEDGE_AABB.y + WEDGE_AABB.h / 2 - WEDGE.h / 2,
  WEDGE.w,
  WEDGE.h,
);

function RunnerCopy({ ids }: { ids: CopyIds }) {
  return (
    <>
      <div style={box(0, 3.345454216003418, 3.563636302947998, 15.59999942779541)} data-node-id={ids.torso}>
        <div
          style={box(0, 4.363636493682861, 2.254545211791992, 11.236363410949707)}
          data-node-id={ids.thighFront}
        >
          <img style={leaf} src={vector8564} alt="" />
          <div style={box(0, 3.818181276321411, 2.254545211791992, 7.418184280395508)}>
            <div style={{ ...box(0, 0, 2.254545211791992, 7.418184280395508) }} data-node-id={ids.shinFront}>
              <img style={leaf} src={vector8567} alt="" />
              <div style={box(0.10909084975719452, 3.745455503463745, 2.036363124847412, 3.6727283000946045)}>
                <div
                  style={box(0, 0, 2.036363124847412, 3.6727283000946045)}
                  data-node-id={ids.footFront}
                >
                  <img style={leaf} src={ids.footFrontAsset} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={box(1.5272727012634277, 0, 2.036363124847412, 7.7090888023376465)} data-node-id={ids.armBack}>
          <div style={box(0, 0, 2.036363124847412, 7.7090888023376465)} data-node-id={ids.forearmBack}>
            <img style={leaf} src={vector8573} alt="" />
            <div style={box(0, 2.836362838745117, 2.036363124847412, 4.872725963592529)}>
              <div
                style={box(0, 0, 2.036363124847412, 4.872725963592529)}
                data-node-id={ids.handBack}
              >
                <img style={leaf} src={ids.forearmBackAsset} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{ ...wedgeStyle, transform: `rotate(${WEDGE.rotation}deg)` }}
        data-node-id={ids.wedge}
      >
        <img style={leaf} src={frame8578} alt="" />
      </div>

      <div style={box(1.85454523563385, 0, 4.145453929901123, 4.145453453063965)} data-node-id={ids.head}>
        <img style={leaf} src={vector8579} alt="" />
      </div>

      <div
        style={box(0.5818180441856384, 7.70908784866333, 2.2545459270477295, 11.236360549926758)}
        data-node-id={ids.thighBack}
      >
        <img style={leaf} src={vector8581} alt="" />
        <div style={box(0, 3.8181796073913574, 2.2545459270477295, 7.418180465698242)}>
          <div style={box(0, 0, 2.2545459270477295, 7.418180465698242)} data-node-id={ids.shinBack}>
            <img style={leaf} src={vector8584} alt="" />
            <div style={box(0.1090909093618393, 3.7454535961151123, 2.036363363265991, 3.6727263927459717)}>
              <div style={box(0, 0, 2.036363363265991, 3.6727263927459717)} data-node-id={ids.footBack}>
                <img style={leaf} src={ids.footBackAsset} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        style={box(2.10909104347229, 3.345454454421997, 2.036363363265991, 7.7090888023376465)}
        data-node-id={ids.armFront}
      >
        <div style={box(0, 0, 2.036363363265991, 7.7090888023376465)} data-node-id={ids.forearmFront}>
          <img style={leaf} src={vector8590} alt="" />
          <div style={box(0, 2.836362838745117, 2.036363363265991, 4.872725963592529)}>
            <div
              style={box(0, 0, 2.036363363265991, 4.872725963592529)}
              data-node-id={ids.handFront}
            >
              <img style={leaf} src={ids.forearmFrontAsset} alt="" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function PacingRun() {
  return (
    <div style={{ ...box(12, 15, 18, 18), overflow: 'hidden' }} data-node-id="480:8559">
      <div style={box(0.75, -6.972725868225098, 6, 18.945451736450195)}>
        <div style={box(0, 0, 6, 18.945451736450195)} data-node-id="480:8561">
          <RunnerCopy ids={COPY_A} />
          <div style={box(0, 0, 6, 18.945451736450195)} data-node-id="480:8594">
            <RunnerCopy ids={COPY_B} />
          </div>
        </div>
      </div>
    </div>
  );
}
