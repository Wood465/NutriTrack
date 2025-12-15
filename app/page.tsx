'use client';

import { useEffect, useState } from 'react';
import Navbar from "@/app/ui/navbar";
import StatsOverview from "@/app/ui/StatsOverview";

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
      <main className="flex min-h-screen flex-col pt-20 p-6">
        <Navbar />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col pt-20 p-6">
      <Navbar />

      {/* MODRI ODSEK */}
      <section className="rounded-lg bg-blue-500 text-white px-6 py-10 md:px-10 md:py-16 mt-4">
        {!user && (
          <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl md:text-4xl font-semibold">
              NutriTrack
            </h1>

            <p className="text-lg text-blue-100">
              Spremljaj obroke, kalorije in prehranske navade na enostaven način.
            </p>

            <p className="text-blue-100">
              Po prijavi dobiš dostop do osebne statistike, dnevnih in tedenskih
              pregledov ter grafov, ki ti pomagajo razumeti svoje navade.
            </p>
          </div>
        )}

        {user && (
          <div className="max-w-3xl space-y-2">
            <h1 className="text-3xl md:text-4xl font-semibold">
              Živjo, {user.ime} 👋
            </h1>

            <p className="text-blue-100">
              Tukaj je pregled tvojega prehranjevanja.
            </p>
          </div>
        )}
      </section>

      {/* VSEBINA SPODAJ */}
      {user && (
        <section className="mt-10">
          <StatsOverview />
        </section>
      )}
    </main>
  );
}
