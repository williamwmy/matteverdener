import s from './TallinjeDisplay.module.css';

const TICK_SPACING = 38;
const PAD = 26;
const HEIGHT = 100;
const LINE_Y = 58;

/**
 * Tegner en tallinje i SVG. Konsumerer `visual`-objekter fra questions.js:
 * - hidden: verdier som vises som «?» (tallet barnet skal finne)
 * - jump: { start, hops, dir } tegner hoppebuer for addisjon ('up')
 *   eller subtraksjon ('down') med startprikk
 * @param {{
 *   from: number,
 *   to: number,
 *   step?: number,
 *   hidden?: number[],
 *   jump?: { start: number, hops: number, dir: 'up'|'down' }|null,
 * }} props
 */
export default function TallinjeDisplay({ from, to, step = 1, hidden = [], jump = null }) {
  const values = [];
  for (let v = from; v <= to; v += step) values.push(v);
  const width = PAD * 2 + (values.length - 1) * TICK_SPACING;
  const xFor = (v) => PAD + ((v - from) / step) * TICK_SPACING;

  const arcs = [];
  if (jump) {
    for (let i = 0; i < jump.hops; i++) {
      const start = jump.dir === 'down' ? jump.start - i * step : jump.start + i * step;
      const end = jump.dir === 'down' ? start - step : start + step;
      arcs.push([xFor(start), xFor(end)]);
    }
  }

  return (
    <svg
      className={s.line}
      width={width}
      height={HEIGHT}
      viewBox={`0 0 ${width} ${HEIGHT}`}
      role="img"
      aria-label={`Tallinje fra ${from} til ${to}`}
    >
      <line x1="4" y1={LINE_Y} x2={width - 4} y2={LINE_Y} className={s.axis} />
      <path d={`M ${width - 2} ${LINE_Y} l -9 -5 v 10 z`} className={s.axisHead} />
      <path d={`M 2 ${LINE_Y} l 9 -5 v 10 z`} className={s.axisHead} />

      {values.map((v) => (
        <g key={v}>
          <line x1={xFor(v)} y1={LINE_Y - 7} x2={xFor(v)} y2={LINE_Y + 7} className={s.tick} />
          {hidden.includes(v) ? (
            <>
              <circle cx={xFor(v)} cy={LINE_Y + 25} r="13" className={s.qCircle} />
              <text x={xFor(v)} y={LINE_Y + 31} className={s.qMark}>
                ?
              </text>
            </>
          ) : (
            <text x={xFor(v)} y={LINE_Y + 30} className={s.label}>
              {v}
            </text>
          )}
        </g>
      ))}

      {jump && <circle cx={xFor(jump.start)} cy={LINE_Y} r="5" className={s.startDot} />}
      {arcs.map(([x1, x2], i) => (
        <g key={i}>
          <path
            d={`M ${x1} ${LINE_Y - 9} Q ${(x1 + x2) / 2} ${LINE_Y - 42} ${x2} ${LINE_Y - 9}`}
            className={s.hop}
          />
          <path d={`M ${x2} ${LINE_Y - 7} l -5 -9 h 10 z`} className={s.hopHead} />
        </g>
      ))}
    </svg>
  );
}
