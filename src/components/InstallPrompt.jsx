import { useEffect, useState } from 'react';
import s from './InstallPrompt.module.css';

const DISMISS_KEY = 'matteverdener_install_dismissed';

// Allerede installert? (kjører som standalone-app)
function isStandalone() {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

// iOS Safari kan IKKE installere programmatisk — der må vi vise hvordan.
// (Chrome/Firefox på iOS kan ikke legge til på hjemskjerm i det hele tatt.)
function isIosSafari() {
  const ua = window.navigator.userAgent;
  const ios = /iphone|ipad|ipod/i.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const safari = /safari/i.test(ua) && !/crios|fxios|edgios|android/i.test(ua);
  return ios && safari;
}

/**
 * Oppfordrer til å installere PWA-en, tilpasset plattform:
 * - Android/desktop (Chromium): ekte «Installer»-knapp via beforeinstallprompt.
 * - iOS Safari: instruksjon (Del → «Legg til på Hjem-skjerm»), siden Apple ikke
 *   tillater programmatisk installasjon.
 * Skjules om appen alt er installert, eller om brukeren har avvist den før.
 */
export default function InstallPrompt() {
  const [deferred, setDeferred] = useState(null); // beforeinstallprompt-hendelsen
  const [mode, setMode] = useState(null); // 'android' | 'ios' | null

  useEffect(() => {
    if (isStandalone()) return;
    if (localStorage.getItem(DISMISS_KEY)) return;

    function onBeforeInstall(e) {
      e.preventDefault(); // hindre nettleserens egen mini-infolinje
      setDeferred(e);
      setMode('android');
    }
    function onInstalled() {
      setMode(null);
      setDeferred(null);
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);

    // iOS gir ingen hendelse — vis instruksjon direkte.
    if (isIosSafari()) setMode('ios');

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, '1');
    setMode(null);
  }

  async function install() {
    if (!deferred) return;
    deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setMode(null);
  }

  if (!mode) return null;

  return (
    <div className={s.banner} role="region" aria-label="Installer appen">
      <div className={s.icon} aria-hidden="true">📲</div>
      {mode === 'android' ? (
        <>
          <p className={s.text}>Legg MatteVerdener på hjemskjermen for raskere tilgang.</p>
          <button type="button" className={s.installBtn} onClick={install}>
            Installer
          </button>
        </>
      ) : (
        <p className={s.text}>
          Legg på hjemskjermen: trykk{' '}
          <svg className={s.share} viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 3l4 4m-4-4L8 7m4-4v12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 12H5a2 2 0 00-2 2v5a2 2 0 002 2h14a2 2 0 002-2v-5a2 2 0 00-2-2h-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <strong>Del</strong> nederst i Safari, og velg <strong>«Legg til på Hjem-skjerm»</strong>.
        </p>
      )}
      <button type="button" className={s.close} onClick={dismiss} aria-label="Lukk">
        ✕
      </button>
    </div>
  );
}
