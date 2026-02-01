'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/app/ui/navbar';
import StatsOverview from '@/app/ui/StatsOverview';
import { fetchWithTimeout } from '@/app/lib/fetch-timeout';

/**
 * DOMOV STRAN (Home / Landing)
 *
 * Namen:
 * - Najprej preverimo, ali je uporabnik prijavljen (klic na /api/session).
 * - Ce NI prijavljen: prikazemo predstavitev aplikacije + 3 informativne kartice.
 * - Ce JE prijavljen: prikazemo pozdrav + komponento s statistiko (StatsOverview).
 *
 * Zakaj to delamo:
 * - UI je odvisen od prijave, zato moramo najprej prebrati sejo.
 * - "checked" prepreci, da bi se za trenutek pokazala napacna vsebina (flash),
 *   preden dobimo odgovor iz API-ja.
 */

export default function Page() {
  // "user" je null, ce uporabnik ni prijavljen. Ce je prijavljen, dobimo objekt (npr. { ime: ... }).
  const [user, setUser] = useState<any | null>(null);

  // "checked" pove, ali smo ze zakljucili preverjanje seje (/api/session).
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Preveri trenutno sejo (kdo je prijavljen) in shrani rezultat v state.
    async function loadUser() {
      try {
        // cache: 'no-store' pomeni: vedno vzemi sveze podatke (ne iz cachea).
        const res = await fetchWithTimeout(
          '/api/session',
          { cache: 'no-store' },
          5000,
        );
        if (!res.ok) {
          setUser(null);
          return;
        }

        const data = await res.json();
        // Ce API vrne user, ga shranimo, drugace ostane null.
        setUser(data.user ?? null);
      } catch {
        setUser(null);
      } finally {
        // Ne glede na to, ali klic uspe ali pade, oznacimo da je preverjanje koncano.
        setChecked(true);
      }
    }

    loadUser();
  }, []);

  // Dokler ne preverimo seje, prikazemo samo Navbar (brez vsebine),
  // da ne pride do "flash-a" nepravilnega UI-ja.
  if (!checked) {
    return (
      <main className="min-h-screen">
        <Navbar />
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-6xl space-y-10 px-4 pb-16 pt-10 md:px-6">
        {/* HERO SEKCIJA:
            - Ce user ne obstaja: marketing/uvod
            - Ce user obstaja: personaliziran pozdrav */}
        <section className="rounded-3xl border border-blue-200/50 bg-gradient-to-br from-blue-600 via-blue-500 to-sky-500 p-8 text-white shadow-lg md:p-12">
          {!user ? (
            <div className="max-w-3xl space-y-4">
              <h1 className="text-3xl font-semibold md:text-4xl">NutriTrack</h1>
              <p className="text-base text-blue-100 md:text-lg">
                Spremljaj obroke, kalorije in prehranske navade na enostaven
                nacin.
              </p>
              <p className="text-sm text-blue-100 md:text-base">
                Po prijavi dobis dostop do osebne statistike, dnevnih in
                tedenskih pregledov ter grafov, ki ti pomagajo razumeti svoje
                navade.
              </p>
            </div>
          ) : (
            <div className="max-w-3xl space-y-2">
              <h1 className="text-3xl font-semibold md:text-4xl">
                Zivjo, {user.ime}
              </h1>
              <p className="text-base text-blue-100 md:text-lg">
                Tukaj je pregled tvojega prehranjevanja.
              </p>
            </div>
          )}
        </section>

        {/* CE NI PRIJAVE: prikazemo 3 kartice (kaj aplikacija ponuja) */}
        {!user && (
          <section className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-200/70 bg-white/95 p-6 shadow-sm backdrop-blur dark:border-gray-800/70 dark:bg-gray-900/80">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                Hiter zacetek
              </p>
              <h3 className="mt-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
                Dodaj obrok v 10 sekundah
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Ustvari svoj seznam obrokov, dodaj kalorije in opis ter jih takoj
                spremljaj v profilu.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200/70 bg-white/95 p-6 shadow-sm backdrop-blur dark:border-gray-800/70 dark:bg-gray-900/80">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                Statistika
              </p>
              <h3 className="mt-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
                Dnevni in tedenski pregled
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Sistem ti pripravi povprecja in trend, da vidis kako se spreminja
                vnos skozi teden.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200/70 bg-white/95 p-6 shadow-sm backdrop-blur dark:border-gray-800/70 dark:bg-gray-900/80">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                Fokus
              </p>
              <h3 className="mt-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
                Bolj jasni cilji
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                S spremljanjem makrohranil hitro opazis vzorce in lazje drzis
                rutino.
              </p>
            </div>
          </section>
        )}

        {/* CE JE PRIJAVA: prikazemo statistiko (StatsOverview) */}
        {user && (
          <section className="rounded-3xl border border-gray-200/70 bg-white/95 p-6 shadow-sm backdrop-blur dark:border-gray-800/70 dark:bg-gray-900/80 md:p-8">
            <StatsOverview />
          </section>
        )}
      </div>
    </main>
  );
}
