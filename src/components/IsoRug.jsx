import s from './IsoRug.module.css';

// Flate områdetepper i samme isometriske projeksjon som gulvet. Tar en farge
// og et valgfritt mønster (striper/stjerne).

const UX = [0.7071, 0.4056];
const UY = [-0.7071, 0.4056];

export const RUG = { w: 180, h: 110, ax: 90, ay: 55, fw: 98, fd: 70 };
const BORDER = '#efe7d2';

function clamp8(n) {
  return Math.max(0, Math.min(255, Math.round(n)));
}
function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${clamp8(((n >> 16) & 255) * f)},${clamp8(((n >> 8) & 255) * f)},${clamp8((n & 255) * f)})`;
}

function quad(cx, cy, w, d) {
  const q = (ox, oy) =>
    `${(cx + ox * UX[0] + oy * UY[0]).toFixed(1)},${(cy + ox * UX[1] + oy * UY[1]).toFixed(1)}`;
  return [q(-w / 2, -d / 2), q(w / 2, -d / 2), q(w / 2, d / 2), q(-w / 2, d / 2)].join(' ');
}
function at(cx, cy, ox, oy) {
  return [cx + ox * UX[0] + oy * UY[0], cy + ox * UX[1] + oy * UY[1]];
}

/**
 * @param {{ color: string, motif?: 'stripes'|'star'|null, rotation?: number }} props
 */
export default function IsoRug({ color = '#c0392b', motif = null, rotation = 0 }) {
  let w = RUG.fw;
  let d = RUG.fd;
  if (rotation % 2 === 1) [w, d] = [d, w];
  const { ax, ay } = RUG;

  const deco = [];
  if (motif === 'stripes') {
    [-0.26, 0, 0.26].forEach((f, i) => {
      const [cx, cy] = at(ax, ay, f * w, 0);
      deco.push(<polygon key={i} points={quad(cx, cy, w * 0.1, d * 0.74)} fill={shade(color, 1.25)} />);
    });
  } else if (motif === 'star') {
    deco.push(
      <text key="s" x={ax} y={ay + 8} textAnchor="middle" className={s.star}>
        ⭐
      </text>
    );
  }

  return (
    <svg className={s.rug} width={RUG.w} height={RUG.h} viewBox={`0 0 ${RUG.w} ${RUG.h}`} aria-hidden="true">
      <polygon points={quad(ax, ay, w, d)} fill={BORDER} />
      <polygon points={quad(ax, ay, w * 0.82, d * 0.78)} fill={color} />
      {deco}
    </svg>
  );
}
