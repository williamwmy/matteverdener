import s from './MyntDisplay.module.css';

/**
 * Viser tiere og enere som mynter — 10-mynter for tiere og 1-mynter for enere
 * — for å konkretisere posisjonssystemet. Konsumerer { type: 'mynter', tens,
 * ones } fra oppgavedata.
 * @param {{ tens: number, ones: number }} props
 */
export default function MyntDisplay({ tens, ones }) {
  return (
    <div className={s.scene} role="img" aria-label={`${tens} tiere og ${ones} enere`}>
      <div className={s.group}>
        <span className={s.caption}>Tiere</span>
        <div className={s.coins}>
          {Array.from({ length: tens }, (_, i) => (
            <span key={i} className={`${s.coin} ${s.ten}`}>
              10
            </span>
          ))}
        </div>
      </div>
      <div className={s.group}>
        <span className={s.caption}>Enere</span>
        <div className={s.coins}>
          {Array.from({ length: ones }, (_, i) => (
            <span key={i} className={`${s.coin} ${s.one}`}>
              1
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
