'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/app/ui/navbar';
import StatsOverview from '@/app/ui/StatsOverview';

// Tipiziramo user namesto `any` (brez spremembe funkcionalnosti)
type SessionUser = {
  id?: string | number;
  ime?: string | null;
  priimek?: string | null;
  email?: string | null;
};

export default function Page() {
  const [user, setUser] = useState<SessionUser | null>(null);

  // `checked` pove, ali smo že preverili session (da ne renderamo napačnega stanja)
  const [checked, setChecked] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true; // prepreči setState po unmountu

    async function loadUser() {
      try {
        const res = await fetch('/api/session', { cache: 'no-store' });
        const data = await res.json();

        if (!isMounted) return;

        // Vzemi user iz response-a, sicer null
        setUser((data?.user ?? null) as SessionUser | null);
      } catch {
        // Če fetch faila, se obnašamo kot da ni user-ja (funkcionalnost: app ne crasha)
        if (!isMounted) return;
        setUser(null);
      } finally {
        // `checked` vedno nastavimo (tudi ob napaki), da UI lahko nadaljuje
        if (!isMounted) return;
        setChecked(true);
      }
    }

    loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  // Prikaži "skelet" stran dokler se session ne preveri
  if (!checked) {
    return (
      <main className="relative min-h-screen bg-slate-50">
        <Navbar />
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-slate-50 text-slate-900">
      <div className="pointer-events-none absolute -top-32 right-0 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-10 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />

      <Navbar />

      <div className="mx-auto w-full max-w-7xl px-6 pb-16 pt-12">
        {/* MODRI ODSEK */}
        <section className="relative overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 px-6 py-12 text-white shadow-2xl shadow-blue-200/70 md:px-12 md:py-20">
          <div className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

          {/* Če user ni prijavljen */}
          {!user && (
            <div className="relative max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-blue-100">
                Pregled navad
              </div>

              <h1 className="text-3xl font-semibold md:text-6xl">NutriTrack</h1>

              <p className="text-lg text-blue-100">
                Spremljaj obroke, kalorije in prehranske navade na enostaven način.
              </p>

              <p className="text-blue-100">
                Po prijavi dobiš dostop do osebne statistike, dnevnih in tedenskih pregledov ter
                grafov, ki ti pomagajo razumeti svoje navade.
              </p>
            </div>
          )}

          {/* Če je user prijavljen */}
          {user && (
            <div className="relative max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-blue-100">
                Dnevni pregled
              </div>

              <h1 className="text-3xl font-semibold md:text-6xl">
                Živjo, {user.ime ?? 'Uporabnik'} 👋
              </h1>

              <p className="text-blue-100">Tukaj je pregled tvojega prehranjevanja.</p>
            </div>
          )}
        </section>

        {/* VSEBINA SPODAJ */}
        {user && (
          <section className="mt-10 rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl shadow-slate-200/70 backdrop-blur">
            <StatsOverview />
          </section>
        )}
      </div>
    </main>
  );
}
