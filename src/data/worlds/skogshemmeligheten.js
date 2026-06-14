// Verden 3 — Skogshemmeligheten (3.–4. trinn)
// LK20-mål (mot 4. trinn): brøk som del av hel og mengde, representere og
// sammenligne brøk, desimaltall (tideler/hundredeler) og sammenhengen med
// brøk, og kjenne igjen/beskrive mønstre og tallfølger.
// Tema: skjult skatt, sopp, ugler, magiske lykter og hemmeligheter i skogen.

import { randInt, pick, makeChoices, choicesFrom, brokDistraktorer, question } from '../questionHelpers.js';

// Norsk desimaltegn (komma).
function nf(x) {
  return String(Math.round(x * 100) / 100).replace('.', ',');
}

// ---- Brøk ----

function fractionShaded() {
  const denom = pick([2, 3, 4, 5, 6]);
  const num = randInt(1, denom - 1);
  const shape = pick(['bar', 'sirkel']);
  const wrong = brokDistraktorer(num, denom);
  return question({
    prompt: 'Hvor stor del av skattekartet er fylt?',
    visual: { type: 'brok', numerator: num, denominator: denom, shape },
    choiceType: 'text',
    choices: choicesFrom(`${num}/${denom}`, wrong),
    correct: `${num}/${denom}`,
    explanation: { text: `${num} av ${denom} like deler er fylt: ${num}/${denom}.`, visual: { type: 'brok', numerator: num, denominator: denom, shape } },
  });
}

function fractionOfQuantity() {
  const denom = pick([2, 3, 4, 5]);
  const num = randInt(1, denom - 1);
  const part = randInt(2, 5);
  const total = denom * part;
  const correct = num * part;
  return question({
    prompt: `Ugla 🦉 fant ${total} sopper 🍄. Hvor mange er ${num}/${denom} av dem?`,
    choices: choicesFrom(correct, [correct + part, correct - part, correct + 1, total - correct, total]),
    correct,
    explanation: { text: `${total} : ${denom} = ${part}, og ${num} · ${part} = ${correct}.`, visual: null },
  });
}

function compareFractions() {
  // denom − 1 må være ≥ 4 for å gi fire ulike tellere.
  const denom = pick([5, 6, 8, 10]);
  const nums = [];
  while (nums.length < 4) {
    const n = randInt(1, denom - 1);
    if (!nums.includes(n)) nums.push(n);
  }
  const biggest = Math.max(...nums);
  return question({
    prompt: 'Hvilken brøk er størst?',
    choiceType: 'text',
    choices: nums.map((n) => `${n}/${denom}`),
    correct: `${biggest}/${denom}`,
    explanation: { text: `Når nevneren er lik, er brøken med størst teller størst: ${biggest}/${denom}.`, visual: null },
  });
}

function equivalentFraction() {
  const base = pick([[1, 2], [1, 3], [1, 4], [2, 3], [3, 4]]);
  const k = randInt(2, 4);
  const [bn, bd] = base;
  const correct = bn * k;
  return question({
    prompt: 'Hvilket tall mangler?',
    expression: `${bn}/${bd} = ?/${bd * k}`,
    choices: choicesFrom(correct, [correct + 1, correct - 1, correct + k, bd * k - correct, k]),
    correct,
    explanation: { text: `Vi ganger både teller og nevner med ${k}: ${bn}/${bd} = ${correct}/${bd * k}.`, visual: null },
  });
}

function addFractions() {
  const denom = pick([4, 5, 6, 8, 10]);
  const a = randInt(1, denom - 2);
  const b = randInt(1, denom - 1 - a);
  return question({
    prompt: 'Legg sammen brøkene:',
    expression: `${a}/${denom} + ${b}/${denom}`,
    choiceType: 'text',
    choices: choicesFrom(`${a + b}/${denom}`, [`${a + b}/${denom * 2}`, `${a + b + 1}/${denom}`, `${Math.max(1, a + b - 1)}/${denom}`, `${a * b}/${denom}`]),
    correct: `${a + b}/${denom}`,
    explanation: { text: `Med lik nevner legger vi sammen tellerne: ${a} + ${b} = ${a + b}, altså ${a + b}/${denom}.`, visual: null },
  });
}

// ---- Desimaltall ----

const DECIMAL_FRACTIONS = [
  { dec: 0.5, frac: '1/2' },
  { dec: 0.25, frac: '1/4' },
  { dec: 0.75, frac: '3/4' },
  { dec: 0.1, frac: '1/10' },
  { dec: 0.2, frac: '1/5' },
];

function decimalFraction() {
  const item = pick(DECIMAL_FRACTIONS);
  const ask = Math.random() < 0.5;
  if (ask) {
    const wrong = DECIMAL_FRACTIONS.filter((d) => d.frac !== item.frac).map((d) => nf(d.dec));
    return question({
      prompt: `Hvilket desimaltall er det samme som ${item.frac}?`,
      choiceType: 'text',
      choices: choicesFrom(nf(item.dec), wrong),
      correct: nf(item.dec),
      explanation: { text: `${item.frac} = ${nf(item.dec)}.`, visual: null },
    });
  }
  const wrong = DECIMAL_FRACTIONS.filter((d) => d.frac !== item.frac).map((d) => d.frac);
  return question({
    prompt: `Hvilken brøk er det samme som ${nf(item.dec)}?`,
    choiceType: 'text',
    choices: choicesFrom(item.frac, wrong),
    correct: item.frac,
    explanation: { text: `${nf(item.dec)} = ${item.frac}.`, visual: null },
  });
}

function tenths() {
  const n = randInt(1, 9);
  return question({
    prompt: `Hvor mange tideler er det i ${nf(n / 10)}?`,
    choices: makeChoices(n, { min: 0, max: 10, spread: 2 }),
    correct: n,
    explanation: { text: `${nf(n / 10)} betyr ${n} tideler.`, visual: null },
  });
}

function orderDecimals() {
  const set = new Set();
  while (set.size < 4) set.add(randInt(1, 9) / 10);
  const arr = [...set];
  const wantBig = Math.random() < 0.5;
  const correct = wantBig ? Math.max(...arr) : Math.min(...arr);
  return question({
    prompt: wantBig ? 'Hvilket tall er størst?' : 'Hvilket tall er minst?',
    choiceType: 'text',
    choices: arr.map(nf),
    correct: nf(correct),
    explanation: { text: `${nf(correct)} er ${wantBig ? 'størst' : 'minst'}.`, visual: null },
  });
}

function addDecimals() {
  const a = randInt(1, 5);
  const b = randInt(1, 9 - a);
  return question({
    prompt: 'Regn ut:',
    expression: `${nf(a / 10)} + ${nf(b / 10)}`,
    choiceType: 'text',
    choices: choicesFrom(nf((a + b) / 10), [nf((a + b + 1) / 10), nf((a + b - 1) / 10), nf((a + b) / 100), nf(a + b)]),
    correct: nf((a + b) / 10),
    explanation: { text: `${a} tideler + ${b} tideler = ${a + b} tideler = ${nf((a + b) / 10)}.`, visual: null },
  });
}

// ---- Mønster og tallfølger ----

function figurtall() {
  const kind = pick(['trekant', 'kvadrat']);
  const seqs = {
    trekant: [1, 3, 6, 10, 15, 21],
    kvadrat: [1, 4, 9, 16, 25, 36],
  };
  const seq = seqs[kind];
  const shown = randInt(3, 4);
  const correct = seq[shown];
  return question({
    prompt: 'Hvilket tall kommer neste i mønsteret?',
    expression: seq.slice(0, shown).join(', ') + ', ?',
    choices: makeChoices(correct, { min: 0, spread: Math.max(2, Math.round(correct / 6)) }),
    correct,
    explanation: {
      text: kind === 'trekant'
        ? `Dette er trekanttall — vi legger til ett mer hver gang. Neste er ${correct}.`
        : `Dette er kvadrattall (1·1, 2·2, 3·3 …). Neste er ${correct}.`,
      visual: null,
    },
  });
}

function sequenceRule() {
  const d = pick([2, 3, 4, 5, 10]);
  const mult = Math.random() < 0.3;
  const start = randInt(1, 6);
  if (mult) {
    const r = pick([2, 3]);
    const seq = [start, start * r, start * r * r, start * r * r * r];
    const next = seq[3] * r;
    return question({
      prompt: 'Hva er det neste tallet i tallfølgen?',
      expression: seq.join(', ') + ', ?',
      choices: makeChoices(next, { min: 0, spread: Math.max(3, Math.round(next / 5)) }),
      correct: next,
      explanation: { text: `Hvert tall ganges med ${r}. Neste er ${seq[3]} · ${r} = ${next}.`, visual: null },
    });
  }
  const seq = [start, start + d, start + 2 * d, start + 3 * d];
  const next = start + 4 * d;
  return question({
    prompt: 'Hva er det neste tallet i tallfølgen?',
    expression: seq.join(', ') + ', ?',
    choices: makeChoices(next, { min: 0, spread: Math.max(2, d) }),
    correct: next,
    explanation: { text: `Tallfølgen øker med ${d}. Neste er ${next}.`, visual: null },
  });
}

function findRule() {
  const d = pick([2, 3, 4, 5, 10]);
  const start = randInt(2, 8);
  const seq = [start, start + d, start + 2 * d, start + 3 * d];
  return question({
    prompt: 'Hvilken regel følger tallfølgen?',
    expression: seq.join(', ') + ' …',
    choiceType: 'text',
    choices: choicesFrom(`+ ${d}`, [`+ ${d + 1}`, `+ ${d - 1}`, `· ${d}`, `+ ${d + 2}`]),
    correct: `+ ${d}`,
    explanation: { text: `Hvert tall er ${d} mer enn det forrige, så regelen er + ${d}.`, visual: null },
  });
}

export const pools = {
  1: [() => fractionShaded(), () => fractionShaded(), () => sequenceRule(), () => fractionOfQuantity()],
  2: [() => fractionShaded(), () => fractionOfQuantity(), () => sequenceRule(), () => compareFractions()],
  3: [() => fractionOfQuantity(), () => compareFractions(), () => findRule(), () => figurtall()],
  4: [() => compareFractions(), () => equivalentFraction(), () => figurtall(), () => fractionOfQuantity()],
  5: [() => equivalentFraction(), () => decimalFraction(), () => tenths(), () => findRule()],
  6: [() => decimalFraction(), () => tenths(), () => orderDecimals(), () => addFractions()],
  7: [() => addFractions(), () => orderDecimals(), () => addDecimals(), () => equivalentFraction()],
  8: [() => addDecimals(), () => decimalFraction(), () => figurtall(), () => addFractions()],
  9: [() => addFractions(), () => addDecimals(), () => sequenceRule(), () => compareFractions()],
  10: [() => addDecimals(), () => addFractions(), () => figurtall(), () => orderDecimals()],
};
