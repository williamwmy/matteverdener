// Verden 6 — Middelalderborgen (6.–7. trinn)
// LK20-mål (mot 7. trinn): algebraiske uttrykk og hoderegning, løse enkle
// likninger, og geometri — omkrets, areal og vinkler i figurer.
// Tema: riddere, drager, tårn, skjold og konger.

import { randInt, pick, makeChoices, choicesFrom, question } from '../questionHelpers.js';

// ---- Likninger ----

function equationAddSub() {
  const a = randInt(1, 15);
  if (Math.random() < 0.5) {
    const x = randInt(2, 20);
    return question({
      prompt: 'Hva er x?',
      expression: `x + ${a} = ${x + a}`,
      choices: makeChoices(x, { min: 0, spread: 3 }),
      correct: x,
      explanation: { text: `x = ${x + a} − ${a} = ${x}.`, visual: null },
    });
  }
  // Garanter at x > a slik at resultatet ikke blir negativt.
  const r = randInt(0, 15);
  const x = r + a;
  return question({
    prompt: 'Hva er x?',
    expression: `x − ${a} = ${r}`,
    choices: makeChoices(x, { min: 0, spread: 3 }),
    correct: x,
    explanation: { text: `x = ${r} + ${a} = ${x}.`, visual: null },
  });
}

function equationMultiply() {
  const a = randInt(2, 9);
  const x = randInt(2, 12);
  return question({
    prompt: 'Hva er x?',
    expression: `${a}x = ${a * x}`,
    choices: makeChoices(x, { min: 0, spread: 3 }),
    correct: x,
    explanation: { text: `x = ${a * x} : ${a} = ${x}.`, visual: null },
  });
}

function equationTwoStep() {
  const a = randInt(2, 6);
  const x = randInt(2, 10);
  const b = randInt(1, 12);
  const c = a * x + b;
  return question({
    prompt: 'Hva er x?',
    expression: `${a}x + ${b} = ${c}`,
    choices: makeChoices(x, { min: 0, spread: 3 }),
    correct: x,
    explanation: { text: `${a}x = ${c} − ${b} = ${a * x}, så x = ${x}.`, visual: null },
  });
}

// ---- Uttrykk ----

function evaluateExpression() {
  const a = randInt(2, 6);
  const b = randInt(1, 12);
  const x = randInt(2, 9);
  const correct = a * x + b;
  return question({
    prompt: `🐉 Sett inn x = ${x} i uttrykket. Hva blir det?`,
    expression: `${a}x + ${b}`,
    choices: makeChoices(correct, { min: 0, spread: 4 }),
    correct,
    explanation: { text: `${a} · ${x} + ${b} = ${a * x} + ${b} = ${correct}.`, visual: null },
  });
}

function simplifyTerms() {
  const a = randInt(2, 6);
  const b = randInt(1, 6);
  if (Math.random() < 0.5) {
    const sum = a + b;
    return question({
      prompt: 'Forenkle uttrykket:',
      expression: `${a}x + ${b}x`,
      choiceType: 'text',
      choices: choicesFrom(`${sum}x`, [`${sum + 1}x`, `${sum}`, `${a * b}x`, `${sum - 1}x`]),
      correct: `${sum}x`,
      explanation: { text: `${a}x + ${b}x = ${sum}x.`, visual: null },
    });
  }
  const big = a + b;
  const diff = big - b;
  return question({
    prompt: 'Forenkle uttrykket:',
    expression: `${big}x − ${b}x`,
    choiceType: 'text',
    choices: choicesFrom(`${diff}x`, [`${diff + 1}x`, `${diff}`, `${diff - 1}x`, `${big}x`]),
    correct: `${diff}x`,
    explanation: { text: `${big}x − ${b}x = ${diff}x.`, visual: null },
  });
}

// ---- Geometri ----

function rectanglePerimeter() {
  const b = randInt(3, 12);
  const h = randInt(2, 10);
  const correct = 2 * (b + h);
  return question({
    prompt: 'Hvor mange meter er omkretsen av tårnveggen?',
    visual: { type: 'figur', shape: 'rektangel', labels: { b: `${b} m`, h: `${h} m` } },
    choices: makeChoices(correct, { min: 0, spread: 4 }),
    correct,
    explanation: { text: `Omkrets = 2 · (${b} + ${h}) = ${correct} m.`, visual: null },
  });
}

function rectangleArea() {
  const b = randInt(3, 12);
  const h = randInt(2, 9);
  const correct = b * h;
  return question({
    prompt: 'Hvor stort er arealet av skjoldet?',
    visual: { type: 'figur', shape: 'rektangel', labels: { b: `${b} cm`, h: `${h} cm` } },
    choices: makeChoices(correct, { min: 0, spread: Math.max(3, Math.round(correct / 6)) }),
    correct,
    explanation: { text: `Areal = ${b} · ${h} = ${correct} cm².`, visual: null },
  });
}

function squareAreaPerimeter() {
  const side = randInt(3, 12);
  const wantArea = Math.random() < 0.5;
  const correct = wantArea ? side * side : 4 * side;
  return question({
    prompt: wantArea ? 'Hvor stort er arealet av det kvadratiske rommet?' : 'Hvor lang er omkretsen av det kvadratiske rommet?',
    visual: { type: 'figur', shape: 'kvadrat', labels: { side: `${side} m` } },
    choices: makeChoices(correct, { min: 0, spread: Math.max(3, Math.round(correct / 6)) }),
    correct,
    explanation: {
      text: wantArea ? `Areal = ${side} · ${side} = ${correct} m².` : `Omkrets = 4 · ${side} = ${correct} m.`,
      visual: null,
    },
  });
}

function triangleArea() {
  const grunn = randInt(2, 12) * (Math.random() < 0.5 ? 1 : 2);
  let hoyde = randInt(2, 10);
  if ((grunn * hoyde) % 2 !== 0) hoyde += 1; // hold arealet som heltall
  const correct = (grunn * hoyde) / 2;
  return question({
    prompt: 'Hvor stort er arealet av vimpelen (trekanten)?',
    visual: { type: 'figur', shape: 'trekant', labels: { grunnlinje: `${grunn} cm`, hoyde: `${hoyde} cm` } },
    choices: makeChoices(correct, { min: 0, spread: Math.max(3, Math.round(correct / 6)) }),
    correct,
    explanation: { text: `Areal = (${grunn} · ${hoyde}) : 2 = ${correct} cm².`, visual: null },
  });
}

function triangleAngle() {
  const a = randInt(30, 90);
  const b = randInt(30, 150 - a);
  const correct = 180 - a - b;
  return question({
    prompt: `To vinkler i trekanten er ${a}° og ${b}°. Hvor stor er den tredje vinkelen?`,
    visual: { type: 'figur', shape: 'trekant', labels: { vinkel: '?' } },
    choices: makeChoices(correct, { min: 0, max: 180, spread: 6 }),
    correct,
    explanation: { text: `Vinklene i en trekant er 180° til sammen: 180 − ${a} − ${b} = ${correct}°.`, visual: null },
  });
}

function straightAngle() {
  const onLine = Math.random() < 0.5;
  const total = onLine ? 180 : 90;
  const aShown = randInt(20, total - 15);
  const correct = total - aShown;
  return question({
    prompt: onLine
      ? `To vinkler ligger på en rett linje. Den ene er ${aShown}°. Hvor stor er den andre?`
      : `To vinkler er til sammen en rett vinkel (90°). Den ene er ${aShown}°. Hvor stor er den andre?`,
    choices: makeChoices(correct, { min: 0, max: 180, spread: 6 }),
    correct,
    explanation: { text: `${total} − ${aShown} = ${correct}°.`, visual: null },
  });
}

export const pools = {
  1: [() => equationAddSub(), () => equationAddSub(), () => evaluateExpression(), () => simplifyTerms()],
  2: [() => equationAddSub(), () => equationMultiply(), () => evaluateExpression(), () => rectanglePerimeter()],
  3: [() => equationMultiply(), () => simplifyTerms(), () => rectanglePerimeter(), () => rectangleArea()],
  4: [() => equationMultiply(), () => evaluateExpression(), () => rectangleArea(), () => squareAreaPerimeter()],
  5: [() => equationTwoStep(), () => simplifyTerms(), () => squareAreaPerimeter(), () => triangleArea()],
  6: [() => equationTwoStep(), () => evaluateExpression(), () => triangleArea(), () => straightAngle()],
  7: [() => equationTwoStep(), () => simplifyTerms(), () => triangleAngle(), () => straightAngle()],
  8: [() => equationTwoStep(), () => evaluateExpression(), () => triangleAngle(), () => triangleArea()],
  9: [() => equationTwoStep(), () => simplifyTerms(), () => triangleAngle(), () => rectangleArea()],
  10: [() => equationTwoStep(), () => evaluateExpression(), () => triangleAngle(), () => straightAngle()],
};
