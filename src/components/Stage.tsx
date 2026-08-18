import SpeedIndicator from './SpeedIndicator';
import SpeedUpStrip from './SpeedUpStrip';

/**
 * `Speed up Icon+STRIP META POC` (480:8550) — the 600×600 frame itself, which
 * is exactly the Meta Ray-Ban Display's addressable area.
 *
 * Everything sits inside 480:8553, a 380×500 layer set to `screen` blending:
 * on the glasses, black reads as transparent, so keeping the blend mode keeps
 * the prototype honest about what will actually be lit up.
 *
 * Remounting this component is what replays the timeline — see App.tsx.
 */
export default function Stage() {
  return (
    <div className="figma-frame" data-node-id="480:8550">
      <div className="blend-layer" data-node-id="480:8553">
        <SpeedIndicator />
        <SpeedUpStrip />
      </div>
    </div>
  );
}
