import { useEffect, useRef, useState } from 'react';
import s from './CheatDialog.module.css';

/**
 * Skjult «juksekode»-dialog (åpnes med Konami-koden på verdenskartet). Spilleren
 * kan legge til diamanter, låse opp alle verdenene, og se/justere det skjulte
 * adaptive nivået per verden.
 * @param {{
 *   onGrant: function(number): void,
 *   onUnlockWorlds: function(): void,
 *   allUnlocked: boolean,
 *   worldLevels: Array<{ id: number, name: string, emoji: string, level: number, unlocked: boolean }>,
 *   onSetWorldLevel: function(number, number): void,
 *   onUnlockWorld: function(number): void,
 *   onClose: function(): void,
 * }} props
 */
export default function CheatDialog({ onGrant, onUnlockWorlds, allUnlocked, worldLevels = [], onSetWorldLevel, onUnlockWorld, onClose }) {
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

        <div className={s.divider} aria-hidden="true" />

        <p className={s.levelsTitle}>Skjult nivå per verden</p>
        <ul className={s.levels}>
          {worldLevels.map((w) => (
            <li key={w.id} className={s.levelRow}>
              <button
                type="button"
                className={s.lockBtn}
                onClick={() => onUnlockWorld(w.id)}
                disabled={w.unlocked}
                aria-label={w.unlocked ? `${w.name} er åpen` : `Lås opp ${w.name}`}
                title={w.unlocked ? 'Åpen' : 'Lås opp'}
              >
                {w.unlocked ? '🔓' : '🔒'}
              </button>
              <span className={s.levelName}>
                <span aria-hidden="true">{w.emoji}</span> {w.name}
              </span>
              <span className={s.levelStepper}>
                <button
                  type="button"
                  className={s.levelBtn}
                  aria-label={`Senk nivå i ${w.name}`}
                  onClick={() => onSetWorldLevel(w.id, w.level - 1)}
                  disabled={w.level <= 1}
                >
                  −
                </button>
                <span className={s.levelValue}>{w.level}</span>
                <button
                  type="button"
                  className={s.levelBtn}
                  aria-label={`Øk nivå i ${w.name}`}
                  onClick={() => onSetWorldLevel(w.id, w.level + 1)}
                  disabled={w.level >= 10}
                >
                  +
                </button>
              </span>
            </li>
          ))}
        </ul>
      </form>
    </div>
  );
}
