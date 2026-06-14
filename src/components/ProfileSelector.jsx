import { useState } from 'react';
import { useProfile } from '../hooks/useProfile.js';
import { MAX_PROFILES } from '../store.js';
import s from './ProfileSelector.module.css';

const AVATARS = ['🦊', '🐻', '🐼', '🦁', '🐯', '🐨', '🐸', '🦋', '🐙', '🦄', '🐲', '🌟'];

/**
 * Velg, opprett eller slett spillerprofiler (maks 5 per enhet).
 * @param {{ onDone: function(): void }} props - kalles når en profil er valgt
 */
export default function ProfileSelector({ onDone }) {
  const { state, addProfile, removeProfile, selectProfile } = useProfile();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const profiles = state.profiles;
  const canCreate = profiles.length < MAX_PROFILES;

  function handleSelect(id) {
    selectProfile(id);
    onDone();
  }

  function handleCreate(event) {
    event.preventDefault();
    if (!name.trim()) return;
    addProfile(name, avatar);
    setName('');
    setCreating(false);
    onDone();
  }

  return (
    <main className={`screen ${s.selector}`}>
      <h1 className={s.heading}>Hvem skal spille?</h1>

      <ul className={s.list}>
        {profiles.map((profile) => (
          <li key={profile.id} className={s.cardWrap}>
            {confirmDeleteId === profile.id ? (
              <div className={s.confirm}>
                <p className={s.confirmText}>Slette {profile.name}?</p>
                <div className={s.confirmButtons}>
                  <button
                    className={s.deleteConfirmBtn}
                    onClick={() => {
                      removeProfile(profile.id);
                      setConfirmDeleteId(null);
                    }}
                  >
                    Ja, slett
                  </button>
                  <button className="btn-ghost" onClick={() => setConfirmDeleteId(null)}>
                    Avbryt
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button className={s.card} onClick={() => handleSelect(profile.id)}>
                  <span className={s.avatar} aria-hidden="true">
                    {profile.avatar}
                  </span>
                  <span className={s.name}>{profile.name}</span>
                  <span className={s.diamonds}>💎 {profile.diamonds}</span>
                </button>
                <button
                  className={s.deleteBtn}
                  aria-label={`Slett ${profile.name}`}
                  onClick={() => setConfirmDeleteId(profile.id)}
                >
                  ✕
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      {!creating && canCreate && (
        <button className={s.newBtn} onClick={() => setCreating(true)}>
          + Ny spiller
        </button>
      )}

      {creating && (
        <form className={s.form} onSubmit={handleCreate}>
          <label className={s.label} htmlFor="profile-name">
            Hva heter du?
          </label>
          <input
            id="profile-name"
            className={s.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            autoFocus
            placeholder="Skriv navnet ditt"
          />
          <p className={s.label}>Velg figuren din:</p>
          <div className={s.avatarGrid} role="radiogroup" aria-label="Velg avatar">
            {AVATARS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                role="radio"
                aria-checked={avatar === emoji}
                className={avatar === emoji ? `${s.avatarBtn} ${s.avatarSelected}` : s.avatarBtn}
                onClick={() => setAvatar(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
          <div className={s.formButtons}>
            <button type="submit" className="btn-primary" disabled={!name.trim()}>
              Start eventyret!
            </button>
            <button type="button" className="btn-ghost" onClick={() => setCreating(false)}>
              Avbryt
            </button>
          </div>
        </form>
      )}
    </main>
  );
}
