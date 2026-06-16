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
    // Skjermen (lys) ligger foran den mørke baksiden: dybdesorteringen tegner
    // skjermen over baksiden når TV-en vender mot oss, og skjuler den bak
    // baksiden når den er snudd bort.
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
  bookstack(c) {
    return [
      { cx: 0, cy: 0, cz: 0, w: 44, d: 32, h: 9, color: c },
      { cx: 3, cy: -1, cz: 9, w: 40, d: 30, h: 8, color: shade(c, 0.78) },
      { cx: -3, cy: 2, cz: 17, w: 38, d: 28, h: 8, color: shade(c, 1.18) },
      { cx: 2, cy: -2, cz: 25, w: 34, d: 26, h: 7, color: shade(c, 0.9) },
    ];
  },
  vase(c) {
    return [
      { cx: 0, cy: 0, cz: 0, w: 26, d: 26, h: 12, color: shade(c, 0.85) },
      { cx: 0, cy: 0, cz: 12, w: 30, d: 30, h: 30, color: c },
      { cx: 0, cy: 0, cz: 42, w: 20, d: 20, h: 8, color: shade(c, 0.9) },
      { cx: -6, cy: 0, cz: 50, w: 5, d: 5, h: 16, color: '#4ecb71' },
      { cx: 6, cy: 0, cz: 50, w: 5, d: 5, h: 12, color: '#4ecb71' },
      { cx: -6, cy: 0, cz: 66, w: 11, d: 11, h: 9, color: '#f29bc6' },
      { cx: 6, cy: 0, cz: 62, w: 10, d: 10, h: 9, color: '#f9c846' },
      { cx: 0, cy: 0, cz: 58, w: 10, d: 10, h: 9, color: '#e05252' },
    ];
  },
  chest(c) {
    return [
      { cx: 0, cy: 0, cz: 0, w: 52, d: 34, h: 20, color: c },
      { cx: 0, cy: 0, cz: 20, w: 52, d: 34, h: 10, color: shade(c, 1.12) },
      { cx: 0, cy: 17, cz: 7, w: 12, d: 4, h: 10, color: '#f9c846' },
    ];
  },
  // ---- Kjøkken ----
  dishwasher(c) {
    return [
      { cx: 0, cy: 0, cz: 0, w: 46, d: 42, h: 80, color: c },
      { cx: 0, cy: 0, cz: 72, w: 46, d: 42, h: 8, color: shade(c, 0.8) },
      { cx: 0, cy: 21, cz: 30, w: 26, d: 3, h: 28, color: '#9aa3b5' },
      { cx: 0, cy: 22, cz: 50, w: 30, d: 3, h: 4, color: shade(c, 0.65) },
    ];
  },
  island(c) {
    return [
      { cx: 0, cy: 0, cz: 0, w: 100, d: 60, h: 40, color: c },
      { cx: 0, cy: 0, cz: 40, w: 106, d: 66, h: 6, color: '#e8e4da' },
      { cx: -26, cy: 30, cz: 30, w: 16, d: 3, h: 4, color: shade(c, 0.6) },
      { cx: 26, cy: 30, cz: 30, w: 16, d: 3, h: 4, color: shade(c, 0.6) },
    ];
  },
  pantry(c) {
    return [
      { cx: 0, cy: 0, cz: 0, w: 50, d: 44, h: 130, color: c },
      { cx: 0, cy: 0, cz: 64, w: 50, d: 44, h: 3, color: shade(c, 0.8) },
      { cx: -8, cy: 22, cz: 84, w: 4, d: 4, h: 20, color: shade(c, 0.55) },
      { cx: -8, cy: 22, cz: 40, w: 4, d: 4, h: 20, color: shade(c, 0.55) },
    ];
  },
  microwave(c) {
    return [
      { cx: 0, cy: 0, cz: 0, w: 46, d: 34, h: 26, color: c },
      { cx: -6, cy: 17, cz: 4, w: 26, d: 3, h: 18, color: '#2a2940' },
      { cx: 16, cy: 17, cz: 4, w: 10, d: 3, h: 18, color: shade(c, 0.8) },
      { cx: 16, cy: 18, cz: 14, w: 5, d: 2, h: 5, color: '#7ed4f7' },
    ];
  },
  // ---- Bad ----
  mirror(c) {
    return [
      { cx: 0, cy: 0, cz: 0, w: 40, d: 10, h: 96, color: c },
      { cx: 0, cy: 5, cz: 6, w: 32, d: 3, h: 84, color: '#bfe3f0' },
    ];
  },
  towelrack(c) {
    return [
      { cx: -18, cy: 0, cz: 0, w: 5, d: 5, h: 70, color: c },
      { cx: 18, cy: 0, cz: 0, w: 5, d: 5, h: 70, color: c },
      { cx: 0, cy: 0, cz: 64, w: 41, d: 5, h: 5, color: c },
      { cx: 0, cy: 0, cz: 44, w: 36, d: 5, h: 5, color: shade(c, 0.85) },
      { cx: -8, cy: 5, cz: 24, w: 24, d: 3, h: 36, color: '#7ed4f7' },
    ];
  },
  shower(c) {
    return [
      { cx: 0, cy: 0, cz: 0, w: 56, d: 56, h: 8, color: shade(c, 0.92) },
      { cx: -26, cy: 0, cz: 8, w: 4, d: 56, h: 84, color: c },
      { cx: 0, cy: -26, cz: 8, w: 56, d: 4, h: 84, color: c },
      { cx: -22, cy: -22, cz: 8, w: 6, d: 6, h: 78, color: '#9aa3b5' },
      { cx: -6, cy: -6, cz: 78, w: 14, d: 14, h: 5, color: '#cfd3db' },
    ];
  },
  washingmachine(c) {
    return [
      { cx: 0, cy: 0, cz: 0, w: 48, d: 46, h: 80, color: c },
      { cx: 0, cy: 0, cz: 72, w: 48, d: 46, h: 8, color: shade(c, 0.82) },
      { cx: 0, cy: 23, cz: 28, w: 28, d: 3, h: 28, color: '#3a3340' },
      { cx: 0, cy: 24, cz: 34, w: 18, d: 2, h: 18, color: '#7ed4f7' },
    ];
  },
  bathcabinet(c) {
    return [
      { cx: 0, cy: 0, cz: 0, w: 44, d: 24, h: 54, color: c },
      { cx: 0, cy: 13, cz: 6, w: 36, d: 2, h: 42, color: '#bfe3f0' },
      { cx: 15, cy: 14, cz: 26, w: 3, d: 2, h: 8, color: shade(c, 0.6) },
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

// Akse-utstrekning + skjerm-boks for én kloss (etter rotasjon). `sx/sy` er den
// projiserte 2D-omsluttende boksen, brukt til å avgjøre om to klosser i det hele
// tatt overlapper på skjermen.
function extents(b) {
  const cx = b.cx ?? 0;
  const cy = b.cy ?? 0;
  const cz = b.cz ?? 0;
  const x0 = cx - b.w / 2, x1 = cx + b.w / 2;
  const y0 = cy - b.d / 2, y1 = cy + b.d / 2;
  const z0 = cz, z1 = cz + b.h;
  let sx0 = Infinity, sx1 = -Infinity, sy0 = Infinity, sy1 = -Infinity;
  for (const ox of [x0, x1])
    for (const oy of [y0, y1]) {
      const sx = ox * UX[0] + oy * UY[0];
      if (sx < sx0) sx0 = sx;
      if (sx > sx1) sx1 = sx;
      for (const oz of [z0, z1]) {
        const sy = ox * UX[1] + oy * UY[1] + oz * UZ_Y;
        if (sy < sy0) sy0 = sy;
        if (sy > sy1) sy1 = sy;
      }
    }
  return { x0, x1, y0, y1, z0, z1, cx, cy, cz, sx0, sx1, sy0, sy1 };
}

// Overlapper to klosser i det hele tatt på skjermen? Hvis ikke, spiller
// tegnerekkefølgen deres ingen rolle (og vi unngår falske avhengigheter som
// ellers kan lage sykler i sorteringen).
function screenOverlap(a, b) {
  return a.sx0 < b.sx1 && b.sx0 < a.sx1 && a.sy0 < b.sy1 && b.sy0 < a.sy1;
}

// Skal kloss A tegnes FØR B? Kameraet ser fra +x,+y,+z, så høyere koordinat er
// nærmere oss. Er klossene adskilt på en akse, bestemmer den rekkefølgen
// (maler-algoritmen: tegn det bakerste først). Overlapper de på alle tre akser
// — typisk en liten detalj (håndtak/luke/knott) som står i en stor flate — kan
// ikke senter-dybden (cx+cy+cz) brukes, for da løfter en høyt plassert detalj
// (stor cz) seg foran kroppen og «lyser gjennom» når møbelet snus bort. Da
// ordner vi i stedet etter horisontal dybde (cx+cy) slik at frontdetaljer
// havner foran og bakdetaljer skjules bak kroppen.
function drawnBefore(a, b) {
  if (a.x1 <= b.x0) return true;
  if (b.x1 <= a.x0) return false;
  if (a.y1 <= b.y0) return true;
  if (b.y1 <= a.y0) return false;
  if (a.z1 <= b.z0) return true;
  if (b.z1 <= a.z0) return false;
  const ha = a.cx + a.cy;
  const hb = b.cx + b.cy;
  if (ha !== hb) return ha < hb;
  return a.cz < b.cz;
}

// Topologisk sortering (Kahn) av klossene fra bakerst til forrest. Ved en
// eventuell syklus (skal ikke skje for ikke-gjennomtrengende klosser) beholdes
// opprinnelig rekkefølge.
function sortByDepth(boxes) {
  const ext = boxes.map(extents);
  const n = boxes.length;
  const after = Array.from({ length: n }, () => []);
  const indeg = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (!screenOverlap(ext[i], ext[j])) continue; // overlapper ikke → ingen kant
      const [first, second] = drawnBefore(ext[i], ext[j]) ? [i, j] : [j, i];
      after[first].push(second);
      indeg[second]++;
    }
  }
  const ready = [];
  for (let i = 0; i < n; i++) if (indeg[i] === 0) ready.push(i);
  const order = [];
  while (ready.length) {
    ready.sort((p, q) => p - q); // stabil tie-break på opprinnelig indeks
    const k = ready.shift();
    order.push(k);
    for (const m of after[k]) if (--indeg[m] === 0) ready.push(m);
  }
  if (order.length !== n) {
    // Syklus (sjelden — f.eks. en detalj klemt mellom kropp og en hylle/list):
    // fall tilbake på horisontal dybde (cx+cy), så høyde (cz). Det skjuler
    // bakdetaljer riktig; rene vertikale stabler havner aldri her (de er alltid
    // syklusfrie og sorteres topologisk over).
    return boxes
      .map((b, i) => ({ b, i }))
      .sort((p, q) =>
        (p.b.cx + p.b.cy) - (q.b.cx + q.b.cy) || (p.b.cz ?? 0) - (q.b.cz ?? 0) || p.i - q.i
      )
      .map((o) => o.b);
  }
  return order.map((i) => boxes[i]);
}

/**
 * Tegner en gjenstand isometrisk. Bruk `ISO` for plassering/anker.
 * @param {{ shape: string, color: string, rotation?: number }} props
 */
export default function IsoItem({ shape, color, rotation = 0 }) {
  const build = SHAPES[shape] ?? SHAPES.chair;
  let boxes = build(color || '#a06b49');
  if (rotation % 4 !== 0) {
    boxes = sortByDepth(boxes.map((b) => rotateBox(b, rotation)));
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
