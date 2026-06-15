# MatteVerdener

Norsk mattespill (PWA) for 1.–7. trinn. Barn løser oppgaver tilpasset
læreplanen (LK20), tjener diamanter og pynter sitt eget rom. Ingen backend,
ingen innlogging — all data lagres lokalt i `localStorage`.

## Hva vi bygger

Et offline-first læringsspill der **oppgavene er det viktigste**. Hver av de 7
verdenene har sitt eget tema og dekker kompetansemål for et trinn-trinn-spenn.
En økt er 8 oppgaver; vanskelighetsgraden styres av et skjult adaptivt nivå
(1–10) som justeres etter hvor godt barnet gjør det. Diamanter brukes i en
butikk til å møblere et isometrisk rom.

Designprinsipper: barnevennlig, visuelt (nomer, tallinje, brøkfigurer,
koordinatsystem, søylediagram, geometrifigurer), norsk bokmål, store
trykkflater (≥44px), `prefers-reduced-motion` respektert.

## Hva vi har bygd

Hele MVP-en er på plass og fungerer:

- **7 verdener** med 16–23 curriculumforankrede oppgavetyper hver (~125 totalt),
  fordelt på nivå 1–10 (se «Verdener» under). De **låses opp i rekkefølge**:
  neste verden åpner når du har tjent den første stjernen i forrige.
- **Synlig progresjon per verden**: stjerner (0–3) etter antall riktige svar
  samlet (`STAR_STEPS = [12, 30, 50]` i `worlds.js`), vist som stjernerad +
  framgangsmåler på verdenskortet. Opplåsing styres av `isWorldUnlocked`.
  (Det skjulte adaptive nivået er noe annet — det styrer vanskelighetsgrad.)
- **Adaptiv motor**: 7/8 riktig → +1 nivå, 8/8 → +2, <5/8 → −1. 25 % av
  oppgavene i en økt hentes fra nivået over for litt motstand. Nivået vises
  aldri i UI. Diamantbelønningen skalerer med nivået (`computeReward` i
  `useAdaptive.js`): 10 per riktig på nivå 1 → 28 på nivå 10, pluss en
  perfekt-bonus som også øker med nivået.
- **Skjermer**: startskjerm (m/ versjon), profilvelger (maks 5, slett m/
  bekreftelse), verdenskart, spilløkt, isometrisk rom (CSS 3D), butikk.
- **Møbelkatalog + butikk**: én katalog (`src/data/furniture.js`) med
  møbel*typer* (form + fargevarianter). Hver vare er en variant `«type:farge»`
  (f.eks. `stol:rod`). Butikken viser ett kort per type med fargevelger; etter
  kjøp kan du legge inn **flere av samme** vare (+/−-teller). Gulv/vegg/vindu er
  fortsatt engangsvalg (singletoner i `shopItems.js`).
- **Visuelle oppgavekomponenter**: NomerDisplay, TallinjeDisplay (m/ hopp og
  negative tall), SekvensDisplay (tallmønster/-følge på tallinje med pil-hopp,
  f.eks. `1, 4, 9, ?`), TelleScene, ArrayDisplay, BrokDisplay, KoordinatDisplay,
  SoyleDiagram, FigurDisplay, MyntDisplay.
- **Easter eggs**: (1) Konami-koden (`↑↑↓↓←→←→ b a`, `useKonamiCode`) på
  verdenskartet åpner `CheatDialog` der man kan legge til diamanter *og* låse opp
  alle verdener (`unlockAllWorlds` løfter hver verden utenom den siste til
  `UNLOCK_CORRECT` riktige). (2) Svarer barnet riktig og fasiten er nettopp **67**, spretter en
  animert «six seven»-meme opp (`SixSevenMeme` i `Celebrations.jsx`); trigges i
  `GameSession.handleAnswer` på `Number(question.correct) === 67`.
- **Per-verden tema**: egen bakgrunn og emoji-stripe i spilløkten.
- **Lydeffekter**: syntetisert med Web Audio API i `src/sound.js` (ingen
  lydfiler) — riktig/feil/belønning/kjøp/klikk. Av/på-bryteren (`SoundToggle`)
  ligger på startskjermen og verdenskartet og huskes i `settings.soundOn`.
- **PWA**: manifest + autoUpdate-service worker, fungerer offline, Google Fonts
  runtime-caches.

## Teknisk stack

- React 18 + Vite, ren CSS (CSS Modules + tokens i `src/styles/tokens.css`)
- `vite-plugin-pwa` (`registerType: 'autoUpdate'`)
- Ingen UI-rammeverk, ingen state-bibliotek (kun React Context), ingen backend
- Versjon fra `package.json` via `__APP_VERSION__` (define i `vite.config.js`)

## Kommandoer

```bash
npm install
npm run dev       # utviklingsserver
npm run build     # produksjonsbygg (dist/) med service worker
npm run preview   # forhåndsvis produksjonsbygget (test PWA/offline)
```

## Arkitektur

```
src/
  data/
    worlds.js              # metadata for de 7 verdenene (navn, tema, farge)
    questions.js           # DISPATCHER: ruter (worldId, level) → riktig verden
    questionHelpers.js     # delte verktøy (randInt, makeChoices, choicesFrom …)
    furniture.js           # møbelkatalog: TYPES (form + farger) + variant-/migrering
    shopItems.js           # singletoner (gulv/vegg/vindu) + vindusvisning
    worlds/                # ÉN FIL PER VERDEN — her ligger oppgavene
      tallskogen.js
      kystbyen.js
      skogshemmeligheten.js
      verdensrommet.js
      dyphavet.js
      middelalderborgen.js
      fremtidensby.js
  components/               # én komponent per fil (.jsx + .module.css)
  hooks/                    # useProfile, useAdaptive, useKonamiCode
  context/ProfileContext.jsx
  store.js                 # alt av localStorage-tilgang
```

### Slik legger du til/endrer oppgaver

1. Åpne riktig fil i `src/data/worlds/`.
2. Hver fil eksporterer `pools`: et objekt `{ 1: [...], …, 10: [...] }` der hver
   verdi er en liste av **generatorfunksjoner** (`() => question({...})`).
   Dupliser en generator i lista for å gi den høyere vekt.
3. En oppgave er et objekt fra `question()`:
   ```js
   {
     prompt,                      // tekst
     expression,                  // valgfri stor visning (kan være null)
     visual,                      // valgfri { type, … } — se under
     choiceType,                  // 'number' | 'text' | 'emoji' | 'nomer'
     choices,                     // nøyaktig 4 unike alternativer
     correct,                     // må finnes i choices
     explanation: { text, visual } // vises ved feil svar
   }
   ```
4. `visual.type` rutes i `GameSession.jsx` (`QuestionVisual`) til riktig
   komponent: `nomer`, `tallinje`, `sekvens`, `telle`, `array`, `brok`,
   `koordinat`, `soyle`, `figur`, `mynter`. For tallmønstre gir `sekvens`
   `{ terms, answer, labels, reveal }` en tallinje med pil-hopp (siste hopp mot
   `?` er bevisst uten etikett; sett `reveal: true` i `explanation.visual` for å
   vise fasit + alle hopp).
5. Bruk `makeChoices(correct, {min,max,spread})` for talldistraktører og
   `choicesFrom(correct, [distraktører])` for tekst/brøk. Pass på at du alltid
   har minst 3 unike distraktører, ellers kaster `choicesFrom`.

### Verdener og læreplanforankring (LK20)

| # | Verden | Trinn | Tema | Mål |
|---|--------|-------|------|-----|
| 1 | Tallskogen | 1.–2. | skog, dyr | telling forlengs/baklengs, nomer, tallinje, partall/oddetall, posisjonssystem, +/−, kommutativitet, mønstre |
| 2 | Kystbyen | 2.–3. | kyst, fiske | multiplikasjon (array/gjentatt addisjon), gangetabell, divisjon, brøk av mengde |
| 3 | Skogshemmeligheten | 3.–4. | sopp/mystikk | brøk (del av hel/mengde, sammenligne, ekvivalente, addisjon), desimaltall, mønster/figurtall |
| 4 | Verdensrommet | 4.–5. | rom/planeter | store tall, posisjonssystem, avrunding, negative tall, koordinatsystem |
| 5 | Dyphavet | 5.–6. | dyphav | prosent (brøk/desimal/prosent), statistikk (gjennomsnitt/median/typetall/søylediagram), sannsynlighet |
| 6 | Middelalderborgen | 6.–7. | borg/riddere | likninger, uttrykk (innsetting/forenkling), geometri (omkrets/areal/vinkler) |
| 7 | Fremtidens by | 7. | fremtidsby | funksjoner, likninger med x på begge sider, koordinater i alle kvadranter, proporsjonalitet, prosent |

## Datamodell (localStorage `matteverdener_v1`)

Toppnivå: `{ profiles[], activeProfileId, settings: { soundOn } }`.
Profil: `{ id, name, avatar, createdAt, diamonds, adaptiveLevel, rooms[], activeRoomId, owned[], worldProgress }`.
`adaptiveLevel` er felles på tvers av verdener (én verdi per profil) — en ny
profil starter på 1 og møter de letteste oppgavene i alle verdener.

Hvert rom er `{ id, name, floor, wallpaper, window, placed[] }` og kan døpes om
i UI. `owned[]` er felles for profilen og inneholder **variant-id-er**
(`«type:farge»`, f.eks. `sofa:lilla`) + singleton-id-er (`gulv-…`/`vegg-…`/
`vindu-…`); du eier en variant én gang men kan plassere den i flere rom og i
flere eksemplarer. Hver plasserte gjenstand er en egen instans i `placed[]`:
`{ iid, v, x, y, r }` der `v` er variant-id-en og `r` er rotasjon (0–3).
Hjelpere i `store.js`: `getPlaced`, `countPlaced`, `addPlaced`,
`removeOnePlaced`, `updatePlaced`. `furniture.js` slår opp en variant →
`{ type, color }` via `resolveVariant`.

Profilen starter med ett gratis rom; flere kan kjøpes for diamanter
(`ROOM_PRICES`/`nextRoomPrice` i `store.js`, maks `MAX_ROOMS`). `store.js`
migrerer gamle profiler ved innlasting: enkelt `room` → `rooms[]` +
`activeRoomId`, og gamle `furniture[]`/`decorations[]`/`positions{}` med flate
item-id-er → `placed[]` med variant-id-er (`legacyVariant` i `furniture.js`).

Gulvmøbler tegnes i `Room.jsx` isometrisk (`IsoItem` — klosser med topp/sider,
fargelagt fra varianten) i et 2D-lag oppå 3D-rommet (`projectFloor` projiserer
gulvpunkt → skjerm, sortert bakfra og frem), slik at de aldri skjærer inn i
veggene. Vegger, vindu og veggdekor ligger i 3D-laget. Tepper (`kind: 'rug'`)
tegnes flatt (`IsoRug`) i samme lag, men *under* de stående møblene. Møbler,
dekor og tepper kan **dras** (flyttes) og **snurres** (trykk uten å dra → 90°);
tilstanden lagres direkte på instansen i `placed[]`.

**Gotcha i `IsoItem`**: ved rotasjon sorteres klossene på dybde (`cx+cy+cz`).
Stablede deler som skal kunne skjules av hverandre (f.eks. TV-skjermen vs. den
mørke baksiden) må ha **samme `cz`**, ellers tegnes den høyeste alltid øverst —
da «lyser» skjermen gjennom baksiden uansett rotasjon.

## Kjente forenklinger / mulige neste steg

- Ett globalt `adaptiveLevel` per profil deles av alle verdener. Per-verden nivå
  ville passe bedre når trinn-spennene er så ulike.
- Geometri/måling/klokke (LK20 for 1.–2.) er bare delvis dekket; klokke,
  kalender og lengde/areal-måling kan bli egne oppgavetyper.
- Profiler som spilte før verdenene ble åpnet beholder nivået sitt.

## Verifisering

- `npm run build` skal være grønt (genererer service worker + manifest).
- Logikktest (rene funksjoner, ingen DOM):
  ```bash
  node --input-type=module -e "import {generateQuestion} from './src/data/questions.js'; for(let w=1;w<=7;w++) for(let l=1;l<=10;l++) for(let i=0;i<3000;i++){const q=generateQuestion(w,l); if(q.choices.length!==4||!q.choices.includes(q.correct)) throw new Error(JSON.stringify(q));} console.log('OK');"
  ```
- Visuell test: bruk `/run`-ferdigheten (Playwright + `npm run dev`) til å spille
  gjennom en økt per verden.
