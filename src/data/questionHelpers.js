// Delte verktøy for oppgavegenerering. Brukes av alle verdensfilene i
// src/data/worlds/. Holder ingen verdensspesifikk logikk.

export const CHOICE_COUNT = 4;

export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pick(arr) {
  return arr[randInt(0, arr.length - 1)];
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Lager 4 tallsvar: riktig svar + plausible distraktører i nærheten.
 * @param {number} correct
 * @param {{ min?: number, max?: number, spread?: number }} opts
 * @returns {number[]}
 */
export function makeChoices(correct, { min = 0, max = Number.MAX_SAFE_INTEGER, spread = 3 } = {}) {
  const choices = new Set([correct]);
  let guard = 0;
  while (choices.size < CHOICE_COUNT && guard < 300) {
    guard++;
    const offset = randInt(1, spread) * (Math.random() < 0.5 ? -1 : 1);
    const candidate = correct + offset;
    if (candidate >= min && candidate <= max) choices.add(candidate);
  }
  // Nødutvei hvis spredningen ikke ga nok unike alternativer.
  let filler = min;
  while (choices.size < CHOICE_COUNT) {
    choices.add(filler);
    filler++;
  }
  return shuffle([...choices]);
}

/**
 * Bygger 4 svaralternativer fra en eksplisitt distraktørliste (tall eller
 * tekst, f.eks. brøker). Tar distraktører i rekkefølge til vi har nok unike.
 * @param {number|string} correct
 * @param {(number|string)[]} distractors - kandidater i prioritert rekkefølge
 * @returns {(number|string)[]}
 */
export function choicesFrom(correct, distractors) {
  const set = new Set([correct]);
  for (const d of distractors) {
    if (set.size >= CHOICE_COUNT) break;
    if (d !== correct && d !== undefined && d !== null) set.add(d);
  }
  if (set.size < CHOICE_COUNT) {
    throw new Error('choicesFrom: for få distraktører for ' + correct);
  }
  return shuffle([...set]);
}

/**
 * Lager minst 3 unike, plausible brøk-distraktører (som tekst) til en gitt
 * brøk. Padder med varierende nevner slik at vi alltid har nok.
 * @param {number} num
 * @param {number} denom
 * @returns {string[]}
 */
export function brokDistraktorer(num, denom) {
  const correct = `${num}/${denom}`;
  const seen = new Set([correct]);
  const out = [];
  const candidates = [
    `${num + 1}/${denom}`,
    `${denom - num}/${denom}`,
    `${num}/${denom + 1}`,
    `${num + 1}/${denom + 1}`,
    `${num}/${denom + 2}`,
    `${num + 2}/${denom}`,
    `${Math.max(1, num - 1)}/${denom}`,
  ];
  for (let k = 3; k <= 8; k++) candidates.push(`${num}/${denom + k}`);
  for (const c of candidates) {
    if (!seen.has(c)) {
      seen.add(c);
      out.push(c);
    }
  }
  return out;
}

/** Standardform med fornuftige defaults. */
export function question(fields) {
  return { expression: null, visual: null, choiceType: 'number', ...fields };
}

export function basicQuestion(expression, correct, opts) {
  return question({
    prompt: 'Regn ut:',
    expression,
    choices: makeChoices(correct, { min: 0, ...opts }),
    correct,
    explanation: { text: `${expression} = ${correct}`, visual: null },
  });
}

export function missingQuestion(expression, correct, opts) {
  return question({
    prompt: 'Hvilket tall mangler?',
    expression,
    choices: makeChoices(correct, { min: 0, ...opts }),
    correct,
    explanation: { text: expression.replace('?', String(correct)), visual: null },
  });
}
