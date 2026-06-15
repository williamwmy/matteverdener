import s from './SekvensDisplay.module.css';

const PAD = 30;
const HEIGHT = 124;
const LINE_Y = 78;
const MIN_GAP = 46; // minste avstand mellom to nabotall (px) for at piltekst får plass
const MAX_WIDTH = 540;
const ORDERED_GAP = 90; // fast avstand i steg-modus (god plass til 3-sifrede tall + piltekst)

/**
 * Tallinje for tallmønstre/-følger og løpende regnestykker.
 *
 * To plasseringsmodi:
 * - VERDI (standard): punktene plasseres etter tallverdi, så voksende sprang
 *   (kvadrattall 1, 4, 9 …) synes. Forutsetter en monoton følge.
 * - STEG (`ordered`): punktene plasseres med lik avstand i regnerekkefølge,
 *   venstre→høyre. Brukes for løpende summer som `104 − 73 + 115`, der følgen
 *   ikke er monoton (104 → 31 → 146) og verdiplassering ville krysse buene og
 *   stable etikettene oppå hverandre.
 *
 * Den siste pila (mot «?») er bevisst uten tekst, så barnet selv finner hoppet
 * — med mindre `reveal` er satt (fasit ved feil svar).
 * @param {{
 *   terms: number[],
 *   answer: number,
 *   labels?: string[],
 *   reveal?: boolean,
 *   ordered?: boolean,
 * }} props
 */
export default function SekvensDisplay({ terms, answer, labels = [], reveal = false, ordered = false }) {
  const seq = [...terms, answer];
  const min = Math.min(...seq);
  const max = Math.max(...seq);
  const span = Math.max(1, max - min);

  let xs;
  let width;
  if (ordered) {
    width = PAD * 2 + (seq.length - 1) * ORDERED_GAP;
    xs = seq.map((_, i) => PAD + i * ORDERED_GAP);
  } else {
    // Skaler så det minste hoppet får minst MIN_GAP px, men hold totalbredden i sjakk.
    let minDiff = Infinity;
    for (let i = 1; i < seq.length; i++) minDiff = Math.min(minDiff, Math.abs(seq[i] - seq[i - 1]));
    if (!Number.isFinite(minDiff) || minDiff === 0) minDiff = 1;
    const perUnit = Math.min(MIN_GAP / minDiff, MAX_WIDTH / span);
    width = PAD * 2 + span * perUnit;
    xs = seq.map((v) => PAD + (v - min) * perUnit);
  }
  const xFor = (i) => xs[i];

  return (
    <svg
      className={s.line}
      width={width}
      height={HEIGHT}
      viewBox={`0 0 ${width} ${HEIGHT}`}
      role="img"
      aria-label={`Tallmønster: ${terms.join(', ')}, ?`}
    >
      <line x1="4" y1={LINE_Y} x2={width - 4} y2={LINE_Y} className={s.axis} />
      <path d={`M ${width - 2} ${LINE_Y} l -9 -5 v 10 z`} className={s.axisHead} />
      <path d={`M 2 ${LINE_Y} l 9 -5 v 10 z`} className={s.axisHead} />

      {/* Piler mellom påfølgende ledd. */}
      {seq.slice(1).map((v, i) => {
        const x1 = xFor(i);
        const x2 = xFor(i + 1);
        const mid = (x1 + x2) / 2;
        const label = labels[i];
        return (
          <g key={`arc-${i}`}>
            <path d={`M ${x1} ${LINE_Y - 9} Q ${mid} ${LINE_Y - 44} ${x2} ${LINE_Y - 9}`} className={s.hop} />
            <path d={`M ${x2} ${LINE_Y - 7} l -5 -9 h 10 z`} className={s.hopHead} />
            {label && (
              <text x={mid} y={LINE_Y - 36} className={s.hopLabel}>
                {label}
              </text>
            )}
          </g>
        );
      })}

      {/* Punkter med verdier; siste punkt er svaret («?» eller fasit). */}
      {seq.map((v, i) => {
        const isAnswer = i === seq.length - 1;
        const x = xFor(i);
        return (
          <g key={`pt-${i}`}>
            <circle cx={x} cy={LINE_Y} r="4.5" className={s.dot} />
            {isAnswer && !reveal ? (
              <>
                <circle cx={x} cy={LINE_Y + 27} r="13" className={s.qCircle} />
                <text x={x} y={LINE_Y + 33} className={s.qMark}>
                  ?
                </text>
              </>
            ) : (
              <text x={x} y={LINE_Y + 32} className={isAnswer ? s.answerLabel : s.label}>
                {v}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
