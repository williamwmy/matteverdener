import { useState } from 'react';
import DiamondCounter from './DiamondCounter.jsx';
import ItemArt from './ItemArt.jsx';
import IsoItem from './IsoItem.jsx';
import IsoRug from './IsoRug.jsx';
import { CATEGORIES, SHOP_ITEMS, roomFieldFor } from '../data/shopItems.js';
import { useProfile } from '../hooks/useProfile.js';
import { getActiveRoom, replaceRoom } from '../store.js';
import { sfx } from '../sound.js';
import s from './Shop.module.css';

const PREVIEW_W = 120;
const PREVIEW_H = 90;

/**
 * Butikken: kjøp gjenstander med diamanter og velg hva som brukes i rommet.
 * @param {{ onBack: function(): void }} props
 */
export default function Shop({ onBack }) {
  const { activeProfile, updateActiveProfile } = useProfile();
  const [category, setCategory] = useState(CATEGORIES[0].id);

  const room = getActiveRoom(activeProfile);
  const owned = activeProfile.owned ?? [];
  const items = SHOP_ITEMS.filter((item) => item.category === category);

  function isActive(item) {
    const field = roomFieldFor(item.category);
    if (field) return room[field] === item.id;
    const list = item.category === 'mobler' ? room.furniture : room.decorations;
    return list.includes(item.id);
  }

  function applyItem(item, active) {
    const field = roomFieldFor(item.category);
    if (field) return { ...room, [field]: active ? item.id : null };
    const key = item.category === 'mobler' ? 'furniture' : 'decorations';
    const without = room[key].filter((id) => id !== item.id);
    return { ...room, [key]: active ? [...without, item.id] : without };
  }

  function buy(item) {
    if (owned.includes(item.id) || activeProfile.diamonds < item.price) return;
    // Kjøpte gjenstander tas i bruk i det aktive rommet med en gang.
    sfx.purchase();
    updateActiveProfile({
      diamonds: activeProfile.diamonds - item.price,
      owned: [...owned, item.id],
      rooms: replaceRoom(activeProfile, room.id, applyItem(item, true)),
    });
  }

  function toggleUse(item) {
    sfx.tap();
    updateActiveProfile({ rooms: replaceRoom(activeProfile, room.id, applyItem(item, !isActive(item))) });
  }

  return (
    <main className={`screen ${s.shop}`}>
      <header className={s.header}>
        <button className="btn-ghost" onClick={onBack}>
          ← Rommet
        </button>
        <h1 className={s.heading}>Butikken</h1>
        <DiamondCounter amount={activeProfile.diamonds} />
      </header>

      {activeProfile.rooms.length > 1 && (
        <p className={s.roomHint}>Innreder: {room.name}</p>
      )}

      <nav className={s.tabs} aria-label="Kategorier">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={category === cat.id ? `${s.tab} ${s.tabActive}` : s.tab}
            aria-pressed={category === cat.id}
            onClick={() => setCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </nav>

      <ul className={s.grid}>
        {items.map((item) => {
          const isOwned = owned.includes(item.id);
          const active = isActive(item);
          const singleton = roomFieldFor(item.category) !== null;
          const affordable = activeProfile.diamonds >= item.price;
          return (
            <li key={item.id} className={s.card}>
              <div className={s.preview}>
                <PreviewBox item={item} />
              </div>
              <p className={s.name}>
                {item.name}
                {isOwned && <span className={s.ownedBadge}>Eies</span>}
              </p>
              {!isOwned ? (
                <button
                  className={s.buyBtn}
                  onClick={() => buy(item)}
                  disabled={!affordable}
                >
                  Kjøp · 💎 {item.price}
                </button>
              ) : active ? (
                singleton ? (
                  <button className={s.useBtn} disabled>
                    I bruk ✓
                  </button>
                ) : (
                  <button className={s.useBtn} onClick={() => toggleUse(item)}>
                    Fjern fra rommet
                  </button>
                )
              ) : (
                <button className={s.useBtn} onClick={() => toggleUse(item)}>
                  Bruk
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </main>
  );
}

/**
 * Forhåndsvisning i fast boks. Gulvmøbler vises isometrisk (samme tegning som
 * i rommet), vegg-/gulv-/vindusvarer som flate flater/plakater.
 * @param {{ item: object }} props
 */
function PreviewBox({ item }) {
  const placement = item.placement;
  if (item.kind === 'rug') {
    return (
      <div className={s.previewIso} style={{ transform: `scale(${0.62})` }}>
        <IsoRug id={item.id} />
      </div>
    );
  }
  if (placement?.surface === 'floor') {
    // IsoItem-tegningen er ISO.w×ISO.h; skaler ned så den fyller forhåndsvisningen.
    return (
      <div className={s.previewIso} style={{ transform: `scale(${0.46})` }}>
        <IsoItem id={item.id} />
      </div>
    );
  }
  if (!placement) {
    return (
      <div className={s.previewFill}>
        <ItemArt item={item} />
      </div>
    );
  }
  const scale = Math.min(PREVIEW_W / placement.w, PREVIEW_H / placement.h, 1) * 0.9;
  return (
    <div
      className={s.previewScaled}
      style={{ width: placement.w, height: placement.h, transform: `scale(${scale})` }}
    >
      <ItemArt item={item} />
    </div>
  );
}
