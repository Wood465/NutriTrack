import Navbar from "@/app/ui/navbar";

/**
 * Stran »O aplikaciji«.
 * Namenjena je kratki predstavitvi aplikacije NutriTrack.
 */
export default function AboutPage() {
  return (
    // Glavni wrapper celotne strani
    <main className="relative min-h-screen bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white dark:bg-slate-950 dark:text-white">
      {/* Dekorativni elementi v ozadju (samo za izgled) */}
      <div className="pointer-events-none absolute -top-32 right-0 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl dark:opacity-0" />
      <div className="pointer-events-none absolute bottom-0 left-10 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl dark:opacity-0" />

      {/* Navigacija aplikacije */}
      <Navbar />

      {/* Osrednji vsebinski del strani */}
      <div className="mx-auto w-full max-w-7xl px-6 pb-16 pt-12">
        {/* Uvodni (hero) del z naslovom in opisom */}
        <section className="relative overflow-hidden rounded-3xl border border-white/70 dark:border-slate-800 bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950 px-6 py-10 text-white shadow-2xl shadow-blue-200/70 dark:shadow-black/40 md:px-10 md:py-14">
          {/* Dekorativni blur elementi */}
          <div className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full bg-white dark:bg-slate-900/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

          {/* Vsebina hero dela */}
          <div className="relative max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white dark:bg-slate-900/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-blue-100">
              O aplikaciji
            </div>

            <h1 className="text-3xl font-semibold md:text-5xl">O aplikaciji</h1>

            <p className="text-blue-100">
              NutriTrack pomaga spremljati, kaj poješ vsak dan. Aplikacija ostane
              preprosta, da hitro vidiš obroke, kalorije in napredek.
            </p>
          </div>
        </section>

        {/* Vsebinski del z opisom funkcionalnosti */}
        <section className="mt-10 rounded-3xl border border-white/70 dark:border-slate-800 bg-white dark:bg-slate-900/90 dark:bg-slate-900/80 p-8 shadow-xl shadow-slate-200/70 dark:shadow-black/30 backdrop-blur md:p-12">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-medium">Kaj lahko delaš</h2>
              <ul className="list-inside list-disc space-y-1 text-slate-600 dark:text-slate-300">
                <li>Dodajaš obroke in hrano.</li>
                <li>Vidiš kalorije in osnovna hranila.</li>
                <li>Pregledaš pretekle dneve.</li>
                <li>Urediš že dodane vnose.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-medium">Kaj želi doseči</h2>
              <p className="text-slate-600 dark:text-slate-300">
                NutriTrack ti da pregled nad prehrano brez nepotrebnih menijev.
                Ideja je, da hitro vneseš obrok in takoj vidiš, kaj to pomeni za
                tvoj dan.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-medium">Komu je namenjena</h2>
              <p className="text-slate-600 dark:text-slate-300">
                Uporabna je za vsakogar, ki želi razumeti svoje prehranske navade
                in imeti osnovne podatke na enem mestu – brez kompliciranja.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

