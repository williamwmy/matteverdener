import { useEffect, useRef } from 'react';

// Konami-koden: opp opp ned ned venstre høyre venstre høyre b a.
const SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

/**
 * Lytter på tastetrykk og kaller `onUnlock` når Konami-koden tastes inn.
 * Sammenligner mot fremgangen så langt; feil tast nullstiller (men en ny
 * korrekt start telles med igjen).
 * @param {function(): void} onUnlock
 */
export function useKonamiCode(onUnlock) {
  const progress = useRef(0);
  const cb = useRef(onUnlock);
  cb.current = onUnlock;

  useEffect(() => {
    function onKeyDown(e) {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const expected = SEQUENCE[progress.current];
      if (key === expected) {
        progress.current += 1;
        if (progress.current === SEQUENCE.length) {
          progress.current = 0;
          cb.current();
        }
      } else {
        // Start på nytt — men hvis denne tasten er sekvensens første, tell den.
        progress.current = key === SEQUENCE[0] ? 1 : 0;
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
}
