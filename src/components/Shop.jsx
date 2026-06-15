import { useState } from 'react';
import DiamondCounter from './DiamondCounter.jsx';
import ItemArt from './ItemArt.jsx';
import IsoItem from './IsoItem.jsx';
import IsoRug from './IsoRug.jsx';
import { CATEGORIES, SHOP_ITEMS, roomFieldFor } from '../data/shopItems.js';
import { TYPES, variantId } from '../data/furniture.js';
import { useProfile } from '../hooks/useProfile.js';
import {
  getActiveRoom,
  replaceRoom,
  countPlaced,
  addPlaced,
  removeOnePlaced,
} from '../store.js';
import { sfx } from '../sound.js';
import s from './Shop.module.css';

const SINGLETON_CATS = ['gulv', 'vegg', 'vindu'];
const PREVIEW_W = 120;
const PREVIEW_H = 90;

/**
 * Butikken: velg en møbeltype, velg farge, kjøp — og legg inn flere av samme.
 * Gulv/vegg/vindu er fortsatt engangsvalg som dekker hele flaten.
 * @param {{ onBack: function(): void }} props
 */
export default function Shop({ onBack }) {
  const { activeProfile, updateActiveProfile } = useProfile();
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [selected, setSelected] = useState({}); // typeKey -> colorId

  const room = getActiveRoom(activeProfile);
  const owned = activeProfile.owned ?? [];
  const isSingleton = SINGLETON_CATS.includes(category);

  // ---- Katalog (møbler/dekor/tepper) ----
  function buyVariant(type, variant) {
    if (owned.includes(variant) || activeProfile.diamonds < type.price) return;
    sfx.purchase();
    updateActiveProfile({
      diamonds: activeProfile.diamonds - type.price,
      owned: [...owned, variant],
      rooms: replaceRoom(activeProfile, room.id, addPlaced(room, variant)),
    });
  }
  function addOne(variant) {
    sfx.tap();
    updateActiveProfile({ rooms: replaceRoom(activeProfile, room.id, addPlaced(room, variant)) });
  }
  function removeOne(variant) {
    sfx.tap();
    updateActiveProfile({ rooms: replaceRoom(activeProfile, room.id, removeOnePlaced(room, variant)) });
  }

  // ---- Singletoner (gulv/vegg/vindu) ----
  function isActive(item) {
    const field = roomFieldFor(item.category);
    return room[field] === item.id;
  }
  function setField(item, on) {
    const field = roomFieldFor(item.category);
    return { ...room, [field]: on ? item.id : null };
  }
  function buySingleton(item) {
    if (owned.includes(item.id) || activeProfile.diamonds < item.price) return;
    sfx.purchase();
    updateActiveProfile({
      diamonds: activeProfile.diamonds - item.price,
      owned: [...owned, item.id],
      rooms: replaceRoom(activeProfile, room.id, setField(item, true)),
    });
  }
  function useSingleton(item) {
    sfx.tap();
    updateActiveProfile({ rooms: replaceRoom(activeProfile, room.id, setField(item, true)) });
  }

  const singletonItems = SHOP_ITEMS.filter((it) => it.category === category);
  const typeItems = TYPES.filter((t) => t.category === category);

  return (
    <main className={`screen ${s.shop}`}>
      <header className={s.header}>
        <button className="btn-ghost" onClick={onBack}>
          ← Rommet
        </button>
        <h1 className={s.heading}>Butikken</h1>
        <DiamondCounter amount={activeProfile.diamonds} />
      </header>

      {activeProfile.rooms.length > 1 && <p className={s.roomHint}>Innreder: {room.name}</p>}

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
        {isSingleton
          ? singletonItems.map((item) => {
              const isOwned = owned.includes(item.id);
              const active = isActive(item);
              const affordable = activeProfile.diamonds >= item.price;
              return (
                <li key={item.id} className={s.card}>
                  <div className={s.preview}>
                    <PreviewSingleton item={item} />
                  </div>
                  <p className={s.name}>
                    {item.name}
                    {isOwned && <span className={s.ownedBadge}>Eies</span>}
                  </p>
                  {!isOwned ? (
                    <button className={s.buyBtn} onClick={() => buySingleton(item)} disabled={!affordable}>
                      Kjøp · 💎 {item.price}
                    </button>
                  ) : active ? (
                    <button className={s.useBtn} disabled>
                      I bruk ✓
                    </button>
                  ) : (
                    <button className={s.useBtn} onClick={() => useSingleton(item)}>
                      Bruk
                    </button>
                  )}
                </li>
              );
            })
          : typeItems.map((type) => {
              const colorId = selected[type.key] ?? type.colors[0].id;
              const color = type.colors.find((c) => c.id === colorId) ?? type.colors[0];
              const variant = variantId(type.key, color.id);
              const isOwned = owned.includes(variant);
              const count = countPlaced(room, variant);
              const affordable = activeProfile.diamonds >= type.price;
              return (
                <li key={type.key} className={s.card}>
                  <div className={s.preview}>
                    <PreviewType type={type} color={color} />
                  </div>
                  <p className={s.name}>{type.name}</p>

                  {type.colors.length > 1 && (
                    <div className={s.colors} role="radiogroup" aria-label="Velg farge">
                      {type.colors.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          role="radio"
                          aria-checked={c.id === color.id}
                          aria-label={c.name}
                          title={c.name}
                          className={c.id === color.id ? `${s.swatch} ${s.swatchOn}` : s.swatch}
                          style={{ background: c.value }}
                          onClick={() => setSelected((m) => ({ ...m, [type.key]: c.id }))}
                        />
                      ))}
                    </div>
                  )}

                  {!isOwned ? (
                    <button className={s.buyBtn} onClick={() => buyVariant(type, variant)} disabled={!affordable}>
                      Kjøp · 💎 {type.price}
                    </button>
                  ) : (
                    <div className={s.counter}>
                      <button
                        className={s.countBtn}
                        aria-label="Fjern én"
                        onClick={() => removeOne(variant)}
                        disabled={count === 0}
                      >
                        −
                      </button>
                      <span className={s.count}>{count} i rommet</span>
                      <button className={s.countBtn} aria-label="Legg til én" onClick={() => addOne(variant)}>
                        +
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
      </ul>
    </main>
  );
}

/** Forhåndsvisning av en møbeltype i valgt farge. */
function PreviewType({ type, color }) {
  if (type.kind === 'rug') {
    return (
      <div className={s.previewIso} style={{ transform: 'scale(0.6)' }}>
        <IsoRug color={color.value} motif={type.motif} />
      </div>
    );
  }
  if (type.kind === 'wall') {
    const scale = Math.min(PREVIEW_W / type.footprint.w, PREVIEW_H / type.footprint.h, 1) * 0.9;
    return (
      <div className={s.previewScaled} style={{ width: type.footprint.w, height: type.footprint.h, transform: `scale(${scale})` }}>
        <ItemArt item={{ id: type.art, category: 'dekor' }} />
      </div>
    );
  }
  return (
    <div className={s.previewIso} style={{ transform: 'scale(0.46)' }}>
      <IsoItem shape={type.shape} color={color.value} />
    </div>
  );
}

/** Forhåndsvisning av gulv/vegg/vindu. */
function PreviewSingleton({ item }) {
  return (
    <div className={s.previewFill}>
      <ItemArt item={item} />
    </div>
  );
}
