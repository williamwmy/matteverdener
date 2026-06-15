import { useState } from 'react';
import DiamondCounter from './DiamondCounter.jsx';
import SoundToggle from './SoundToggle.jsx';
import CheatDialog from './CheatDialog.jsx';
import {
  WORLDS,
  STAR_STEPS,
  WORLD_GOAL,
  UNLOCK_CORRECT,
  getWorld,
  isWorldUnlocked,
  worldCorrect,
  worldStars,
} from '../data/worlds.js';
import { useProfile } from '../hooks/useProfile.js';
import { useKonamiCode } from '../hooks/useKonamiCode.js';
import { sfx } from '../sound.js';
import s from './WorldMap.module.css';

/** Stjernerad + framgangsmåler som viser progresjonen i en verden. */
function WorldProgress({ profile, world }) {
  const stars = worldStars(profile, world.id);
  const correct = worldCorrect(profile, world.id);
  const fill = Math.min(correct / WORLD_GOAL, 1) * 100;
  return (
    <span className={s.progress}>
      <span className={s.stars} aria-label={`${stars} av ${STAR_STEPS.length} stjerner`}>
        {[0, 1, 2].map((i) => (
          <span key={i} className={i < stars ? s.starOn : s.starOff}>
            {i < stars ? '⭐' : '☆'}
          </span>
        ))}
      </span>
      <span className={s.bar}>
        <span className={s.barFill} style={{ width: `${fill}%` }} />
      </span>
    </span>
  );
}

/**
 * Verdenkartet: 7 verdener som øyer, kun opplåste kan velges.
 * @param {{
 *   onSelectWorld: function(number): void,
 *   onOpenRoom: function(): void,
 *   onSwitchProfile: function(): void,
 * }} props
 */
export default function WorldMap({ onSelectWorld, onOpenRoom, onSwitchProfile }) {
  const { activeProfile, updateActiveProfile } = useProfile();
  const [showCheat, setShowCheat] = useState(false);

  useKonamiCode(() => {
    sfx.reward();
    setShowCheat(true);
  });

  function grantDiamonds(amount) {
    sfx.purchase();
    updateActiveProfile({ diamonds: activeProfile.diamonds + amount });
    setShowCheat(false);
  }

  const allUnlocked = WORLDS.every((w) => isWorldUnlocked(activeProfile, w.id));

  function unlockAllWorlds() {
    sfx.purchase();
    // En verden åpnes når den forrige har ≥ UNLOCK_CORRECT riktige — så vi løfter
    // hver verden utenom den siste opp dit (uten å redusere bedre progresjon).
    const wp = { ...(activeProfile.worldProgress ?? {}) };
    for (const w of WORLDS.slice(0, -1)) {
      const cur = wp[w.id]?.totalCorrect ?? 0;
      if (cur < UNLOCK_CORRECT) wp[w.id] = { ...(wp[w.id] ?? {}), totalCorrect: UNLOCK_CORRECT };
    }
    updateActiveProfile({ worldProgress: wp });
    setShowCheat(false);
  }

  return (
    <main className={`screen ${s.map}`}>
      <header className={s.header}>
        <button className={s.profileChip} onClick={onSwitchProfile} title="Bytt spiller">
          <span aria-hidden="true">{activeProfile.avatar}</span>
          <span className={s.profileName}>{activeProfile.name}</span>
        </button>
        <div className={s.headerRight}>
          <DiamondCounter amount={activeProfile.diamonds} />
          <SoundToggle />
          <button className={s.roomBtn} onClick={onOpenRoom}>
            🛋️ Rommet mitt
          </button>
        </div>
      </header>

      <h1 className={s.heading}>Velg en verden</h1>

      <ul className={s.grid}>
        {WORLDS.map((world) => {
          const unlocked = isWorldUnlocked(activeProfile, world.id);
          const prev = getWorld(world.id - 1);
          return (
            <li key={world.id}>
              {unlocked ? (
                <button
                  className={s.world}
                  style={{ '--world-color': world.color }}
                  onClick={() => {
                    sfx.tap();
                    onSelectWorld(world.id);
                  }}
                >
                  <span className={s.worldEmoji} aria-hidden="true">
                    {world.emoji}
                  </span>
                  <span className={s.worldName}>{world.name}</span>
                  <span className={s.worldGrades}>{world.grades}</span>
                  <span className={s.worldDescription}>{world.description}</span>
                  <WorldProgress profile={activeProfile} world={world} />
                </button>
              ) : (
                <div className={`${s.world} ${s.locked}`} aria-label={`${world.name} — låst`}>
                  <span className={s.worldEmoji} aria-hidden="true">
                    {world.emoji}
                  </span>
                  <span className={s.worldName}>{world.name}</span>
                  <span className={s.worldGrades}>{world.grades}</span>
                  <span className={s.lockBadge}>🔒 Tjen ⭐ i {prev.name}</span>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {showCheat && (
        <CheatDialog
          onGrant={grantDiamonds}
          onUnlockWorlds={unlockAllWorlds}
          allUnlocked={allUnlocked}
          onClose={() => setShowCheat(false)}
        />
      )}
    </main>
  );
}
