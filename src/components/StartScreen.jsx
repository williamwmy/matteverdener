import SoundToggle from './SoundToggle.jsx';
import InstallPrompt from './InstallPrompt.jsx';
import { sfx } from '../sound.js';
import s from './StartScreen.module.css';

// Dekorative tegn som svever rolig i bakgrunnen.
const FLOATIES = [
  { c: '➕', x: '10%', y: '18%', d: '0s', size: '2.6rem' },
  { c: '✖️', x: '82%', y: '14%', d: '1.2s', size: '2.1rem' },
  { c: '➖', x: '16%', y: '74%', d: '2.1s', size: '2.4rem' },
  { c: '➗', x: '86%', y: '70%', d: '0.6s', size: '2.2rem' },
  { c: '⭐', x: '72%', y: '40%', d: '1.7s', size: '1.8rem' },
  { c: '🔢', x: '24%', y: '42%', d: '2.6s', size: '2rem' },
  { c: '✨', x: '50%', y: '12%', d: '0.9s', size: '1.6rem' },
];

/**
 * Startskjerm med logo, versjonsnummer og inngangsknapp.
 * @param {{ version: string, onStart: function(): void }} props
 */
export default function StartScreen({ version, onStart }) {
  return (
    <main className={`screen ${s.start}`}>
      <div className={s.topBar}>
        <SoundToggle />
      </div>
      <div className={s.floaties} aria-hidden="true">
        {FLOATIES.map((f, i) => (
          <span
            key={i}
            className={s.floatie}
            style={{ left: f.x, top: f.y, fontSize: f.size, animationDelay: f.d }}
          >
            {f.c}
          </span>
        ))}
      </div>
      <div className={s.hero}>
        <div className={s.gem} aria-hidden="true">
          💎
        </div>
        <h1 className={s.title}>MatteVerdener</h1>
        <p className={s.tagline}>Løs oppgaver, tjen diamanter og pynt rommet ditt!</p>
      </div>
      <button
        className="btn-primary"
        onClick={() => {
          sfx.tap();
          onStart();
        }}
      >
        Velg spiller
      </button>
      <p className={s.version}>v{version}</p>
      <InstallPrompt />
    </main>
  );
}
