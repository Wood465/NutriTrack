'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/app/ui/navbar';
import StatsOverview from '@/app/ui/StatsOverview';

export default function Page() {
  const [user, setUser] = useState<any | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch('/api/session', { cache: 'no-store' });
        const data = await res.json();
        setUser(data.user ?? null);
      } finally {
        setChecked(true);
      }
    }

    loadUser();
  }, []);

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
        <section className="rounded-3xl border border-blue-200/50 bg-gradient-to-br from-blue-600 via-blue-500 to-sky-500 p-8 text-white shadow-lg md:p-12">
          {!user && (
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
          )}

          {user && (
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

        {!user && (
          <section className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-200/70 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-gray-800/70 dark:bg-gray-900/80">
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

            <div className="rounded-2xl border border-gray-200/70 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-gray-800/70 dark:bg-gray-900/80">
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

            <div className="rounded-2xl border border-gray-200/70 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-gray-800/70 dark:bg-gray-900/80">
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

        {user && (
          <section className="rounded-3xl border border-gray-200/70 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-gray-800/70 dark:bg-gray-900/80 md:p-8">
            <StatsOverview />
          </section>
        )}
      </div>
    </main>
  );
}
