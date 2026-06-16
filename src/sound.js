// Lydeffekter syntetisert med Web Audio API — ingen lydfiler, fungerer offline.
// Lyden er på/av via setSoundEnabled (styres fra ProfileContext og huskes i
// localStorage). Alt er pakket i try/catch slik at manglende lydstøtte aldri
// kan velte appen.

let ctx = null;
let enabled = true;

let unlocked = false;

function audioCtx() {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

// iOS/Safari (og strenge mobilnettlesere) starter AudioContext-en «suspended»
// og spiller ingen lyd før den er låst opp INNE i en ekte brukerhandling — og
// da må det faktisk startes en lydkilde, ikke bare kalles resume(). Vi gjør det
// én gang på første trykk/tast: resume + en stille 1-sample-buffer. Etterpå
// virker alle senere lyder (også de som ikke kommer rett fra et trykk).
function unlock() {
  if (unlocked) return;
  const c = audioCtx();
  if (!c) return;
  try {
    const src = c.createBufferSource();
    src.buffer = c.createBuffer(1, 1, 22050);
    src.connect(c.destination);
    src.start(0);
  } catch {
    /* ignorer */
  }
  if (c.state === 'running') unlocked = true;
}

if (typeof window !== 'undefined') {
  const events = ['pointerdown', 'touchend', 'keydown'];
  const onFirstGesture = () => {
    unlock();
    if (unlocked) events.forEach((e) => window.removeEventListener(e, onFirstGesture));
  };
  events.forEach((e) => window.addEventListener(e, onFirstGesture, { passive: true }));
}

/** Slår lyd av/på. Når av, lages ingen lyd og ingen AudioContext. */
export function setSoundEnabled(on) {
  enabled = on;
}

export function isSoundEnabled() {
  return enabled;
}

/**
 * Spiller én tone med en myk inn/ut-envelope.
 * @param {{ freq: number, type?: OscillatorType, dur?: number, when?: number, gain?: number, slideTo?: number }} opts
 */
function tone({ freq, type = 'sine', dur = 0.15, when = 0, gain = 0.18, slideTo }) {
  const c = audioCtx();
  if (!c) return;
  const t0 = c.currentTime + when;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.03);
}

function sequence(notes, gain) {
  if (!enabled) return;
  try {
    notes.forEach((n) => tone({ gain, ...n }));
  } catch {
    /* ignorer lydfeil */
  }
}

// Toner (Hz)
const C5 = 523.25;
const E5 = 659.25;
const G5 = 783.99;
const C6 = 1046.5;
const B5 = 987.77;
const E6 = 1318.51;

export const sfx = {
  /** Riktig svar — lys, stigende arpeggio. */
  correct() {
    sequence(
      [
        { freq: C5, type: 'triangle', dur: 0.12, when: 0 },
        { freq: E5, type: 'triangle', dur: 0.12, when: 0.09 },
        { freq: G5, type: 'triangle', dur: 0.16, when: 0.18 },
      ],
      0.16
    );
  },
  /** Feil svar — myk, fallende «aaw» (ikke skarp). */
  wrong() {
    sequence([{ freq: 320, type: 'sine', dur: 0.28, when: 0, slideTo: 150 }], 0.16);
  },
  /** Belønningsskjerm — liten fanfare. */
  reward() {
    sequence(
      [
        { freq: C5, type: 'triangle', dur: 0.14, when: 0 },
        { freq: E5, type: 'triangle', dur: 0.14, when: 0.12 },
        { freq: G5, type: 'triangle', dur: 0.14, when: 0.24 },
        { freq: C6, type: 'triangle', dur: 0.3, when: 0.36 },
      ],
      0.16
    );
  },
  /** Kjøp — lyst «mynt»-pling. */
  purchase() {
    sequence(
      [
        { freq: B5, type: 'square', dur: 0.08, when: 0 },
        { freq: E6, type: 'square', dur: 0.16, when: 0.07 },
      ],
      0.12
    );
  },
  /** Lett UI-klikk. */
  tap() {
    sequence([{ freq: 440, type: 'sine', dur: 0.07, when: 0, slideTo: 620 }], 0.1);
  },
};
