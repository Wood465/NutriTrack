## Poročilo o spletni aplikaciji **NutriTrack**

---

## 1. Uvod

NutriTrack je spletna aplikacija, namenjena spremljanju prehranskih navad uporabnikov.  
Uporabnikom omogoča beleženje obrokov, pregled vnosa kalorij in makrohranil ter spremljanje statistike skozi čas.

Namen aplikacije je uporabniku pomagati bolje razumeti svoje prehranjevalne navade in jih po potrebi izboljšati.

Aplikacija je zasnovana kot sodobna spletna rešitev z uporabo aktualnih tehnologij ter preglednega in uporabniku prijaznega vmesnika.

---

## 2. Tehnologije in orodja

Pri razvoju aplikacije **NutriTrack** so bile uporabljene naslednje tehnologije:

- **Next.js** – za izdelavo frontend in backend dela aplikacije  
- **React** – za gradnjo uporabniškega vmesnika  
- **TypeScript** – za večjo varnost in berljivost kode  
- **PostgreSQL** – relacijska baza podatkov za shranjevanje uporabnikov in obrokov  
- **JWT (JSON Web Token)** – za avtentikacijo uporabnikov  
- **Google OAuth** – za prijavo z Google računom  
- **Tailwind CSS** – za oblikovanje uporabniškega vmesnika  

Aplikacija uporablja sodoben pristop, kjer so API poti integrirane neposredno v Next.js projekt.

---

## 3. Funkcionalnosti aplikacije

### 3.1 Registracija in prijava

Uporabnik se lahko:

- registrira z e-poštnim naslovom in geslom,
- ali prijavi z Google računom.

Po uspešni prijavi se uporabniku ustvari seja z uporabo JWT žetona, ki se shrani v piškotek.

---

### 3.2 Upravljanje uporabnikov

Vsak uporabnik ima svoj profil, kjer so prikazani:

- osebni podatki (ime, priimek, e-pošta),
- profilna slika,
- statistični podatki o prehrani.

Administrator ima dostop do posebne **admin strani**, kjer lahko:

- vidi seznam vseh uporabnikov,
- izbriše uporabnike iz sistema.

Admin dostop je omejen glede na uporabnikovo vlogo.

---

### 3.3 Beleženje obrokov

Uporabnik lahko:

- doda nov obrok,
- vnansne kalorije ter makrohranila (beljakovine, ogljikove hidrate, maščobe),
- doda opis obroka,
- pregleda vse svoje obroke.

Aplikacija podpira tudi **decimalne vrednosti**, kar omogoča natančnejši vnos podatkov.

---

### 3.4 Statistika in pregled podatkov

Na glavni strani in profilu se uporabniku prikažejo:

- povprečen dnevni vnos kalorij,
- število dni, ko je beležil obroke,
- dnevni in tedenski pregledi.

Statistika se izračunava na podlagi podatkov iz baze in se samodejno posodablja.

---

### 3.5 Profilna slika

Uporabnik lahko:

- naloži svojo profilno sliko,
- slika se shrani neposredno v bazo podatkov kot binarni zapis (**BLOB**),
- slika se nato prikazuje na profilu.

---

## 4. Uporabniški vmesnik

Uporabniški vmesnik je:

- pregleden,
- odziven (deluje na različnih velikostih zaslona),
- enostaven za uporabo.

Navigacija je vedno vidna preko navigacijske vrstice, ki se prilagaja glede na stanje prijave uporabnika.  
Neprijavljenim uporabnikom je prikazan opis aplikacije, prijavljenim pa statistika in osebni podatki.

---

## 5. Varnost

Aplikacija vključuje več varnostnih mehanizmov:

- zaščiten dostop do strani (preverjanje prijave),
- uporaba JWT žetonov,
- ločene pravice za administratorja,
- zaščita API poti pred nepooblaščenim dostopom.

Gesla uporabnikov so v bazi shranjena v zgoščeni obliki (**hashirana**).

---

## 6. Zaključek

NutriTrack je funkcionalna in sodobna spletna aplikacija, ki uporabnikom omogoča učinkovito spremljanje prehranskih navad.  
Aplikacija združuje praktične funkcionalnosti, pregledno statistiko in razumljiv uporabniški vmesnik.

NutriTrack predstavlja dobro osnovo za resno prehransko aplikacijo in hkrati prikazuje uporabo sodobnih spletnih tehnologij v praksi.