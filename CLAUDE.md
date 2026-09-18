# Reservio – podklad pre prácu na projekte

Univerzálny rezervačný systém pre kaderníčky, kozmetičky, trénerov, tanečné školy
a kliniky. Zadávateľ si nastaví služby s dĺžkou trvania, pracovný čas, prestávky,
prevádzky a miestnosti. Klient si vyberie službu a systém mu ponúkne iba termíny,
do ktorých sa služba celá zmestí.

Jazyk projektu je slovenčina: všetky texty v rozhraní, commity aj komentáre píš po slovensky.

## Stav projektu

- Repozitár: `Soldanellka/reservio-app`, vetva `main`, nasadenie na Vercel (`reservio-app.vercel.app`).
- Next.js 14 (App Router) + Tailwind. Tailwind je zatiaľ nastavený, ale komponenty
  používajú inline štýly a `globals.css`.
- Celá funkčná aplikácia je zatiaľ jeden statický súbor `public/app.html`:
  vanilla JavaScript, bez buildu, dáta v `localStorage`. Beží na `/app.html`.
- Úvodná stránka je Next.js (`src/app/page.tsx` + komponenty) a odkazuje do `/app.html`.

Toto rozdelenie je dočasné. Cieľ je preniesť aplikáciu do Next.js a nad databázu.

## Mapa súborov

```
public/app.html              celá aplikácia (UI + logika + dáta), ~1400 riadkov
src/app/layout.tsx           root layout
src/app/page.tsx             úvodná stránka
src/app/globals.css          globálne štýly úvodnej stránky
src/components/              Header, Hero, CalendarPreview
```

## Ako funguje app.html

Kód je rozdelený na sekcie oddelené komentármi:

- **pomocné funkcie** – práca s časom. Čas je všade celé číslo minút od polnoci
  (`t2m` / `m2t`), dátum je reťazec `YYYY-MM-DD` (`dk` / `pd` / `addDays`),
  pondelok je deň 0 (`wd`).
- **Store** – `db` je jeden objekt uložený v `localStorage` pod kľúčom `reservio.v1`,
  `load()` a `save()` sú jediné miesta, ktoré sa dotýkajú úložiska. Toto je vrstva,
  ktorá sa bude vymieňať za databázu.
- **dostupnosť** – `dayWindow()` vráti pracovný čas dňa aj s výnimkami,
  `checkSlot()` overí jeden konkrétny termín, `getSlots()` vygeneruje voľné termíny.
- **notifikácie** – `notify()`, `sendDaily()`, `sendNextDay()`, `sendDigest()` a `tick()`,
  ktorý beží každých 30 sekúnd.
- **router** – hash routovanie: `#/`, `#/rezervacia`, `#/admin/<záložka>`.
- **klient** a **zadávateľ** – renderovacie funkcie, každá vracia HTML reťazec
  a funkciu `wire()`, ktorá naviaže udalosti.

### Dátový model

```js
location = { id, name, address, rooms: [{id, name}], week: [7x {open, start, end, breaks: [{start, end, label}]}] }
service  = { id, name, description, duration, buffer, price, color, capacity, roomIds: [] }
booking  = { id, serviceId, locationId, roomId, date, start, duration, buffer,
             customer: {name, phone, email, note}, status, createdAt, source }
block    = { id, locationId, roomId|null, date, start, end, label }
exception= { id, locationId, date, type: 'closed'|'custom', start, end, note }
settings = { slotStep, horizon, minNotice, notify: {...}, sent: {...} }
```

`duration` je dĺžka služby v minútach, `buffer` je pauza po službe, ktorú klient
nevidí, ale ďalší termín začne až po nej. `capacity > 1` znamená skupinovú službu:
viac klientov na rovnaký čas v rovnakej miestnosti.

### Pravidlá, ktoré musí dodržať každá zmena

- Termín je voľný, keď sa `[start, start + duration]` zmestí do pracovného času,
  neprekrýva sa s prestávkou, blokom ani inou rezerváciou v tej istej miestnosti,
  vrátane jej `buffer`.
- Zrušená rezervácia (`status === 'cancelled'`) neblokuje kalendár.
- Klientovi sa nikdy nesmie zobraziť meno ani telefón iného klienta.
- Prestávky, obedy a interné bloky klient nevidí ako zoznam, iba ako chýbajúce termíny.

## Známe obmedzenia

1. Dáta sú v prehliadači, takže rezervácia klienta sa k zadávateľovi nedostane.
2. Správa nemá prihlásenie, `/app.html#/admin` je dostupná komukoľvek.
3. Voľné termíny kontroluje prehliadač, takže dvaja klienti naraz môžu zabrať ten istý čas.
4. Notifikácie fungujú iba pri otvorenej aplikácii, e-maily zatiaľ nie sú.
5. Interval ponúkaných termínov (`slotStep`) je spoločný pre všetky služby.

## Roadmapa

1. **Opraviť build a nasadenie.** Bez toho sa na Vercel nedostane nič nové.
2. **Databáza a dátová vrstvo.** Nahradiť `load()` a `save()` volaniami databázy.
   Rozhodnutie Firebase verzus Postgres ešte nepadlo, README počíta s Firebase.
   Kontrola kolízií musí prejsť na server, inak bod 3 vyššie zostáva.
3. **Prihlásenie zadávateľa** a oddelenie verejných dát (služby, voľné termíny)
   od súkromných (mená, telefóny, poznámky).
4. **E-mailové notifikácie.** Okamžitá pri rezervácii cez serverovú funkciu,
   súhrn dňa a prehľad na ďalší deň cez naplánovanú úlohu. Pozor: na bezplatnom
   pláne Vercelu môže naplánovaná úloha bežať iba raz denne, spustí sa kdekoľvek
   v rámci zvolenej hodiny a beží v UTC.
5. **Prenos aplikácie do Next.js komponentov**, keď bude hotová databáza.
   Robiť to skôr znamená prepisovať ten istý kód dvakrát.

## Ako pracovať v tomto repozitári

- Malé, samostatné commity so slovenským popisom, čo sa zmenilo a prečo.
- Po každej zmene v `public/app.html` prejdi celý postup: rezervácia klientom,
  zobrazenie v kalendári, úprava rezervácie, presun na iný čas, zrušenie.
- Ak zmeníš dátový model, zvýš `version` v `defaultData()` a v `load()` ošetri
  staré dáta, aby sa používateľovi nevymazal kalendár.
- Nepridávaj knižnice, kým to nie je nutné. `app.html` je zámerne bez závislostí.
- Neposielaj dáta klientov nikam mimo projektu.
