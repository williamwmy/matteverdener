// Verden 1 — Tallskogen (1.–2. trinn)
// LK20-mål: ordne/sammenligne tall og mengder, telling forlengs/baklengs med
// ulike startpunkt og differanse, partall/oddetall, posisjonssystemet,
// tallinja i regning, addisjon/subtraksjon, kommutativ egenskap, repeterende
// mønstre, og problemløsing fra lek og natur.

import {
  CHOICE_COUNT,
  randInt,
  pick,
  shuffle,
  makeChoices,
  choicesFrom,
  question,
  basicQuestion,
  missingQuestion,
} from '../questionHelpers.js';

const FOREST_ACTORS = [
  { name: 'Ekornet', emoji: '🐿️', pronoun: 'det', item: '🌰', itemName: 'nøtter' },
  { name: 'Pinnsvinet', emoji: '🦔', pronoun: 'det', item: '🍄', itemName: 'sopper' },
  { name: 'Haren', emoji: '🐰', pronoun: 'den', item: '🥕', itemName: 'gulrøtter' },
  { name: 'Ugla', emoji: '🦉', pronoun: 'den', item: '🪶', itemName: 'fjær' },
  { name: 'Bjørnen', emoji: '🐻', pronoun: 'den', item: '🫐', itemName: 'blåbær' },
  { name: 'Reven', emoji: '🦊', pronoun: 'den', item: '🍂', itemName: 'blader' },
];

const COUNT_ANIMALS = [
  { plural: 'rever', emoji: '🦊' },
  { plural: 'harer', emoji: '🐰' },
  { plural: 'pinnsvin', emoji: '🦔' },
  { plural: 'ugler', emoji: '🦉' },
  { plural: 'ekorn', emoji: '🐿️' },
];

const COUNT_KINDS = [
  ...COUNT_ANIMALS,
  { plural: 'trær', emoji: '🌲' },
  { plural: 'sopper', emoji: '🍄' },
];

const PATTERN_EMOJIS = ['🌲', '🍄', '🦊', '🌰', '🍂', '🐰', '🌿', '⭐'];

// ---- Nomer ----

function nomerRecognition(min, max) {
  const value = randInt(min, max);
  return question({
    prompt: 'Hvor mange prikker ser du?',
    visual: { type: 'nomer', values: [value] },
    choices: makeChoices(value, { min: 1, max: 10, spread: 2 }),
    correct: value,
    explanation: { text: `Mønsteret viser ${value}.`, visual: { type: 'nomer', values: [value] } },
  });
}

function nomerPick(min, max) {
  const value = randInt(min, max);
  return question({
    prompt: 'Trykk på mønsteret som viser:',
    expression: String(value),
    choiceType: 'nomer',
    choices: makeChoices(value, { min: 1, max: 10, spread: 2 }),
    correct: value,
    explanation: { text: `Dette mønsteret viser ${value}.`, visual: { type: 'nomer', values: [value] } },
  });
}

function nomerAddition(maxAddend, maxSum) {
  const a = randInt(1, Math.min(maxAddend, maxSum - 1));
  const b = randInt(1, Math.min(maxAddend, maxSum - a));
  const sum = a + b;
  return question({
    prompt: 'Hvor mange prikker er det til sammen?',
    expression: `${a} + ${b}`,
    visual: { type: 'nomer', values: [a, b], op: '+' },
    choices: makeChoices(sum, { min: 0, max: maxSum + 6, spread: 2 }),
    correct: sum,
    explanation: { text: `${a} + ${b} = ${sum}`, visual: { type: 'nomer', values: [a, b], op: '+' } },
  });
}

function nomerSubtraction(maxA) {
  const a = randInt(3, Math.min(maxA, 10));
  const b = randInt(1, a - 1);
  const diff = a - b;
  return question({
    prompt: 'Hvor mange prikker blir igjen?',
    expression: `${a} − ${b}`,
    visual: { type: 'nomer', values: [a, b], op: '−' },
    choices: makeChoices(diff, { min: 0, max: 10, spread: 2 }),
    correct: diff,
    explanation: { text: `${a} − ${b} = ${diff}`, visual: { type: 'nomer', values: [a, b], op: '−' } },
  });
}

// ---- Tallinja ----

function tallinjePlasser({ maxStart = 0, step = 1 } = {}) {
  const span = 10;
  const from = step === 1 ? randInt(0, maxStart) : 0;
  const to = from + span * step;
  const hiddenVal = from + step * randInt(2, span - 2);
  return question({
    prompt: 'Hvilket tall skal stå der spørsmålstegnet er?',
    visual: { type: 'tallinje', from, to, step, hidden: [hiddenVal] },
    choices: makeChoices(hiddenVal, { min: 0, spread: Math.max(2, step) }),
    correct: hiddenVal,
    explanation: { text: `Tallet ${hiddenVal} skal stå der.`, visual: { type: 'tallinje', from, to, step, hidden: [] } },
  });
}

function tallinjeHoppAdd({ maxStart = 8, maxHopp = 5 } = {}) {
  const a = randInt(1, maxStart);
  const b = randInt(2, maxHopp);
  const visual = { type: 'tallinje', from: Math.max(0, a - 1), to: a + b + 1, step: 1, hidden: [], jump: { start: a, hops: b, dir: 'up' } };
  return question({
    prompt: `Start på ${a} og hopp ${b} frem. Hvor lander du?`,
    expression: `${a} + ${b}`,
    visual,
    choices: makeChoices(a + b, { min: 0, spread: 2 }),
    correct: a + b,
    explanation: { text: `${a} + ${b} = ${a + b}`, visual },
  });
}

function tallinjeHoppSub({ maxStart = 14, maxHopp = 5 } = {}) {
  const b = randInt(2, maxHopp);
  const a = randInt(b + 1, maxStart);
  const visual = { type: 'tallinje', from: Math.max(0, a - b - 1), to: a + 1, step: 1, hidden: [], jump: { start: a, hops: b, dir: 'down' } };
  return question({
    prompt: `Start på ${a} og hopp ${b} bakover. Hvor lander du?`,
    expression: `${a} − ${b}`,
    visual,
    choices: makeChoices(a - b, { min: 0, spread: 2 }),
    correct: a - b,
    explanation: { text: `${a} − ${b} = ${a - b}`, visual },
  });
}

function telleRekke({ diffs = [1], maxStart = 10, allowDown = false } = {}) {
  const d = pick(diffs);
  const down = allowDown && Math.random() < 0.5;
  const shown = 4;
  const start = down ? randInt(shown * d, maxStart + shown * d) : randInt(0, maxStart);
  const terms = Array.from({ length: shown }, (_, i) => (down ? start - i * d : start + i * d));
  const correct = down ? start - shown * d : start + shown * d;
  const label = down ? `−${d}` : `+${d}`;
  const labels = Array(shown - 1).fill(label);
  return question({
    prompt: 'Hva er det neste tallet i tellerekka?',
    expression: terms.join(', ') + ', ?',
    choices: makeChoices(correct, { min: 0, spread: Math.max(2, d) }),
    correct,
    visual: { type: 'sekvens', terms, answer: correct, labels },
    explanation: {
      text: `Tellerekka ${down ? 'minker' : 'øker'} med ${d} om gangen. Neste tall er ${correct}.`,
      visual: { type: 'sekvens', terms, answer: correct, labels: [...labels, label], reveal: true },
    },
  });
}

// ---- Telling i skogen ----

function buildScene(targetKind, targetCount, distractorKinds, maxPerKind) {
  const items = Array(targetCount).fill(targetKind.emoji);
  for (const kind of distractorKinds) items.push(...Array(randInt(1, maxPerKind)).fill(kind.emoji));
  while (items.length > 14) {
    const i = items.findIndex((e) => e !== targetKind.emoji);
    if (i === -1) break;
    items.splice(i, 1);
  }
  return shuffle(items);
}

function telleScene({ maxTarget = 6, distractors = 1 } = {}) {
  const kinds = shuffle(COUNT_KINDS);
  const target = kinds[0];
  const n = randInt(2, maxTarget);
  const items = buildScene(target, n, kinds.slice(1, 1 + distractors), Math.min(6, maxTarget));
  const visual = { type: 'telle', items };
  return question({
    prompt: `Hvor mange ${target.plural} ${target.emoji} ser du?`,
    visual,
    choices: makeChoices(n, { min: 0, max: 15, spread: 2 }),
    correct: n,
    explanation: { text: `Det er ${n} ${target.plural} i bildet.`, visual },
  });
}

function telleSceneAlle() {
  const kinds = shuffle(COUNT_ANIMALS).slice(0, 3);
  const counts = kinds.map(() => randInt(1, 4));
  const total = counts.reduce((sum, c) => sum + c, 0);
  const items = shuffle(kinds.flatMap((kind, i) => Array(counts[i]).fill(kind.emoji)));
  const visual = { type: 'telle', items };
  return question({
    prompt: 'Hvor mange dyr ser du til sammen?',
    visual,
    choices: makeChoices(total, { min: 0, max: 15, spread: 2 }),
    correct: total,
    explanation: { text: `Det er ${total} dyr i bildet til sammen.`, visual },
  });
}

function flestDyr() {
  const kinds = shuffle(COUNT_ANIMALS).slice(0, 4);
  const counts = shuffle(pick([
    [1, 2, 3, 5],
    [1, 2, 4, 6],
    [1, 3, 4, 5],
    [2, 3, 4, 5],
  ]));
  const maxIndex = counts.indexOf(Math.max(...counts));
  const items = shuffle(kinds.flatMap((kind, i) => Array(counts[i]).fill(kind.emoji)));
  const visual = { type: 'telle', items };
  return question({
    prompt: 'Hvilket dyr er det flest av?',
    visual,
    choiceType: 'emoji',
    choices: shuffle(kinds.map((kind) => kind.emoji)),
    correct: kinds[maxIndex].emoji,
    explanation: { text: `Det er flest ${kinds[maxIndex].plural} ${kinds[maxIndex].emoji} — hele ${counts[maxIndex]} stykker!`, visual },
  });
}

function monsterEmoji() {
  const palette = shuffle(PATTERN_EMOJIS);
  const unitLen = pick([2, 2, 3]);
  const unit = palette.slice(0, unitLen);
  const seqLen = unitLen === 2 ? 5 : 7;
  const seq = Array.from({ length: seqLen }, (_, i) => unit[i % unitLen]);
  const correct = unit[seqLen % unitLen];
  const distractors = palette.filter((e) => e !== correct).slice(0, 3);
  return question({
    prompt: 'Hva kommer etter i mønsteret?',
    expression: seq.join(' ') + '  ?',
    choiceType: 'emoji',
    choices: shuffle([correct, ...distractors]),
    correct,
    explanation: { text: `Mønsteret gjentar seg: ${unit.join(' ')}`, visual: null },
  });
}

// ---- Tallforståelse ----

function biggestOrSmallest(cap) {
  const numbers = new Set();
  while (numbers.size < CHOICE_COUNT) numbers.add(randInt(1, cap));
  const choices = shuffle([...numbers]);
  const wantBiggest = Math.random() < 0.5;
  const correct = wantBiggest ? Math.max(...choices) : Math.min(...choices);
  return question({
    prompt: wantBiggest ? 'Hvilket tall er størst?' : 'Hvilket tall er minst?',
    choices,
    correct,
    explanation: { text: `${correct} er ${wantBiggest ? 'det største' : 'det minste'} tallet.`, visual: null },
  });
}

function partallOddetall(cap) {
  const wantEven = Math.random() < 0.5;
  const pickParity = (even) => {
    let n;
    do {
      n = randInt(1, cap);
    } while (n % 2 !== (even ? 0 : 1));
    return n;
  };
  const correct = pickParity(wantEven);
  const distractors = new Set();
  let guard = 0;
  while (distractors.size < 3 && guard++ < 200) distractors.add(pickParity(!wantEven));
  return question({
    prompt: wantEven ? 'Hvilket tall er et partall?' : 'Hvilket tall er et oddetall?',
    choices: shuffle([correct, ...distractors]),
    correct,
    explanation: {
      text: wantEven
        ? `${correct} er et partall — det kan deles i to like grupper.`
        : `${correct} er et oddetall — én blir alltid til overs når du deler i to.`,
      visual: null,
    },
  });
}

function tiereEnere() {
  if (Math.random() < 0.5) {
    const t = randInt(1, 9);
    const e = randInt(1, 9);
    const correct = t * 10 + e;
    const candidates = [e * 10 + t, correct + 10, correct - 10, t + e, correct + 1, correct - 1];
    const distractors = [...new Set(candidates)].filter((c) => c >= 0 && c !== correct).slice(0, 3);
    const visual = { type: 'mynter', tens: t, ones: e };
    return question({
      prompt: `Hvilket tall har ${t} tiere og ${e} enere?`,
      visual,
      choices: shuffle([correct, ...distractors]),
      correct,
      explanation: { text: `${t} tiere er ${t * 10}, pluss ${e} enere blir ${correct}.`, visual },
    });
  }
  const n = randInt(21, 99);
  const correct = Math.floor(n / 10);
  const visual = { type: 'mynter', tens: correct, ones: n % 10 };
  return question({
    prompt: `Hvor mange tiere er det i tallet ${n}?`,
    visual,
    choices: makeChoices(correct, { min: 0, max: 10, spread: 2 }),
    correct,
    explanation: { text: `${n} har ${correct} tiere og ${n % 10} enere.`, visual },
  });
}

function kommutativ(cap) {
  const a = randInt(2, cap - 2);
  let b = randInt(2, cap - 2);
  while (b === a) b = randInt(2, cap - 2);
  const distractors = new Set([b, a + b]);
  let guard = 0;
  while (distractors.size < 3 && guard++ < 100) {
    const c = a + randInt(1, 3) * (Math.random() < 0.5 ? -1 : 1);
    if (c >= 0 && c !== a) distractors.add(c);
  }
  return question({
    prompt: 'Hvilket tall mangler?',
    expression: `${a} + ${b} = ${b} + ?`,
    choices: shuffle([a, ...distractors]),
    correct: a,
    explanation: { text: `${a} + ${b} = ${b} + ${a} — rekkefølgen spiller ingen rolle når vi legger sammen.`, visual: null },
  });
}

// ---- Regning ----

function plainAddSub(cap) {
  const spread = Math.max(3, Math.round(cap / 12));
  if (Math.random() < 0.5) {
    const a = randInt(5, cap - 4);
    const b = randInt(3, cap - a);
    return basicQuestion(`${a} + ${b}`, a + b, { max: cap + 10, spread });
  }
  const a = randInt(8, cap);
  const b = randInt(3, a - 2);
  return basicQuestion(`${a} − ${b}`, a - b, { spread });
}

function missingNumber(cap) {
  const spread = Math.max(2, Math.round(cap / 15));
  const variant = pick(['x+b=c', 'a+x=c', 'a-x=b', 'x-b=c']);
  if (variant === 'x+b=c' || variant === 'a+x=c') {
    const c = randInt(5, cap);
    const known = randInt(1, c - 1);
    const correct = c - known;
    const expression = variant === 'x+b=c' ? `? + ${known} = ${c}` : `${known} + ? = ${c}`;
    return missingQuestion(expression, correct, { spread });
  }
  if (variant === 'a-x=b') {
    const a = randInt(5, cap);
    const b = randInt(1, a - 1);
    return missingQuestion(`${a} − ? = ${b}`, a - b, { spread });
  }
  const b = randInt(1, Math.max(2, Math.round(cap / 2)));
  const c = randInt(1, cap - b);
  return missingQuestion(`? − ${b} = ${c}`, b + c, { spread });
}

function doublesHalves(cap) {
  if (Math.random() < 0.5) {
    const n = randInt(2, Math.floor(cap / 2));
    return question({
      prompt: `Hva er dobbelt så mye som ${n}?`,
      choices: makeChoices(n * 2, { min: 0, spread: Math.max(2, Math.round(n / 2)) }),
      correct: n * 2,
      explanation: { text: `Dobbelt så mye som ${n} er ${n} + ${n} = ${n * 2}.`, visual: null },
    });
  }
  const half = randInt(2, Math.floor(cap / 2));
  const m = half * 2;
  return question({
    prompt: `Hva er halvparten av ${m}?`,
    choices: makeChoices(half, { min: 0, spread: Math.max(2, Math.round(half / 2)) }),
    correct: half,
    explanation: { text: `Halvparten av ${m} er ${half}, fordi ${half} + ${half} = ${m}.`, visual: null },
  });
}

function tensMoreLess(cap) {
  const more = Math.random() < 0.5;
  const n = randInt(11, cap - 10);
  const correct = more ? n + 10 : n - 10;
  return question({
    prompt: more ? `Hva er 10 mer enn ${n}?` : `Hva er 10 mindre enn ${n}?`,
    choices: makeChoices(correct, { min: 0, spread: 10 }),
    correct,
    explanation: { text: more ? `${n} + 10 = ${correct}` : `${n} − 10 = ${correct}`, visual: null },
  });
}

function threeTerms(cap) {
  const spread = Math.max(4, Math.round(cap / 12));
  if (Math.random() < 0.5) {
    const a = randInt(5, Math.floor(cap / 2));
    const b = randInt(3, Math.floor(cap / 3));
    const c = randInt(2, Math.min(40, a + b - 1));
    return basicQuestion(`${a} + ${b} − ${c}`, a + b - c, { spread });
  }
  const a = randInt(3, Math.floor(cap / 3));
  const b = randInt(3, Math.floor(cap / 3));
  const c = randInt(2, cap - a - b);
  return basicQuestion(`${a} + ${b} + ${c}`, a + b + c, { spread });
}

function doubleMissing(cap) {
  const b = randInt(Math.round(cap / 6), Math.round(cap / 2));
  const c = randInt(Math.round(cap / 10), Math.round(cap / 3));
  const target = b + c;
  const a = randInt(2, target - 2);
  return missingQuestion(`${a} + ? = ${b} + ${c}`, target - a, { spread: Math.max(4, Math.round(cap / 15)) });
}

function storyProblem(cap, kind) {
  const actor = pick(FOREST_ACTORS);
  const spread = Math.max(2, Math.round(cap / 12));
  if (kind === 'add') {
    const a = randInt(2, cap - 2);
    const b = randInt(1, cap - a);
    return question({
      prompt: `${actor.name} ${actor.emoji} har ${a} ${actor.itemName} ${actor.item} og finner ${b} til. Hvor mange ${actor.itemName} har ${actor.pronoun} nå?`,
      choices: makeChoices(a + b, { min: 0, spread }),
      correct: a + b,
      explanation: { text: `${a} + ${b} = ${a + b}`, visual: null },
    });
  }
  if (kind === 'sub') {
    const a = randInt(3, cap);
    const b = randInt(1, a - 1);
    return question({
      prompt: `${actor.name} ${actor.emoji} har ${a} ${actor.itemName} ${actor.item} og mister ${b}. Hvor mange ${actor.itemName} er igjen?`,
      choices: makeChoices(a - b, { min: 0, spread }),
      correct: a - b,
      explanation: { text: `${a} − ${b} = ${a - b}`, visual: null },
    });
  }
  const a = randInt(5, cap);
  const b = randInt(2, a - 2);
  const c = randInt(1, Math.max(1, cap - (a - b)));
  const correct = a - b + c;
  return question({
    prompt: `${actor.name} ${actor.emoji} plukker ${a} ${actor.itemName} ${actor.item}, mister ${b} og finner ${c} til. Hvor mange ${actor.itemName} har ${actor.pronoun} nå?`,
    choices: makeChoices(correct, { min: 0, spread: Math.max(3, spread) }),
    correct,
    explanation: { text: `${a} − ${b} + ${c} = ${correct}`, visual: null },
  });
}

// Hvert nivå trekker tilfeldig fra sin pool; dupliserte innslag gir høyere vekt.
export const pools = {
  1: [
    () => telleScene({ maxTarget: 5, distractors: 1 }),
    () => telleScene({ maxTarget: 5, distractors: 1 }),
    () => nomerRecognition(1, 8),
    () => nomerPick(1, 6),
    () => tallinjePlasser({ maxStart: 0 }),
    () => biggestOrSmallest(10),
    () => monsterEmoji(),
  ],
  2: [
    () => telleScene({ maxTarget: 8, distractors: 2 }),
    () => nomerRecognition(3, 10),
    () => nomerPick(3, 10),
    () => tallinjePlasser({ maxStart: 10 }),
    () => telleRekke({ diffs: [1], maxStart: 15, allowDown: true }),
    () => nomerAddition(4, 8),
    () => monsterEmoji(),
  ],
  3: [
    () => tallinjeHoppAdd({ maxStart: 8, maxHopp: 5 }),
    () => nomerAddition(6, 12),
    () => nomerSubtraction(8),
    () => telleSceneAlle(),
    () => flestDyr(),
    () => telleRekke({ diffs: [1, 2], maxStart: 15, allowDown: true }),
    () => missingNumber(10),
  ],
  4: [
    () => tallinjeHoppAdd({ maxStart: 12, maxHopp: 6 }),
    () => tallinjeHoppSub({ maxStart: 14, maxHopp: 6 }),
    () => storyProblem(15, pick(['add', 'sub'])),
    () => partallOddetall(20),
    () => telleRekke({ diffs: [2, 5], maxStart: 20, allowDown: true }),
    () => kommutativ(15),
    () => nomerSubtraction(10),
  ],
  5: [
    () => tallinjeHoppSub({ maxStart: 18, maxHopp: 6 }),
    () => plainAddSub(30),
    () => tiereEnere(),
    () => telleRekke({ diffs: [5, 10], maxStart: 40, allowDown: true }),
    () => missingNumber(20),
    () => storyProblem(20, pick(['add', 'sub'])),
    () => doublesHalves(30),
  ],
  6: [
    () => plainAddSub(50),
    () => tiereEnere(),
    () => kommutativ(30),
    () => telleRekke({ diffs: [10], maxStart: 50, allowDown: true }),
    () => threeTerms(30),
    () => storyProblem(30, pick(['add', 'sub'])),
    () => tallinjePlasser({ step: 10 }),
    () => missingNumber(30),
  ],
  7: [
    () => plainAddSub(100),
    () => missingNumber(50),
    () => threeTerms(60),
    () => storyProblem(50, pick(['add', 'sub'])),
    () => tensMoreLess(90),
    () => tiereEnere(),
    () => telleRekke({ diffs: [2, 5, 10], maxStart: 80, allowDown: true }),
  ],
  8: [
    () => plainAddSub(100),
    () => missingNumber(100),
    () => threeTerms(100),
    () => storyProblem(80, 'twoStep'),
    () => tensMoreLess(100),
    () => kommutativ(50),
  ],
  9: [
    () => threeTerms(150),
    () => doubleMissing(120),
    () => storyProblem(100, 'twoStep'),
    () => plainAddSub(150),
    () => missingNumber(120),
  ],
  10: [
    () => threeTerms(200),
    () => doubleMissing(200),
    () => storyProblem(150, 'twoStep'),
    () => missingNumber(200),
    () => plainAddSub(200),
  ],
};
