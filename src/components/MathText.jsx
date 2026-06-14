import { Fragment } from 'react';
import s from './MathText.module.css';

// Brøk skrives i oppgavedata som «teller/nevner» (f.eks. 1/3). Her tegnes de
// med vannrett brøkstrek slik elevene lærer det. Tegnet ? godtas som teller
// eller nevner (manko-oppgaver, f.eks. 1/2 = ?/4). Divisjon bruker «:» i
// dataene, så ingen ekte deling fanges ved en feil.
const FRACTION = /(\d+|\?)\/(\d+|\?)/g;

/**
 * Rendrer tekst der brøk-tokens vises som stablet brøk med horisontal strek.
 * All annen tekst (tall, prosent, desimaltall, koordinater) er uendret.
 * @param {{ children: string|number }} props
 */
export default function MathText({ children }) {
  const text = String(children ?? '');
  if (!text.includes('/')) return <>{text}</>;

  const parts = [];
  let last = 0;
  let key = 0;
  let m;
  FRACTION.lastIndex = 0;
  while ((m = FRACTION.exec(text)) !== null) {
    if (m.index > last) parts.push(<Fragment key={key++}>{text.slice(last, m.index)}</Fragment>);
    parts.push(<Brok key={key++} num={m[1]} den={m[2]} />);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(<Fragment key={key++}>{text.slice(last)}</Fragment>);
  return <>{parts}</>;
}

function Brok({ num, den }) {
  return (
    <span className={s.frac} role="math" aria-label={`${num} delt på ${den}`}>
      <span className={s.num}>{num}</span>
      <span className={s.den} aria-hidden="true">
        {den}
      </span>
    </span>
  );
}
