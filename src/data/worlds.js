// Verdensdefinisjon og metadata. Alle 7 verdener er åpne og har egne
// oppgavefiler under worlds/. `theme` styrer bakgrunn og emoji-stripe i
// spilløkten (se GameSession + GameSession.module.css), `strip` er pynt.

export const SESSION_LENGTH = 8;

export const WORLDS = [
  {
    id: 1,
    name: 'Tallskogen',
    grades: '1.–2. trinn',
    emoji: '🌲',
    description: 'Telling, nomer, tallinja og pluss og minus',
    color: '#4ecb71',
    theme: 'forest',
    strip: '🌲🌳🍄🌿🦊🌲🐿️🌳🍄🌲',
  },
  {
    id: 2,
    name: 'Kystbyen',
    grades: '2.–3. trinn',
    emoji: '⛵',
    description: 'Ganging, deling og enkle brøker',
    color: '#7ed4f7',
    theme: 'coast',
    strip: '🌊⛵🐟🦀🏖️🐚🌊⛵🐟🌊',
  },
  {
    id: 3,
    name: 'Skogshemmeligheten',
    grades: '3.–4. trinn',
    emoji: '🍄',
    description: 'Brøk, desimaltall og mønster',
    color: '#b07ef7',
    theme: 'mystery',
    strip: '🌙🍄🦉🌿🔮🍄🦔🌙🕸️🍄',
  },
  {
    id: 4,
    name: 'Verdensrommet',
    grades: '4.–5. trinn',
    emoji: '🚀',
    description: 'Store tall, negative tall og koordinater',
    color: '#f97ec3',
    theme: 'space',
    strip: '🚀🪐⭐🌍🛰️✨🌟👽🚀⭐',
  },
  {
    id: 5,
    name: 'Dyphavet',
    grades: '5.–6. trinn',
    emoji: '🐙',
    description: 'Prosent, statistikk og sannsynlighet',
    color: '#4e9ecb',
    theme: 'deepsea',
    strip: '🌊🐙🐠🫧🦈🐡🪸🐟🫧🌊',
  },
  {
    id: 6,
    name: 'Middelalderborgen',
    grades: '6.–7. trinn',
    emoji: '🏰',
    description: 'Algebra, likninger og geometri',
    color: '#cb9b4e',
    theme: 'castle',
    strip: '🏰⚔️🐉🛡️👑🏰🗝️⚔️🐉🏰',
  },
  {
    id: 7,
    name: 'Fremtidens by',
    grades: '7. trinn',
    emoji: '🌆',
    description: 'Avansert algebra og funksjoner',
    color: '#e05252',
    theme: 'future',
    strip: '🌆🤖🛸💡🚝🌃🛰️🤖🌆💡',
  },
];

/**
 * @param {number} id
 * @returns {object|undefined}
 */
export function getWorld(id) {
  return WORLDS.find((w) => w.id === id);
}

// ---- Progresjon og opplåsing ----
// Synlig progresjon i en verden måles i antall riktige svar (samlet). Man
// tjener stjerner ved milepælene under, og neste verden låses opp når man har
// tjent den første stjernen i forrige verden.

export const STAR_STEPS = [12, 30, 50];
export const UNLOCK_CORRECT = STAR_STEPS[0];
export const WORLD_GOAL = STAR_STEPS[STAR_STEPS.length - 1];

/** Antall riktige svar samlet i en verden. */
export function worldCorrect(profile, worldId) {
  return profile?.worldProgress?.[worldId]?.totalCorrect ?? 0;
}

/** Antall opptjente stjerner (0–3) i en verden. */
export function worldStars(profile, worldId) {
  const c = worldCorrect(profile, worldId);
  return STAR_STEPS.filter((step) => c >= step).length;
}

/** Er verdenen åpen? Verden 1 er alltid åpen; ellers kreves en stjerne i forrige. */
export function isWorldUnlocked(profile, worldId) {
  if (worldId <= 1) return true;
  return worldCorrect(profile, worldId - 1) >= UNLOCK_CORRECT;
}
