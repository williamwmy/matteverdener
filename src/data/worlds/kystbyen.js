// Verden 2 — Kystbyen (2.–3. trinn)
// LK20-mål (mot 4. trinn): utforske multiplikasjon og divisjon og sammenhengen
// mellom dem, bruke gangetabellen, og forstå brøk som del av en mengde.
// Tema: fiskebåter, krabber, skjell, måker og fisketorget.

import {
  randInt,
  pick,
  makeChoices,
  choicesFrom,
  brokDistraktorer,
  question,
} from '../questionHelpers.js';

const SEA_ITEMS = [
  { emoji: '🐟', name: 'fisk', single: 'fisk' },
  { emoji: '🦀', name: 'krabber', single: 'krabbe' },
  { emoji: '🐚', name: 'skjell', single: 'skjell' },
  { emoji: '🦞', name: 'hummere', single: 'hummer' },
];

// Plausible distraktører for et produkt: naborader/-kolonner og småfeil.
function productChoices(a, b) {
  const p = a * b;
  return choicesFrom(p, [p + a, p - a, p + b, a * (b + 1), (a + 1) * b, p + 1, p - 1, p + 2]);
}

// ---- Multiplikasjon som gjentatt addisjon (array) ----

function arrayProduct({ maxRow = 4, maxCol = 5 } = {}) {
  const item = pick(SEA_ITEMS);
  const rows = randInt(2, maxRow);
  const cols = randInt(2, maxCol);
  const p = rows * cols;
  return question({
    prompt: `${rows} båter har ${cols} ${item.name} hver. Hvor mange ${item.name} er det til sammen?`,
    visual: { type: 'array', rows, cols, emoji: item.emoji },
    choices: productChoices(rows, cols),
    correct: p,
    explanation: { text: `${rows} · ${cols} = ${p}`, visual: { type: 'array', rows, cols, emoji: item.emoji } },
  });
}

// Gjentatt addisjon → multiplikasjon.
function repeatedAddition() {
  const a = randInt(2, 5);
  const b = randInt(2, 5);
  return question({
    prompt: 'Hvor mye blir dette?',
    expression: Array(b).fill(a).join(' + '),
    choices: productChoices(a, b),
    correct: a * b,
    explanation: { text: `${b} ganger ${a} er ${a} · ${b} = ${a * b}`, visual: null },
  });
}

// ---- Gangetabell ----

function timesTable(tables, max = 10) {
  const a = pick(tables);
  const b = randInt(2, max);
  return question({
    prompt: 'Regn ut:',
    expression: `${a} · ${b}`,
    choices: productChoices(a, b),
    correct: a * b,
    explanation: { text: `${a} · ${b} = ${a * b}`, visual: null },
  });
}

function missingFactor(max = 10) {
  const a = randInt(2, max);
  const b = randInt(2, max);
  const p = a * b;
  return question({
    prompt: 'Hvilket tall mangler?',
    expression: `${a} · ? = ${p}`,
    choices: choicesFrom(b, [b + 1, b - 1, b + 2, b + 3, b - 2]),
    correct: b,
    explanation: { text: `${a} · ${b} = ${p}, så tallet er ${b}.`, visual: null },
  });
}

// ---- Divisjon ----

function divisionShare(max = 10) {
  const item = pick(SEA_ITEMS);
  const divisor = randInt(2, 5);
  const quotient = randInt(2, max);
  const total = divisor * quotient;
  return question({
    prompt: `Fiskeren 🎣 deler ${total} ${item.name} ${item.emoji} likt på ${divisor} kasser. Hvor mange ${item.name} blir det i hver kasse?`,
    choices: choicesFrom(quotient, [quotient + 1, quotient - 1, quotient + 2, divisor, total]),
    correct: quotient,
    explanation: { text: `${total} : ${divisor} = ${quotient}`, visual: null },
  });
}

function divisionPlain(max = 10) {
  const divisor = randInt(2, max);
  const quotient = randInt(2, max);
  const total = divisor * quotient;
  return question({
    prompt: 'Regn ut:',
    expression: `${total} : ${divisor}`,
    choices: choicesFrom(quotient, [quotient + 1, quotient - 1, quotient + 2, divisor, quotient - 2]),
    correct: quotient,
    explanation: { text: `${total} : ${divisor} = ${quotient}, fordi ${divisor} · ${quotient} = ${total}.`, visual: null },
  });
}

// ---- Brøk som del av mengde ----

function fractionOfQuantity() {
  const item = pick(SEA_ITEMS);
  const denom = pick([2, 3, 4]);
  const quotient = randInt(2, 5);
  const total = denom * quotient; // del av hel mengde går opp
  return question({
    prompt: `Hvor mye er 1/${denom} av ${total} ${item.name} ${item.emoji}?`,
    choices: choicesFrom(quotient, [quotient + 1, quotient - 1, quotient + 2, denom, total]),
    correct: quotient,
    explanation: { text: `${total} delt på ${denom} er ${quotient}.`, visual: null },
  });
}

// Hvor stor del er fylt? (brøk som svar)
function fractionShaded() {
  const denom = pick([2, 3, 4, 5]);
  const num = randInt(1, denom - 1);
  const shape = pick(['bar', 'sirkel']);
  const wrong = brokDistraktorer(num, denom);
  return question({
    prompt: 'Hvor stor del er fylt med farge?',
    visual: { type: 'brok', numerator: num, denominator: denom, shape },
    choiceType: 'text',
    choices: choicesFrom(`${num}/${denom}`, wrong),
    correct: `${num}/${denom}`,
    explanation: {
      text: `${num} av ${denom} like deler er fylt, altså ${num}/${denom}.`,
      visual: { type: 'brok', numerator: num, denominator: denom, shape },
    },
  });
}

// ---- Problemløsing fra torget ----

function marketTwoStep() {
  const item = pick(SEA_ITEMS);
  const perBox = randInt(3, 6);
  const boxes = randInt(2, 4);
  const eaten = randInt(2, perBox);
  const correct = perBox * boxes - eaten;
  return question({
    prompt: `Måken 🐦 stjeler fra torget! Det er ${boxes} kasser med ${perBox} ${item.name} ${item.emoji} i hver. Måken tar ${eaten}. Hvor mange ${item.name} er igjen?`,
    choices: makeChoices(correct, { min: 0, spread: 4 }),
    correct,
    explanation: { text: `${perBox} · ${boxes} = ${perBox * boxes}, og ${perBox * boxes} − ${eaten} = ${correct}.`, visual: null },
  });
}

export const pools = {
  1: [
    () => arrayProduct({ maxRow: 3, maxCol: 4 }),
    () => arrayProduct({ maxRow: 3, maxCol: 4 }),
    () => repeatedAddition(),
    () => timesTable([2], 6),
  ],
  2: [
    () => arrayProduct({ maxRow: 4, maxCol: 5 }),
    () => repeatedAddition(),
    () => timesTable([2, 5], 8),
    () => timesTable([10], 10),
  ],
  3: [
    () => timesTable([2, 5, 10], 10),
    () => timesTable([3], 8),
    () => divisionShare(5),
    () => arrayProduct({ maxRow: 4, maxCol: 5 }),
  ],
  4: [
    () => timesTable([3, 4], 10),
    () => divisionShare(6),
    () => missingFactor(5),
    () => divisionPlain(5),
  ],
  5: [
    () => timesTable([2, 3, 4, 5], 10),
    () => divisionPlain(6),
    () => missingFactor(8),
    () => fractionOfQuantity(),
  ],
  6: [
    () => timesTable([6, 7, 8], 10),
    () => divisionPlain(8),
    () => fractionOfQuantity(),
    () => fractionShaded(),
  ],
  7: [
    () => timesTable([6, 7, 8, 9], 10),
    () => divisionPlain(10),
    () => fractionShaded(),
    () => marketTwoStep(),
  ],
  8: [
    () => timesTable([7, 8, 9], 12),
    () => divisionPlain(12),
    () => missingFactor(12),
    () => marketTwoStep(),
  ],
  9: [
    () => timesTable([8, 9, 12], 12),
    () => divisionPlain(12),
    () => fractionOfQuantity(),
    () => marketTwoStep(),
  ],
  10: [
    () => timesTable([11, 12], 12),
    () => divisionPlain(12),
    () => missingFactor(12),
    () => marketTwoStep(),
  ],
};
