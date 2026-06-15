import s from './IsoItem.module.css';

// Isometrisk møbel-tegning i SVG, med SAMME projeksjon som rommet
// (rotateX(55°) rotateZ(45°)). Hver form bygges av klosser og tar en
// hovedfarge; bein/aksenter utledes som lysere/mørkere nyanser.

const UX = [0.7071, 0.4056];
const UY = [-0.7071, 0.4056];
const UZ_Y = -0.8192;

export const ISO = { w: 230, h: 260, ax: 115, ay: 196 };

function clamp8(n) {
  return Math.max(0, Math.min(255, Math.round(n)));
}
// Tar både «#rrggbb» og «rgb(r,g,b)», slik at en allerede skyggelagt farge kan
// skyggelegges videre (formene forhåndsskygger noen klosser før Box-fasene gjør
// det igjen). Uten rgb()-støtte ble re-skyggede flater til NaN → svart.
function parseColor(color) {
  if (color[0] === '#') {
    const n = parseInt(color.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const m = color.match(/\d+/g) ?? [0, 0, 0];
  return [Number(m[0]), Number(m[1]), Number(m[2])];
}
export function shade(color, f) {
  const [r, g, b] = parseColor(color);
  return `rgb(${clamp8(r * f)},${clamp8(g * f)},${clamp8(b * f)})`;
}

function pt(ox, oy, oz) {
  const x = ISO.ax + ox * UX[0] + oy * UY[0];
  const y = ISO.ay + ox * UX[1] + oy * UY[1] + oz * UZ_Y;
  return `${x.toFixed(1)},${y.toFixed(1)}`;
}

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

// Hver form: (c) => liste av klosser (bakfra og frem, nedenfra og opp).
const SHAPES = {
  chair(c) {
    const leg = shade(c, 0.72);
    return [
      { cx: -12, cy: -12, cz: 0, w: 6, d: 6, h: 24, color: leg },
      { cx: 12, cy: -12, cz: 0, w: 6, d: 6, h: 24, color: leg },
      { cx: 0, cy: -13, cz: 24, w: 32, d: 7, h: 28, color: c },
      { cx: -12, cy: 12, cz: 0, w: 6, d: 6, h: 24, color: leg },
      { cx: 12, cy: 12, cz: 0, w: 6, d: 6, h: 24, color: leg },
      { cx: 0, cy: 2, cz: 24, w: 32, d: 30, h: 7, color: c },
    ];
  },
  stool(c) {
    const leg = shade(c, 0.72);
    return [
      { cx: -9, cy: -9, cz: 0, w: 5, d: 5, h: 20, color: leg },
      { cx: 9, cy: -9, cz: 0, w: 5, d: 5, h: 20, color: leg },
      { cx: -9, cy: 9, cz: 0, w: 5, d: 5, h: 20, color: leg },
      { cx: 9, cy: 9, cz: 0, w: 5, d: 5, h: 20, color: leg },
      { cx: 0, cy: 0, cz: 20, w: 28, d: 28, h: 7, color: c },
    ];
  },
  armchair(c) {
    const cushion = shade(c, 1.18);
    return [
      { cx: 0, cy: -20, cz: 0, w: 56, d: 14, h: 44, color: c },
      { cx: 0, cy: 4, cz: 0, w: 40, d: 44, h: 20, color: shade(c, 0.9) },
      { cx: -24, cy: 2, cz: 0, w: 12, d: 52, h: 34, color: shade(c, 0.95) },
      { cx: 24, cy: 2, cz: 0, w: 12, d: 52, h: 34, color: shade(c, 0.95) },
      { cx: 0, cy: 6, cz: 20, w: 38, d: 38, h: 11, color: cushion },
    ];
  },
  sofa(c) {
    return [
      { cx: 0, cy: -24, cz: 0, w: 122, d: 14, h: 48, color: c },
      { cx: 0, cy: 4, cz: 0, w: 96, d: 50, h: 22, color: shade(c, 0.86) },
      { cx: -56, cy: 0, cz: 0, w: 14, d: 60, h: 38, color: shade(c, 0.92) },
      { cx: 56, cy: 0, cz: 0, w: 14, d: 60, h: 38, color: shade(c, 0.92) },
      { cx: 0, cy: 6, cz: 22, w: 92, d: 46, h: 11, color: shade(c, 1.18) },
      { cx: 22, cy: 10, cz: 33, w: 22, d: 20, h: 15, color: '#f9c846' },
    ];
  },
  bed(c) {
    return [
      { cx: 0, cy: 0, cz: 0, w: 122, d: 70, h: 18, color: '#6f4730' },
      { cx: 0, cy: 0, cz: 18, w: 112, d: 64, h: 13, color: '#f5f0e6' },
      { cx: -40, cy: 0, cz: 31, w: 30, d: 30, h: 10, color: '#ffffff' },
      { cx: 22, cy: 0, cz: 31, w: 66, d: 64, h: 8, color: c },
    ];
  },
  table(c) {
    const leg = shade(c, 0.72);
    return [
      { cx: -48, cy: -26, cz: 0, w: 8, d: 8, h: 38, color: leg },
      { cx: 48, cy: -26, cz: 0, w: 8, d: 8, h: 38, color: leg },
      { cx: -48, cy: 26, cz: 0, w: 8, d: 8, h: 38, color: leg },
      { cx: 48, cy: 26, cz: 0, w: 8, d: 8, h: 38, color: leg },
      { cx: 0, cy: 0, cz: 38, w: 112, d: 66, h: 10, color: c },
    ];
  },
  coffeetable(c) {
    const leg = shade(c, 0.72);
    return [
      { cx: -32, cy: -16, cz: 0, w: 7, d: 7, h: 18, color: leg },
      { cx: 32, cy: -16, cz: 0, w: 7, d: 7, h: 18, color: leg },
      { cx: -32, cy: 16, cz: 0, w: 7, d: 7, h: 18, color: leg },
      { cx: 32, cy: 16, cz: 0, w: 7, d: 7, h: 18, color: leg },
      { cx: 0, cy: 0, cz: 18, w: 84, d: 50, h: 8, color: c },
    ];
  },
  desk(c) {
    const leg = shade(c, 0.72);
    return [
      { cx: -40, cy: -16, cz: 0, w: 8, d: 8, h: 30, color: leg },
      { cx: 40, cy: -16, cz: 0, w: 8, d: 8, h: 30, color: leg },
      { cx: 0, cy: -8, cz: 40, w: 30, d: 6, h: 24, color: '#2a2940' },
      { cx: 0, cy: 0, cz: 30, w: 96, d: 46, h: 9, color: c },
      { cx: -40, cy: 16, cz: 0, w: 8, d: 8, h: 30, color: leg },
      { cx: 40, cy: 16, cz: 0, w: 8, d: 8, h: 30, color: leg },
      { cx: 34, cy: 6, cz: 39, w: 12, d: 10, h: 12, color: '#e05252' },
    ];
  },
  bookshelf(c) {
    const boxes = [{ cx: 0, cy: 0, cz: 0, w: 46, d: 28, h: 124, color: c }];
    [16, 56, 96].forEach((z) =>
      [-16, -8, 0, 8, 16].forEach((x, i) =>
        boxes.push({ cx: x, cy: 11, cz: z, w: 6, d: 5, h: 26, color: BOOK_COLORS[(i + z) % 5] })
      )
    );
    return boxes;
  },
  dresser(c) {
    const h = shade(c, 0.6);
    return [
      { cx: 0, cy: 0, cz: 0, w: 70, d: 40, h: 50, color: c },
      { cx: -14, cy: 20, cz: 14, w: 6, d: 4, h: 4, color: h },
      { cx: 14, cy: 20, cz: 14, w: 6, d: 4, h: 4, color: h },
      { cx: -14, cy: 20, cz: 30, w: 6, d: 4, h: 4, color: h },
      { cx: 14, cy: 20, cz: 30, w: 6, d: 4, h: 4, color: h },
    ];
  },
  nightstand(c) {
    return [
      { cx: 0, cy: 0, cz: 0, w: 32, d: 30, h: 34, color: c },
      { cx: 0, cy: 15, cz: 20, w: 8, d: 4, h: 4, color: shade(c, 0.6) },
    ];
  },
  wardrobe(c) {
    return [
      { cx: 0, cy: 0, cz: 0, w: 56, d: 40, h: 124, color: c },
      { cx: -6, cy: 20, cz: 56, w: 4, d: 4, h: 26, color: shade(c, 0.5) },
      { cx: 6, cy: 20, cz: 56, w: 4, d: 4, h: 26, color: shade(c, 0.5) },
    ];
  },
  tv(c) {
    // Ramme og skjerm har SAMME cz, så dybdesorteringen (cx+cy+cz) styres av
    // dybden (cy): skjermen tegnes over rammen når TV-en vender mot oss, og
    // rammen (baksiden) tegnes over skjermen når den er snudd bort. Ulik cz her
    // ville alltid tegnet skjermen øverst → «TV-en vises bak frem».
    return [
      { cx: 0, cy: 0, cz: 0, w: 90, d: 40, h: 24, color: c },
      { cx: 0, cy: -6, cz: 24, w: 66, d: 8, h: 42, color: '#1c2030' },
      { cx: 0, cy: -3, cz: 24, w: 58, d: 6, h: 36, color: '#4a78c4' },
    ];
  },
  fridge(c) {
    return [
      { cx: 0, cy: 0, cz: 0, w: 44, d: 40, h: 124, color: c },
      { cx: 0, cy: 0, cz: 80, w: 44, d: 40, h: 3, color: shade(c, 0.85) },
      { cx: 18, cy: 20, cz: 88, w: 4, d: 4, h: 28, color: shade(c, 0.7) },
      { cx: 18, cy: 20, cz: 40, w: 4, d: 4, h: 30, color: shade(c, 0.7) },
    ];
  },
  stove(c) {
    return [
      { cx: 0, cy: 0, cz: 0, w: 50, d: 42, h: 44, color: c },
      { cx: 0, cy: 21, cz: 18, w: 30, d: 3, h: 14, color: shade(c, 0.7) },
      { cx: 0, cy: 0, cz: 44, w: 50, d: 42, h: 4, color: shade(c, 0.8) },
      { cx: -12, cy: -9, cz: 48, w: 14, d: 14, h: 2, color: '#3a3340' },
      { cx: 12, cy: -9, cz: 48, w: 14, d: 14, h: 2, color: '#3a3340' },
      { cx: -12, cy: 9, cz: 48, w: 14, d: 14, h: 2, color: '#3a3340' },
      { cx: 12, cy: 9, cz: 48, w: 14, d: 14, h: 2, color: '#3a3340' },
    ];
  },
  counter(c) {
    return [
      { cx: 0, cy: 0, cz: 0, w: 90, d: 44, h: 40, color: c },
      { cx: 0, cy: 0, cz: 40, w: 94, d: 48, h: 6, color: '#e8e4da' },
      { cx: -22, cy: 0, cz: 46, w: 24, d: 20, h: 4, color: '#9aa3b5' },
      { cx: -22, cy: -12, cz: 48, w: 4, d: 4, h: 12, color: '#aab2c2' },
    ];
  },
  sink(c) {
    return [
      { cx: 0, cy: 0, cz: 0, w: 50, d: 40, h: 42, color: c },
      { cx: 0, cy: 0, cz: 42, w: 48, d: 38, h: 6, color: shade(c, 0.88) },
      { cx: 0, cy: 2, cz: 46, w: 34, d: 24, h: 5, color: '#9aa3b5' },
      { cx: 0, cy: -14, cz: 48, w: 5, d: 5, h: 14, color: '#9aa3b5' },
      { cx: 0, cy: -9, cz: 58, w: 5, d: 12, h: 4, color: '#aab2c2' },
    ];
  },
  toilet(c) {
    return [
      { cx: 0, cy: -17, cz: 0, w: 34, d: 12, h: 42, color: c },
      { cx: 0, cy: 4, cz: 0, w: 30, d: 34, h: 24, color: c },
      { cx: 0, cy: 4, cz: 24, w: 32, d: 34, h: 5, color: shade(c, 0.95) },
    ];
  },
  bathtub(c) {
    return [
      { cx: 0, cy: 0, cz: 0, w: 100, d: 52, h: 28, color: c },
      { cx: 0, cy: 0, cz: 20, w: 88, d: 42, h: 9, color: '#7ed4f7' },
    ];
  },
  fireplace(c) {
    return [
      { cx: 0, cy: 0, cz: 0, w: 70, d: 30, h: 70, color: c },
      { cx: 0, cy: 14, cz: 6, w: 34, d: 4, h: 40, color: '#2a2018' },
      { cx: 0, cy: 13, cz: 6, w: 28, d: 3, h: 18, color: '#f9a03c' },
      { cx: 0, cy: 0, cz: 70, w: 80, d: 38, h: 6, color: shade(c, 0.85) },
    ];
  },
  aquarium(c) {
    return [
      { cx: 0, cy: 0, cz: 0, w: 60, d: 34, h: 36, color: c },
      { cx: 0, cy: 0, cz: 36, w: 58, d: 32, h: 30, color: '#9fdcf0' },
      { cx: 0, cy: 0, cz: 60, w: 60, d: 34, h: 5, color: shade(c, 0.7) },
    ];
  },
  lamp(c) {
    return [
      { cx: 0, cy: 0, cz: 0, w: 28, d: 28, h: 8, color: '#44415e' },
      { cx: 0, cy: 0, cz: 8, w: 6, d: 6, h: 64, color: '#8b8aa0' },
      { cx: 0, cy: 0, cz: 70, w: 42, d: 42, h: 24, color: c },
    ];
  },
  trophy(c) {
    return [
      { cx: 0, cy: 0, cz: 0, w: 32, d: 26, h: 10, color: '#6f4730' },
      { cx: 0, cy: 0, cz: 10, w: 9, d: 9, h: 12, color: shade(c, 0.85) },
      { cx: 0, cy: 0, cz: 22, w: 32, d: 26, h: 24, color: c },
    ];
  },
  cactus(c) {
    return [
      { cx: 0, cy: 0, cz: 0, w: 30, d: 30, h: 24, color: '#c96f4a' },
      { cx: 0, cy: 0, cz: 24, w: 16, d: 16, h: 44, color: c },
      { cx: -12, cy: 0, cz: 44, w: 10, d: 8, h: 18, color: c },
      { cx: 13, cy: 0, cz: 52, w: 9, d: 8, h: 14, color: c },
    ];
  },
  monstera(c) {
    return [
      { cx: 0, cy: 0, cz: 0, w: 32, d: 32, h: 26, color: '#c96f4a' },
      { cx: 0, cy: 0, cz: 26, w: 8, d: 8, h: 26, color: shade(c, 0.85) },
      { cx: -14, cy: -6, cz: 40, w: 22, d: 6, h: 18, color: c },
      { cx: 12, cy: 8, cz: 44, w: 20, d: 6, h: 16, color: shade(c, 0.85) },
      { cx: 0, cy: 0, cz: 52, w: 18, d: 14, h: 14, color: c },
    ];
  },
};

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
 * @param {{ shape: string, color: string, rotation?: number }} props
 */
export default function IsoItem({ shape, color, rotation = 0 }) {
  const build = SHAPES[shape] ?? SHAPES.chair;
  let boxes = build(color || '#a06b49');
  if (rotation % 4 !== 0) {
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
