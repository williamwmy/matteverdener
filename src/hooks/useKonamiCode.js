import { useEffect, useRef } from 'react';

// Konami-koden: opp opp ned ned venstre høyre venstre høyre b a.
const KEY_SEQUENCE = [
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

// Samme kode med berøring: sveip i hver retning i stedet for piltastene, og to
// trykk i stedet for «b a». Slik kan koden tastes inn på mobil/nettbrett.
const TOUCH_SEQUENCE = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'tap', 'tap'];

const SWIPE_MIN = 30; // px netto bevegelse for å telle som et sveip
const TAP_MAX = 18; // px maks bevegelse for å telle som et trykk (mellomrommet ignoreres)

/**
 * Lytter på taster OG berøring og kaller `onUnlock` når Konami-koden tastes inn.
 * Tastatur: `↑↑↓↓←→←→ b a`. Berøring: sveip `↑↑↓↓←→←→` + to trykk.
 * Hver kilde har sin egen fremgang; feil tast/gest nullstiller (men en ny
 * korrekt start telles med igjen).
 * @param {function(): void} onUnlock
 */
export function useKonamiCode(onUnlock) {
  const cb = useRef(onUnlock);
  cb.current = onUnlock;

  useEffect(() => {
    // Felles sekvens-matcher: gir en funksjon som mates med ett token om gangen.
    function makeMatcher(sequence) {
      let progress = 0;
      return (token) => {
        if (token === sequence[progress]) {
          progress += 1;
          if (progress === sequence.length) {
            progress = 0;
            cb.current();
          }
        } else {
          // Start på nytt — men hvis dette tokenet er sekvensens første, tell det.
          progress = token === sequence[0] ? 1 : 0;
        }
      };
    }

    const feedKey = makeMatcher(KEY_SEQUENCE);
    const feedTouch = makeMatcher(TOUCH_SEQUENCE);

    function onKeyDown(e) {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      feedKey(key);
    }

    // Klassifiser hver enkelt-finger-gest som sveip (retning) eller trykk.
    let start = null;
    function onTouchStart(e) {
      if (e.touches.length !== 1) {
        start = null; // ignorer to-finger-gester (zoom o.l.)
        return;
      }
      start = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    function onTouchEnd(e) {
      if (!start) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
      start = null;
      const dist = Math.hypot(dx, dy);
      const reach = Math.max(Math.abs(dx), Math.abs(dy));
      let token;
      if (dist < TAP_MAX) token = 'tap';
      else if (reach < SWIPE_MIN) return; // for utydelig — verken klart trykk eller sveip
      else if (Math.abs(dx) > Math.abs(dy)) token = dx > 0 ? 'right' : 'left';
      else token = dy > 0 ? 'down' : 'up';
      feedTouch(token);
    }

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);
}
