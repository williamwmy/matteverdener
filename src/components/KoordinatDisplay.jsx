import s from './KoordinatDisplay.module.css';

const CELL = 30;
const PAD = 26;

/**
 * Koordinatsystem i SVG. Tegner rutenett fra min til max på begge akser og
 * markerer ett punkt. Støtter både første kvadrant (min = 0) og alle fire
 * (min < 0). Konsumerer { type: 'koordinat', min, max, point } fra data.
 * @param {{ min: number, max: number, point: [number, number] }} props
 */
export default function KoordinatDisplay({ min, max, point }) {
  const span = max - min;
  const size = span * CELL;
  const total = size + PAD * 2;
  const sx = (x) => PAD + (x - min) * CELL;
  const sy = (y) => PAD + (max - y) * CELL;
  const ticks = [];
  for (let v = min; v <= max; v++) ticks.push(v);

  return (
    <svg
      className={s.grid}
      width={total}
      height={total}
      viewBox={`0 0 ${total} ${total}`}
      role="img"
      aria-label={`Koordinatsystem med et punkt i (${point[0]}, ${point[1]})`}
    >
      {ticks.map((v) => (
        <g key={`g${v}`}>
          <line x1={sx(v)} y1={PAD} x2={sx(v)} y2={PAD + size} className={s.line} />
          <line x1={PAD} y1={sy(v)} x2={PAD + size} y2={sy(v)} className={s.line} />
        </g>
      ))}
      <line x1={sx(min)} y1={sy(0)} x2={sx(max)} y2={sy(0)} className={s.axis} />
      <line x1={sx(0)} y1={sy(min)} x2={sx(0)} y2={sy(max)} className={s.axis} />
      {ticks.filter((v) => v !== 0).map((v) => (
        <text key={`x${v}`} x={sx(v)} y={sy(0) + 14} className={s.tickLabel}>
          {v}
        </text>
      ))}
      {ticks.filter((v) => v !== 0).map((v) => (
        <text key={`y${v}`} x={sx(0) - 9} y={sy(v) + 4} className={s.tickLabel}>
          {v}
        </text>
      ))}
      <circle cx={sx(point[0])} cy={sy(point[1])} r="7" className={s.point} />
      <text x={sx(point[0]) + 11} y={sy(point[1]) - 9} className={s.star}>
        ⭐
      </text>
    </svg>
  );
}
