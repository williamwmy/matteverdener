import s from './ArrayDisplay.module.css';

/**
 * Rad-og-kolonne-array for multiplikasjon (f.eks. 3 rader med 4 fisk).
 * Konsumerer { type: 'array', rows, cols, emoji } fra oppgavedata.
 * @param {{ rows: number, cols: number, emoji: string }} props
 */
export default function ArrayDisplay({ rows, cols, emoji }) {
  return (
    <div
      className={s.grid}
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      role="img"
      aria-label={`${rows} rader med ${cols} ${emoji}`}
    >
      {Array.from({ length: rows * cols }, (_, i) => (
        <span key={i} className={s.cell}>
          {emoji}
        </span>
      ))}
    </div>
  );
}
