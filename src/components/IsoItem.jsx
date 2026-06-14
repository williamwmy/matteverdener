import s from './IsoItem.module.css';

// Isometrisk møbel-tegning i SVG, med SAMME projeksjon som rommet
// (rotateX(55°) rotateZ(45°)). Hver gjenstand bygges av klosser (bokser) med
// topp- og to sideflater, slik at de leses som 3D og «står» i rommet.

// Projeksjonsvektorer (skjerm-piksler per gulv-/høyde-enhet).
const UX = [0.7071, 0.4056]; // gulvets +x: høyre-ned
const UY = [-0.7071, 0.4056]; // gulvets +y: venstre-ned
const UZ_Y = -0.8192; // høyde (+z): rett opp

// Fast SVG-størrelse og ankerpunkt (gulvsenter under gjenstanden).
export const ISO = { w: 230, h: 260, ax: 115, ay: 196 };

function clamp8(n) {
  return Math.max(0, Math.min(255, Math.round(n)));
}

function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${clamp8(((n >> 16) & 255) * f)},${clamp8(((n >> 8) & 255) * f)},${clamp8((n & 255) * f)})`;
}

function pt(ox, oy, oz) {
  const x = ISO.ax + ox * UX[0] + oy * UY[0];
  const y = ISO.ay + ox * UX[1] + oy * UY[1] + oz * UZ_Y;
  return `${x.toFixed(1)},${y.toFixed(1)}`;
}

/**
 * En kloss tegnet som tre flater (høyre, venstre, topp) med skygge.
 * @param {{ cx?: number, cy?: number, cz?: number, w: number, d: number, h: number, color: string }} b
 */
function Box(b) {
  const { cx = 0, cy = 0, cz = 0, w, d, h, color } = b;
  const x0 = cx - w / 2;
  const x1 = cx + w / 2;
  const y0 = cy - d / 2;
  const y1 = cy + d / 2;
  const z0 = cz;
  const z1 = cz + h;
  const top = [pt(x0, y0, z1), pt(x1, y0, z1), pt(x1, y1, z1), pt(x0, y1, z1)].join(' ');
  const right = [pt(x1, y0, z0), pt(x1, y1, z0), pt(x1, y1, z1), pt(x1, y0, z1)].join(' ');
  const left = [pt(x1, y1, z0), pt(x0, y1, z0), pt(x0, y1, z1), pt(x1, y1, z1)].join(' ');
  return (
    <>
      <polygon points={right} fill={shade(color, 0.82)} />
      <polygon points={left} fill={shade(color, 0.6)} />
      <polygon points={top} fill={shade(color, 1.12)} />
    </>
  );
}

const BOOK_COLORS = ['#e05252', '#4ecb71', '#f9c846', '#7ed4f7', '#b07ef7'];

// Klossene er listet i tegnerekkefølge (bakfra og frem, nedenfra og opp).
function buildBoxes(id) {
  switch (id) {
    case 'bokhylle': {
      const boxes = [{ cx: 0, cy: 0, cz: 0, w: 46, d: 28, h: 124, color: '#8b5a3c' }];
      [16, 56, 96].forEach((z) =>
        [-16, -8, 0, 8, 16].forEach((x, i) =>
          boxes.push({ cx: x, cy: 11, cz: z, w: 6, d: 5, h: 26, color: BOOK_COLORS[(i + z) % 5] })
        )
      );
      return boxes;
    }
    case 'skrivebord':
      return [
        { cx: -40, cy: -16, cz: 0, w: 8, d: 8, h: 30, color: '#7c4f33' },
        { cx: 40, cy: -16, cz: 0, w: 8, d: 8, h: 30, color: '#7c4f33' },
        { cx: 0, cy: -8, cz: 40, w: 30, d: 6, h: 24, color: '#2a2940' },
        { cx: 0, cy: 0, cz: 30, w: 96, d: 46, h: 9, color: '#a06b49' },
        { cx: -40, cy: 16, cz: 0, w: 8, d: 8, h: 30, color: '#7c4f33' },
        { cx: 40, cy: 16, cz: 0, w: 8, d: 8, h: 30, color: '#7c4f33' },
        { cx: 34, cy: 6, cz: 39, w: 12, d: 10, h: 12, color: '#e05252' },
      ];
    case 'seng':
      return [
        { cx: 0, cy: 0, cz: 0, w: 122, d: 70, h: 18, color: '#6f4730' },
        { cx: 0, cy: 0, cz: 18, w: 112, d: 64, h: 13, color: '#f5f0e6' },
        { cx: -40, cy: 0, cz: 31, w: 30, d: 30, h: 10, color: '#ffffff' },
        { cx: 22, cy: 0, cz: 31, w: 66, d: 64, h: 8, color: '#7ed4f7' },
      ];
    case 'sofa':
      return [
        { cx: 0, cy: -24, cz: 0, w: 122, d: 14, h: 48, color: '#b07ef7' },
        { cx: 0, cy: 4, cz: 0, w: 96, d: 50, h: 22, color: '#9a64e0' },
        { cx: -56, cy: 0, cz: 0, w: 14, d: 60, h: 38, color: '#a070e6' },
        { cx: 56, cy: 0, cz: 0, w: 14, d: 60, h: 38, color: '#a070e6' },
        { cx: 0, cy: 6, cz: 22, w: 92, d: 46, h: 11, color: '#c79bff' },
        { cx: 22, cy: 10, cz: 33, w: 22, d: 20, h: 15, color: '#f9c846' },
      ];
    case 'potte-kaktus':
      return [
        { cx: 0, cy: 0, cz: 0, w: 30, d: 30, h: 24, color: '#c96f4a' },
        { cx: 0, cy: 0, cz: 24, w: 16, d: 16, h: 44, color: '#4ecb71' },
        { cx: -12, cy: 0, cz: 44, w: 10, d: 8, h: 18, color: '#4ecb71' },
        { cx: 13, cy: 0, cz: 52, w: 9, d: 8, h: 14, color: '#4ecb71' },
      ];
    case 'potte-monstera':
      return [
        { cx: 0, cy: 0, cz: 0, w: 32, d: 32, h: 26, color: '#c96f4a' },
        { cx: 0, cy: 0, cz: 26, w: 8, d: 8, h: 26, color: '#3fae60' },
        { cx: -14, cy: -6, cz: 40, w: 22, d: 6, h: 18, color: '#4ecb71' },
        { cx: 12, cy: 8, cz: 44, w: 20, d: 6, h: 16, color: '#3fae60' },
        { cx: 0, cy: 0, cz: 52, w: 18, d: 14, h: 14, color: '#4ecb71' },
      ];
    case 'lampe':
      return [
        { cx: 0, cy: 0, cz: 0, w: 28, d: 28, h: 8, color: '#44415e' },
        { cx: 0, cy: 0, cz: 8, w: 6, d: 6, h: 64, color: '#8b8aa0' },
        { cx: 0, cy: 0, cz: 70, w: 42, d: 42, h: 24, color: '#f9c846' },
      ];
    case 'trofe':
      return [
        { cx: 0, cy: 0, cz: 0, w: 32, d: 26, h: 10, color: '#6f4730' },
        { cx: 0, cy: 0, cz: 10, w: 9, d: 9, h: 12, color: '#d9a92e' },
        { cx: 0, cy: 0, cz: 22, w: 32, d: 26, h: 24, color: '#f9c846' },
      ];
    default:
      return [{ cx: 0, cy: 0, cz: 0, w: 40, d: 40, h: 40, color: '#7ed4f7' }];
  }
}

// Roterer en kloss `r` × 90° rundt loddrett akse (i gulvplanet): senteret
// dreies og bredde/dybde bytter plass, så asymmetriske detaljer (bøker, skjerm,
// pute) følger med.
function rotateBox(b, r) {
  let cx = b.cx ?? 0;
  let cy = b.cy ?? 0;
  let w = b.w;
  let d = b.d;
  const steps = ((r % 4) + 4) % 4;
  for (let i = 0; i < steps; i++) {
    [cx, cy] = [-cy, cx];
    [w, d] = [d, w];
  }
  return { ...b, cx, cy, w, d };
}

const depthKey = (b) => (b.cx ?? 0) + (b.cy ?? 0) + (b.cz ?? 0);

/**
 * Tegner en gjenstand isometrisk. Bruk `ISO` for plassering/anker.
 * @param {{ id: string, rotation?: number }} props - id og rotasjon (0–3)
 */
export default function IsoItem({ id, rotation = 0 }) {
  let boxes = buildBoxes(id);
  if (rotation % 4 !== 0) {
    // Behold forfattet rekkefølge ved 0°; sorter bakfra og frem ved rotasjon.
    boxes = boxes
      .map((b) => rotateBox(b, rotation))
      .sort((a, b2) => depthKey(a) - depthKey(b2) || (a.cz ?? 0) - (b2.cz ?? 0));
  }
  return (
    <svg
      className={s.iso}
      width={ISO.w}
      height={ISO.h}
      viewBox={`0 0 ${ISO.w} ${ISO.h}`}
      aria-hidden="true"
    >
      {boxes.map((b, i) => (
        <Box key={i} {...b} />
      ))}
    </svg>
  );
}
