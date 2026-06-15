import { Fragment } from 'react';
import s from './MathText.module.css';

// Brøk skrives i oppgavedata som «teller/nevner» (f.eks. 1/3). Her tegnes de
// med vannrett brøkstrek slik elevene lærer det. Tegnet ? godtas som teller
// eller nevner (manko-oppgaver, f.eks. 1/2 = ?/4). Divisjon bruker «:» i
// dataene, så ingen ekte deling fanges ved en feil.
const FRACTION = /(\d+|\?)\/(\d+|\?)/g;

/**
 * Rendrer tekst der brøk-tokens vises som stablet brøk med horisontal strek.
 * Med `highlight` markeres også plassholder-? (det ukjente tallet) som gul
 * tekst i en sirkel. Brukes kun på selve regneuttrykket, ikke på setninger
 * der ? er vanlig tegnsetting.
 * @param {{ children: string|number, highlight?: boolean }} props
 */
export default function MathText({ children, highlight = false }) {
  const text = String(children ?? '');
  if (!text.includes('/') && !(highlight && text.includes('?'))) return <>{text}</>;

  const out = [];
  let key = 0;

  const pushPlain = (str) => {
    if (!str) return;
    if (highlight && str.includes('?')) {
      str.split('?').forEach((bit, i) => {
        if (i > 0) out.push(<Placeholder key={key++} />);
        if (bit) out.push(<Fragment key={key++}>{bit}</Fragment>);
      });
    } else {
      out.push(<Fragment key={key++}>{str}</Fragment>);
    }
  };

  let last = 0;
  let m;
  FRACTION.lastIndex = 0;
  while ((m = FRACTION.exec(text)) !== null) {
    if (m.index > last) pushPlain(text.slice(last, m.index));
    out.push(<Brok key={key++} num={m[1]} den={m[2]} highlight={highlight} />);
    last = m.index + m[0].length;
  }
  if (last < text.length) pushPlain(text.slice(last));
  return <>{out}</>;
}

function Placeholder({ small }) {
  return (
    <span className={small ? `${s.ph} ${s.phSmall}` : s.ph} aria-label="det ukjente tallet">
      ?
    </span>
  );
}

function Brok({ num, den, highlight }) {
  const cell = (v) => (highlight && v === '?' ? <Placeholder small /> : v);
  return (
    <span className={s.frac} role="math" aria-label={`${num} delt på ${den}`}>
      <span className={s.num}>{cell(num)}</span>
      <span className={s.den} aria-hidden="true">
        {cell(den)}
      </span>
    </span>
  );
}
