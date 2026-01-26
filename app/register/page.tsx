'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/app/ui/navbar';

export default function RegisterPage() {
  // Controlled inputs
  const [ime, setIme] = useState<string>('');
  const [priimek, setPriimek] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirm, setConfirm] = useState<string>('');

  // UI state
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Da lahko varno prekličemo timeout ob unmountu (da ne ostane "leaking" timer)
  const redirectTimerRef = useRef<number | null>(null);

  useEffect(() => {
    // Cleanup timeouta ob unmountu
    return () => {
      if (redirectTimerRef.current !== null) {
        window.clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  async function handleRegister() {
    // Reset sporočil ob vsakem poskusu registracije
    setError('');
    setSuccess('');

    // Minimalna validacija (ne spreminja backend funkcionalnosti, samo prepreči očitne napake)
    if (!ime || !priimek || !email || !password || !confirm) {
      setError('Prosimo, izpolni vsa polja.');
      return;
    }

    if (password !== confirm) {
      setError('Gesli se ne ujemata.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ime,
          priimek,
          email,
          password,
        }),
      });

      // Backend naj vrača JSON; če ne, ne crashamo
      const data = await res.json().catch(() => ({} as any));

      if (!res.ok) {
        setError(data?.error || 'Napaka pri registraciji.');
        return;
      }

      // Uspeh: ohranimo tvojo logiko preusmeritve po 1500ms
      setSuccess('Registracija uspešna. Preusmerjam...');

      redirectTimerRef.current = window.setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    } catch {
      setError('Napaka pri registraciji.');
    } finally {
      setIsSubmitting(false);
    }
  }

  // Optional: Enter na kateremkoli inputu sproži registracijo (isti handleRegister)
  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      void handleRegister();
    }
  }

  return (
    <main className="relative min-h-screen bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white dark:bg-slate-950 dark:text-white">
      <div className="pointer-events-none absolute -top-32 right-0 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl dark:opacity-0" />
      <div className="pointer-events-none absolute bottom-0 left-10 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl dark:opacity-0" />

      <Navbar />

      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="relative overflow-hidden rounded-3xl border border-white/70 dark:border-slate-800 bg-white dark:bg-slate-900/90 dark:bg-slate-900/80 p-8 shadow-xl shadow-slate-200/70 dark:shadow-black/30 backdrop-blur">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-200/30 blur-3xl" />

            <div className="relative space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300">
                  Registracija
                </div>
                <h1 className="mt-4 text-3xl font-semibold">Ustvari račun</h1>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Začni s sledenjem prehrani v nekaj korakih.
                </p>
              </div>

              {/* Error box */}
              {error && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              )}

              {/* Success box */}
              {success && (
                <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {success}
                </div>
              )}

              {/* Form: onSubmit preprečimo default, ker ti uporabljaš button type="button"
                  (funkcionalnost ostane enaka) */}
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Ime</label>
                    <input
                      type="text"
                      value={ime}
                      onChange={(e) => setIme(e.target.value)}
                      onKeyDown={onKeyDown}
                      className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="vnesi ime"
                      autoComplete="given-name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Priimek</label>
                    <input
                      type="text"
                      value={priimek}
                      onChange={(e) => setPriimek(e.target.value)}
                      onKeyDown={onKeyDown}
                      className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="vnesi priimek"
                      autoComplete="family-name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">E-pošta</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={onKeyDown}
                    className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="vnesi e-pošto"
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Geslo</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={onKeyDown}
                    className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="vnesi geslo"
                    autoComplete="new-password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Potrdi geslo</label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    onKeyDown={onKeyDown}
                    className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="ponovno vnesi geslo"
                    autoComplete="new-password"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => void handleRegister()}
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-blue-600 py-2.5 text-white shadow-lg shadow-blue-200/70 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? 'Registriram...' : 'Registracija'}
                </button>

                <div className="text-center text-sm text-slate-600 dark:text-slate-300">
                  Že imaš račun?{' '}
                  <Link href="/login" className="text-blue-600 hover:underline">
                    Prijava
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

