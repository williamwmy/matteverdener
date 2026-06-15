// Verden 2 — Kystbyen (2.–3. trinn)
// LK20-mål (mot 4. trinn): utforske multiplikasjon og divisjon og sammenhengen
// mellom dem, bruke gangetabellen, og forstå brøk som del av en mengde.
// Tema: fiskebåter, krabber, skjell, måker og fisketorget.

import {
  randInt,
  pick,
  shuffle,
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
    explanation: {
      text: `${perBox} · ${boxes} = ${perBox * boxes}, og ${perBox * boxes} − ${eaten} = ${correct}.`,
      visual: { type: 'sekvens', terms: [perBox * boxes], answer: correct, labels: [`−${eaten}`], reveal: true },
    },
  });
}

// ---- Multiplikasjon som hopp på tallinja ----

function gangeHopp() {
  const a = randInt(2, 5); // hoppstørrelse
  const b = randInt(2, 5); // antall hopp
  const p = a * b;
  const visual = { type: 'tallinje', from: 0, to: p, step: a, hidden: [], jump: { start: 0, hops: b, dir: 'up' } };
  return question({
    prompt: `Måken 🐦 tar ${b} hopp på ${a}. Hvor lander den?`,
    expression: `${a} · ${b}`,
    visual,
    choices: productChoices(a, b),
    correct: p,
    explanation: { text: `${b} hopp på ${a}: ${a} · ${b} = ${p}.`, visual },
  });
}

// Tosifret · ensifret.
function tosifretGanger() {
  const a = randInt(11, 24);
  const b = randInt(3, 6);
  const p = a * b;
  return question({
    prompt: 'Regn ut:',
    expression: `${a} · ${b}`,
    choices: makeChoices(p, { min: 0, spread: Math.max(4, b) }),
    correct: p,
    explanation: { text: `${a} · ${b} = ${p}.`, visual: null },
  });
}

// ---- Divisjon med rest ----

function divisjonRest() {
  const item = pick(SEA_ITEMS);
  const divisor = randInt(3, 6);
  const quotient = randInt(2, 6);
  const rem = randInt(1, divisor - 1);
  const total = divisor * quotient + rem;
  return question({
    prompt: `${total} ${item.name} ${item.emoji} skal deles likt på ${divisor} kasser. Hvor mange blir til overs?`,
    choices: choicesFrom(rem, [rem + 1, rem - 1, divisor, divisor - rem, quotient, rem + 2]),
    correct: rem,
    explanation: { text: `${total} : ${divisor} = ${quotient} og ${rem} til overs.`, visual: null },
  });
}

// Hvor mange fulle kasser? (heltallsdivisjon)
function fulleKasser() {
  const item = pick(SEA_ITEMS);
  const per = randInt(3, 6);
  const full = randInt(2, 6);
  const rem = randInt(1, per - 1);
  const total = per * full + rem;
  return question({
    prompt: `${total} ${item.name} ${item.emoji} pakkes ${per} i hver kasse. Hvor mange FULLE kasser blir det?`,
    choices: choicesFrom(full, [full + 1, full - 1, per, total, full + 2]),
    correct: full,
    explanation: { text: `${total} : ${per} = ${full} fulle kasser (og ${rem} til overs).`, visual: null },
  });
}

// ---- Sammenhengen gange/dele (fakta-familie) ----

function faktafamilie() {
  const a = randInt(2, 6);
  const b = randInt(2, 6);
  const p = a * b;
  const correct = `${p} : ${a} = ${b}`;
  const wrong = [
    `${p} : ${a} = ${b + 1}`,
    `${p} : ${b} = ${a + 1}`,
    `${a} : ${b} = ${p}`,
    `${p} · ${a} = ${b}`,
    `${p} : ${a} = ${b + 2}`,
  ].filter((w) => w !== correct);
  return question({
    prompt: `Hvilket regnestykke hører til samme «familie» som ${a} · ${b} = ${p}?`,
    choiceType: 'text',
    choices: choicesFrom(correct, wrong),
    correct,
    explanation: { text: `Ganging og deling henger sammen: ${a} · ${b} = ${p}, så ${p} : ${a} = ${b}.`, visual: null },
  });
}

// ---- Pris (gjentatt addisjon i kroner) ----

function prisGanger() {
  const item = pick(SEA_ITEMS);
  const k = randInt(2, 9);
  const n = randInt(2, 6);
  const p = k * n;
  return question({
    prompt: `Én ${item.single} koster ${k} kr. Hva koster ${n} ${item.name} ${item.emoji}?`,
    choices: makeChoices(p, { min: 0, spread: Math.max(3, k) }),
    correct: p,
    explanation: { text: `${k} · ${n} = ${p} kr.`, visual: null },
  });
}

// ---- Dobling og halvering ----

function dobleHalvere() {
  if (Math.random() < 0.5) {
    const n = randInt(3, 20);
    return question({
      prompt: `Hva er det dobbelte av ${n}?`,
      choices: makeChoices(n * 2, { min: 0, spread: 3 }),
      correct: n * 2,
      explanation: { text: `${n} + ${n} = ${n * 2}.`, visual: null },
    });
  }
  const half = randInt(3, 12);
  const n = half * 2;
  return question({
    prompt: `Hva er halvparten av ${n}?`,
    choices: makeChoices(half, { min: 0, spread: 3 }),
    correct: half,
    explanation: { text: `${n} : 2 = ${half}.`, visual: null },
  });
}

// ---- Sammenligne enkle brøker (samme teller) ----

function sammenlignBrok() {
  const denoms = shuffle([2, 3, 4, 5, 6, 8]).slice(0, 4);
  const smallest = Math.min(...denoms); // minst nevner = størst brøk når telleren er 1
  return question({
    prompt: 'Hvilken brøk er størst?',
    choiceType: 'text',
    choices: shuffle(denoms.map((d) => `1/${d}`)),
    correct: `1/${smallest}`,
    explanation: { text: `Når telleren er 1, er brøken med minst nevner størst: 1/${smallest}.`, visual: null },
  });
}

export const pools = {
  1: [
    () => arrayProduct({ maxRow: 3, maxCol: 4 }),
    () => arrayProduct({ maxRow: 3, maxCol: 4 }),
    () => repeatedAddition(),
    () => timesTable([2], 6),
    () => gangeHopp(),
    () => dobleHalvere(),
  ],
  2: [
    () => arrayProduct({ maxRow: 4, maxCol: 5 }),
    () => repeatedAddition(),
    () => timesTable([2, 5], 8),
    () => timesTable([10], 10),
    () => gangeHopp(),
    () => prisGanger(),
  ],
  3: [
    () => timesTable([2, 5, 10], 10),
    () => timesTable([3], 8),
    () => divisionShare(5),
    () => arrayProduct({ maxRow: 4, maxCol: 5 }),
    () => gangeHopp(),
    () => dobleHalvere(),
  ],
  4: [
    () => timesTable([3, 4], 10),
    () => divisionShare(6),
    () => missingFactor(5),
    () => divisionPlain(5),
    () => prisGanger(),
    () => faktafamilie(),
  ],
  5: [
    () => timesTable([2, 3, 4, 5], 10),
    () => divisionPlain(6),
    () => missingFactor(8),
    () => fractionOfQuantity(),
    () => faktafamilie(),
    () => divisjonRest(),
  ],
  6: [
    () => timesTable([6, 7, 8], 10),
    () => divisionPlain(8),
    () => fractionOfQuantity(),
    () => fractionShaded(),
    () => tosifretGanger(),
    () => sammenlignBrok(),
  ],
  7: [
    () => timesTable([6, 7, 8, 9], 10),
    () => divisionPlain(10),
    () => fractionShaded(),
    () => marketTwoStep(),
    () => divisjonRest(),
    () => fulleKasser(),
  ],
  8: [
    () => timesTable([7, 8, 9], 12),
    () => divisionPlain(12),
    () => missingFactor(12),
    () => marketTwoStep(),
    () => tosifretGanger(),
    () => sammenlignBrok(),
  ],
  9: [
    () => timesTable([8, 9, 12], 12),
    () => divisionPlain(12),
    () => fractionOfQuantity(),
    () => marketTwoStep(),
    () => fulleKasser(),
    () => tosifretGanger(),
  ],
  10: [
    () => timesTable([11, 12], 12),
    () => divisionPlain(12),
    () => missingFactor(12),
    () => marketTwoStep(),
    () => divisjonRest(),
    () => faktafamilie(),
  ],
};
