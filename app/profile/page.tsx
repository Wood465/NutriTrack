'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/app/ui/navbar';
import { fetchWithTimeout } from '@/app/lib/fetch-timeout';

/**
 * PROFILE PAGE (Profil)
 *
 * Namen strani:
 * - Prikaze osnovne podatke o prijavljenem uporabniku (ime, priimek, email).
 * - Omogoca nalaganje profilne slike (avatar).
 * - Izracuna osnovno statistiko iz obrokov:
 *   - povprecen dnevni vnos kalorij
 *   - stevilo dni, ko je uporabnik kaj zabelezil
 *
 * Kako deluje:
 * 1) Ob nalaganju strani preberemo sejo (/api/session) -> dobimo uporabnika.
 * 2) Ko uporabnika poznamo, nalozimo njegove obroke (/api/meals?user_id=...).
 * 3) Iz obrokov izracunamo:
 *    - total kalorij
 *    - koliko razlicnih dni je zabelezenih
 *    - average = total / st. dni
 * 4) Avatar nalagamo na /api/profile/avatar (POST z FormData).
 *    Za prikaz avatarja uporabljamo /api/profile/avatar/view.
 *    "avatarKey" je samo trik za osvezevanje slike (da browser ne uporabi cache-a).
 */

export default function ProfilePage() {
  /**
   * Avatar:
   * - avatarSrc: URL slike, ki jo prikazemo v <img>
   * - avatarKey: vrednost, ki se spremeni po uploadu in prisili reload slike
   * - defaultAvatarSrc: fallback, ce avatar endpoint vrne napako (npr. ni slike)
   */
  const [avatarKey, setAvatarKey] = useState(0);
  const [avatarSrc, setAvatarSrc] = useState(`/api/profile/avatar/view?key=0`);
  const defaultAvatarSrc = '/avatar-default.svg';

  // user: trenutno prijavljen uporabnik (za izpis podatkov + user.id)
  const [user, setUser] = useState<any>(null);

  // statistika: povprecje kalorij in stevilo dni z vnosom
  const [averageCalories, setAverageCalories] = useState<number | null>(null);
  const [loggedDays, setLoggedDays] = useState<number | null>(null);

  /**
   * 1) Nalozimo prijavljenega uporabnika iz seje
   * - /api/session vrne { user: ... } ali null
   */
  useEffect(() => {
    async function loadUser() {
      try {
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
        setUser(data.user ?? null);
      } catch {
        setUser(null);
      }
    }

    loadUser();
  }, []);

  /**
   * 2) Ko imamo user, nalozimo njegove obroke in izracunamo statistiko
   * - ce ni obrokov: statistiko nastavimo na 0
   * - days: uporabimo Set, da dobimo stevilo unikatnih datumov (YYYY-MM-DD)
   */
  useEffect(() => {
    if (!user) return;

    async function loadStats() {
      let meals: any = [];
      try {
        const res = await fetchWithTimeout(
          `/api/meals?user_id=${user.id}`,
          { cache: 'no-store' },
          7000,
        );

        if (!res.ok) {
          setAverageCalories(0);
          setLoggedDays(0);
          return;
        }

        meals = await res.json();
      } catch (err) {
        setAverageCalories(0);
        setLoggedDays(0);
        return;
      }

      if (!Array.isArray(meals) || meals.length === 0) {
        setAverageCalories(0);
        setLoggedDays(0);
        return;
      }

      // vsota kalorij vseh obrokov
      const totalCalories = meals.reduce(
        (sum: number, meal: any) => sum + parseFloat(meal.kalorije || 0),
        0,
      );

      // unikatni dnevi (YYYY-MM-DD) -> koliko dni je bilo sploh kaj zabelezeno
      const uniqueDays = new Set(
        meals.map((m: any) => new Date(m.cas).toISOString().slice(0, 10)),
      );

      const daysCount = uniqueDays.size;
      setLoggedDays(daysCount);
      setAverageCalories(daysCount > 0 ? Math.round(totalCalories / daysCount) : 0);
    }

    loadStats();
  }, [user]);

  /**
   * 3) Posodobitev avatar URL-ja, ko se spremeni avatarKey
   * - key dodamo v query, da se URL spremeni in browser ponovno nalozi sliko
   */
  useEffect(() => {
    setAvatarSrc(`/api/profile/avatar/view?key=${avatarKey}`);
  }, [avatarKey]);

  /**
   * 4) Upload avatarja
   * - uporabimo FormData, ker posiljamo datoteko (image/*)
   * - ce uspe: spremenimo avatarKey -> prisilimo reload prikaza
   */
  async function uploadAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    const res = await fetch('/api/profile/avatar', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      // Date.now() zagotovi nov key -> nov URL -> nova slika brez cache-a
      setAvatarKey(Date.now());
    } else {
      alert('Upload ni uspel');
    }
  }

  return (
    <main className="min-h-screen">
      {/* Navigacija */}
      <Navbar />

      <div className="mx-auto max-w-6xl space-y-10 px-4 pb-16 pt-10 md:px-6">
        {/* Hero / naslov strani */}
        <section className="rounded-3xl border border-blue-200/50 bg-gradient-to-br from-blue-600 via-blue-500 to-sky-500 p-8 text-white shadow-lg md:p-12">
          <div className="max-w-3xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">
              Profil
            </p>
            <h1 className="text-3xl font-semibold md:text-4xl">Tvoj racun</h1>
            <p className="text-base text-blue-100 md:text-lg">
              Uredi podatke in spremljaj povprecje vnosa.
            </p>
          </div>
        </section>

        {/* Layout: levo osebni podatki, desno statistika */}
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          {/* LEVO: uporabnikovi podatki + avatar */}
          <div className="rounded-3xl border border-gray-200/70 bg-white/95 p-6 shadow-sm backdrop-blur dark:border-gray-800/70 dark:bg-gray-900/80 md:p-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Osebni podatki
            </h2>

            {/* Prikaz podatkov iz seje (ce user ni nalozen, izpisemo '--') */}
            <div className="mt-5 space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  Ime:
                </span>{' '}
                {user?.ime ?? '--'}
              </p>
              <p>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  Priimek:
                </span>{' '}
                {user?.priimek ?? '--'}
              </p>
              <p>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  E-posta:
                </span>{' '}
                {user?.email ?? '--'}
              </p>
            </div>

            {/* Avatar + akcije */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <img
                src={avatarSrc}
                alt="Profilna slika"
                className="h-20 w-20 rounded-full border border-gray-200 object-cover dark:border-gray-800"
                onError={() => {
                  // Ce avatar endpoint odpove, preklopimo na default sliko
                  if (avatarSrc !== defaultAvatarSrc) {
                    setAvatarSrc(defaultAvatarSrc);
                  }
                }}
              />

              {/* Upload polje je skrito, kliknemo label kot gumb */}
              <label className="cursor-pointer rounded-full border border-blue-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-blue-700 transition hover:bg-blue-50 dark:border-blue-900/40 dark:text-blue-200 dark:hover:bg-blue-950/40">
                Spremeni sliko
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  className="hidden"
                  onChange={uploadAvatar}
                />
              </label>

              {/* Link do strani za spremembo gesla */}
              <Link
                href="/profile/change-password"
                className="rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-700 transition hover:bg-gray-100 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Spremeni geslo
              </Link>
            </div>
          </div>

          {/* DESNO: statistika iz obrokov */}
          <div className="rounded-3xl border border-gray-200/70 bg-white/95 p-6 shadow-sm backdrop-blur dark:border-gray-800/70 dark:bg-gray-900/80 md:p-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Statistika
            </h2>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-gray-200/70 bg-white/95 p-4 shadow-sm dark:border-gray-800/70 dark:bg-gray-900/80">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Povprecen dnevni vnos
                </p>
                <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {averageCalories !== null
                    ? `${averageCalories} kcal`
                    : 'Nalaganje...'}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200/70 bg-white/95 p-4 shadow-sm dark:border-gray-800/70 dark:bg-gray-900/80">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Zabelezeni dnevi
                </p>
                <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {loggedDays !== null ? loggedDays : 'Nalaganje...'}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
