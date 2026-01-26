'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from "@/app/ui/navbar";

export default function ProfilePage() {
  const [avatarKey, setAvatarKey] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [averageCalories, setAverageCalories] = useState<number | null>(null);
  const [loggedDays, setLoggedDays] = useState<number | null>(null);
  const [avatarSrc, setAvatarSrc] = useState("/default-avatar.svg");

  useEffect(() => {
    async function loadUserAndStats() {
      const sessionRes = await fetch('/api/session', { cache: 'no-store' });
      const sessionData = await sessionRes.json();
      const sessionUser = sessionData.user;
      setUser(sessionUser);

      if (!sessionUser) return;

      const res = await fetch(`/api/meals?user_id=${sessionUser.id}`, { cache: 'no-store' });
      const meals = await res.json();

      if (meals.length === 0) {
        setAverageCalories(0);
        setLoggedDays(0);
        return;
      }

      const total = meals.reduce(
        (sum: number, meal: any) => sum + parseFloat(meal.kalorije || 0),
        0
      );

      const days = new Set(
        meals.map((m: any) => new Date(m.cas).toISOString().slice(0, 10))
      );

      setLoggedDays(days.size);
      setAverageCalories(Math.round(total / days.size));
    }

    loadUserAndStats();
  }, []);

  useEffect(() => {
    setAvatarSrc(`/api/profile/avatar/view?key=${avatarKey}`);
  }, [avatarKey]);

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
      setAvatarKey(Date.now());
    } else {
      alert('Upload ni uspel');
    }
  }

  return (
    <main className="relative min-h-screen bg-slate-50 text-slate-900">
      <div className="pointer-events-none absolute -top-32 right-0 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-10 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />

      <Navbar />

      <div className="mx-auto w-full max-w-7xl px-6 pb-16 pt-12">
        <section className="relative overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 px-6 py-10 text-white shadow-2xl shadow-blue-200/70 md:px-10 md:py-14">
          <div className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

          <div className="relative max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-blue-100">
              Profil
            </div>
            <h1 className="text-3xl font-semibold md:text-5xl">Tvoji podatki</h1>
            <p className="text-blue-100">
              Uredi svojo profilno sliko, preglej podatke in spremljaj statistiko.
            </p>
          </div>
        </section>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <section className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl shadow-slate-200/70 backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Osebni podatki</h2>
                <p className="text-sm text-slate-600">Osnovni podatki tvojega računa.</p>
              </div>
              <Link
                href="/profile/change-password"
                className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                Spremeni geslo
              </Link>
            </div>

            <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-center">
              <div className="flex items-center gap-4">
                <img
                  src={avatarSrc}
                  alt="Profilna slika"
                  className="h-24 w-24 rounded-2xl object-cover border border-slate-200"
                  onError={() => setAvatarSrc("/default-avatar.svg")}
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

              <div className="grid gap-2 text-sm text-slate-700">
                <p>
                  <span className="font-medium text-slate-900">Ime:</span> {user?.ime ?? '—'}
                </p>
                <p>
                  <span className="font-medium text-slate-900">Priimek:</span> {user?.priimek ?? '—'}
                </p>
                <p>
                  <span className="font-medium text-slate-900">E-pošta:</span> {user?.email ?? '—'}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl shadow-slate-200/70 backdrop-blur">
            <div>
              <h2 className="text-xl font-semibold">Statistika</h2>
              <p className="text-sm text-slate-600">Povzetek tvojih prehranskih vnosov.</p>
            </div>

            <div className="mt-6 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-700">
                <span className="font-medium text-slate-900">Povprečen dnevni vnos:</span>{' '}
                {averageCalories !== null ? `${averageCalories} kcal` : 'Nalaganje...'}
              </p>
              <p className="text-sm text-slate-700">
                <span className="font-medium text-slate-900">Zabeleženi dnevi:</span>{' '}
                {loggedDays !== null ? loggedDays : 'Nalaganje...'}
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
