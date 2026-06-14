import s from './BrokDisplay.module.css';

/**
 * Visualiserer en brøk som søyle eller sirkel der `numerator` av
 * `denominator` deler er fylt. Konsumerer { type: 'brok', numerator,
 * denominator, shape } fra oppgavedata.
 * @param {{ numerator: number, denominator: number, shape?: 'bar'|'sirkel' }} props
 */
export default function BrokDisplay({ numerator, denominator, shape = 'bar' }) {
  const label = `${numerator} av ${denominator} deler`;
  if (shape === 'sirkel') {
    const slice = 360 / denominator;
    const stops = [];
    for (let i = 0; i < denominator; i++) {
      const color = i < numerator ? 'var(--color-accent)' : 'var(--color-surface-alt)';
      stops.push(`${color} ${i * slice}deg ${(i + 1) * slice}deg`);
    }
    return (
      <div
        className={s.circle}
        style={{ background: `conic-gradient(${stops.join(', ')})` }}
        role="img"
        aria-label={label}
      />
    );
  }
  return (
    <div className={s.bar} role="img" aria-label={label}>
      {Array.from({ length: denominator }, (_, i) => (
        <span key={i} className={i < numerator ? `${s.part} ${s.filled}` : s.part} />
      ))}
    </div>
  );
}
