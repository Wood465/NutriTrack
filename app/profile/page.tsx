'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/app/ui/navbar';

// Tipizirajmo obliko user-ja, da se znebimo `any` (brez spreminjanja funkcionalnosti)
type SessionUser = {
  id: string | number;
  ime?: string | null;
  priimek?: string | null;
  email?: string | null;
};

// Tip za meal (v kodi uporabljaš `kalorije` in `cas`)
type Meal = {
  kalorije?: string | number | null;
  cas: string | Date;
};

export default function ProfilePage() {
  // `avatarKey` uporabljamo kot "cache buster" za URL avatarja (da se slika po uploadu osveži)
  const [avatarKey, setAvatarKey] = useState<number>(0);

  // Session user iz /api/session
  const [user, setUser] = useState<SessionUser | null>(null);

  // Statistika
  const [averageCalories, setAverageCalories] = useState<number | null>(null);
  const [loggedDays, setLoggedDays] = useState<number | null>(null);

  // Trenutni src za avatar (privzeto fallback)
  const [avatarSrc, setAvatarSrc] = useState<string>('/default-avatar.svg');

  // Avatar URL izračunamo iz `avatarKey` (enako kot tvoj useEffect, samo bolj čisto)
  const avatarUrl = useMemo(() => `/api/profile/avatar/view?key=${avatarKey}`, [avatarKey]);

  useEffect(() => {
    let isMounted = true; // prepreči setState po unmountu (npr. ob hitrem navigiranju)

    async function loadUserAndStats() {
      try {
        // 1) Preberi session
        const sessionRes = await fetch('/api/session', { cache: 'no-store' });
        const sessionData = await sessionRes.json();
        const sessionUser: SessionUser | null = sessionData?.user ?? null;

        if (!isMounted) return;
        setUser(sessionUser);

        // Če ni user-ja, nima smisla nadaljevati
        if (!sessionUser) return;

        // 2) Preberi meals za userja
        const res = await fetch(`/api/meals?user_id=${sessionUser.id}`, { cache: 'no-store' });
        const meals: Meal[] = await res.json();

        if (!isMounted) return;

        // Če ni vnosov, statiko nastavimo na 0
        if (!Array.isArray(meals) || meals.length === 0) {
          setAverageCalories(0);
          setLoggedDays(0);
          return;
        }

        // Skupne kalorije (varno pretvorimo v number)
        const total = meals.reduce((sum, meal) => {
          const kcal = Number(meal?.kalorije ?? 0);
          return sum + (Number.isFinite(kcal) ? kcal : 0);
        }, 0);

        // Unikatni dnevi po datumu (YYYY-MM-DD)
        const days = new Set(
          meals.map((m) => {
            const d = new Date(m.cas);
            // če je datum invalid, da ne vrže errorja:
            if (Number.isNaN(d.getTime())) return 'invalid';
            return d.toISOString().slice(0, 10);
          }),
        );

        // Če je "invalid" v setu, ga ignoriramo pri štetju dni
        days.delete('invalid');

        setLoggedDays(days.size);

        // Ohranimo tvojo logiko: povprečje računaš kot total / 7
        setAverageCalories(Math.round(total / 7));
      } catch (err) {
        // Ne spreminjamo UI-ja, samo poskrbimo da ne crasha in nastavimo smiselne fallbacke
        if (!isMounted) return;
        setAverageCalories(0);
        setLoggedDays(0);
      }
    }

    loadUserAndStats();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    // Ko se avatarKey spremeni (po uspešnem uploadu), osvežimo src
    setAvatarSrc(avatarUrl);
  }, [avatarUrl]);

  async function uploadAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    // File input lahko sproži event tudi brez file-a (npr. cancel)
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        // Date.now() spremeni key in s tem URL → browser ne uporabi cache
        setAvatarKey(Date.now());
      } else {
        alert('Upload ni uspel');
      }
    } catch {
      alert('Upload ni uspel');
    } finally {
      // Reset inputa, da lahko user naloži isti file še enkrat (onChange se sicer ne sproži)
      e.target.value = '';
    }
  }

  return (
    <main className="relative min-h-screen bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white dark:bg-slate-950 dark:text-white">
      <div className="pointer-events-none absolute -top-32 right-0 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl dark:opacity-0" />
      <div className="pointer-events-none absolute bottom-0 left-10 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl dark:opacity-0" />

      <Navbar />

      <div className="mx-auto w-full max-w-7xl px-6 pb-16 pt-12">
        <section className="relative overflow-hidden rounded-3xl border border-white/70 dark:border-slate-800 bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950 px-6 py-10 text-white shadow-2xl shadow-blue-200/70 dark:shadow-black/40 md:px-10 md:py-14">
          <div className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full bg-white dark:bg-slate-900/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

          <div className="relative max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white dark:bg-slate-900/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-blue-100">
              Profil
            </div>
            <h1 className="text-3xl font-semibold md:text-5xl">Tvoji podatki</h1>
            <p className="text-blue-100">
              Uredi svojo profilno sliko, preglej podatke in spremljaj statistiko.
            </p>
          </div>
        </section>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <section className="rounded-3xl border border-white/70 dark:border-slate-800 bg-white dark:bg-slate-900/90 dark:bg-slate-900/80 p-6 shadow-xl shadow-slate-200/70 dark:shadow-black/30 backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Osebni podatki</h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">Osnovni podatki tvojega računa.</p>
              </div>

              <Link
                href="/profile/change-password"
                className="rounded-full border border-slate-200 dark:border-slate-700 px-3 py-1 text-sm text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:bg-slate-800/60 hover:text-slate-900 dark:text-white"
              >
                Spremeni geslo
              </Link>
            </div>

            <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-center">
              <div className="flex items-center gap-4">
                <img
                  src={avatarSrc}
                  alt="Profilna slika"
                  className="h-24 w-24 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
                  // Fallback, če avatar endpoint vrne napako ali ni slike
                  onError={() => setAvatarSrc('/default-avatar.svg')}
                />

                <label className="cursor-pointer rounded-full border border-blue-200 px-3 py-1 text-sm text-blue-700 transition hover:bg-blue-50">
                  Spremeni sliko
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    className="hidden"
                    onChange={uploadAvatar}
                  />
                </label>
              </div>

              <div className="grid gap-2 text-sm text-slate-700 dark:text-slate-200">
                <p>
                  <span className="font-medium text-slate-900 dark:text-white">Ime:</span> {user?.ime ?? '—'}
                </p>
                <p>
                  <span className="font-medium text-slate-900 dark:text-white">Priimek:</span> {user?.priimek ?? '—'}
                </p>
                <p>
                  <span className="font-medium text-slate-900 dark:text-white">E-pošta:</span> {user?.email ?? '—'}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-white/70 dark:border-slate-800 bg-white dark:bg-slate-900/90 dark:bg-slate-900/80 p-6 shadow-xl shadow-slate-200/70 dark:shadow-black/30 backdrop-blur">
            <div>
              <h2 className="text-xl font-semibold">Statistika</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">Povzetek tvojih prehranskih vnosov.</p>
            </div>

            <div className="mt-6 space-y-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 p-4">
              <p className="text-sm text-slate-700 dark:text-slate-200">
                <span className="font-medium text-slate-900 dark:text-white">Povprečen dnevni vnos:</span>{' '}
                {averageCalories !== null ? `${averageCalories} kcal` : 'Nalaganje...'}
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-200">
                <span className="font-medium text-slate-900 dark:text-white">Zabeleženi dnevi:</span>{' '}
                {loggedDays !== null ? loggedDays : 'Nalaganje...'}
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

