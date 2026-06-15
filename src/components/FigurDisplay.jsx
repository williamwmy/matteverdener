import s from './FigurDisplay.module.css';

/**
 * Geometrisk figur i SVG med sidemål, for areal-, omkrets- og vinkeloppgaver.
 * Konsumerer { type: 'figur', shape, labels } fra oppgavedata.
 * shape: 'rektangel' | 'kvadrat' | 'trekant'
 * labels: f.eks. { b: '6 cm', h: '4 cm' } eller { grunnlinje, hoyde } eller { vinkler }
 * @param {{ shape: string, labels: object }} props
 */
export default function FigurDisplay({ shape, labels }) {
  if (shape === 'trekant') {
    return (
      <svg className={s.fig} width="200" height="150" viewBox="0 0 200 150" role="img" aria-label="Trekant">
        <polygon points="30,120 170,120 70,30" className={s.shape} />
        {labels.grunnlinje && (
          <text x="100" y="140" className={s.label}>
            {labels.grunnlinje}
          </text>
        )}
        {labels.hoyde && (
          <>
            <line x1="70" y1="30" x2="70" y2="120" className={s.helper} />
            <rect x="70" y="110" width="10" height="10" className={s.rightAngle} />
            <text x="86" y="78" className={s.label}>
              {labels.hoyde}
            </text>
          </>
        )}
        {labels.vinkel && (
          <text x="70" y="52" className={s.angle}>
            {labels.vinkel}
          </text>
        )}
        {/* Vinkler markert i hvert hjørne (hjørne A nede til venstre, B nede til høyre, C i toppen). */}
        {labels.va && (
          <text x="52" y="108" className={s.angle}>
            {labels.va}
          </text>
        )}
        {labels.vb && (
          <text x="148" y="108" className={s.angle}>
            {labels.vb}
          </text>
        )}
        {labels.vc && (
          <text x="74" y="56" className={s.angle}>
            {labels.vc}
          </text>
        )}
      </svg>
    );
  }
  // rektangel / kvadrat
  const w = shape === 'kvadrat' ? 120 : 170;
  return (
    <svg className={s.fig} width="210" height="150" viewBox="0 0 210 150" role="img" aria-label={shape}>
      <rect x="20" y="25" width={w} height="90" className={s.shape} />
      {labels.b && (
        <text x={20 + w / 2} y="135" className={s.label}>
          {labels.b}
        </text>
      )}
      {labels.h && (
        <text x={20 + w + 10} y="75" className={s.label}>
          {labels.h}
        </text>
      )}
      {labels.side && (
        <text x={20 + w / 2} y="135" className={s.label}>
          {labels.side}
        </text>
      )}
    </svg>
  );
}
