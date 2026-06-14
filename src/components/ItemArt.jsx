import s from './ItemArt.module.css';

/**
 * Rene CSS-illustrasjoner av butikkgjenstander. Brukes både i Rommet
 * (full størrelse) og som forhåndsvisning i Butikken.
 * @param {{ item: object }} props - en gjenstand fra shopItems.js
 */
export default function ItemArt({ item }) {
  if (item.category === 'gulv') return <div className={s.swatch} data-floor={item.id} />;
  if (item.category === 'vegg') return <div className={s.swatch} data-wall={item.id} />;
  if (item.category === 'vindu') {
    return (
      <div className={s.vindu}>
        <div className={s.vinduRute} data-window={item.id} />
      </div>
    );
  }
  return renderArt(item.id);
}

function renderArt(id) {
  switch (id) {
    case 'seng':
      return (
        <div className={s.art}>
          <div className={s.sengGavl} />
          <div className={s.sengRamme} />
          <div className={s.sengMadrass} />
          <div className={s.sengPute} />
          <div className={s.sengTeppe} />
        </div>
      );
    case 'skrivebord':
      return (
        <div className={s.art}>
          <div className={s.bordSkjerm} />
          <div className={s.bordPlate} />
          <div className={`${s.bordBein} ${s.bordBeinVenstre}`} />
          <div className={`${s.bordBein} ${s.bordBeinHoyre}`} />
          <div className={s.bordKopp} />
        </div>
      );
    case 'bokhylle':
      return (
        <div className={s.art}>
          <div className={s.hylleRamme}>
            <div className={s.hylleBoker} />
            <div className={s.hylleBoker} />
            <div className={s.hylleBoker} />
          </div>
        </div>
      );
    case 'sofa':
      return (
        <div className={s.art}>
          <div className={s.sofaRygg} />
          <div className={`${s.sofaArm} ${s.sofaArmVenstre}`} />
          <div className={`${s.sofaArm} ${s.sofaArmHoyre}`} />
          <div className={s.sofaSete} />
          <div className={s.sofaPute} />
        </div>
      );
    case 'plakat-rakett':
      return (
        <div className={`${s.art} ${s.plakat}`}>
          <div className={s.rakettKropp} />
          <div className={s.rakettVindu} />
          <div className={s.rakettFlamme} />
          <div className={s.plakatStjerner} />
        </div>
      );
    case 'plakat-stjerner':
      return (
        <div className={`${s.art} ${s.plakat}`}>
          <div className={s.maane} />
          <div className={s.plakatStjerner} />
        </div>
      );
    case 'potte-kaktus':
      return (
        <div className={s.art}>
          <div className={s.kaktusKropp} />
          <div className={s.potte} />
        </div>
      );
    case 'potte-monstera':
      return (
        <div className={s.art}>
          <div className={`${s.blad} ${s.bladVenstre}`} />
          <div className={`${s.blad} ${s.bladHoyre}`} />
          <div className={`${s.blad} ${s.bladTopp}`} />
          <div className={s.potte} />
        </div>
      );
    case 'lampe':
      return (
        <div className={s.art}>
          <div className={s.lampeGlow} />
          <div className={s.lampeSkjerm} />
          <div className={s.lampeStang} />
          <div className={s.lampeFot} />
        </div>
      );
    case 'trofe':
      return (
        <div className={s.art}>
          <div className={s.trofeKopp} />
          <div className={s.trofeStett} />
          <div className={s.trofeFot} />
        </div>
      );
    default:
      return <div className={s.art} />;
  }
}
