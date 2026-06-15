// All lesing og skriving til localStorage skjer her — ingen komponenter
// kaller localStorage direkte.

import { legacyVariant, resolveVariant } from './data/furniture.js';

const STORAGE_KEY = 'matteverdener_v1';

export const MAX_PROFILES = 5;

// Pris for å kjøpe rom nummer N (1-indeksert). Første rom er gratis; deretter
// stiger prisen. `null` = ikke flere rom å kjøpe.
export const ROOM_PRICES = [0, 300, 600, 1000, 1500];
export const MAX_ROOMS = ROOM_PRICES.length;

function defaultState() {
  return { profiles: [], activeProfileId: null, settings: { soundOn: true } };
}

function makeId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
}

function emptyRoom(name) {
  return { id: makeId(), name, floor: null, wallpaper: null, window: null, placed: [] };
}

// Gjør om et eldre rom (furniture[]/decorations[]/positions{}) til nye
// `placed`-instanser med variant-id-er.
function migrateRoom(room) {
  if (Array.isArray(room.placed)) return room;
  const positions = room.positions ?? {};
  const placed = [];
  for (const oldId of [...(room.furniture ?? []), ...(room.decorations ?? [])]) {
    const v = legacyVariant(oldId);
    if (!v) continue;
    const pos = positions[oldId] ?? {};
    placed.push({
      iid: makeId(),
      v,
      x: pos.x ?? 150,
      y: pos.y ?? 200,
      r: pos.r ?? 0,
    });
  }
  const { furniture, decorations, positions: _p, ...rest } = room;
  return { ...rest, placed };
}

/**
 * Pris for å kjøpe det neste rommet gitt hvor mange rom profilen alt har.
 * @param {number} roomCount
 * @returns {number|null} pris i diamanter, eller null hvis maks er nådd
 */
export function nextRoomPrice(roomCount) {
  return roomCount < MAX_ROOMS ? ROOM_PRICES[roomCount] : null;
}

/**
 * Migrerer en profil til gjeldende datamodell. Eldre profiler hadde ett enkelt
 * `room`-objekt; nå har de en `rooms`-liste med et aktivt rom.
 * @param {object} profile
 * @returns {object} migrert profil
 */
function migrateProfile(profile) {
  // owned: gamle item-id-er → nye variant-id-er.
  const owned = [...new Set((profile.owned ?? []).map(legacyVariant).filter(Boolean))];

  // Det skjulte nivået er nå per verden. Eldre profiler hadde ett felles
  // `adaptiveLevel` — vi sår alle 7 verdenene fra det, så ingen mister fremgang.
  const worldLevels =
    profile.worldLevels && typeof profile.worldLevels === 'object'
      ? profile.worldLevels
      : Object.fromEntries(Array.from({ length: 7 }, (_, i) => [i + 1, profile.adaptiveLevel ?? 1]));

  if (Array.isArray(profile.rooms) && profile.rooms.length > 0) {
    const rooms = profile.rooms.map(migrateRoom);
    const activeRoomId = rooms.some((r) => r.id === profile.activeRoomId)
      ? profile.activeRoomId
      : rooms[0].id;
    return { ...profile, owned, worldLevels, rooms, activeRoomId };
  }
  const base = { ...emptyRoom('Rommet mitt'), ...(profile.room ?? {}) };
  if (!base.id) base.id = makeId();
  if (!base.name) base.name = 'Rommet mitt';
  const first = migrateRoom(base);
  const { room, ...rest } = profile;
  return { ...rest, owned, worldLevels, rooms: [first], activeRoomId: first.id };
}

/**
 * Leser tilstand fra localStorage. Returnerer alltid et gyldig objekt,
 * også når lagringen er tom, korrupt eller utilgjengelig.
 * @returns {object}
 */
export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.profiles)) return defaultState();
    return {
      ...defaultState(),
      ...parsed,
      settings: { ...defaultState().settings, ...(parsed.settings ?? {}) },
      profiles: parsed.profiles.map(migrateProfile),
    };
  } catch {
    return defaultState();
  }
}

/**
 * Lagrer tilstand til localStorage.
 * @param {object} state
 * @returns {boolean} false hvis lagring feilet (privat modus, full disk).
 */
export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

/**
 * @param {object} state
 * @returns {object|null} Den aktive profilen, eller null.
 */
export function getActiveProfile(state) {
  return state.profiles.find((p) => p.id === state.activeProfileId) ?? null;
}

/**
 * Oppretter en ny profil og gjør den aktiv. Maks 5 profiler.
 * @param {object} state
 * @param {string} name
 * @param {string} avatar - emoji
 * @returns {object} ny tilstand
 */
export function createProfile(state, name, avatar) {
  if (state.profiles.length >= MAX_PROFILES) return state;
  const firstRoom = emptyRoom('Rommet mitt');
  const profile = {
    id: makeId(),
    name: name.trim(),
    avatar,
    createdAt: new Date().toISOString(),
    diamonds: 0,
    worldLevels: {},
    rooms: [firstRoom],
    activeRoomId: firstRoom.id,
    owned: [],
    worldProgress: {},
  };
  return {
    ...state,
    profiles: [...state.profiles, profile],
    activeProfileId: profile.id,
  };
}

/**
 * @param {object} state
 * @param {string} profileId
 * @returns {object} ny tilstand
 */
export function deleteProfile(state, profileId) {
  return {
    ...state,
    profiles: state.profiles.filter((p) => p.id !== profileId),
    activeProfileId: state.activeProfileId === profileId ? null : state.activeProfileId,
  };
}

/**
 * @param {object} state
 * @param {string} profileId
 * @returns {object} ny tilstand
 */
export function setActiveProfile(state, profileId) {
  return { ...state, activeProfileId: profileId };
}

/**
 * Oppdaterer felter på en profil.
 * @param {object} state
 * @param {string} profileId
 * @param {object} updates - felter som skrives over på profilen
 * @returns {object} ny tilstand
 */
export function updateProfile(state, profileId, updates) {
  return {
    ...state,
    profiles: state.profiles.map((p) => (p.id === profileId ? { ...p, ...updates } : p)),
  };
}

/**
 * Det skjulte adaptive nivået for én verden (default 1). Lagres per verden i
 * `profile.worldLevels[worldId]`.
 * @param {object} profile
 * @param {number} worldId
 * @returns {number} nivå 1–10
 */
export function getWorldLevel(profile, worldId) {
  return profile?.worldLevels?.[worldId] ?? 1;
}

/** @param {object} state @returns {boolean} om lyd er på (default: på) */
export function getSoundOn(state) {
  return state.settings?.soundOn ?? true;
}

/** @param {object} state @param {boolean} on @returns {object} ny tilstand */
export function setSoundOn(state, on) {
  return { ...state, settings: { ...(state.settings ?? {}), soundOn: on } };
}

/**
 * @param {object} profile
 * @returns {object} det aktive rommet (faller tilbake til første rom)
 */
export function getActiveRoom(profile) {
  return profile.rooms.find((r) => r.id === profile.activeRoomId) ?? profile.rooms[0];
}

/**
 * Bygger en ny rooms-liste der ett rom er erstattet.
 * @param {object} profile
 * @param {string} roomId
 * @param {object} newRoom - det nye rom-objektet (erstatter hele rommet)
 * @returns {object[]} ny rooms-liste
 */
export function replaceRoom(profile, roomId, newRoom) {
  return profile.rooms.map((r) => (r.id === roomId ? newRoom : r));
}

/**
 * Lager et nytt tomt rom og oppdateringer som legger det til og gjør det aktivt.
 * Trekker ikke fra diamanter — det gjør kalleren.
 * @param {object} profile
 * @returns {{ rooms: object[], activeRoomId: string }}
 */
export function buildAddedRoom(profile) {
  const room = emptyRoom(`Rom ${profile.rooms.length + 1}`);
  return { rooms: [...profile.rooms, room], activeRoomId: room.id };
}

// ---- Plasserte instanser (placed[]) ----

export function getPlaced(room) {
  return room.placed ?? [];
}

/** Antall instanser av en variant i rommet. */
export function countPlaced(room, variant) {
  return getPlaced(room).filter((it) => it.v === variant).length;
}

/** Standard startposisjon for en ny instans (litt forskjøvet etter antall). */
function defaultSpot(room, variant) {
  const n = countPlaced(room, variant);
  return { x: 150 + ((n * 18) % 90) - 36, y: 200 + ((n * 14) % 70) - 28, r: 0 };
}

/** Legg til én instans av en variant; returnerer nytt rom. */
export function addPlaced(room, variant) {
  const spot = defaultSpot(room, variant);
  return { ...room, placed: [...getPlaced(room), { iid: makeId(), v: variant, ...spot }] };
}

/** Fjern den sist plasserte instansen av en variant; returnerer nytt rom. */
export function removeOnePlaced(room, variant) {
  const list = getPlaced(room);
  for (let i = list.length - 1; i >= 0; i--) {
    if (list[i].v === variant) {
      return { ...room, placed: [...list.slice(0, i), ...list.slice(i + 1)] };
    }
  }
  return room;
}

/** Oppdater posisjon/rotasjon for én instans (etter iid). */
export function updatePlaced(room, iid, patch) {
  return { ...room, placed: getPlaced(room).map((it) => (it.iid === iid ? { ...it, ...patch } : it)) };
}

/** Slå opp variant → { type, color }; eksponert for komponenter. */
export { resolveVariant };
