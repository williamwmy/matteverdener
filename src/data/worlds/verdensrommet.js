// Verden 4 — Verdensrommet (4.–5. trinn)
// LK20-mål (mot 5. trinn): posisjonssystemet og store tall, runde av,
// regne med negative tall (temperatur, tallinje), og plassere/lese punkt i
// koordinatsystemet. Tema: raketter, planeter, stjerner og romvesener.

import { randInt, pick, shuffle, makeChoices, choicesFrom, question } from '../questionHelpers.js';

// Norsk tusenskille.
function fmt(n) {
  return n.toLocaleString('nb-NO');
}

const PLACES = [
  { name: 'enerplassen', pow: 1 },
  { name: 'tierplassen', pow: 10 },
  { name: 'hundrerplassen', pow: 100 },
  { name: 'tusenplassen', pow: 1000 },
];

// ---- Store tall ----

function placeValue() {
  const digits = [randInt(1, 9), randInt(0, 9), randInt(0, 9), randInt(0, 9)];
  const n = digits[0] * 1000 + digits[1] * 100 + digits[2] * 10 + digits[3];
  const placeIdx = randInt(0, 3);
  const place = PLACES[placeIdx];
  const correct = digits[3 - placeIdx];
  const distract = digits.filter((_, i) => i !== 3 - placeIdx);
  // Hold distraktørene som gyldige siffer (0–9).
  const pool = [...new Set(distract)].filter((d) => d !== correct);
  pool.push((correct + 1) % 10, (correct + 9) % 10, (correct + 5) % 10);
  return question({
    prompt: `Hvilket siffer står på ${place.name} i tallet ${fmt(n)}?`,
    choices: choicesFrom(correct, pool),
    correct,
    explanation: { text: `I ${fmt(n)} står sifferet ${correct} på ${place.name}.`, visual: null },
  });
}

function compareLarge() {
  const set = new Set();
  while (set.size < 4) set.add(randInt(1000, 9999));
  const arr = [...set];
  const wantBig = Math.random() < 0.5;
  const correct = wantBig ? Math.max(...arr) : Math.min(...arr);
  return question({
    prompt: wantBig ? 'Hvilket tall er størst?' : 'Hvilket tall er minst?',
    choiceType: 'text',
    choices: arr.map(fmt),
    correct: fmt(correct),
    explanation: { text: `${fmt(correct)} er ${wantBig ? 'størst' : 'minst'}.`, visual: null },
  });
}

function rounding() {
  const target = pick([10, 100, 1000]);
  const n = randInt(target === 10 ? 11 : target, 9999);
  const correct = Math.round(n / target) * target;
  const names = { 10: 'tier', 100: 'hundrer', 1000: 'tusen' };
  return question({
    prompt: `Rund av ${fmt(n)} til nærmeste ${names[target]}.`,
    choiceType: 'text',
    choices: choicesFrom(fmt(correct), [fmt(correct + target), fmt(correct - target), fmt(n), fmt(correct + target * 2)]),
    correct: fmt(correct),
    explanation: { text: `${fmt(n)} avrundet til nærmeste ${names[target]} er ${fmt(correct)}.`, visual: null },
  });
}

function multiplyPower() {
  const a = randInt(2, 99);
  const pow = pick([10, 100, 1000]);
  const correct = a * pow;
  return question({
    prompt: 'Regn ut:',
    expression: `${a} · ${fmt(pow)}`,
    choiceType: 'text',
    choices: choicesFrom(fmt(correct), [fmt(a * pow * 10), fmt(a * (pow / 10)), fmt(correct + pow), fmt(correct - pow)]),
    correct: fmt(correct),
    explanation: { text: `${a} · ${fmt(pow)} = ${fmt(correct)}.`, visual: null },
  });
}

function largeAddSub() {
  if (Math.random() < 0.5) {
    const a = randInt(200, 4000);
    const b = randInt(200, 4000);
    return question({
      prompt: 'Regn ut:',
      expression: `${fmt(a)} + ${fmt(b)}`,
      choiceType: 'text',
      choices: choicesFrom(fmt(a + b), [fmt(a + b + 100), fmt(a + b - 100), fmt(a + b + 10), fmt(a + b - 1000)]),
      correct: fmt(a + b),
      explanation: { text: `${fmt(a)} + ${fmt(b)} = ${fmt(a + b)}.`, visual: null },
    });
  }
  const a = randInt(2000, 9000);
  const b = randInt(200, a - 100);
  return question({
    prompt: 'Regn ut:',
    expression: `${fmt(a)} − ${fmt(b)}`,
    choiceType: 'text',
    choices: choicesFrom(fmt(a - b), [fmt(a - b + 100), fmt(a - b - 100), fmt(a - b + 10), fmt(a - b - 10)]),
    correct: fmt(a - b),
    explanation: { text: `${fmt(a)} − ${fmt(b)} = ${fmt(a - b)}.`, visual: null },
  });
}

// ---- Negative tall ----

const PLANETS = ['Mars', 'Jupiter', 'Neptun', 'Pluto', 'Uranus'];

function negTemperature() {
  const planet = pick(PLANETS);
  const start = randInt(-15, -1);
  if (Math.random() < 0.5) {
    const rise = randInt(2, 12);
    const correct = start + rise;
    return question({
      prompt: `På ${planet} er det ${start}°. Temperaturen stiger ${rise}°. Hvor mange grader er det nå?`,
      choices: makeChoices(correct, { min: -30, max: 30, spread: 3 }),
      correct,
      explanation: { text: `${start} + ${rise} = ${correct}°.`, visual: null },
    });
  }
  const drop = randInt(2, 10);
  const correct = start - drop;
  return question({
    prompt: `På ${planet} er det ${start}°. Temperaturen synker ${drop}°. Hvor mange grader er det nå?`,
    choices: makeChoices(correct, { min: -40, max: 20, spread: 3 }),
    correct,
    explanation: { text: `${start} − ${drop} = ${correct}°.`, visual: null },
  });
}

function negOrder() {
  const set = new Set();
  while (set.size < 4) set.add(randInt(-9, 9));
  const arr = [...set];
  const wantBig = Math.random() < 0.5;
  const correct = wantBig ? Math.max(...arr) : Math.min(...arr);
  return question({
    prompt: wantBig ? 'Hvilket tall er størst?' : 'Hvilket tall er minst?',
    choices: shuffle(arr),
    correct,
    explanation: { text: `${correct} er ${wantBig ? 'størst' : 'minst'}. Husk at −1 er større enn −5.`, visual: null },
  });
}

function negLine() {
  const from = -randInt(3, 6);
  const to = randInt(3, 6);
  const hidden = randInt(from + 1, to - 1);
  return question({
    prompt: 'Hvilket tall skal stå der spørsmålstegnet er?',
    visual: { type: 'tallinje', from, to, step: 1, hidden: [hidden] },
    choices: makeChoices(hidden, { min: from - 2, max: to + 2, spread: 2 }),
    correct: hidden,
    explanation: { text: `Tallet ${hidden} skal stå der.`, visual: { type: 'tallinje', from, to, step: 1, hidden: [] } },
  });
}

// ---- Koordinatsystem ----

function coordIdentify({ min = 0, max = 6 } = {}) {
  const px = randInt(min === 0 ? 1 : min + 1, max - 1);
  const py = randInt(min === 0 ? 1 : min + 1, max - 1);
  const correct = `(${px}, ${py})`;
  const wrong = [`(${py}, ${px})`, `(${px + 1}, ${py})`, `(${px}, ${py - 1})`, `(${px - 1}, ${py + 1})`].filter((c) => c !== correct);
  return question({
    prompt: 'Hvilke koordinater har stjernen ⭐?',
    visual: { type: 'koordinat', min, max, point: [px, py] },
    choiceType: 'text',
    choices: choicesFrom(correct, wrong),
    correct,
    explanation: { text: `Stjernen ligger på x = ${px} og y = ${py}, altså ${correct}.`, visual: { type: 'koordinat', min, max, point: [px, py] } },
  });
}

// ---- Tallsprang i posisjonssystemet ----

function tallsprang() {
  const step = pick([10, 100, 1000]);
  const opp = Math.random() < 0.5;
  const n = randInt(step * 2, 9000);
  const correct = opp ? n + step : n - step;
  return question({
    prompt: `Hva er ${step} ${opp ? 'mer' : 'mindre'} enn ${fmt(n)}?`,
    choiceType: 'text',
    choices: choicesFrom(fmt(correct), [fmt(opp ? n - step : n + step), fmt(n), fmt(correct + step), fmt(correct - step), fmt(correct + 1)]),
    correct: fmt(correct),
    explanation: { text: `${fmt(n)} ${opp ? '+' : '−'} ${step} = ${fmt(correct)}.`, visual: null },
  });
}

function utvidetForm() {
  const t = randInt(1, 9);
  const h = randInt(0, 9);
  const te = randInt(0, 9);
  const e = randInt(0, 9);
  const n = t * 1000 + h * 100 + te * 10 + e;
  const parts = [t * 1000, h * 100, te * 10, e].filter((x) => x > 0).map(fmt).join(' + ');
  return question({
    prompt: `Hvilket tall er det samme som ${parts}?`,
    choiceType: 'text',
    choices: choicesFrom(fmt(n), [fmt(n + 100), fmt(n - 10), fmt(n + 9), fmt(n - 100), fmt(n + 1000)]),
    correct: fmt(n),
    explanation: { text: `${parts} = ${fmt(n)}.`, visual: null },
  });
}

// Tosifret · ensifret (store tall).
function tosifretGanger() {
  const a = randInt(12, 49);
  const b = randInt(3, 8);
  const p = a * b;
  return question({
    prompt: 'Regn ut:',
    expression: `${a} · ${b}`,
    choiceType: 'text',
    choices: choicesFrom(fmt(p), [fmt(p + 10), fmt(p - 10), fmt(p + 1), fmt(p + 100), fmt(p - 1)]),
    correct: fmt(p),
    explanation: { text: `${a} · ${b} = ${fmt(p)}.`, visual: null },
  });
}

function delTier() {
  const pow = pick([10, 100]);
  const q = randInt(2, 99);
  const n = q * pow;
  return question({
    prompt: 'Regn ut:',
    expression: `${fmt(n)} : ${pow}`,
    choiceType: 'text',
    choices: choicesFrom(fmt(q), [fmt(q * 10), fmt(q + 1), fmt(q - 1), fmt(q + 10)]),
    correct: fmt(q),
    explanation: { text: `${fmt(n)} : ${pow} = ${fmt(q)}.`, visual: null },
  });
}

// ---- Negative tall ----

function negAddSub() {
  const a = randInt(-9, 5);
  const b = randInt(2, 12);
  const minus = Math.random() < 0.5;
  const correct = minus ? a - b : a + b;
  return question({
    prompt: 'Regn ut:',
    expression: `${a} ${minus ? '−' : '+'} ${b}`,
    choices: makeChoices(correct, { min: -30, max: 30, spread: 3 }),
    correct,
    explanation: { text: `${a} ${minus ? '−' : '+'} ${b} = ${correct}.`, visual: null },
  });
}

function negAvstand() {
  const a = -randInt(1, 9);
  const b = randInt(1, 9);
  const correct = b - a;
  return question({
    prompt: `Hvor mange steg er det fra ${a} til ${b} på tallinja?`,
    visual: { type: 'tallinje', from: a - 1, to: b + 1, step: 1, hidden: [] },
    choices: makeChoices(correct, { min: 1, max: 25, spread: 3 }),
    correct,
    explanation: { text: `Fra ${a} til ${b} er ${b} − (${a}) = ${correct} steg.`, visual: null },
  });
}

const SPACE_PLACES = ['romstasjonen', 'månebasen', 'Mars-roveren', 'satellitten'];

function temperaturStig() {
  const natt = -randInt(2, 12);
  const dag = randInt(1, 10);
  const correct = dag - natt;
  return question({
    prompt: `På ${pick(SPACE_PLACES)} var det ${natt}° om natta og ${dag}° om dagen. Hvor mange grader steg temperaturen?`,
    choices: makeChoices(correct, { min: 1, max: 30, spread: 3 }),
    correct,
    explanation: { text: `${dag} − (${natt}) = ${correct}°.`, visual: null },
  });
}

// ---- Primtall ----

const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23];

function primtall() {
  const p = pick(PRIMES);
  const comps = [];
  while (comps.length < 3) {
    const c = randInt(4, 25);
    if (!PRIMES.includes(c) && !comps.includes(c) && c !== p) comps.push(c);
  }
  return question({
    prompt: 'Hvilket tall er et primtall (kan bare deles på 1 og seg selv)?',
    choices: shuffle([p, ...comps]),
    correct: p,
    explanation: { text: `${p} er et primtall — det kan bare deles på 1 og ${p}.`, visual: null },
  });
}

export const pools = {
  1: [() => placeValue(), () => compareLarge(), () => coordIdentify({ min: 0, max: 5 }), () => utvidetForm(), () => tallsprang()],
  2: [() => placeValue(), () => compareLarge(), () => coordIdentify({ min: 0, max: 6 }), () => rounding(), () => tallsprang(), () => utvidetForm()],
  3: [() => rounding(), () => negLine(), () => coordIdentify({ min: 0, max: 6 }), () => delTier(), () => utvidetForm(), () => tallsprang()],
  4: [() => negTemperature(), () => negOrder(), () => rounding(), () => coordIdentify({ min: -3, max: 3 }), () => negAvstand(), () => delTier()],
  5: [() => negTemperature(), () => negOrder(), () => largeAddSub(), () => multiplyPower(), () => negAvstand(), () => tosifretGanger()],
  6: [() => multiplyPower(), () => largeAddSub(), () => negTemperature(), () => coordIdentify({ min: -4, max: 4 }), () => negAddSub(), () => delTier()],
  7: [() => largeAddSub(), () => multiplyPower(), () => coordIdentify({ min: -5, max: 5 }), () => negOrder(), () => negAvstand(), () => primtall()],
  8: [() => largeAddSub(), () => negAvstand(), () => negTemperature(), () => multiplyPower(), () => temperaturStig(), () => tosifretGanger()],
  9: [() => multiplyPower(), () => largeAddSub(), () => coordIdentify({ min: -5, max: 5 }), () => negTemperature(), () => negAddSub(), () => primtall()],
  10: [() => largeAddSub(), () => multiplyPower(), () => negOrder(), () => coordIdentify({ min: -5, max: 5 }), () => temperaturStig(), () => tosifretGanger()],
};
