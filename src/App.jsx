import { useState } from 'react';
import StartScreen from './components/StartScreen.jsx';
import ProfileSelector from './components/ProfileSelector.jsx';
import WorldMap from './components/WorldMap.jsx';
import GameSession from './components/GameSession.jsx';
import Room from './components/Room.jsx';
import Shop from './components/Shop.jsx';
import { getWorld } from './data/worlds.js';
import { useProfile } from './hooks/useProfile.js';
import s from './App.module.css';

/** Versjon injiseres av Vite (define i vite.config.js). */
export const APP_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev';

export default function App() {
  const [screen, setScreen] = useState('start');
  const [activeWorldId, setActiveWorldId] = useState(null);
  const { activeProfile, saveFailed } = useProfile();

  // Skjermer etter profilvalg krever en aktiv profil.
  const needsProfile = !['start', 'profiles'].includes(screen);
  const effectiveScreen = needsProfile && !activeProfile ? 'profiles' : screen;

  function renderScreen() {
    switch (effectiveScreen) {
      case 'start':
        return <StartScreen version={APP_VERSION} onStart={() => setScreen('profiles')} />;
      case 'profiles':
        return <ProfileSelector onDone={() => setScreen('map')} />;
      case 'map':
        return (
          <WorldMap
            onSelectWorld={(worldId) => {
              setActiveWorldId(worldId);
              setScreen('game');
            }}
            onOpenRoom={() => setScreen('room')}
            onSwitchProfile={() => setScreen('profiles')}
          />
        );
      case 'game':
        return (
          <GameSession world={getWorld(activeWorldId)} onExit={() => setScreen('map')} />
        );
      case 'room':
        return <Room onBack={() => setScreen('map')} onOpenShop={() => setScreen('shop')} />;
      case 'shop':
        return <Shop onBack={() => setScreen('room')} />;
      default:
        return null;
    }
  }

  return (
    <>
      {saveFailed && (
        <div role="alert" className={s.saveBanner}>
          ⚠️ Kunne ikke lagre fremgangen din. Sjekk at nettleseren har lagringsplass.
        </div>
      )}
      {renderScreen()}
    </>
  );
}
