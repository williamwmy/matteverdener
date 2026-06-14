import { Fragment, useEffect, useRef, useState } from 'react';
import DiamondCounter from './DiamondCounter.jsx';
import ItemArt from './ItemArt.jsx';
import IsoItem, { ISO } from './IsoItem.jsx';
import IsoRug, { RUG } from './IsoRug.jsx';
import { getItem } from '../data/shopItems.js';
import { useProfile } from '../hooks/useProfile.js';
import { getActiveRoom, buildAddedRoom, nextRoomPrice, replaceRoom } from '../store.js';
import { sfx } from '../sound.js';
import s from './Room.module.css';

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

/**
 * Rommet i isometrisk kabinett-perspektiv: gulv + to vegger bygget med
 * CSS 3D transforms. Gulvmøbler tegnes isometrisk i et 2D-lag oppå rommet.
 * Møbler og dekor kan dras dit man vil — skjermbevegelse regnes om til
 * rommets gulv-/vegg-koordinater og lagres per gjenstand i rommet.
 * @param {{ onBack: function(): void, onOpenShop: function(): void }} props
 */
export default function Room({ onBack, onOpenShop }) {
  const { activeProfile, updateActiveProfile } = useProfile();
  const rooms = activeProfile.rooms;
  const room = getActiveRoom(activeProfile);
  const roomPrice = nextRoomPrice(rooms.length);
  const canAffordRoom = roomPrice != null && activeProfile.diamonds >= roomPrice;

  const [editingName, setEditingName] = useState(null);

  // Dra-tilstand: `live` driver visningen, `dragRef` holder startverdiene.
  const layerRef = useRef(null);
  const dragRef = useRef(null);
  const [live, setLive] = useState(null); // { id, x, y }

  function positionOf(item) {
    if (live && live.id === item.id) return { x: live.x, y: live.y, r: live.r };
    const ov = room.positions?.[item.id];
    if (ov) return { x: ov.x, y: ov.y, r: ov.r ?? 0 };
    return { x: item.placement.x, y: item.placement.y, r: 0 };
  }

  function startDrag(item, e) {
    e.preventDefault();
    const rect = layerRef.current.getBoundingClientRect();
    const scale = rect.width / 320; // laget er 320px uskalert
    const base = positionOf(item);
    dragRef.current = {
      id: item.id,
      surface: item.placement.surface,
      baseX: base.x,
      baseY: base.y,
      baseR: base.r,
      startCX: e.clientX,
      startCY: e.clientY,
      scale,
      w: item.placement.w,
      h: item.placement.h,
      moved: false,
    };
    setLive({ id: item.id, x: base.x, y: base.y, r: base.r });
  }

  // Mens man drar: lytt globalt slik at det funker selv om pekeren forlater
  // gjenstanden. Skjermdelta regnes om til lokale koordinater via invers av
  // gulv-/vegg-projeksjonen, og lagres når man slipper.
  useEffect(() => {
    if (!live) return;
    function onMove(e) {
      const d = dragRef.current;
      if (!d) return;
      const dxC = e.clientX - d.startCX;
      const dyC = e.clientY - d.startCY;
      // Liten terskel skiller et trykk (snurr) fra et dra (flytt).
      if (!d.moved && Math.hypot(dxC, dyC) > 8) d.moved = true;
      if (!d.moved) return;
      const dSX = dxC / d.scale;
      const dSY = dyC / d.scale;
      let x;
      let y;
      if (d.surface === 'floor') {
        x = clamp(d.baseX + 0.7071 * dSX + 1.2326 * dSY, 24, 296);
        y = clamp(d.baseY - 0.7071 * dSX + 1.2326 * dSY, 24, 296);
      } else if (d.surface === 'wallRight') {
        x = clamp(d.baseX + 1.4142 * dSX, 0, 320 - d.w);
        y = clamp(d.baseY - 0.7001 * dSX + 1.2206 * dSY, 0, 170 - d.h);
      } else {
        x = clamp(d.baseX + 1.4142 * dSX, 0, 320 - d.w);
        y = clamp(d.baseY + 0.7001 * dSX + 1.2206 * dSY, 0, 170 - d.h);
      }
      setLive({ id: d.id, x, y, r: d.baseR });
    }
    function onUp() {
      const d = dragRef.current;
      dragRef.current = null;
      setLive((lp) => {
        if (!lp || !d) return null;
        let entry;
        if (d.moved) {
          entry = { x: lp.x, y: lp.y, r: d.baseR };
        } else if (d.surface === 'floor') {
          // Trykk uten å dra → snurr gulvmøbelet 90°.
          entry = { x: d.baseX, y: d.baseY, r: (d.baseR + 1) % 4 };
          sfx.tap();
        } else {
          return null; // veggdekor roteres ikke
        }
        const positions = { ...(room.positions ?? {}), [d.id]: entry };
        updateActiveProfile({ rooms: replaceRoom(activeProfile, room.id, { ...room, positions }) });
        return null;
      });
    }
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    // Bind kun når en ny dra-økt starter (id går fra null → id).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live?.id]);

  function switchRoom(id) {
    if (id !== room.id) updateActiveProfile({ activeRoomId: id });
  }

  function saveName() {
    const name = (editingName ?? '').trim() || room.name;
    updateActiveProfile({ rooms: replaceRoom(activeProfile, room.id, { ...room, name }) });
    setEditingName(null);
  }

  function buyRoom() {
    if (!canAffordRoom) return;
    sfx.purchase();
    updateActiveProfile({ ...buildAddedRoom(activeProfile), diamonds: activeProfile.diamonds - roomPrice });
  }

  const furniture = room.furniture.map(getItem).filter(Boolean);
  const decorations = room.decorations.map(getItem).filter(Boolean);
  const wallItems = (surface) =>
    decorations.filter((item) => item.placement?.surface === surface);
  const isEmpty = furniture.length === 0 && decorations.length === 0;
  const windowItem = room.window ? getItem(room.window) : null;

  // Gulvmøblene tegnes som flate «standere» i et 2D-lag oppå 3D-rommet, slik
  // at de aldri skjærer inn i veggene. Hvert gulvpunkt projiseres til skjerm-
  // koordinater med samme transform som rommet, og sorteres bakfra og frem
  // (etter gjeldende posisjon, så de bytter dybde mens man drar).
  const place = (item) => {
    const pos = positionOf(item);
    return { item, rotation: pos.r, ...projectFloor(pos.x, pos.y) };
  };

  // Tepper ligger flatt og tegnes UNDER de stående møblene.
  const placedRugs = decorations
    .filter((item) => item.kind === 'rug')
    .map(place)
    .sort((a, b) => a.depth - b.depth);

  const placedFloor = [...furniture, ...decorations]
    .filter((item) => item.placement?.surface === 'floor' && item.kind !== 'rug')
    .map(place)
    .sort((a, b) => a.depth - b.depth);

  return (
    <main className={`screen ${s.roomScreen}`}>
      <header className={s.header}>
        <button className="btn-ghost" onClick={onBack}>
          ← Kartet
        </button>
        {editingName === null ? (
          <h1 className={s.heading}>
            {room.name}
            <button
              className={s.renameBtn}
              aria-label="Gi rommet et nytt navn"
              onClick={() => setEditingName(room.name)}
            >
              ✏️
            </button>
          </h1>
        ) : (
          <form
            className={s.renameForm}
            onSubmit={(e) => {
              e.preventDefault();
              saveName();
            }}
          >
            <input
              className={s.renameInput}
              value={editingName}
              maxLength={20}
              autoFocus
              aria-label="Romnavn"
              onChange={(e) => setEditingName(e.target.value)}
              onBlur={saveName}
            />
            <button type="submit" className={s.renameSave}>
              Lagre
            </button>
          </form>
        )}
        <div className={s.headerRight}>
          <DiamondCounter amount={activeProfile.diamonds} />
          <button className={s.shopBtn} onClick={onOpenShop}>
            🛍️ Butikk
          </button>
        </div>
      </header>

      <nav className={s.roomTabs} aria-label="Rom">
        {rooms.map((r) => (
          <button
            key={r.id}
            className={r.id === room.id ? `${s.roomTab} ${s.roomTabActive}` : s.roomTab}
            aria-pressed={r.id === room.id}
            onClick={() => switchRoom(r.id)}
          >
            🚪 {r.name}
          </button>
        ))}
        {roomPrice != null && (
          <button
            className={s.addRoomBtn}
            onClick={buyRoom}
            disabled={!canAffordRoom}
            title={canAffordRoom ? 'Kjøp et nytt rom' : 'Du har ikke nok diamanter ennå'}
          >
            ➕ Nytt rom · 💎 {roomPrice}
          </button>
        )}
      </nav>

      <div className={s.stageWrap}>
        <div className={s.stage}>
          <div className={s.room}>
            <div className={s.floor} data-floor={room.floor ?? ''} />

            <div className={s.wallRight} data-wall={room.wallpaper ?? ''}>
              {windowItem && (
                <div className={s.windowSlot}>
                  <ItemArt item={windowItem} />
                </div>
              )}
              {wallItems('wallRight').map((item) => (
                <div
                  key={item.id}
                  className={s.wallItem}
                  style={placementBox(positionOf(item), item.placement)}
                  onPointerDown={(e) => startDrag(item, e)}
                >
                  <ItemArt item={item} />
                </div>
              ))}
            </div>

            <div className={s.wallLeft} data-wall={room.wallpaper ?? ''}>
              {wallItems('wallLeft').map((item) => (
                <div
                  key={item.id}
                  className={s.wallItem}
                  style={placementBox(positionOf(item), item.placement)}
                  onPointerDown={(e) => startDrag(item, e)}
                >
                  <ItemArt item={item} />
                </div>
              ))}
            </div>

          </div>

          {/* Møbellaget ligger oppå rommet og motvirker at flate møbler
              skjærer inn i veggene. Gjenstandene kan dras. */}
          <div className={s.furnitureLayer} ref={layerRef}>
            {placedRugs.map(({ item, sx, sy, rotation }) => {
              const dragging = live?.id === item.id;
              return (
                <div
                  key={item.id}
                  className={dragging ? `${s.piece} ${s.pieceDragging}` : s.piece}
                  style={{ left: sx - RUG.ax, top: sy - RUG.ay }}
                  onPointerDown={(e) => startDrag(item, e)}
                >
                  <IsoRug id={item.id} rotation={rotation} />
                </div>
              );
            })}
            {placedFloor.map(({ item, sx, sy, rotation }) => {
              const w = item.placement.w;
              const dragging = live?.id === item.id;
              return (
                <Fragment key={item.id}>
                  <div
                    className={s.shadow}
                    style={{ left: sx - w * 0.42, top: sy - 12, width: w * 0.84, height: 24 }}
                  />
                  <div
                    className={dragging ? `${s.piece} ${s.pieceDragging}` : s.piece}
                    style={{ left: sx - ISO.ax, top: sy - ISO.ay }}
                    onPointerDown={(e) => startDrag(item, e)}
                  >
                    <IsoItem id={item.id} rotation={rotation} />
                  </div>
                </Fragment>
              );
            })}
          </div>

          {isEmpty ? (
            <p className={s.emptyHint}>Kjøp møbler i butikken! 🛍️</p>
          ) : (
            <p className={s.dragHint}>✋ Dra for å flytte · 🔄 trykk for å snurre</p>
          )}
        </div>
      </div>
    </main>
  );
}

function placementBox(pos, placement) {
  return { left: pos.x, top: pos.y, width: placement.w, height: placement.h };
}

// Projiserer et gulvpunkt (0–320) til skjermkoordinater i møbellaget, med
// samme transform som .room (rotateX(55deg) rotateZ(45deg), origo i midten).
const ORIGIN = 160;
const COS55 = Math.cos((55 * Math.PI) / 180);

function projectFloor(x, y) {
  const px = x - ORIGIN;
  const py = y - ORIGIN;
  const x1 = (px - py) * Math.SQRT1_2;
  const y1 = (px + py) * Math.SQRT1_2;
  return { sx: ORIGIN + x1, sy: ORIGIN + y1 * COS55, depth: y1 };
}
