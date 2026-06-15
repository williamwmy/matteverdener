import { useMemo } from 'react';
import s from './Celebrations.module.css';

const CONFETTI_COLORS = ['#f9c846', '#7ed4f7', '#4ecb71', '#e05252', '#b07ef7', '#f97ec3'];

/**
 * Fargerik konfetti som faller — brukes på belønningsskjermen.
 * @param {{ count?: number }} props
 */
export function Confetti({ count = 24 }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        dur: 1.4 + Math.random() * 1.1,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        drift: (Math.random() * 2 - 1) * 70,
        rot: Math.random() * 360,
        round: Math.random() < 0.5,
      })),
    [count]
  );
  return (
    <div className={s.confetti} aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          className={p.round ? `${s.piece} ${s.round}` : s.piece}
          style={{
            left: `${p.left}%`,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            '--drift': `${p.drift}px`,
            '--rot': `${p.rot}deg`,
          }}
        />
      ))}
    </div>
  );
}

const BURST_EMOJI = ['💎', '✨', '⭐', '💎', '✨', '💎', '⭐'];

/**
 * Liten sprut av diamanter/gnister som spretter oppover — vises et lite
 * øyeblikk når barnet svarer riktig.
 */
export function DiamondBurst() {
  const items = useMemo(
    () =>
      BURST_EMOJI.map((e, i) => ({
        e,
        x: (i - (BURST_EMOJI.length - 1) / 2) * 34 + (Math.random() * 14 - 7),
        delay: Math.random() * 0.12,
        rise: 70 + Math.random() * 50,
      })),
    []
  );
  return (
    <div className={s.burst} aria-hidden="true">
      {items.map((it, i) => (
        <span
          key={i}
          className={s.burstItem}
          style={{ '--x': `${it.x}px`, '--rise': `${it.rise}px`, animationDelay: `${it.delay}s` }}
        >
          {it.e}
        </span>
      ))}
    </div>
  );
}

/**
 * Skjult easter egg: animert «six seven»-meme som spretter opp når barnet
 * svarer riktig og fasiten er nettopp 67. To håndflater «veier» opp og ned
 * (6 mot 7) mens teksten spretter. Rent dekorativt — respekterer reduced motion.
 */
export function SixSevenMeme() {
  return (
    <div className={s.sixSeven} aria-hidden="true">
      <div className={s.ssInner}>
        <div className={s.ssHands}>
          <span className={`${s.ssHand} ${s.ssHandL}`}>
            <span className={s.ssNum}>6</span>
            <span className={s.ssPalm}>🫴</span>
          </span>
          <span className={`${s.ssHand} ${s.ssHandR}`}>
            <span className={s.ssNum}>7</span>
            <span className={s.ssPalm}>🫴</span>
          </span>
        </div>
        <p className={s.ssText}>six seven!</p>
      </div>
    </div>
  );
}

/**
 * Stjernerad (1–3 fylte) på belønningsskjermen, med liten pop-animasjon.
 * @param {{ filled: number }} props
 */
export function StarRating({ filled }) {
  return (
    <div className={s.stars} role="img" aria-label={`${filled} av 3 stjerner`}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={i < filled ? `${s.star} ${s.starOn}` : s.star}
          style={{ animationDelay: `${i * 0.18}s` }}
        >
          {i < filled ? '⭐' : '☆'}
        </span>
      ))}
    </div>
  );
}
