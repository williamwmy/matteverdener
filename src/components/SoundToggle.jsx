import { useProfile } from '../hooks/useProfile.js';
import s from './SoundToggle.module.css';

/**
 * Knapp som slår lyd av/på. Innstillingen huskes i localStorage.
 */
export default function SoundToggle() {
  const { soundOn, toggleSound } = useProfile();
  return (
    <button
      type="button"
      className={s.toggle}
      onClick={toggleSound}
      aria-pressed={soundOn}
      aria-label={soundOn ? 'Skru av lyd' : 'Skru på lyd'}
      title={soundOn ? 'Lyd på' : 'Lyd av'}
    >
      {soundOn ? '🔊' : '🔇'}
    </button>
  );
}
