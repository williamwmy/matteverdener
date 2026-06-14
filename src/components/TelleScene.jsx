import s from './TelleScene.module.css';

/**
 * Et lite skogsbilde av emojier som barnet skal telle i.
 * Konsumerer `visual`-objektet { type: 'telle', items } fra questions.js.
 * Rotasjonen er deterministisk per posisjon slik at bildet er stabilt
 * mellom renders.
 * @param {{ items: string[] }} props
 */
export default function TelleScene({ items }) {
  return (
    <div className={s.scene} role="img" aria-label="Bilde fra skogen med ting å telle">
      {items.map((emoji, i) => (
        <span
          key={i}
          className={s.item}
          style={{ transform: `rotate(${((i * 37) % 19) - 9}deg)` }}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
}
