// Alle kjøpbare gjenstander. `placement` gjelder møbler og dekor:
// surface 'floor' bruker gulvkoordinater (0–320, bakre hjørne øverst),
// 'wallLeft'/'wallRight' bruker veggkoordinater (x langs veggen, y fra toppen).

export const CATEGORIES = [
  { id: 'gulv', label: 'Gulv' },
  { id: 'tepper', label: 'Tepper' },
  { id: 'vegg', label: 'Vegger' },
  { id: 'vindu', label: 'Vindu' },
  { id: 'mobler', label: 'Møbler' },
  { id: 'dekor', label: 'Dekor' },
];

export const SHOP_ITEMS = [
  // Gulv
  { id: 'gulv-treplanker', category: 'gulv', name: 'Treplanker', price: 50 },
  { id: 'gulv-gress', category: 'gulv', name: 'Gressgulv', price: 80 },
  { id: 'gulv-fliser', category: 'gulv', name: 'Rutete fliser', price: 100 },
  { id: 'gulv-teppe', category: 'gulv', name: 'Mykt teppe', price: 120 },

  // Vegger
  { id: 'vegg-bla', category: 'vegg', name: 'Havblå vegg', price: 50 },
  { id: 'vegg-rosa', category: 'vegg', name: 'Rosa vegg', price: 50 },
  { id: 'vegg-striper', category: 'vegg', name: 'Stripete tapet', price: 100 },
  { id: 'vegg-stjernehimmel', category: 'vegg', name: 'Stjernehimmel', price: 150 },

  // Vindu (plasseres alltid på høyre vegg)
  { id: 'vindu-dag', category: 'vindu', name: 'Solskinnsvindu', price: 150 },
  { id: 'vindu-natt', category: 'vindu', name: 'Nattevindu', price: 200 },
  { id: 'vindu-solnedgang', category: 'vindu', name: 'Solnedgang', price: 250 },

  // Møbler — faste slots på gulvet
  {
    id: 'skrivebord',
    category: 'mobler',
    name: 'Skrivebord',
    price: 200,
    placement: { surface: 'floor', x: 110, y: 70, w: 110, h: 85 },
  },
  {
    id: 'bokhylle',
    category: 'mobler',
    name: 'Bokhylle',
    price: 220,
    placement: { surface: 'floor', x: 250, y: 60, w: 80, h: 120 },
  },
  {
    id: 'seng',
    category: 'mobler',
    name: 'Koseseng',
    price: 250,
    placement: { surface: 'floor', x: 75, y: 210, w: 130, h: 80 },
  },
  {
    id: 'sofa',
    category: 'mobler',
    name: 'Sofa',
    price: 300,
    placement: { surface: 'floor', x: 225, y: 235, w: 130, h: 85 },
  },

  // Dekor
  {
    id: 'plakat-rakett',
    category: 'dekor',
    name: 'Rakettplakat',
    price: 80,
    placement: { surface: 'wallRight', x: 210, y: 25, w: 70, h: 95 },
  },
  {
    id: 'plakat-stjerner',
    category: 'dekor',
    name: 'Stjerneplakat',
    price: 80,
    placement: { surface: 'wallLeft', x: 70, y: 35, w: 90, h: 70 },
  },
  {
    id: 'potte-kaktus',
    category: 'dekor',
    name: 'Kaktus',
    price: 60,
    placement: { surface: 'floor', x: 40, y: 295, w: 50, h: 85 },
  },
  {
    id: 'potte-monstera',
    category: 'dekor',
    name: 'Monstera',
    price: 90,
    placement: { surface: 'floor', x: 300, y: 135, w: 60, h: 90 },
  },
  {
    id: 'lampe',
    category: 'dekor',
    name: 'Koselampe',
    price: 120,
    placement: { surface: 'floor', x: 165, y: 150, w: 50, h: 110 },
  },
  {
    id: 'trofe',
    category: 'dekor',
    name: 'Diamanttrofé',
    price: 150,
    placement: { surface: 'floor', x: 290, y: 295, w: 50, h: 70 },
  },

  // Flere møbler og interiør (stoler i flere farger, spisestue, bad, kjøkken)
  { id: 'stol-tre', category: 'mobler', name: 'Trestol', price: 90, placement: { surface: 'floor', x: 95, y: 120, w: 34, h: 60 } },
  { id: 'stol-rod', category: 'mobler', name: 'Rød stol', price: 90, placement: { surface: 'floor', x: 130, y: 120, w: 34, h: 60 } },
  { id: 'stol-bla', category: 'mobler', name: 'Blå stol', price: 90, placement: { surface: 'floor', x: 95, y: 160, w: 34, h: 60 } },
  { id: 'spisebord', category: 'mobler', name: 'Spisebord', price: 220, placement: { surface: 'floor', x: 160, y: 165, w: 112, h: 80 } },
  { id: 'vask', category: 'mobler', name: 'Vask', price: 160, placement: { surface: 'floor', x: 60, y: 240, w: 52, h: 70 } },
  { id: 'do', category: 'mobler', name: 'Do', price: 150, placement: { surface: 'floor', x: 285, y: 115, w: 36, h: 70 } },
  { id: 'badekar', category: 'mobler', name: 'Badekar', price: 240, placement: { surface: 'floor', x: 235, y: 255, w: 102, h: 70 } },
  { id: 'kjoleskap', category: 'mobler', name: 'Kjøleskap', price: 260, placement: { surface: 'floor', x: 285, y: 70, w: 46, h: 130 } },
  { id: 'kjokkenbenk', category: 'mobler', name: 'Kjøkkenbenk', price: 240, placement: { surface: 'floor', x: 120, y: 58, w: 94, h: 70 } },

  // Enda flere møbler — stue, soverom, kjøkken og litt gøy
  { id: 'tv', category: 'mobler', name: 'TV-benk', price: 200, placement: { surface: 'floor', x: 250, y: 90, w: 90, h: 70 } },
  { id: 'kommode', category: 'mobler', name: 'Kommode', price: 180, placement: { surface: 'floor', x: 70, y: 90, w: 70, h: 60 } },
  { id: 'nattbord', category: 'mobler', name: 'Nattbord', price: 90, placement: { surface: 'floor', x: 60, y: 150, w: 32, h: 50 } },
  { id: 'lenestol-gronn', category: 'mobler', name: 'Grønn lenestol', price: 180, placement: { surface: 'floor', x: 110, y: 240, w: 56, h: 60 } },
  { id: 'lenestol-rod', category: 'mobler', name: 'Rød lenestol', price: 180, placement: { surface: 'floor', x: 200, y: 240, w: 56, h: 60 } },
  { id: 'klesskap', category: 'mobler', name: 'Klesskap', price: 260, placement: { surface: 'floor', x: 285, y: 60, w: 56, h: 130 } },
  { id: 'komfyr', category: 'mobler', name: 'Komfyr', price: 240, placement: { surface: 'floor', x: 120, y: 60, w: 50, h: 70 } },
  { id: 'sofabord', category: 'mobler', name: 'Sofabord', price: 140, placement: { surface: 'floor', x: 175, y: 185, w: 84, h: 60 } },
  { id: 'peis', category: 'mobler', name: 'Peis', price: 220, placement: { surface: 'floor', x: 160, y: 52, w: 78, h: 80 } },
  { id: 'akvarium', category: 'mobler', name: 'Akvarium', price: 200, placement: { surface: 'floor', x: 250, y: 150, w: 60, h: 70 } },
  { id: 'pall-gul', category: 'mobler', name: 'Gul krakk', price: 60, placement: { surface: 'floor', x: 90, y: 190, w: 28, h: 40 } },
  { id: 'pall-gronn', category: 'mobler', name: 'Grønn krakk', price: 60, placement: { surface: 'floor', x: 130, y: 205, w: 28, h: 40 } },

  // Tepper — flate områdetepper som legges oppå gulvet (kan dras og snurres).
  // `kind: 'rug'` skiller dem fra de stående møblene i rom-tegningen.
  {
    id: 'teppe-rod',
    category: 'tepper',
    name: 'Rødt teppe',
    price: 90,
    kind: 'rug',
    placement: { surface: 'floor', x: 150, y: 200, w: 96, h: 70 },
  },
  {
    id: 'teppe-stripe',
    category: 'tepper',
    name: 'Stripeteppe',
    price: 110,
    kind: 'rug',
    placement: { surface: 'floor', x: 150, y: 200, w: 104, h: 72 },
  },
  {
    id: 'teppe-gronn',
    category: 'tepper',
    name: 'Grønt teppe',
    price: 110,
    kind: 'rug',
    placement: { surface: 'floor', x: 150, y: 200, w: 92, h: 68 },
  },
  {
    id: 'teppe-stjerne',
    category: 'tepper',
    name: 'Stjerneteppe',
    price: 150,
    kind: 'rug',
    placement: { surface: 'floor', x: 150, y: 200, w: 100, h: 74 },
  },
];

/**
 * @param {string} id
 * @returns {object|undefined}
 */
export function getItem(id) {
  return SHOP_ITEMS.find((item) => item.id === id);
}

/**
 * Hvilket rom-felt en kategori styrer (kun for engangsvalg).
 * @param {string} category
 * @returns {'floor'|'wallpaper'|'window'|null}
 */
export function roomFieldFor(category) {
  if (category === 'gulv') return 'floor';
  if (category === 'vegg') return 'wallpaper';
  if (category === 'vindu') return 'window';
  return null;
}
