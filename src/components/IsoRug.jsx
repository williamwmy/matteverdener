import s from './IsoRug.module.css';

// Flate områdetepper tegnet i samme isometriske projeksjon som gulvet. I
// motsetning til møblene (stående klosser) ligger teppet flatt (z = 0) og er
// forankret i sitt eget senter.

const UX = [0.7071, 0.4056];
const UY = [-0.7071, 0.4056];

// Fast SVG-størrelse og ankerpunkt (teppets senter).
export const RUG = { w: 180, h: 110, ax: 90, ay: 55 };

const RUGS = {
  'teppe-rod': { w: 96, d: 70, base: '#c0392b', border: '#efd9b0', motif: null },
  'teppe-stripe': { w: 104, d: 72, base: '#2e6da4', border: '#cfe3f5', motif: 'stripes' },
  'teppe-gronn': { w: 92, d: 68, base: '#3a9d5d', border: '#ece7c6', motif: 'dots' },
  'teppe-stjerne': { w: 100, d: 74, base: '#6b4ea8', border: '#f9c846', motif: 'star' },
};

function clamp8(n) {
  return Math.max(0, Math.min(255, Math.round(n)));
}
function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${clamp8(((n >> 16) & 255) * f)},${clamp8(((n >> 8) & 255) * f)},${clamp8((n & 255) * f)})`;
}

// Et parallellogram (gulvrektangel w×d) sentrert i (cx, cy) i skjermkoordinater.
function quad(cx, cy, w, d) {
  const p = (ox, oy) =>
    `${(cx + ox * UX[0] + oy * UY[0]).toFixed(1)},${(cy + ox * UX[1] + oy * UY[1]).toFixed(1)}`;
  return [p(-w / 2, -d / 2), p(w / 2, -d / 2), p(w / 2, d / 2), p(-w / 2, d / 2)].join(' ');
}

// Skjermpunkt for et gulv-offset (ox, oy) fra teppesenteret.
function at(cx, cy, ox, oy) {
  return [cx + ox * UX[0] + oy * UY[0], cy + ox * UX[1] + oy * UY[1]];
}

/**
 * Tegner et flatt teppe. Bruk `RUG` for plassering/anker.
 * @param {{ id: string, rotation?: number }} props
 */
export default function IsoRug({ id, rotation = 0 }) {
  const cfg = RUGS[id] ?? RUGS['teppe-rod'];
  let w = cfg.w;
  let d = cfg.d;
  if (rotation % 2 === 1) [w, d] = [d, w]; // 90°/270° bytter lang og kort side
  const { ax, ay } = RUG;

  const motif = [];
  if (cfg.motif === 'stripes') {
    [-0.26, 0, 0.26].forEach((f, i) => {
      const [cx, cy] = at(ax, ay, f * w, 0);
      motif.push(<polygon key={i} points={quad(cx, cy, w * 0.1, d * 0.74)} fill={shade(cfg.base, 1.25)} />);
    });
  } else if (cfg.motif === 'dots') {
    [
      [-0.26, -0.22],
      [0.26, -0.22],
      [-0.26, 0.22],
      [0.26, 0.22],
      [0, 0],
    ].forEach(([fx, fy], i) => {
      const [cx, cy] = at(ax, ay, fx * w, fy * d);
      motif.push(<circle key={i} cx={cx} cy={cy} r="3.4" fill={cfg.border} />);
    });
  } else if (cfg.motif === 'star') {
    motif.push(
      <text key="s" x={ax} y={ay + 8} textAnchor="middle" className={s.star}>
        ⭐
      </text>
    );
  }

  return (
    <svg className={s.rug} width={RUG.w} height={RUG.h} viewBox={`0 0 ${RUG.w} ${RUG.h}`} aria-hidden="true">
      <polygon points={quad(ax, ay, w, d)} fill={cfg.border} />
      <polygon points={quad(ax, ay, w * 0.82, d * 0.78)} fill={cfg.base} />
      {motif}
    </svg>
  );
}
