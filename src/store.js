// All lesing og skriving til localStorage skjer her — ingen komponenter
// kaller localStorage direkte.

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
  return { id: makeId(), name, floor: null, wallpaper: null, window: null, furniture: [], decorations: [] };
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
  if (Array.isArray(profile.rooms) && profile.rooms.length > 0) {
    const activeRoomId = profile.rooms.some((r) => r.id === profile.activeRoomId)
      ? profile.activeRoomId
      : profile.rooms[0].id;
    return { ...profile, activeRoomId };
  }
  const first = { ...emptyRoom('Rommet mitt'), ...(profile.room ?? {}) };
  if (!first.id) first.id = makeId();
  if (!first.name) first.name = 'Rommet mitt';
  const { room, ...rest } = profile;
  return { ...rest, rooms: [first], activeRoomId: first.id };
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
    adaptiveLevel: 1,
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
