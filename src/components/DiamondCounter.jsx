import s from './DiamondCounter.module.css';

/**
 * Viser en diamantbeholdning med gem-ikon.
 * @param {{ amount: number }} props
 */
export default function DiamondCounter({ amount }) {
  return (
    <span className={s.counter} aria-label={`${amount} diamanter`}>
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path d="M12 21 2 9l3.5-5h13L22 9z" fill="var(--color-diamond)" />
        <path d="M12 21 7.5 9h9z" fill="#b3e7fb" />
        <path d="M5.5 4 7.5 9H2zM18.5 4 22 9h-5.5z" fill="#56b9e2" />
      </svg>
      <span className={s.amount}>{amount}</span>
    </span>
  );
}
