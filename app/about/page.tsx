import Navbar from '@/app/ui/navbar';

/**
 * ABOUT PAGE (O aplikaciji)
 *
 * Namen strani:
 * - To je statična informativna stran, kjer uporabniku razložimo:
 *   1) kaj je NutriTrack,
 *   2) kaj lahko z njim dela,
 *   3) zakaj obstaja (kateri problem rešuje),
 *   4) komu je namenjen,
 *   5) kako deluje (3 osnovni koraki).
 *
 * Te strani NE uporabljamo za logiko prijave ali podatke iz baze.
 * Gre samo za jasen opis aplikacije in njenega namena.
 */

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Glavna navigacija (linki na ostale strani aplikacije) */}
      <Navbar />

      {/* Glavni layout: omejena sirina + razmiki + padding za lep izgled */}
      <div className="mx-auto max-w-6xl space-y-10 px-4 pb-16 pt-10 md:px-6">
        {/* HERO sekcija: naslov + kratek opis aplikacije */}
        <section className="rounded-3xl border border-blue-200/50 bg-gradient-to-br from-blue-600 via-blue-500 to-sky-500 p-8 text-white shadow-lg md:p-12">
          <div className="max-w-3xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">
              O aplikaciji
            </p>
            <h1 className="text-3xl font-semibold md:text-4xl">NutriTrack</h1>
            <p className="text-base text-blue-100 md:text-lg">
              Enostavna aplikacija za belezenje obrokov, kalorij in osnovnih
              prehranskih navad.
            </p>
          </div>
        </section>

        {/* 3 kartice: hitro razlozijo kljucne informacije (kaj / zakaj / komu) */}
        <section className="grid gap-6 md:grid-cols-3">
          {/* Kartica 1: funkcionalnosti */}
          <div className="rounded-2xl border border-gray-200/70 bg-white/95 p-6 shadow-sm backdrop-blur dark:border-gray-800/70 dark:bg-gray-900/80">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Kaj lahko delas
            </p>
            <h3 className="mt-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Jasne, hitre akcije
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>Dodajas obroke in osnovne makro vrednosti.</li>
              <li>Vidis dnevni in tedenski pregled kalorij.</li>
              <li>Spremljas pretekle dneve in trende.</li>
              <li>Uredjas ze vnesene podatke brez zmede.</li>
            </ul>
          </div>

          {/* Kartica 2: namen/ideja */}
          <div className="rounded-2xl border border-gray-200/70 bg-white/95 p-6 shadow-sm backdrop-blur dark:border-gray-800/70 dark:bg-gray-900/80">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Zakaj obstaja
            </p>
            <h3 className="mt-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Minimalen fokus
            </h3>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
              NutriTrack daje pregled nad prehrano brez nepotrebnih menijev.
              Ideja je, da hitro vneses obrok in takoj razumes vpliv na dan.
            </p>
          </div>

          {/* Kartica 3: ciljna publika */}
          <div className="rounded-2xl border border-gray-200/70 bg-white/95 p-6 shadow-sm backdrop-blur dark:border-gray-800/70 dark:bg-gray-900/80">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Komu je namenjena
            </p>
            <h3 className="mt-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Za vsakogar
            </h3>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
              Uporabna je za vsakogar, ki zeli razumeti svoje prehranske navade
              in imeti osnovne podatke na enem mestu brez kompliciranja.
            </p>
          </div>
        </section>

        {/* Kako deluje: 3 koraki v obliki majhnih blokov (zelo hitro razumljivo) */}
        <section className="rounded-2xl border border-gray-200/70 bg-white/95 p-6 shadow-sm backdrop-blur dark:border-gray-800/70 dark:bg-gray-900/80">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Kako deluje
          </h2>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {/* Korak 1 */}
            <div className="rounded-xl border border-gray-200/70 bg-white/90 p-4 text-sm text-gray-600 shadow-sm dark:border-gray-800/70 dark:bg-gray-900/60 dark:text-gray-300">
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                1. Vnos obrokov
              </p>
              <p className="mt-2">
                Dodaj obrok, kalorije in hranila v nekaj klikih.
              </p>
            </div>

            {/* Korak 2 */}
            <div className="rounded-xl border border-gray-200/70 bg-white/90 p-4 text-sm text-gray-600 shadow-sm dark:border-gray-800/70 dark:bg-gray-900/60 dark:text-gray-300">
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                2. Pregled statistike
              </p>
              <p className="mt-2">
                Sistem pripravi dnevne in tedenske povprecne vrednosti.
              </p>
            </div>

            {/* Korak 3 */}
            <div className="rounded-xl border border-gray-200/70 bg-white/90 p-4 text-sm text-gray-600 shadow-sm dark:border-gray-800/70 dark:bg-gray-900/60 dark:text-gray-300">
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                3. Napredek
              </p>
              <p className="mt-2">
                Spremljaj trend in prilagodi prehrano na podlagi podatkov.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
