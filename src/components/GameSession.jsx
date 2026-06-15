import { useEffect, useRef, useState } from 'react';
import NomerDisplay from './NomerDisplay.jsx';
import TallinjeDisplay from './TallinjeDisplay.jsx';
import SekvensDisplay from './SekvensDisplay.jsx';
import TelleScene from './TelleScene.jsx';
import ArrayDisplay from './ArrayDisplay.jsx';
import BrokDisplay from './BrokDisplay.jsx';
import MathText from './MathText.jsx';
import KoordinatDisplay from './KoordinatDisplay.jsx';
import SoyleDiagram from './SoyleDiagram.jsx';
import FigurDisplay from './FigurDisplay.jsx';
import MyntDisplay from './MyntDisplay.jsx';
import { Confetti, DiamondBurst, StarRating, SixSevenMeme } from './Celebrations.jsx';
import { sfx } from '../sound.js';
import { generateQuestion } from '../data/questions.js';
import { SESSION_LENGTH } from '../data/worlds.js';
import { useProfile } from '../hooks/useProfile.js';
import { useAdaptive } from '../hooks/useAdaptive.js';
import s from './GameSession.module.css';

const CORRECT_DELAY_MS = 1200;
const SIX_SEVEN_DELAY_MS = 2800; // litt lengre når memet vises

/**
 * En spilløkt på 8 oppgaver i en verden. Oppgavene genereres fra profilens
 * adaptive nivå (som aldri vises), og diamanter deles ut til slutt.
 * @param {{ world: object, onExit: function(): void }} props
 */
export default function GameSession({ world, onExit }) {
  const { activeProfile } = useProfile();
  const { finishSession } = useAdaptive();

  // Nivået fryses ved øktstart slik at alle 8 oppgaver bruker samme nivå.
  const levelRef = useRef(activeProfile.adaptiveLevel);
  const timerRef = useRef(null);

  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState(() => generateQuestion(world.id, levelRef.current));
  const [phase, setPhase] = useState('question'); // 'question' | 'correct' | 'wrong' | 'done'
  const [chosen, setChosen] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [reward, setReward] = useState(0);
  const [sixSeven, setSixSeven] = useState(false);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  function advance(finalCorrectCount) {
    if (index + 1 >= SESSION_LENGTH) {
      setReward(finishSession(world.id, finalCorrectCount, SESSION_LENGTH, levelRef.current));
      setPhase('done');
      sfx.reward();
      return;
    }
    setIndex(index + 1);
    setQuestion(generateQuestion(world.id, levelRef.current));
    setChosen(null);
    setSixSeven(false);
    setPhase('question');
  }

  function handleAnswer(choice) {
    if (phase !== 'question') return;
    setChosen(choice);
    if (choice === question.correct) {
      const updated = correctCount + 1;
      setCorrectCount(updated);
      setPhase('correct');
      sfx.correct();
      // Easter egg: fasit nøyaktig 67 → animert «six seven»-meme.
      const meme = Number(question.correct) === 67;
      if (meme) {
        setSixSeven(true);
        sfx.reward();
      }
      timerRef.current = setTimeout(() => advance(updated), meme ? SIX_SEVEN_DELAY_MS : CORRECT_DELAY_MS);
    } else {
      setPhase('wrong');
      sfx.wrong();
    }
  }

  function handleExit() {
    if (phase !== 'done' && (index > 0 || chosen !== null)) {
      const sure = window.confirm('Vil du avslutte økten? Du får ikke diamanter for den.');
      if (!sure) return;
    }
    onExit();
  }

  // Hver verden har sin egen bakgrunns- og strilestil via en temaklasse.
  const themeClass = s[world.theme] ?? '';

  if (phase === 'done') {
    const perfect = correctCount === SESSION_LENGTH;
    const stars = perfect ? 3 : correctCount >= 5 ? 2 : 1;
    return (
      <main className={`screen ${s.session} ${themeClass}`}>
        <div className={s.rewardCard}>
          {correctCount >= 5 && <Confetti />}
          <div className={s.rewardGem} aria-hidden="true">
            💎
          </div>
          <StarRating filled={stars} />
          <h1 className={s.rewardTitle}>
            {perfect ? 'Helt perfekt!' : correctCount >= 5 ? 'Bra jobbet!' : 'Godt forsøk!'}
          </h1>
          <p className={s.rewardCount}>
            Du klarte {correctCount} av {SESSION_LENGTH} oppgaver
          </p>
          <p className={s.rewardDiamonds}>+{reward} 💎</p>
          {perfect && <p className={s.rewardBonus}>Alt riktig — ekstra bonus! 🎉</p>}
          <button className="btn-primary" onClick={onExit}>
            Tilbake til kartet
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={`screen ${s.session} ${themeClass}`}>
      {world.strip && (
        <div className={s.themeStrip} aria-hidden="true">
          {world.strip}
        </div>
      )}
      <header className={s.header}>
        <span className={s.worldName}>
          {world.emoji} {world.name}
        </span>
        <span className={s.progressLabel}>
          {index + 1} av {SESSION_LENGTH}
        </span>
        <button className="btn-ghost" onClick={handleExit}>
          Avslutt
        </button>
      </header>

      <div
        className={s.progressBar}
        role="progressbar"
        aria-valuenow={index + 1}
        aria-valuemin={1}
        aria-valuemax={SESSION_LENGTH}
      >
        <div
          className={s.progressFill}
          style={{ width: `${((index + (phase !== 'question' ? 1 : 0)) / SESSION_LENGTH) * 100}%` }}
        />
      </div>

      <section className={s.questionArea}>
        <p className={s.prompt}>
          <MathText>{question.prompt}</MathText>
        </p>
        {question.expression && (
          <p className={s.expression}>
            <MathText highlight>{question.expression}</MathText>
          </p>
        )}
        <QuestionVisual visual={question.visual} />
        {phase === 'correct' && <DiamondBurst />}
      </section>

      <div className={s.choices}>
        {question.choices.map((choice) => {
          let extra = '';
          if (phase !== 'question') {
            if (choice === question.correct) extra = s.choiceCorrect;
            else if (choice === chosen) extra = s.choiceWrong;
            else extra = s.choiceDimmed;
          }
          return (
            <button
              key={choice}
              className={`${s.choice} ${extra}`}
              onClick={() => handleAnswer(choice)}
              disabled={phase !== 'question'}
              aria-label={question.choiceType === 'nomer' ? `Mønster med ${choice} prikker` : undefined}
            >
              {question.choiceType === 'nomer' ? (
                <NomerDisplay values={[choice]} size={72} />
              ) : question.choiceType === 'emoji' ? (
                <span className={s.emojiChoice}>{choice}</span>
              ) : question.choiceType === 'text' ? (
                <span className={s.textChoice}>
                  <MathText>{choice}</MathText>
                </span>
              ) : (
                choice
              )}
            </button>
          );
        })}
      </div>

      {phase === 'wrong' && (
        <div className={s.explanation}>
          <p className={s.explanationText}>
            <MathText>{question.explanation.text}</MathText>
          </p>
          <QuestionVisual visual={question.explanation.visual} size={80} />
          <button className="btn-primary" onClick={() => advance(correctCount)}>
            Neste
          </button>
        </div>
      )}

      {sixSeven && <SixSevenMeme />}
    </main>
  );
}

/**
 * Tegner oppgavens visuelle støtte basert på type.
 * @param {{ visual: object|null, size?: number }} props
 */
function QuestionVisual({ visual, size }) {
  if (!visual) return null;
  if (visual.type === 'nomer') {
    return <NomerDisplay values={visual.values} op={visual.op} size={size} />;
  }
  if (visual.type === 'tallinje') {
    return (
      <TallinjeDisplay
        from={visual.from}
        to={visual.to}
        step={visual.step}
        hidden={visual.hidden}
        jump={visual.jump}
      />
    );
  }
  if (visual.type === 'sekvens') {
    return (
      <SekvensDisplay terms={visual.terms} answer={visual.answer} labels={visual.labels} reveal={visual.reveal} />
    );
  }
  if (visual.type === 'telle') {
    return <TelleScene items={visual.items} />;
  }
  if (visual.type === 'array') {
    return <ArrayDisplay rows={visual.rows} cols={visual.cols} emoji={visual.emoji} />;
  }
  if (visual.type === 'brok') {
    return <BrokDisplay numerator={visual.numerator} denominator={visual.denominator} shape={visual.shape} />;
  }
  if (visual.type === 'koordinat') {
    return <KoordinatDisplay min={visual.min} max={visual.max} point={visual.point} />;
  }
  if (visual.type === 'soyle') {
    return <SoyleDiagram data={visual.data} unit={visual.unit} />;
  }
  if (visual.type === 'figur') {
    return <FigurDisplay shape={visual.shape} labels={visual.labels} />;
  }
  if (visual.type === 'mynter') {
    return <MyntDisplay tens={visual.tens} ones={visual.ones} />;
  }
  return null;
}
