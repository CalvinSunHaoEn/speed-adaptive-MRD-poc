import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

import Stage from './components/Stage';

/** Two taps closer together than this are treated as one gesture. */
const TAP_DEBOUNCE_MS = 120;

/**
 * Playback model, per the prototype's brief:
 *
 *  - idle      → the timeline sits paused at frame 0, so the layout is on
 *                screen but nothing moves;
 *  - first tap → it plays once and holds its last frame
 *                (animation-fill-mode: both, iteration-count: 1);
 *  - next tap  → it restarts from frame 0.
 *
 * The restart works by remounting <Stage> under a new key: fresh elements get
 * fresh animations, which is the only way to reliably rewind a CSS animation
 * across engines. `--fig-play-state` is what keyframes.css reads to decide
 * whether those animations are running or parked at 0%.
 */
export default function App() {
  const [run, setRun] = useState(0);
  const lastTapRef = useRef(0);

  const play = useCallback(() => {
    const now = performance.now();
    if (now - lastTapRef.current < TAP_DEBOUNCE_MS) return;
    lastTapRef.current = now;
    setRun((n) => n + 1);
  }, []);

  // The Neural Band's tap surfaces as a pointer event in the glasses' browser.
  // Enter/Space are bound as well so the same build is drivable from a
  // keyboard or a paired remote without changing anything.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
        event.preventDefault();
        play();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [play]);

  return (
    <div
      className="viewport"
      style={{ '--fig-play-state': run > 0 ? 'running' : 'paused' } as CSSProperties}
      onPointerDown={play}
      role="button"
      tabIndex={0}
      aria-label="Tap to play the speed-up animation"
    >
      <Stage key={run} />
    </div>
  );
}
