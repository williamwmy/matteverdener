import { Fragment } from 'react';
import s from './NomerDisplay.module.css';

// Faste nomer-mønstre 1–10. Koordinatene er konstanter slik at mønstrene
// alltid er identiske og aldri regenereres per render.
const FIVE_FRAME_XS = [14, 32, 50, 68, 86];

function fiveRow(y) {
  return FIVE_FRAME_XS.map((x) => [x, y]);
}

const NOMER_PATTERNS = {
  1: [[50, 50]],
  2: [
    [30, 50],
    [70, 50],
  ],
  3: [
    [32, 32],
    [68, 32],
    [32, 68],
  ],
  4: [
    [32, 32],
    [68, 32],
    [32, 68],
    [68, 68],
  ],
  5: [
    [30, 30],
    [70, 30],
    [50, 50],
    [30, 70],
    [70, 70],
  ],
  6: [
    [36, 26],
    [64, 26],
    [36, 50],
    [64, 50],
    [36, 74],
    [64, 74],
  ],
  7: [...fiveRow(32), [14, 68], [32, 68]],
  8: [...fiveRow(32), [14, 68], [32, 68], [50, 68]],
  9: [...fiveRow(32), [14, 68], [32, 68], [50, 68], [68, 68]],
  10: [...fiveRow(32), ...fiveRow(68)],
};

/**
 * Tegner nomer (strukturerte punktmønstre) for tall 1–10.
 * Kan konsumere `visual`-objektet fra questions.js direkte: values-listen
 * tegnes side om side med regnetegn mellom.
 * @param {{ values: number[], op?: string, size?: number }} props
 */
export default function NomerDisplay({ values, op = '+', size = 110 }) {
  const opWord = op === '−' ? 'minus' : 'pluss';
  return (
    <div className={s.group} role="img" aria-label={`Nomer som viser ${values.join(` ${opWord} `)}`}>
      {values.map((value, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <span className={s.plus} aria-hidden="true">
              {op}
            </span>
          )}
          <svg className={s.card} width={size} height={size} viewBox="0 0 100 100">
            {value >= 7 && <rect className={s.frame} x="4" y="20" width="92" height="24" rx="9" />}
            {value === 10 && (
              <rect className={s.frame} x="4" y="56" width="92" height="24" rx="9" />
            )}
            {(NOMER_PATTERNS[value] ?? []).map(([x, y], j) => (
              <circle key={j} className={s.dot} cx={x} cy={y} r="7" />
            ))}
          </svg>
        </Fragment>
      ))}
    </div>
  );
}
