# MatteVerdener

Norsk mattespill (PWA) for 1.–7. trinn. Barn løser oppgaver, tjener diamanter
og pynter sitt eget rom. Ingen backend, ingen innlogging — all data lagres
lokalt i `localStorage` under nøkkelen `matteverdener_v1`.

## Kjøring

```bash
npm install
npm run dev       # utviklingsserver
npm run build     # produksjonsbygg med service worker (dist/)
npm run preview   # forhåndsvis produksjonsbygget
```

## Stack

- React 18 + Vite, ren CSS (CSS Modules + design tokens i `src/styles/tokens.css`)
- `vite-plugin-pwa` med `autoUpdate` — appen fungerer offline etter første besøk
  (Google Fonts runtime-caches av service workeren)
- Versjonsnummer hentes fra `package.json` via `__APP_VERSION__` (define i
  `vite.config.js`) og vises på startskjermen

## Struktur

- `src/store.js` — alt av localStorage-lesing/-skriving
- `src/context/ProfileContext.jsx` — global tilstand (profiler, aktiv profil)
- `src/hooks/useAdaptive.js` — adaptiv vanskelighetslogikk (nivå 1–10, vises
  aldri i UI)
- `src/data/questions.js` — prosedural oppgavegenerering per nivå
- `src/data/shopItems.js` — butikkvarer med faste rom-slots
- `src/components/NomerDisplay.jsx` — faste nomer-punktmønstre 1–10 (SVG)
- `src/components/Room.jsx` — isometrisk rom med CSS 3D transforms;
  gjenstander er rene CSS-illustrasjoner (`ItemArt.jsx`)

## Avvik fra spesifikasjonen

- Profilen har et ekstra felt `owned: string[]` (alle kjøpte gjenstander).
  Spesifikasjonens «Eies»-merke i butikken krever å skille *eid* fra *i bruk* —
  `room`-feltene holder bare det som er aktivt.
- Kjøpte gjenstander tas i bruk umiddelbart; møbler/dekor kan fjernes og
  settes inn igjen fra butikken («Fjern fra rommet» / «Bruk»).
- Kun verden 1 (Tallskogen) har oppgaver; verden 2–7 vises låst med
  «Kommer snart».
