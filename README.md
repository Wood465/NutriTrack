📊 NutriTrack – Poročilo o spletni aplikaciji
1. Uvod

NutriTrack je spletna aplikacija, namenjena spremljanju prehranskih navad uporabnikov.
Uporabnikom omogoča beleženje obrokov, pregled vnosa kalorij in makrohranil ter spremljanje statistike skozi čas.

Namen aplikacije je uporabniku pomagati bolje razumeti svoje prehranjevalne navade in jih po potrebi izboljšati.

Aplikacija je zasnovana kot sodobna spletna rešitev z uporabo aktualnih tehnologij ter preglednega in uporabniku prijaznega vmesnika.

2. Tehnologije in orodja

Pri razvoju aplikacije NutriTrack so bile uporabljene naslednje tehnologije:

Next.js – za frontend in backend del aplikacije (App Router)

React – za gradnjo uporabniškega vmesnika

TypeScript – za večjo varnost, tipizacijo in berljivost kode

PostgreSQL – relacijska baza podatkov

JWT (JSON Web Token) – za avtentikacijo uporabnikov

Google OAuth – prijava z Google računom

Tailwind CSS – sodobno in odzivno oblikovanje

Playwright – E2E testiranje aplikacije

Aplikacija uporablja sodoben pristop, kjer so API poti integrirane neposredno v Next.js projekt.

3. Funkcionalnosti aplikacije
3.1 Registracija in prijava

Uporabnik se lahko:

registrira z e-poštnim naslovom in geslom,

ali prijavi z Google računom.

Po uspešni prijavi se uporabniku ustvari seja z uporabo JWT žetona, ki se shrani v piškotek.

3.2 Upravljanje uporabnikov

Vsak uporabnik ima svoj profil, kjer so prikazani:

osebni podatki (ime, priimek, e-pošta),

profilna slika,

statistični podatki o prehrani.

Administrator ima dostop do admin strani, kjer lahko:

vidi seznam vseh uporabnikov,

briše uporabnike iz sistema.

Dostop do admin strani je omejen glede na uporabnikovo vlogo.

3.3 Beleženje in urejanje obrokov

Uporabnik lahko:

doda nov obrok,

vnese kalorije in makrohranila (beljakovine, ogljikove hidrate, maščobe),

uporablja decimalne vrednosti za natančnejši vnos,

ureja že dodane obroke,

pregleda vse svoje obroke.

3.4 Statistika in pregled podatkov

Aplikacija uporabniku prikazuje:

povprečen dnevni vnos kalorij,

povprečen vnos beljakovin,

število aktivnih dni,

dnevni in tedenski pregled podatkov,

grafični prikaz vnosa kalorij.

Statistika se izračunava dinamično na podlagi podatkov v bazi.

3.5 Profilna slika

Uporabnik lahko:

naloži svojo profilno sliko,

če slika ni nastavljena, se prikaže privzeta profilna slika,

s tem je zagotovljeno pravilno delovanje profila tudi brez slike.



4. Testiranje aplikacije (E2E)

Za zagotavljanje pravilnega delovanja aplikacije je implementirano E2E testiranje s Playwrightom.

Testi so razdeljeni v več paketov, ki jih je mogoče zaganjati ločeno ali skupaj.

▶️ Zagon posameznih testnih paketov
npx playwright test e2e/success/pack1
npx playwright test e2e/success/pack2
npx playwright test e2e/success/pack3
npx playwright test e2e/success/pack4

▶️ Zagon vseh uspešnih testov z grafičnim prikazom
npx playwright test e2e/success --headed

npm test -- app/ui/navbar.test.tsx

Testi preverjajo:

pravilno delovanje prijave in registracije,

zaščito strani,

nalaganje profilov, obrokov in statistike,

pravilno delovanje navigacije.

5. Izvedeni popravki in izboljšave

Med razvojem in refaktoriranjem so bili izvedeni naslednji pomembni popravki:

✅ glavno CSS popravilo (bolj konsistenten in odziven izgled),

✅ popravljeno urejanje obrokov,

✅ popravljeno prikazovanje profilne slike, če ni nastavljena,

✅ pravilni izračuni:

povprečnih kalorij,

povprečnih beljakovin,

✅ refaktorirana in komentirana koda,

✅ izboljšana berljivost in struktura projekta,

✅ uvedeno E2E testiranje in CI podpora.

6. Zaključek

NutriTrack je sodobna in funkcionalna spletna aplikacija za spremljanje prehranskih navad.
Združuje uporabne funkcionalnosti, pregledno statistiko, varnostne mehanizme in avtomatsko testiranje.

Projekt predstavlja dobro osnovo za resno prehransko aplikacijo ter prikazuje praktično uporabo sodobnih spletnih tehnologij in dobrih razvojnih praks.