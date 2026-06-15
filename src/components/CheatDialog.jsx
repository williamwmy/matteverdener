import { useEffect, useRef, useState } from 'react';
import s from './CheatDialog.module.css';

/**
 * Skjult «juksekode»-dialog (åpnes med Konami-koden på verdenskartet). Spilleren
 * kan legge til diamanter og/eller låse opp alle verdenene.
 * @param {{
 *   onGrant: function(number): void,
 *   onUnlockWorlds: function(): void,
 *   allUnlocked: boolean,
 *   onClose: function(): void,
 * }} props
 */
export default function CheatDialog({ onGrant, onUnlockWorlds, allUnlocked, onClose }) {
  const [value, setValue] = useState('100');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const amount = Math.floor(Number(value));
  const valid = Number.isFinite(amount) && amount > 0;

  function submit(e) {
    e.preventDefault();
    if (!valid) return;
    onGrant(amount);
  }

  return (
    <div className={s.overlay} role="dialog" aria-modal="true" aria-label="Hemmelig diamantkode" onClick={onClose}>
      <form className={s.dialog} onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <p className={s.title}>🎉 Hemmelig kode!</p>
        <p className={s.sub}>Hvor mange diamanter vil du ha?</p>
        <div className={s.inputRow}>
          <span className={s.gem} aria-hidden="true">💎</span>
          <input
            ref={inputRef}
            className={s.input}
            type="number"
            inputMode="numeric"
            min="1"
            max="1000000"
            value={value}
            aria-label="Antall diamanter"
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <div className={s.buttons}>
          <button type="button" className={s.cancelBtn} onClick={onClose}>
            Avbryt
          </button>
          <button type="submit" className={s.grantBtn} disabled={!valid}>
            Få diamanter
          </button>
        </div>

        <div className={s.divider} aria-hidden="true" />

        <button
          type="button"
          className={s.unlockBtn}
          onClick={onUnlockWorlds}
          disabled={allUnlocked}
        >
          {allUnlocked ? '✓ Alle verdener er åpne' : '🔓 Lås opp alle verdener'}
        </button>
      </form>
    </div>
  );
}
