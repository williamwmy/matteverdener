// Møbelkatalog: hver TYPE (stol, sofa, …) har en form (`shape`) og en liste
// med fargevarianter. En «variant» identifiseres med `type:farge`
// (f.eks. "stol:rod"). Profilen eier varianter (`owned`), og hvert rom har en
// liste med plasserte instanser (`room.placed`), så man kan ha flere av samme.
//
// Singletoner (gulv/vegg/vindu) ligger fortsatt i shopItems.js.

const C = {
  tre: { id: 'tre', name: 'Lyst tre', value: '#a06b49' },
  morktre: { id: 'morktre', name: 'Mørkt tre', value: '#6f4730' },
  hvit: { id: 'hvit', name: 'Hvit', value: '#e3ddd0' },
  gra: { id: 'gra', name: 'Grå', value: '#9aa0ac' },
  lilla: { id: 'lilla', name: 'Lilla', value: '#b07ef7' },
  bla: { id: 'bla', name: 'Blå', value: '#5b8ad6' },
  gronn: { id: 'gronn', name: 'Grønn', value: '#4ecb71' },
  rod: { id: 'rod', name: 'Rød', value: '#e05252' },
  gul: { id: 'gul', name: 'Gul', value: '#f9c846' },
  rosa: { id: 'rosa', name: 'Rosa', value: '#f29bc6' },
  stal: { id: 'stal', name: 'Stål', value: '#cfd3db' },
  svart: { id: 'svart', name: 'Svart', value: '#3a3340' },
  gull: { id: 'gull', name: 'Gull', value: '#f9c846' },
  solv: { id: 'solv', name: 'Sølv', value: '#cfd3db' },
  bronse: { id: 'bronse', name: 'Bronse', value: '#cd7f32' },
  mur: { id: 'mur', name: 'Murstein', value: '#b5563f' },
};
const p = (...keys) => keys.map((k) => C[k]);

// Hver type: key, navn, kategori, form, kind (furniture/rug/wall), surface,
// pris, footprint {w,h} (for skygge/grenser) og fargeliste.
export const TYPES = [
  // ---- Møbler ----
  { key: 'stol', name: 'Stol', category: 'mobler', shape: 'chair', kind: 'furniture', surface: 'floor', price: 90, footprint: { w: 34, h: 34 }, colors: p('tre', 'hvit', 'rod', 'bla', 'gronn', 'gul') },
  { key: 'pall', name: 'Krakk', category: 'mobler', shape: 'stool', kind: 'furniture', surface: 'floor', price: 60, footprint: { w: 28, h: 28 }, colors: p('gul', 'gronn', 'rod', 'bla', 'lilla', 'rosa') },
  { key: 'lenestol', name: 'Lenestol', category: 'mobler', shape: 'armchair', kind: 'furniture', surface: 'floor', price: 180, footprint: { w: 56, h: 54 }, colors: p('gronn', 'rod', 'bla', 'lilla', 'gul', 'gra') },
  { key: 'sofa', name: 'Sofa', category: 'mobler', shape: 'sofa', kind: 'furniture', surface: 'floor', price: 300, footprint: { w: 122, h: 60 }, colors: p('lilla', 'bla', 'gronn', 'rod', 'gul', 'rosa', 'gra') },
  { key: 'seng', name: 'Seng', category: 'mobler', shape: 'bed', kind: 'furniture', surface: 'floor', price: 250, footprint: { w: 122, h: 70 }, colors: p('bla', 'rosa', 'gronn', 'lilla', 'gul', 'gra') },
  { key: 'spisebord', name: 'Spisebord', category: 'mobler', shape: 'table', kind: 'furniture', surface: 'floor', price: 220, footprint: { w: 112, h: 66 }, colors: p('tre', 'morktre', 'hvit', 'gra') },
  { key: 'sofabord', name: 'Sofabord', category: 'mobler', shape: 'coffeetable', kind: 'furniture', surface: 'floor', price: 140, footprint: { w: 84, h: 50 }, colors: p('tre', 'morktre', 'hvit') },
  { key: 'skrivebord', name: 'Skrivebord', category: 'mobler', shape: 'desk', kind: 'furniture', surface: 'floor', price: 200, footprint: { w: 96, h: 46 }, colors: p('tre', 'hvit', 'gra') },
  { key: 'bokhylle', name: 'Bokhylle', category: 'mobler', shape: 'bookshelf', kind: 'furniture', surface: 'floor', price: 220, footprint: { w: 46, h: 28 }, colors: p('tre', 'morktre', 'hvit') },
  { key: 'kommode', name: 'Kommode', category: 'mobler', shape: 'dresser', kind: 'furniture', surface: 'floor', price: 180, footprint: { w: 70, h: 40 }, colors: p('tre', 'hvit', 'bla') },
  { key: 'nattbord', name: 'Nattbord', category: 'mobler', shape: 'nightstand', kind: 'furniture', surface: 'floor', price: 90, footprint: { w: 32, h: 30 }, colors: p('tre', 'hvit', 'bla') },
  { key: 'klesskap', name: 'Klesskap', category: 'mobler', shape: 'wardrobe', kind: 'furniture', surface: 'floor', price: 260, footprint: { w: 56, h: 40 }, colors: p('tre', 'morktre', 'hvit', 'bla') },
  { key: 'tv', name: 'TV-benk', category: 'mobler', shape: 'tv', kind: 'furniture', surface: 'floor', price: 200, footprint: { w: 90, h: 40 }, colors: p('svart', 'hvit', 'tre') },
  { key: 'kjoleskap', name: 'Kjøleskap', category: 'mobler', shape: 'fridge', kind: 'furniture', surface: 'floor', price: 260, footprint: { w: 44, h: 40 }, colors: p('stal', 'hvit', 'rod', 'bla') },
  { key: 'komfyr', name: 'Komfyr', category: 'mobler', shape: 'stove', kind: 'furniture', surface: 'floor', price: 240, footprint: { w: 50, h: 42 }, colors: p('stal', 'hvit', 'svart') },
  { key: 'kjokkenbenk', name: 'Kjøkkenbenk', category: 'mobler', shape: 'counter', kind: 'furniture', surface: 'floor', price: 240, footprint: { w: 90, h: 44 }, colors: p('tre', 'hvit', 'gra') },
  { key: 'vask', name: 'Vask', category: 'mobler', shape: 'sink', kind: 'furniture', surface: 'floor', price: 160, footprint: { w: 50, h: 40 }, colors: p('hvit', 'bla', 'gra') },
  { key: 'do', name: 'Do', category: 'mobler', shape: 'toilet', kind: 'furniture', surface: 'floor', price: 150, footprint: { w: 34, h: 46 }, colors: p('hvit', 'bla', 'rosa') },
  { key: 'badekar', name: 'Badekar', category: 'mobler', shape: 'bathtub', kind: 'furniture', surface: 'floor', price: 240, footprint: { w: 100, h: 52 }, colors: p('hvit', 'bla', 'rosa') },
  { key: 'peis', name: 'Peis', category: 'mobler', shape: 'fireplace', kind: 'furniture', surface: 'floor', price: 220, footprint: { w: 70, h: 30 }, colors: p('gra', 'hvit', 'mur') },
  { key: 'akvarium', name: 'Akvarium', category: 'mobler', shape: 'aquarium', kind: 'furniture', surface: 'floor', price: 200, footprint: { w: 60, h: 34 }, colors: p('tre', 'morktre', 'hvit') },

  // ---- Dekor ----
  { key: 'lampe', name: 'Lampe', category: 'dekor', shape: 'lamp', kind: 'furniture', surface: 'floor', price: 120, footprint: { w: 44, h: 44 }, colors: p('gul', 'bla', 'rosa', 'hvit', 'gronn') },
  { key: 'trofe', name: 'Trofé', category: 'dekor', shape: 'trophy', kind: 'furniture', surface: 'floor', price: 150, footprint: { w: 32, h: 26 }, colors: p('gull', 'solv', 'bronse') },
  { key: 'kaktus', name: 'Kaktus', category: 'dekor', shape: 'cactus', kind: 'furniture', surface: 'floor', price: 60, footprint: { w: 28, h: 28 }, colors: p('gronn') },
  { key: 'monstera', name: 'Monstera', category: 'dekor', shape: 'monstera', kind: 'furniture', surface: 'floor', price: 90, footprint: { w: 32, h: 32 }, colors: p('gronn') },
  { key: 'plakatrakett', name: 'Rakettplakat', category: 'dekor', shape: 'posterRocket', kind: 'wall', surface: 'wallRight', price: 80, footprint: { w: 70, h: 95 }, colors: p('lilla'), art: 'plakat-rakett' },
  { key: 'plakatstjerner', name: 'Stjerneplakat', category: 'dekor', shape: 'posterStars', kind: 'wall', surface: 'wallLeft', price: 80, footprint: { w: 90, h: 70 }, colors: p('lilla'), art: 'plakat-stjerner' },

  // ---- Tepper (flate) ----
  { key: 'teppe', name: 'Teppe', category: 'tepper', shape: 'rug', motif: null, kind: 'rug', surface: 'floor', price: 90, footprint: { w: 96, h: 70 }, colors: p('rod', 'bla', 'gronn', 'lilla', 'gul', 'gra') },
  { key: 'stripeteppe', name: 'Stripeteppe', category: 'tepper', shape: 'rug', motif: 'stripes', kind: 'rug', surface: 'floor', price: 110, footprint: { w: 104, h: 72 }, colors: p('bla', 'rod', 'gronn', 'lilla') },
  { key: 'stjerneteppe', name: 'Stjerneteppe', category: 'tepper', shape: 'rug', motif: 'star', kind: 'rug', surface: 'floor', price: 150, footprint: { w: 100, h: 74 }, colors: p('lilla', 'bla', 'rod', 'gronn') },
];

const TYPE_BY_KEY = Object.fromEntries(TYPES.map((t) => [t.key, t]));

/** @param {string} key @returns {object|undefined} */
export function getType(key) {
  return TYPE_BY_KEY[key];
}

/** Bygg variant-id «type:farge». */
export function variantId(typeKey, colorId) {
  return `${typeKey}:${colorId}`;
}

/**
 * Slå opp en variant.
 * @param {string} variant - «type:farge»
 * @returns {{ type: object, color: object }|null}
 */
export function resolveVariant(variant) {
  if (!variant) return null;
  const [key, colorId] = variant.split(':');
  const type = TYPE_BY_KEY[key];
  if (!type) return null;
  const color = type.colors.find((c) => c.id === colorId) ?? type.colors[0];
  return { type, color };
}

// Gamle (flate) id-er → nye variant-id-er, for migrering av lagrede profiler.
const LEGACY = {
  'stol-tre': 'stol:tre', 'stol-rod': 'stol:rod', 'stol-bla': 'stol:bla',
  'lenestol-gronn': 'lenestol:gronn', 'lenestol-rod': 'lenestol:rod',
  'pall-gul': 'pall:gul', 'pall-gronn': 'pall:gronn',
  skrivebord: 'skrivebord:tre', bokhylle: 'bokhylle:tre', seng: 'seng:bla', sofa: 'sofa:lilla',
  spisebord: 'spisebord:tre', vask: 'vask:hvit', do: 'do:hvit', badekar: 'badekar:hvit',
  kjoleskap: 'kjoleskap:stal', kjokkenbenk: 'kjokkenbenk:tre', tv: 'tv:svart', kommode: 'kommode:tre',
  nattbord: 'nattbord:tre', klesskap: 'klesskap:tre', komfyr: 'komfyr:stal', sofabord: 'sofabord:tre',
  peis: 'peis:gra', akvarium: 'akvarium:tre',
  lampe: 'lampe:gul', trofe: 'trofe:gull', 'potte-kaktus': 'kaktus:gronn', 'potte-monstera': 'monstera:gronn',
  'plakat-rakett': 'plakatrakett:lilla', 'plakat-stjerner': 'plakatstjerner:lilla',
  'teppe-rod': 'teppe:rod', 'teppe-gronn': 'teppe:gronn', 'teppe-stripe': 'stripeteppe:bla', 'teppe-stjerne': 'stjerneteppe:lilla',
};

/** Oversett en gammel item-id til ny variant-id (eller behold hvis allerede ny). */
export function legacyVariant(oldId) {
  if (!oldId) return null;
  if (oldId.includes(':')) return resolveVariant(oldId) ? oldId : null;
  // Singletoner (gulv/vegg/vindu) beholdes uendret.
  if (/^(gulv|vegg|vindu)-/.test(oldId)) return oldId;
  return LEGACY[oldId] ?? null;
}
