import { Fragment, useEffect, useRef, useState } from 'react';
import DiamondCounter from './DiamondCounter.jsx';
import ItemArt from './ItemArt.jsx';
import IsoItem, { ISO } from './IsoItem.jsx';
import IsoRug, { RUG } from './IsoRug.jsx';
import { getItem } from '../data/shopItems.js';
import { resolveVariant } from '../data/furniture.js';
import { useProfile } from '../hooks/useProfile.js';
import { getActiveRoom, getPlaced, buildAddedRoom, nextRoomPrice, replaceRoom, updatePlaced } from '../store.js';
import { sfx } from '../sound.js';
import s from './Room.module.css';

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

/**
 * Rommet i isometrisk kabinett-perspektiv. Hver plasserte gjenstand er en egen
 * instans (room.placed); flere av samme er lov. Gjenstandene kan dras (flytte)
 * og trykkes (snurre 90°).
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
  const [live, setLive] = useState(null); // { iid, x, y, r }

  function positionOf(inst) {
    if (live && live.iid === inst.iid) return { x: live.x, y: live.y, r: live.r };
    return { x: inst.x, y: inst.y, r: inst.r ?? 0 };
  }

  function startDrag(inst, type, e) {
    e.preventDefault();
    const rect = layerRef.current.getBoundingClientRect();
    const scale = rect.width / 320; // laget er 320px uskalert
    const base = positionOf(inst);
    dragRef.current = {
      iid: inst.iid,
      surface: type.surface,
      kind: type.kind,
      baseX: base.x,
      baseY: base.y,
      baseR: base.r,
      startCX: e.clientX,
      startCY: e.clientY,
      scale,
      w: type.footprint.w,
      h: type.footprint.h,
      moved: false,
    };
    setLive({ iid: inst.iid, x: base.x, y: base.y, r: base.r });
  }

  useEffect(() => {
    if (!live) return;
    function onMove(e) {
      const d = dragRef.current;
      if (!d) return;
      const dxC = e.clientX - d.startCX;
      const dyC = e.clientY - d.startCY;
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
      setLive({ iid: d.iid, x, y, r: d.baseR });
    }
    function onUp() {
      const d = dragRef.current;
      dragRef.current = null;
      setLive((lp) => {
        if (!lp || !d) return null;
        let patch;
        if (d.moved) {
          patch = { x: lp.x, y: lp.y };
        } else if (d.surface === 'floor') {
          patch = { r: (d.baseR + 1) % 4 }; // trykk → snurr gulvgjenstand
          sfx.tap();
        } else {
          return null; // veggdekor roteres ikke
        }
        updateActiveProfile({ rooms: replaceRoom(activeProfile, room.id, updatePlaced(room, d.iid, patch)) });
        return null;
      });
    }
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live?.iid]);

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

  // Slå opp hver instans → form/farge, og del opp etter type.
  const items = getPlaced(room)
    .map((inst) => {
      const rv = resolveVariant(inst.v);
      return rv ? { inst, type: rv.type, color: rv.color.value } : null;
    })
    .filter(Boolean);

  const project = (it) => {
    const pos = positionOf(it.inst);
    return { ...it, rotation: pos.r, pos, ...projectFloor(pos.x, pos.y) };
  };

  const rugs = items.filter((it) => it.type.kind === 'rug').map(project).sort((a, b) => a.depth - b.depth);
  const floorItems = items
    .filter((it) => it.type.kind === 'furniture' && it.type.surface === 'floor')
    .map(project)
    .sort((a, b) => a.depth - b.depth);
  const wallItems = (surface) => items.filter((it) => it.type.kind === 'wall' && it.type.surface === surface);

  const isEmpty = items.length === 0;
  const windowItem = room.window ? getItem(room.window) : null;

  return (
    <main className={`screen ${s.roomScreen}`}>
      <header className={s.header}>
        <button className="btn-ghost" onClick={onBack}>
          ← Kartet
        </button>
        {editingName === null ? (
          <h1 className={s.heading}>
            {room.name}
            <button className={s.renameBtn} aria-label="Gi rommet et nytt navn" onClick={() => setEditingName(room.name)}>
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
              {wallItems('wallRight').map(({ inst, type }) => (
                <div
                  key={inst.iid}
                  className={s.wallItem}
                  style={placementBox(positionOf(inst), type.footprint)}
                  onPointerDown={(e) => startDrag(inst, type, e)}
                >
                  <ItemArt item={{ id: type.art, category: 'dekor' }} />
                </div>
              ))}
            </div>

            <div className={s.wallLeft} data-wall={room.wallpaper ?? ''}>
              {wallItems('wallLeft').map(({ inst, type }) => (
                <div
                  key={inst.iid}
                  className={s.wallItem}
                  style={placementBox(positionOf(inst), type.footprint)}
                  onPointerDown={(e) => startDrag(inst, type, e)}
                >
                  <ItemArt item={{ id: type.art, category: 'dekor' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Møbellaget ligger oppå rommet (tepper under møblene). */}
          <div className={s.furnitureLayer} ref={layerRef}>
            {rugs.map(({ inst, type, color, sx, sy, rotation }) => {
              const dragging = live?.iid === inst.iid;
              return (
                <div
                  key={inst.iid}
                  className={dragging ? `${s.piece} ${s.pieceDragging}` : s.piece}
                  style={{ left: sx - RUG.ax, top: sy - RUG.ay }}
                  onPointerDown={(e) => startDrag(inst, type, e)}
                >
                  <IsoRug color={color} motif={type.motif} rotation={rotation} />
                </div>
              );
            })}
            {floorItems.map(({ inst, type, color, sx, sy, rotation }) => {
              const w = type.footprint.w;
              const dragging = live?.iid === inst.iid;
              return (
                <Fragment key={inst.iid}>
                  <div
                    className={s.shadow}
                    style={{ left: sx - w * 0.42, top: sy - 12, width: w * 0.84, height: 24 }}
                  />
                  <div
                    className={dragging ? `${s.piece} ${s.pieceDragging}` : s.piece}
                    style={{ left: sx - ISO.ax, top: sy - ISO.ay }}
                    onPointerDown={(e) => startDrag(inst, type, e)}
                  >
                    <IsoItem shape={type.shape} color={color} rotation={rotation} />
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

function placementBox(pos, footprint) {
  return { left: pos.x, top: pos.y, width: footprint.w, height: footprint.h };
}

// Projiserer et gulvpunkt (0–320) til skjermkoordinater i møbellaget.
const ORIGIN = 160;
const COS55 = Math.cos((55 * Math.PI) / 180);

function projectFloor(x, y) {
  const px = x - ORIGIN;
  const py = y - ORIGIN;
  const x1 = (px - py) * Math.SQRT1_2;
  const y1 = (px + py) * Math.SQRT1_2;
  return { sx: ORIGIN + x1, sy: ORIGIN + y1 * COS55, depth: y1 };
}
