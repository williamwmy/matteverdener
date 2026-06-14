// Verden 7 — Fremtidens by (7. trinn)
// LK20-mål (mot 8. trinn): funksjoner og lineære sammenhenger, regne med
// uttrykk og likninger (også med x på begge sider), koordinatsystemet i alle
// fire kvadranter, proporsjonalitet og prosent. Tema: roboter, svevebiler,
// skyskrapere og droner.

import { randInt, pick, shuffle, makeChoices, choicesFrom, question } from '../questionHelpers.js';

// ---- Funksjoner ----

function functionValue() {
  const a = randInt(2, 6);
  const b = randInt(1, 10);
  const x = randInt(2, 9);
  const correct = a * x + b;
  return question({
    prompt: `Roboten 🤖 følger regelen y = ${a}x + ${b}. Hva er y når x = ${x}?`,
    choices: makeChoices(correct, { min: 0, spread: 4 }),
    correct,
    explanation: { text: `y = ${a} · ${x} + ${b} = ${correct}.`, visual: null },
  });
}

function functionRule() {
  const a = pick([2, 3, 4]);
  const b = pick([0, 1, 2, 3]);
  const ys = [1, 2, 3].map((x) => a * x + b);
  const tail = b === 0 ? '' : ` + ${b}`;
  const correct = `y = ${a}x${tail}`;
  const wrong = [
    `y = ${a + 1}x${tail}`,
    `y = ${a - 1 > 0 ? a - 1 : a + 2}x${tail}`,
    `y = ${a}x + ${b + 1}`,
    `y = ${a}x + ${b + 2}`,
    b > 0 ? `y = ${a}x + ${b - 1}` : `y = ${a + 2}x`,
  ].filter((w) => w !== correct);
  return question({
    prompt: `Når x = 1, 2, 3 blir y = ${ys.join(', ')}. Hvilken regel passer?`,
    choiceType: 'text',
    choices: choicesFrom(correct, wrong),
    correct,
    explanation: { text: `Hver gang x øker med 1, øker y med ${a}, og y = ${a}x + ${b}.`, visual: null },
  });
}

function nextInSequence() {
  const a = pick([2, 3, 4, 5]);
  const b = randInt(1, 6);
  const seq = [1, 2, 3, 4].map((x) => a * x + b);
  const correct = a * 5 + b;
  return question({
    prompt: 'Hva er det neste tallet i tallfølgen?',
    expression: seq.join(', ') + ', ?',
    choices: makeChoices(correct, { min: 0, spread: Math.max(2, a) }),
    correct,
    explanation: { text: `Tallfølgen øker med ${a} hver gang. Neste er ${correct}.`, visual: null },
  });
}

// ---- Likninger med x på begge sider ----

function equationBothSides() {
  const a = randInt(3, 6);
  const c = randInt(1, a - 1);
  const x = randInt(2, 9);
  const b = randInt(1, 6);
  const d = b + (a - c) * x; // sikrer heltallsløsning og positive ledd
  return question({
    prompt: 'Hva er x?',
    expression: `${a}x + ${b} = ${c}x + ${d}`,
    choices: makeChoices(x, { min: 0, spread: 3 }),
    correct: x,
    explanation: { text: `${a}x − ${c}x = ${d} − ${b} → ${a - c}x = ${d - b}, så x = ${x}.`, visual: null },
  });
}

// ---- Koordinatsystem (alle fire kvadranter) ----

function coordPlot() {
  const min = -5;
  const max = 5;
  const px = randInt(min + 1, max - 1) || 1;
  const py = randInt(min + 1, max - 1) || -1;
  const correct = `(${px}, ${py})`;
  const wrong = [`(${py}, ${px})`, `(${-px}, ${py})`, `(${px}, ${-py})`, `(${px + 1}, ${py})`].filter((c) => c !== correct);
  return question({
    prompt: 'Hvilke koordinater har stjernen ⭐?',
    visual: { type: 'koordinat', min, max, point: [px, py] },
    choiceType: 'text',
    choices: choicesFrom(correct, wrong),
    correct,
    explanation: { text: `Først ${px} langs x-aksen, så ${py} langs y-aksen: ${correct}.`, visual: { type: 'koordinat', min, max, point: [px, py] } },
  });
}

// ---- Proporsjonalitet ----

function proportion() {
  const per = randInt(2, 6);
  const r1 = randInt(2, 4);
  const r2 = randInt(2, 7);
  const m1 = r1 * per;
  const correct = r2 * per;
  return question({
    prompt: `${r1} roboter lager ${m1} deler 🤖. Hvor mange deler lager ${r2} roboter på samme tid?`,
    choices: makeChoices(correct, { min: 0, spread: Math.max(2, per) }),
    correct,
    explanation: { text: `Hver robot lager ${m1} : ${r1} = ${per} deler. ${r2} · ${per} = ${correct}.`, visual: null },
  });
}

function rate() {
  const perHour = randInt(15, 45);
  const h1 = randInt(2, 4);
  const h2 = randInt(2, 6);
  const dist1 = perHour * h1;
  const correct = perHour * h2;
  return question({
    prompt: `En drone 🛸 flyr ${dist1} km på ${h1} timer. Hvor langt flyr den på ${h2} timer i samme fart?`,
    choices: makeChoices(correct, { min: 0, spread: Math.max(5, perHour) }),
    correct,
    explanation: { text: `Farten er ${dist1} : ${h1} = ${perHour} km/t. ${perHour} · ${h2} = ${correct} km.`, visual: null },
  });
}

// ---- Prosent ----

function percentChange() {
  const price = pick([40, 60, 80, 100, 120, 200]);
  const p = pick([10, 20, 25, 50]);
  const change = (price * p) / 100;
  if (Math.random() < 0.5) {
    return question({
      prompt: `En svevebil 🚗 koster ${price} kr. Den settes ned ${p} %. Hva er den nye prisen?`,
      choices: makeChoices(price - change, { min: 0, spread: Math.max(4, change / 2) }),
      correct: price - change,
      explanation: { text: `${p} % av ${price} er ${change}. ${price} − ${change} = ${price - change} kr.`, visual: null },
    });
  }
  return question({
    prompt: `En leilighet 🏢 i skyskraperen koster ${price} tusen kr. Prisen øker ${p} %. Hva er den nye prisen?`,
    choices: makeChoices(price + change, { min: 0, spread: Math.max(4, change / 2) }),
    correct: price + change,
    explanation: { text: `${p} % av ${price} er ${change}. ${price} + ${change} = ${price + change} tusen kr.`, visual: null },
  });
}

export const pools = {
  1: [() => functionValue(), () => functionValue(), () => nextInSequence(), () => proportion()],
  2: [() => functionValue(), () => nextInSequence(), () => proportion(), () => functionRule()],
  3: [() => functionRule(), () => functionValue(), () => proportion(), () => coordPlot()],
  4: [() => functionRule(), () => proportion(), () => rate(), () => coordPlot()],
  5: [() => rate(), () => functionValue(), () => coordPlot(), () => percentChange()],
  6: [() => equationBothSides(), () => functionRule(), () => rate(), () => percentChange()],
  7: [() => equationBothSides(), () => functionValue(), () => coordPlot(), () => percentChange()],
  8: [() => equationBothSides(), () => functionRule(), () => rate(), () => proportion()],
  9: [() => equationBothSides(), () => percentChange(), () => coordPlot(), () => functionValue()],
  10: [() => equationBothSides(), () => functionRule(), () => percentChange(), () => rate()],
};
