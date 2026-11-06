# ZHULULU — Chaos Crew

Mobilná PWA párty hra v Node.js + Socket.IO + Canvas. Žiadny Python.

## Spustenie lokálne

```bash
npm install
npm start
```

Otvoriť http://localhost:3000.

## GitHub + Render

1. Vytvor nový verejný alebo súkromný repozitár na GitHube.
2. Nahraj **obsah priečinka zhululu** (package.json a server.js musia byť v koreňovom priečinku repozitára).
3. Na render.com zvoľ **New → Web Service**, prepoj GitHub repozitár.
4. Runtime: Node; Build Command: `npm install`; Start Command: `npm start` (alebo použi priložený render.yaml).
5. Po nasadení otvor HTTPS URL z Renderu v mobilnom prehliadači.
6. iPhone Safari: Zdieľať → Pridať na plochu. Android Chrome: ⋮ → Pridať na plochu / Inštalovať aplikáciu.
7. Jeden hráč klikne Multiplayer → Vytvoriť miestnosť; ostatní zadajú rovnaký kód.

## Implementované

- 6 postáv (všetky 21+): Maroš, Jayo CEO, Maxo, Lukáš, Krištof, Broski
- Singleplayer, multiplayer miestnosti (do 12 hráčov), synchronizácia pozícií, tímy A/B, chat, body
- Recent played rooms uložené lokálne v danom prehliadači
- 9 aktivít: basket, futbal, volejbal, komediálne podávanie rekvizity, skladanie kreslenej rekvizity, snack, dance, road trip, world
- 8 destinácií, animovaný canvas, mobilné ovládanie, PWA manifest a offline cache

## Dôležité obmedzenia

Toto je **hrateľný prototyp**, nie hotová 3D open-world hra. Minihry sú jednoduché arkádové interakcie s bodmi, nie plnohodnotné simulácie s fyzikou a súťažnými pravidlami. Cestovanie prepína tematické lokality, nejde o detailné mapy celého sveta. "Recent played" ukladá kódy miestností na zariadení, nie sociálne účty ani históriu konkrétnych hráčov. Miestnosti sú v pamäti servera, po reštarte Renderu zaniknú; free hosting sa môže uspávať. Žiadne užívateľské účty, databáza ani matchmaking.

Drogové motívy sú fikčné, rekvizitné a bez návodov na prípravu či užívanie. Jazda autom je výlučne virtuálna.


## Zhululu v1.1 — Chaos Effects, Racing, MMA

- Nové minihry Racing (šípky vľavo/vpravo = pruh; AKCIA = zmena pruhu) a MMA (AKCIA = úder; vľavo/dole = blok).
- V záložke CHAOS nastavíte fiktívnu odrodu, intenzitu a vizuálne efekty. Predvolené Amnesia Haze 80 %. Nastavenie sa ukladá lokálne v prehliadači.
- Racing a MMA bežia ako klientské arkádové minihry; stav zápasu a prekážok sa medzi telefónmi zatiaľ nesynchronizuje. Multiplayer lobby a zdieľanie zvolenej hry zostávajú zachované.
- Aktualizované ikony PWA podľa schváleného loga.


## v1.2 — Joystick + TPP
- Mobilný analógový joystick (Pointer Events, multidotyk), tlačidlo AKCIA.
- 2.5D perspektívny svet s kamerou sledujúcou postavu zozadu, NPC, lokalitami a pozadím s paralaxou.
- Joystick ovláda zmenu pruhov v Racing a pohyb/obranu v MMA. Klávesnica zostáva dostupná na počítači.
- TPP je štylizovaná Canvas perspektíva, nie plný 3D engine.
- Nasadenie: GitHub -> Render Web Service, npm install, npm start.


## v1.3 Colorburst
Vylepšené vykresľovanie TPP sveta: vrstvená farebná obloha, panoráma, perspektívna cesta, budovy s oknami, stromy, tieňovanie, 3D-štýlový avatar, nový HUD a sýtejšie farby. Stále ide o 2.5D Canvas prototyp, nie plnohodnotný 3D engine.


## v1.4 NPC update
- Seven in-world NPCs: Maroš, Jayo, Maxo, Lukáš, Krištof, Broski and Marko the bodybuilder.
- No NPC character selection on the start screen; players use their own avatar.
- NPC tab lets players talk to each character and trigger fictional challenges and visual chaos.
- Multiplayer server now accepts Racing and MMA game selection.


## v1.5 — Marko: The Gooner Bodybuilder
V záložke NPC otvor Marka. Má samostatnú kartu, 4 interakcie (GYM CHALLENGE, GOONER MODE, MMA SPARRING, POKEC), reputáciu 0–100 a 3 achievementy. Odmeny za GYM/GOONER majú 30-sekundový cooldown a postup sa ukladá v localStorage. Meme humor je neexplicitný. Marko je NPC vo svete, nie výber postavy na začiatku.


## v1.6 — Nové logo a splash screen
Nový psychedelický artwork je použitý ako PWA ikona (192/512 px) a pozadie úvodnej obrazovky. Po deployi odstráň starú ikonu z plochy a pridaj aplikáciu znova, ak sa nezmení.
