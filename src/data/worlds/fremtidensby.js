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
  // Distraktører speiler typiske feil: glemte + b (a·x), ganget hele (a·(x+b)),
  // la sammen alt (a+x+b), pluss et naboavvik.
  return question({
    prompt: `Roboten 🤖 følger regelen y = ${a}x + ${b}. Hva er y når x = ${x}?`,
    choices: choicesFrom(correct, [a * x, a * (x + b), a + x + b, correct + 1, correct - 1, correct + 2, correct - 2]),
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
  // Trap: d − b = (a − c)·x er svaret hvis man glemmer å dele på (a − c).
  return question({
    prompt: 'Hva er x?',
    expression: `${a}x + ${b} = ${c}x + ${d}`,
    choices: choicesFrom(x, [d - b, x + 1, x - 1, x + 2]),
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
    // Traps: la til i stedet (price+change), uendret pris, eller bare beløpet (change).
    return question({
      prompt: `En svevebil 🚗 koster ${price} kr. Den settes ned ${p} %. Hva er den nye prisen?`,
      choices: choicesFrom(price - change, [price + change, price, change, price - change - 1, price - change + 1]),
      correct: price - change,
      explanation: { text: `${p} % av ${price} er ${change}. ${price} − ${change} = ${price - change} kr.`, visual: null },
    });
  }
  // Traps: trakk fra i stedet (price−change), uendret pris, eller bare beløpet (change).
  return question({
    prompt: `En leilighet 🏢 i skyskraperen koster ${price} tusen kr. Prisen øker ${p} %. Hva er den nye prisen?`,
    choices: choicesFrom(price + change, [price - change, price, change, price + change + 1, price + change - 1]),
    correct: price + change,
    explanation: { text: `${p} % av ${price} er ${change}. ${price} + ${change} = ${price + change} tusen kr.`, visual: null },
  });
}

// ---- Lineære sammenhenger ----

function stigningstall() {
  const a = pick([2, 3, 4, 5]);
  const b = randInt(0, 5);
  const ys = [1, 2, 3].map((x) => a * x + b);
  return question({
    prompt: `Når x = 1, 2, 3 blir y = ${ys.join(', ')}. Hvor mye øker y hver gang x øker med 1 (stigningstallet)?`,
    choices: makeChoices(a, { min: 1, spread: 2 }),
    correct: a,
    explanation: { text: `y øker med ${a} hver gang — stigningstallet er ${a}.`, visual: null },
  });
}

function finnXavY() {
  const a = pick([2, 3, 4, 5]);
  const b = randInt(1, 8);
  const x = randInt(2, 9);
  const y = a * x + b;
  // Trap: a·x = y − b er svaret hvis man glemmer å dele på a til slutt.
  return question({
    prompt: `Roboten 🤖 følger y = ${a}x + ${b}. Hva er x når y = ${y}?`,
    choices: choicesFrom(x, [a * x, x + 1, x - 1, x + 2]),
    correct: x,
    explanation: { text: `${y} − ${b} = ${a * x}, og ${a * x} : ${a} = ${x}.`, visual: null },
  });
}

function nteLedd() {
  const a = pick([2, 3, 4]);
  const b = pick([1, 2, 3]);
  const n = randInt(4, 8);
  const correct = a * n + b;
  return question({
    prompt: `I et mønster har figur nr. n ${a}·n + ${b} ruter. Hvor mange ruter har figur nr. ${n}?`,
    choices: makeChoices(correct, { min: 0, spread: 3 }),
    correct,
    explanation: { text: `${a} · ${n} + ${b} = ${correct}.`, visual: null },
  });
}

function punktPaaLinje() {
  const a = pick([2, 3, 4]);
  const x = randInt(2, 5);
  const correct = `(${x}, ${a * x})`;
  const wrong = [`(${x}, ${a * x + 1})`, `(${a * x}, ${x})`, `(${x + 1}, ${a * x})`, `(${x}, ${a * x - 1})`].filter((w) => w !== correct);
  return question({
    prompt: `Hvilket punkt ligger på linja y = ${a}x?`,
    choiceType: 'text',
    choices: choicesFrom(correct, wrong),
    correct,
    explanation: { text: `Når x = ${x} er y = ${a}·${x} = ${a * x}, altså ${correct}.`, visual: null },
  });
}

// ---- Likning med parentes ----

function likningParentes() {
  const a = randInt(2, 4);
  const x = randInt(2, 8);
  const b = randInt(1, 5);
  const c = a * (x + b);
  return question({
    prompt: 'Hva er x?',
    expression: `${a}(x + ${b}) = ${c}`,
    choices: makeChoices(x, { min: 0, spread: 3 }),
    correct: x,
    explanation: { text: `x + ${b} = ${c} : ${a} = ${x + b}, så x = ${x}.`, visual: null },
  });
}

// ---- Koordinatsystem: kvadranter ----

function kvadrant() {
  const px = pick([-1, 1]) * randInt(1, 5);
  const py = pick([-1, 1]) * randInt(1, 5);
  const q = px > 0 && py > 0 ? 1 : px < 0 && py > 0 ? 2 : px < 0 && py < 0 ? 3 : 4;
  return question({
    prompt: `I hvilken kvadrant ligger punktet (${px}, ${py})?`,
    visual: { type: 'koordinat', min: -5, max: 5, point: [px, py] },
    choiceType: 'text',
    choices: choicesFrom(`${q}. kvadrant`, [1, 2, 3, 4].filter((k) => k !== q).map((k) => `${k}. kvadrant`)),
    correct: `${q}. kvadrant`,
    explanation: {
      text: `x ${px > 0 ? '> 0' : '< 0'} og y ${py > 0 ? '> 0' : '< 0'} gir ${q}. kvadrant.`,
      visual: { type: 'koordinat', min: -5, max: 5, point: [px, py] },
    },
  });
}

// ---- Forhold og proporsjonalitet ----

function forholdDeling() {
  const r1 = randInt(1, 3);
  const r2 = randInt(r1 + 1, 5);
  const unit = randInt(2, 6);
  const total = (r1 + r2) * unit;
  const bigger = r2 * unit;
  return question({
    prompt: `Del ${total} kr i forholdet ${r1}:${r2}. Hvor mye er den STØRSTE delen?`,
    choices: makeChoices(bigger, { min: 0, spread: 3 }),
    correct: bigger,
    explanation: { text: `${r1} + ${r2} = ${r1 + r2} deler. ${total} : ${r1 + r2} = ${unit} per del, og ${r2} · ${unit} = ${bigger}.`, visual: null },
  });
}

function omvendtProp() {
  const workers1 = pick([2, 3, 4]);
  const hours1 = pick([6, 8, 12, 24]);
  const work = workers1 * hours1;
  const opts = [2, 3, 4, 6, 8, 12].filter((w) => w !== workers1 && work % w === 0);
  const workers2 = pick(opts.length ? opts : [workers1 * 2]);
  const correct = work / workers2;
  return question({
    prompt: `${workers1} roboter 🤖 bygger en bro på ${hours1} timer. Hvor lang tid bruker ${workers2} roboter på samme jobb?`,
    choices: makeChoices(correct, { min: 1, spread: 3 }),
    correct,
    explanation: { text: `Jobben er ${workers1} · ${hours1} = ${work} robottimer. ${work} : ${workers2} = ${correct} timer.`, visual: null },
  });
}

export const pools = {
  1: [() => functionValue(), () => functionValue(), () => nextInSequence(), () => proportion(), () => nteLedd()],
  2: [() => functionValue(), () => nextInSequence(), () => proportion(), () => functionRule(), () => stigningstall(), () => nteLedd()],
  3: [() => functionRule(), () => functionValue(), () => proportion(), () => coordPlot(), () => stigningstall(), () => kvadrant()],
  4: [() => functionRule(), () => proportion(), () => rate(), () => coordPlot(), () => kvadrant(), () => finnXavY()],
  5: [() => rate(), () => functionValue(), () => coordPlot(), () => percentChange(), () => finnXavY(), () => punktPaaLinje()],
  6: [() => equationBothSides(), () => functionRule(), () => rate(), () => percentChange(), () => likningParentes(), () => punktPaaLinje()],
  7: [() => equationBothSides(), () => functionValue(), () => coordPlot(), () => percentChange(), () => forholdDeling(), () => kvadrant()],
  8: [() => equationBothSides(), () => functionRule(), () => rate(), () => proportion(), () => likningParentes(), () => omvendtProp()],
  9: [() => equationBothSides(), () => percentChange(), () => coordPlot(), () => functionValue(), () => forholdDeling(), () => finnXavY()],
  10: [() => equationBothSides(), () => functionRule(), () => percentChange(), () => rate(), () => omvendtProp(), () => likningParentes()],
};
