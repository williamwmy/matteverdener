// Dispatcher for oppgavegenerering. Hver verden har sin egen fil under
// worlds/ med en `pools`-tabell (nivå 1–10 → liste av oppgavegeneratorer).
// Delte verktøy ligger i questionHelpers.js.

import { pick } from './questionHelpers.js';
import { pools as tallskogen } from './worlds/tallskogen.js';
import { pools as kystbyen } from './worlds/kystbyen.js';
import { pools as skogshemmeligheten } from './worlds/skogshemmeligheten.js';
import { pools as verdensrommet } from './worlds/verdensrommet.js';
import { pools as dyphavet } from './worlds/dyphavet.js';
import { pools as middelalderborgen } from './worlds/middelalderborgen.js';
import { pools as fremtidensby } from './worlds/fremtidensby.js';

const WORLD_POOLS = {
  1: tallskogen,
  2: kystbyen,
  3: skogshemmeligheten,
  4: verdensrommet,
  5: dyphavet,
  6: middelalderborgen,
  7: fremtidensby,
};

// Andel oppgaver som hentes fra nivået over — gir litt motstand i hver økt.
const NEXT_LEVEL_RATIO = 0.25;

/**
 * Genererer en oppgave tilpasset verden og nivå.
 * @param {number} worldId - 1–7
 * @param {number} level - Adaptivt nivå 1–10
 * @returns {{ prompt: string, expression: string|null, visual: object|null, choiceType: string, choices: (number|string)[], correct: number|string, explanation: object }}
 */
export function generateQuestion(worldId, level) {
  const pools = WORLD_POOLS[worldId] ?? tallskogen;
  let lvl = Math.min(Math.max(Math.round(level), 1), 10);
  if (lvl < 10 && Math.random() < NEXT_LEVEL_RATIO) lvl += 1;
  return pick(pools[lvl])();
}
