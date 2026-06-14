import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  loadState,
  saveState,
  getActiveProfile,
  createProfile,
  deleteProfile,
  setActiveProfile,
  updateProfile,
  getSoundOn,
  setSoundOn,
} from '../store.js';
import { setSoundEnabled, sfx } from '../sound.js';

const ProfileContext = createContext(null);

/**
 * Global tilstand for profiler og aktiv profil. Eneste sted som
 * persisterer til localStorage (via store.js).
 * @param {{ children: import('react').ReactNode }} props
 */
export function ProfileProvider({ children }) {
  const [state, setState] = useState(loadState);
  const [saveFailed, setSaveFailed] = useState(false);

  const commit = useCallback((next) => {
    setState(next);
    setSaveFailed(!saveState(next));
  }, []);

  // Hold lydmodulen i takt med den lagrede innstillingen.
  const soundOn = getSoundOn(state);
  useEffect(() => {
    setSoundEnabled(soundOn);
  }, [soundOn]);

  const value = {
    state,
    saveFailed,
    soundOn,
    toggleSound: () => {
      const next = !soundOn;
      setSoundEnabled(next); // sett før vi spiller bekreftelseslyden
      if (next) sfx.tap();
      commit(setSoundOn(state, next));
    },
    activeProfile: getActiveProfile(state),
    addProfile: (name, avatar) => commit(createProfile(state, name, avatar)),
    removeProfile: (id) => commit(deleteProfile(state, id)),
    selectProfile: (id) => commit(setActiveProfile(state, id)),
    updateActiveProfile: (updates) => {
      const profile = getActiveProfile(state);
      if (profile) commit(updateProfile(state, profile.id, updates));
    },
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

/** @returns {object} kontekstverdien fra ProfileProvider */
export function useProfileContext() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfileContext må brukes innenfor ProfileProvider');
  return ctx;
}
