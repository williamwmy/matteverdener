import { useProfile } from './useProfile.js';

export const MIN_LEVEL = 1;
export const MAX_LEVEL = 10;

/**
 * Beregner neste adaptive nivå etter en økt.
 * Alt riktig hopper to nivåer slik at flinke barn raskt møter motstand.
 * @param {number} level - nåværende nivå 1–10
 * @param {number} correct - antall riktige svar
 * @param {number} total - antall oppgaver i økten
 * @returns {number} nytt nivå 1–10
 */
export function computeNextLevel(level, correct, total) {
  const ratio = correct / total;
  if (ratio === 1) return Math.min(level + 2, MAX_LEVEL);
  if (ratio >= 0.875) return Math.min(level + 1, MAX_LEVEL);
  if (ratio >= 0.625) return level;
  return Math.max(level - 1, MIN_LEVEL);
}

/**
 * Beregner diamantbelønning for en økt. Belønningen øker med nivået, så
 * vanskeligere oppgaver gir mer (10 per riktig på nivå 1 → 28 på nivå 10).
 * @param {number} correct
 * @param {number} total
 * @param {number} [level=1] - nivået økten ble spilt på (1–10)
 * @returns {number} antall diamanter
 */
export function computeReward(correct, total, level = 1) {
  const lvl = Math.min(Math.max(level, MIN_LEVEL), MAX_LEVEL);
  const perCorrect = 10 + (lvl - 1) * 2;
  const base = correct * perCorrect;
  const bonus = correct === total ? 20 + (lvl - 1) * 5 : 0;
  return base + bonus;
}

/**
 * Adaptiv vanskelighetslogikk. Nivået lagres i profilen, men vises aldri i UI.
 * @returns {{ finishSession: function(number, number, number): number }}
 */
export function useAdaptive() {
  const { activeProfile, updateActiveProfile } = useProfile();

  /**
   * Avslutter en økt: oppdaterer nivå, diamanter og verdensstatistikk.
   * @param {number} worldId
   * @param {number} correct
   * @param {number} total
   * @param {number} [level] - nivået økten ble spilt på (default: profilens nivå)
   * @returns {number} diamanter tjent
   */
  function finishSession(worldId, correct, total, level = activeProfile?.adaptiveLevel ?? 1) {
    if (!activeProfile) return 0;
    const reward = computeReward(correct, total, level);
    const previous = activeProfile.worldProgress[worldId] ?? {
      sessionsCompleted: 0,
      totalCorrect: 0,
      totalWrong: 0,
    };
    updateActiveProfile({
      adaptiveLevel: computeNextLevel(activeProfile.adaptiveLevel, correct, total),
      diamonds: activeProfile.diamonds + reward,
      worldProgress: {
        ...activeProfile.worldProgress,
        [worldId]: {
          sessionsCompleted: previous.sessionsCompleted + 1,
          totalCorrect: previous.totalCorrect + correct,
          totalWrong: previous.totalWrong + (total - correct),
        },
      },
    });
    return reward;
  }

  return { finishSession };
}
