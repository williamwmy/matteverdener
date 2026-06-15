// Verden 5 — Dyphavet (5.–6. trinn)
// LK20-mål (mot 6. trinn): prosent og sammenhengen mellom brøk, desimaltall
// og prosent; statistikk (gjennomsnitt, median, typetall, søylediagram); og
// enkel sannsynlighet. Tema: blekksprut, fiskestimer, ubåt og dyphavsdyr.

import { randInt, pick, shuffle, makeChoices, choicesFrom, question } from '../questionHelpers.js';

const FISH = [
  { emoji: '🐟', label: 'blå fisk' },
  { emoji: '🐠', label: 'gul fisk' },
  { emoji: '🐡', label: 'kulefisk' },
  { emoji: '🦑', label: 'blekksprut' },
  { emoji: '🦐', label: 'reke' },
];

// ---- Prosent ----

function percentOfQuantity() {
  const p = pick([10, 20, 25, 50, 75]);
  const base = pick([20, 40, 60, 80, 100, 200]);
  const correct = (base * p) / 100;
  return question({
    prompt: `En stim 🐟 har ${base} fisk. ${p} % svømmer mot ubåten. Hvor mange fisk svømmer mot ubåten?`,
    choices: makeChoices(correct, { min: 0, spread: Math.max(2, Math.round(correct / 4)) }),
    correct,
    explanation: { text: `${p} % av ${base} er ${correct}.`, visual: null },
  });
}

const PERCENT_TABLE = [
  { p: 50, frac: '1/2', dec: '0,5' },
  { p: 25, frac: '1/4', dec: '0,25' },
  { p: 75, frac: '3/4', dec: '0,75' },
  { p: 10, frac: '1/10', dec: '0,1' },
  { p: 20, frac: '1/5', dec: '0,2' },
];

function percentConvert() {
  const item = pick(PERCENT_TABLE);
  const others = PERCENT_TABLE.filter((x) => x.p !== item.p);
  if (Math.random() < 0.5) {
    return question({
      prompt: `Hvor mange prosent er ${item.frac}?`,
      choiceType: 'text',
      choices: choicesFrom(`${item.p} %`, others.map((o) => `${o.p} %`)),
      correct: `${item.p} %`,
      explanation: { text: `${item.frac} = ${item.p} %.`, visual: null },
    });
  }
  return question({
    prompt: `Hvilken brøk er det samme som ${item.p} %?`,
    choiceType: 'text',
    choices: choicesFrom(item.frac, others.map((o) => o.frac)),
    correct: item.frac,
    explanation: { text: `${item.p} % = ${item.frac}.`, visual: null },
  });
}

function percentPart() {
  const total = 100;
  const part = pick([10, 20, 30, 40, 60, 70]);
  return question({
    prompt: `${part} av ${total} blekkspruter 🦑 er røde. Hvor mange prosent er røde?`,
    choiceType: 'text',
    choices: choicesFrom(`${part} %`, [`${part + 10} %`, `${part - 10} %`, `${part / 2} %`, `${part + 5} %`]),
    correct: `${part} %`,
    explanation: { text: `${part} av 100 er ${part} %.`, visual: null },
  });
}

// ---- Statistikk ----

function meanDepth() {
  const count = pick([2, 3, 4]);
  const mean = randInt(20, 80);
  // Bygg verdier som summerer til mean*count.
  const values = [];
  let rest = mean * count;
  for (let i = 0; i < count - 1; i++) {
    const v = randInt(Math.max(10, mean - 15), mean + 15);
    values.push(v);
    rest -= v;
  }
  values.push(rest);
  if (rest < 5) return meanDepth(); // prøv igjen ved urimelig verdi
  return question({
    prompt: `Ubåten 🤿 dykket til ${values.join(', ')} meter. Hva er gjennomsnittsdybden?`,
    choices: makeChoices(mean, { min: 0, spread: 4 }),
    correct: mean,
    explanation: { text: `(${values.join(' + ')}) : ${count} = ${mean}.`, visual: null },
  });
}

function median() {
  const set = new Set();
  while (set.size < 5) set.add(randInt(1, 30));
  const sorted = [...set].sort((a, b) => a - b);
  const correct = sorted[2];
  return question({
    prompt: `Tallene er ${sorted.join(', ')}. Hva er medianen (det midterste tallet)?`,
    choices: choicesFrom(correct, [sorted[1], sorted[3], sorted[0], sorted[4]]),
    correct,
    explanation: { text: `Når tallene står i rekkefølge, er ${correct} det midterste.`, visual: null },
  });
}

function mode() {
  const repeated = randInt(2, 9);
  // Tre unike «andre» tall slik at typetallet blir entydig.
  const others = [];
  while (others.length < 3) {
    const v = randInt(2, 9);
    if (v !== repeated && !others.includes(v)) others.push(v);
  }
  const shown = shuffle([repeated, repeated, repeated, ...others]);
  return question({
    prompt: `Hva er typetallet (tallet som går igjen flest ganger) i ${shown.join(', ')}?`,
    choices: choicesFrom(repeated, others),
    correct: repeated,
    explanation: { text: `${repeated} går igjen tre ganger — flere enn de andre.`, visual: null },
  });
}

function buildChart(bars = pick([3, 4])) {
  const kinds = shuffle(FISH).slice(0, bars);
  const data = kinds.map((k) => ({ label: k.label, emoji: k.emoji, value: randInt(2, 9) }));
  return data;
}

function chartMost() {
  // Fire søyler gir fire emoji-svaralternativer.
  const data = buildChart(4);
  const top = data.reduce((a, b) => (b.value > a.value ? b : a));
  // Sørg for unik vinner.
  if (data.filter((d) => d.value === top.value).length > 1) return chartMost();
  return question({
    prompt: 'Søylediagrammet viser fangsten. Hvilket dyr ble det flest av?',
    visual: { type: 'soyle', data, unit: '' },
    choiceType: 'emoji',
    choices: shuffle(data.map((d) => d.emoji)),
    correct: top.emoji,
    explanation: { text: `${top.label} ${top.emoji} har den høyeste søylen (${top.value}).`, visual: { type: 'soyle', data } },
  });
}

function chartDiff() {
  const data = buildChart();
  const sorted = [...data].sort((a, b) => b.value - a.value);
  const a = sorted[0];
  const b = sorted[sorted.length - 1];
  if (a.value === b.value) return chartDiff();
  const correct = a.value - b.value;
  return question({
    prompt: `Hvor mange flere ${a.label} ${a.emoji} enn ${b.label} ${b.emoji} er det?`,
    visual: { type: 'soyle', data, unit: '' },
    choices: makeChoices(correct, { min: 0, spread: 2 }),
    correct,
    explanation: { text: `${a.value} − ${b.value} = ${correct}.`, visual: { type: 'soyle', data } },
  });
}

function chartTotal() {
  const data = buildChart();
  const total = data.reduce((sum, d) => sum + d.value, 0);
  return question({
    prompt: 'Hvor mange dyr ble fanget til sammen?',
    visual: { type: 'soyle', data, unit: '' },
    choices: makeChoices(total, { min: 0, spread: 3 }),
    correct: total,
    explanation: { text: `${data.map((d) => d.value).join(' + ')} = ${total}.`, visual: { type: 'soyle', data } },
  });
}

// ---- Sannsynlighet ----

function probabilityCount() {
  const total = pick([5, 6, 8, 10]);
  const k = randInt(1, total - 1);
  const kind = pick(FISH);
  return question({
    prompt: `I en håv er det ${total} sjødyr. ${k} er ${kind.label} ${kind.emoji}. Hvor mange av ${total} er IKKE ${kind.label}?`,
    choices: makeChoices(total - k, { min: 0, max: total, spread: 2 }),
    correct: total - k,
    explanation: { text: `${total} − ${k} = ${total - k}.`, visual: null },
  });
}

function probabilityFraction() {
  const total = pick([4, 5, 8, 10]);
  const k = randInt(1, total - 1);
  const kind = pick(FISH);
  return question({
    prompt: `I en håv er det ${total} sjødyr, og ${k} er ${kind.label} ${kind.emoji}. Hva er sjansen for å fange en ${kind.label}?`,
    choiceType: 'text',
    choices: choicesFrom(`${k}/${total}`, [`${total}/${k}`, `${k + 1}/${total}`, `${k}/${total + 1}`, `${total - k}/${total}`]),
    correct: `${k}/${total}`,
    explanation: { text: `${k} av ${total} er ${kind.label}, så sjansen er ${k}/${total}.`, visual: null },
  });
}

// ---- Mer prosent ----

function desimalProsent() {
  const t = randInt(1, 9);
  const p = t * 10;
  const dec = String(t / 10).replace('.', ',');
  return question({
    prompt: `Hvor mange prosent er ${dec}?`,
    choiceType: 'text',
    choices: choicesFrom(`${p} %`, [`${p + 10} %`, `${p - 10} %`, `${t} %`, `${p + 5} %`]),
    correct: `${p} %`,
    explanation: { text: `${dec} = ${p} %.`, visual: null },
  });
}

function prosentOkning() {
  const base = pick([20, 40, 60, 80, 100, 200]);
  const p = pick([10, 20, 25, 50]);
  const change = (base * p) / 100;
  const correct = base + change;
  return question({
    prompt: `En fiskefangst på ${base} kg øker med ${p} %. Hvor mange kg blir det?`,
    choices: makeChoices(correct, { min: 0, spread: Math.max(4, Math.round(change / 2)) }),
    correct,
    explanation: { text: `${p} % av ${base} er ${change}. ${base} + ${change} = ${correct} kg.`, visual: null },
  });
}

function prosentRabatt() {
  const base = pick([40, 60, 80, 100, 200]);
  const p = pick([10, 20, 25, 50]);
  const change = (base * p) / 100;
  const correct = base - change;
  return question({
    prompt: `Dykkerutstyr koster ${base} kr. Det er ${p} % rabatt. Hva er den nye prisen?`,
    choices: makeChoices(correct, { min: 0, spread: Math.max(4, Math.round(change / 2)) }),
    correct,
    explanation: { text: `${p} % av ${base} er ${change}. ${base} − ${change} = ${correct} kr.`, visual: null },
  });
}

function sannsynlighetProsent() {
  const item = pick([[1, 2, 50], [1, 4, 25], [3, 4, 75], [1, 5, 20], [2, 5, 40], [1, 10, 10]]);
  const [k, n, p] = item;
  return question({
    prompt: `Sjansen for å fange en blekksprut 🦑 er ${k}/${n}. Hvor mange prosent er det?`,
    choiceType: 'text',
    choices: choicesFrom(`${p} %`, [`${p + 10} %`, `${p - 10} %`, `${k * 10} %`, `${p + 25} %`, `${100 - p} %`]),
    correct: `${p} %`,
    explanation: { text: `${k}/${n} = ${p} %.`, visual: null },
  });
}

// ---- Mer statistikk ----

function variasjonsbredde() {
  const set = new Set();
  while (set.size < 5) set.add(randInt(2, 40));
  const arr = [...set];
  const correct = Math.max(...arr) - Math.min(...arr);
  return question({
    prompt: `Ubåten 🤿 målte dybdene ${arr.join(', ')} m. Hva er variasjonsbredden (størst − minst)?`,
    choices: makeChoices(correct, { min: 1, spread: 3 }),
    correct,
    explanation: { text: `${Math.max(...arr)} − ${Math.min(...arr)} = ${correct}.`, visual: null },
  });
}

function chartLeast() {
  const data = buildChart(4);
  const bot = data.reduce((a, b) => (b.value < a.value ? b : a));
  if (data.filter((d) => d.value === bot.value).length > 1) return chartLeast();
  return question({
    prompt: 'Søylediagrammet viser fangsten. Hvilket dyr ble det FÆRREST av?',
    visual: { type: 'soyle', data, unit: '' },
    choiceType: 'emoji',
    choices: shuffle(data.map((d) => d.emoji)),
    correct: bot.emoji,
    explanation: { text: `${bot.label} ${bot.emoji} har den laveste søylen (${bot.value}).`, visual: { type: 'soyle', data } },
  });
}

// ---- Kombinatorikk ----

function kombinasjoner() {
  const a = randInt(2, 4);
  const b = randInt(2, 4);
  return question({
    prompt: `En dykker 🤿 kan velge mellom ${a} drakter og ${b} masker. Hvor mange ulike kombinasjoner finnes det?`,
    choices: makeChoices(a * b, { min: 1, spread: 2 }),
    correct: a * b,
    explanation: { text: `${a} · ${b} = ${a * b} kombinasjoner.`, visual: null },
  });
}

export const pools = {
  1: [() => chartMost(), () => chartTotal(), () => percentOfQuantity(), () => probabilityCount(), () => chartLeast(), () => kombinasjoner()],
  2: [() => chartMost(), () => chartDiff(), () => percentOfQuantity(), () => probabilityCount(), () => chartLeast(), () => kombinasjoner()],
  3: [() => chartDiff(), () => chartTotal(), () => percentConvert(), () => probabilityCount(), () => variasjonsbredde(), () => desimalProsent()],
  4: [() => percentOfQuantity(), () => percentConvert(), () => meanDepth(), () => probabilityFraction(), () => desimalProsent(), () => variasjonsbredde()],
  5: [() => percentOfQuantity(), () => percentPart(), () => meanDepth(), () => mode(), () => prosentOkning(), () => kombinasjoner()],
  6: [() => percentPart(), () => percentConvert(), () => median(), () => mode(), () => prosentRabatt(), () => variasjonsbredde()],
  7: [() => percentOfQuantity(), () => median(), () => probabilityFraction(), () => meanDepth(), () => prosentOkning(), () => sannsynlighetProsent()],
  8: [() => percentPart(), () => median(), () => probabilityFraction(), () => chartDiff(), () => prosentRabatt(), () => sannsynlighetProsent()],
  9: [() => percentOfQuantity(), () => percentPart(), () => median(), () => probabilityFraction(), () => prosentOkning(), () => sannsynlighetProsent()],
  10: [() => percentPart(), () => median(), () => mode(), () => probabilityFraction(), () => prosentRabatt(), () => sannsynlighetProsent()],
};
