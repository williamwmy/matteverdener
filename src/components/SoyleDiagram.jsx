import s from './SoyleDiagram.module.css';

const BAR_W = 46;
const GAP = 18;
const MAX_H = 150;
const PAD_TOP = 14;
const PAD_BOTTOM = 44;
const PAD_LEFT = 8;

/**
 * Søylediagram i SVG. Konsumerer { type: 'soyle', data: [{label, value,
 * emoji?}], unit } fra oppgavedata. Brukes til statistikk-oppgaver.
 * @param {{ data: {label: string, value: number, emoji?: string}[], unit?: string }} props
 */
export default function SoyleDiagram({ data, unit = '' }) {
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const width = PAD_LEFT * 2 + data.length * BAR_W + (data.length - 1) * GAP;
  const height = MAX_H + PAD_TOP + PAD_BOTTOM;
  const baseY = PAD_TOP + MAX_H;

  return (
    <svg
      className={s.chart}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={'Søylediagram: ' + data.map((d) => `${d.label} ${d.value}`).join(', ')}
    >
      <line x1={PAD_LEFT} y1={baseY} x2={width - PAD_LEFT} y2={baseY} className={s.axis} />
      {data.map((d, i) => {
        const x = PAD_LEFT + i * (BAR_W + GAP);
        const h = (d.value / maxVal) * MAX_H;
        return (
          <g key={i}>
            <rect x={x} y={baseY - h} width={BAR_W} height={h} rx="4" className={s.bar} />
            <text x={x + BAR_W / 2} y={baseY - h - 5} className={s.value}>
              {d.value}
              {unit}
            </text>
            <text x={x + BAR_W / 2} y={baseY + 18} className={s.label}>
              {d.emoji ?? d.label}
            </text>
            {d.emoji && (
              <text x={x + BAR_W / 2} y={baseY + 34} className={s.sublabel}>
                {d.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
